/*
 * This file is part of Null Todos.
 *
 * Null Todos is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * Null Todos is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with Null Todos. If not, see <https://www.gnu.org/licenses/>.
 */

import { twMerge as tm } from "tailwind-merge"
import { useGlobalContext } from "../../utils/context"
import { useState, useRef, useEffect } from "react"
import Trash from "../../assets/trash.svg?react"
import { recursivelyDeleteBoard } from "../../utils/database"
import React from "react"
import { getBoards } from "../../utils/database"
import { isMouseAboveOrBelowCenter } from "../../utils/rectangleFunctions"

const Board = React.forwardRef( ({id, name, callbackBoardRefs, ...props}, ref) => {
  const {db, globalState} = useGlobalContext()
  const [textarea, setTextarea] = useState(name)
  const trashParentRef = useRef(null)
  const [deleted, setDeleted] = useState(false)
  const [spellChecking, setSpellChecking] = useState(false)
  const textareaRef = useRef(null)

  // Remove deleted on click outside
  useEffect(() => {
    function handleClickOutside(event){
      if(!trashParentRef.current.lastChild) return
      if(!trashParentRef.current.lastChild.contains(event.target)){
        setDeleted(false)
      }
    }
    document.addEventListener("click", handleClickOutside)
    return(() => {
      document.removeEventListener("click", handleClickOutside)
    })
  }, [])

  async function onTextareaInput(event){
    // Resize text area
    const textarea = event.target
    textarea.style.height = "fit-content"
    textarea.style.height = textarea.scrollHeight + "px"
    setTextarea(textarea.value)
    // Save the name change to db
    await db.boards.update(id, {
      name: textarea.value
    })
  }

  // Size the textarea on load
  useEffect(() => {
    const textarea = textareaRef.current
    textarea.style.height = "fit-content"
    textarea.style.height = textarea.scrollHeight + "px"
  }, [])

  async function deleteSelf(){
    if(!deleted){
      setDeleted(true)
    }else{
      // Remove self from boardOrder
      const miscellaneous = await db.miscellaneous.get(1)
      miscellaneous.boardOrder = miscellaneous.boardOrder.filter((boardId) => {return boardId !== id})
      await db.miscellaneous.update(1, {
        boardOrder: [...miscellaneous.boardOrder]
      })
      // Recursively delete board
      await recursivelyDeleteBoard(db, id)
    }
  }

  // Dragging
  function getBoardRect(board){
    const boardRefs = callbackBoardRefs()
    for(const boardRef of boardRefs.current){
      if(!boardRef) continue
      if(boardRef.dataset.id == board.id){
        return boardRef.getBoundingClientRect()
      }
    }
  }

  async function putDraggingBoardToAboveOrBelow(draggingBoardId, board, aboveOrBelow: "above" | "below"){
    const miscellaneous = await db.miscellaneous.get(1)
    // Remove the currently dragging board
    miscellaneous.boardOrder = miscellaneous.boardOrder.filter((boardId) => {return boardId != draggingBoardId})
    // Get index of current board
    const boardIndex = miscellaneous.boardOrder.findIndex((boardId) => {
      return boardId === board.id
    })
    // Get inserting index
    const insertingIndex = aboveOrBelow === "above" ? boardIndex : (boardIndex + 1)
    // Insert the currently dragging board
    miscellaneous.boardOrder.splice(insertingIndex, 0, draggingBoardId)
    // Update the board order
    await db.miscellaneous.update(1, {
      boardOrder: [...miscellaneous.boardOrder]
    })
  }

  async function onBoardDrag(event){
    const draggingBoardId = parseInt(event.target.dataset.id)
    const boards = await getBoards(db)
    for(const [i, board] of boards.entries()){
      //const board = await db.boards.get(boardId)
      const boardRect = getBoardRect(board)
      // Exclude the currently dragging board
      if(draggingBoardId === board.id) continue
      // When dropping event.clientY is set to 0
      if(event.clientY === 0) return
      // Check if the dragging board is above or below
      const aboveOrBelow = isMouseAboveOrBelowCenter(boardRect, event.clientY)
      if(aboveOrBelow === "above"){
        await putDraggingBoardToAboveOrBelow(draggingBoardId, board, "above")
        return
      }else if(aboveOrBelow === "below"){
        if(i === boards.length - 1){
          await putDraggingBoardToAboveOrBelow(draggingBoardId, board, "below")
          return
        }
      }
    }
  }

  return (
    <div
      ref={ref}
      data-id={id}
      className={tm("rounded-xl py-1.5 px-1.5 min-w-[--cardWidth] w-min flex justify-center items-center min-h-[--cardHeight] h-fit mt-[--cardSpacing] box-border ml-[--cardSpacing]", "bg-lightCard dark:bg-darkCard border border-solid border-lightBackground dark:border-transparent")}
      draggable="true"
      onDrag={onBoardDrag}
      {...props}>
        <div className="grid grid-cols-[auto_auto]">
          <textarea ref={textareaRef} className="m-0 flex items-center border-none bg-transparent text-lightText dark:text-darkText text-sm h-auto resize-none mt-auto mb-auto pl-1 focus:rounded focus:outline focus:outline-1 focus:dark:outline-darkBackground focus:outline-lightBackground hyphens-auto overflow-hidden" value={textarea} onInput={onTextareaInput} rows={1} onFocus={() => {setSpellChecking(true)}} onBlur={() => {setSpellChecking(false)}} spellCheck={spellChecking}></textarea>
          <div ref={trashParentRef} className="flex items-center justify-end">
            {globalState.boardId === id ? (
              "" ) : (
              <Trash className={tm("cursor-pointer w-[--iconSize] h-[--iconSize] fill-lightText dark:fill-darkText", deleted && "fill-red-600 dark:fill-red-600")} onClick={deleteSelf} />
            )}
          </div>
        </div>
    </div>
  )
})

export default Board