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
import { isMouseLeftOrRightHalf } from "../../utils/rectangleFunctions"
import { useGlobalContext } from "../../utils/context"
import { useState, useRef, useEffect } from "react"
import Trash from "../../assets/trash.svg?react"
import Plus from "../../assets/plus.svg?react"
import { recursivelyDeleteList, getCardsFromList } from "../../utils/database"
import { useLiveQuery } from "dexie-react-hooks"
import Card from "./Card"
import React from "react"
import { isValidRect } from "../../utils/rectangleFunctions"

const List = React.forwardRef(({id, name, callbackCardRefs, callbackListRefs, className, focus, ...props}, ref) => {
  const {db} = useGlobalContext()
  const [textarea, setTextarea] = useState(name)
  const trashParentRef = useRef(null)
  const [deleted, setDeleted] = useState(false)
  const cards = useLiveQuery(async () => {
    return getCardsFromList(db, id)
  }, [])
  const boardId = useLiveQuery(async () => (await db.miscellaneous.get(1)).boardId)
  const [spellChecking, setSpellChecking] = useState(false)
  const textareaRef = useRef(null)
  const [focusCard, setFocusCard] = useState(false)

  // Resets cardRefs
  useEffect(() => {
    const cardRefs = callbackCardRefs()
    // Remove nulls from cardRefs
    cardRefs.current = cardRefs.current.filter((ref) => {return ref !== null})
    // Remove invalid refs
    cardRefs.current = cardRefs.current.filter((ref) => {return isValidRect(ref.getBoundingClientRect())})
    // Remove duplicates from cardRefs
    cardRefs.current = [...new Set(cardRefs.current)]
  }, [cards])

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
    await db.lists.update(id, {
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
      await recursivelyDeleteList(db, id, boardId)
    }
  }

  async function addNewCard(){
    // Create new card
    const newCardId = await db.cards.add({
      name: "",
      cards: [],
      parentId: id,
      parentType: "list"
    })
    // Add new card to parent's child references
    const list = await db.lists.get(id)
    await db.lists.update(id, {
      cards: [...list.cards, newCardId]
    })

    setFocusCard(true)
  }

  // dragging
  function getListRect(list){
    const listRefs = callbackListRefs()
    for(const listRef of listRefs.current){
      if(!listRef) continue
      if(listRef.dataset.id == list.id){
        return listRef.getBoundingClientRect()
      }
    }
  }

  async function putDraggingListToLeftOrRight(draggingListId, list, leftOrRight: "left" | "right"){
    const board = await db.boards.get(boardId)
    // Remove the currently dragging list
    board.lists = board.lists.filter((listId) => {return listId != draggingListId})
    // Get index of current list
    const listIndex = board.lists.findIndex((listId) => {
      return listId === list.id
    })
    // Get inserting index
    const insertingIndex = leftOrRight === "left" ? listIndex : (listIndex + 1)
    // Insert the currently dragging list
    board.lists.splice(insertingIndex, 0, draggingListId)
    // Update the board's lists
    await db.boards.update(boardId, {
      lists: [...board.lists]
    })
  }

  async function onListDrag(event){
    const draggingListId = parseInt(event.target.dataset.id)
    const board = await db.boards.get(boardId)
    for(const listId of board.lists){
      const list = await db.lists.get(listId)
      const listRect = getListRect(list)
      // Exclude the currently dragging list
      if(draggingListId === list.id) continue
      if(event.clientX === 0) return
      // Check if the dragging list is left or right
      const leftOrRight = isMouseLeftOrRightHalf(listRect, event.clientX)
      if(leftOrRight === "left"){
        await putDraggingListToLeftOrRight(draggingListId, list, "left")
        return
      }else if(leftOrRight === "right"){
        await putDraggingListToLeftOrRight(draggingListId, list, "right")
        return
      }
    }
  }

  return (
    <div
      ref={ref}
      data-id={id}
      className={tm("rounded-xl pt-1.5 px-1.5 min-w-[--cardWidth] w-min flex justify-center items-center min-h-[--cardHeight] h-fit mt-[--cardSpacing]  box-border ml-[--cardSpacing]", "bg-lightList dark:bg-darkList", className, cards?.length !== 0 ? "pb-[calc(var(--cardSpacing)*1.5)]" : "pb-1.5")}
      draggable="true"
      onDrag={onListDrag}
      {...props}>
        <div className="grid grid-cols-[auto_auto]">
          <textarea ref={textareaRef} className={tm("m-0 flex items-center border-none bg-transparent text-lightText dark:text-darkText text-sm h-auto resize-none mt-auto mb-auto pl-1 focus:rounded focus:outline focus:outline-1 focus:dark:outline-darkBackground focus:outline-lightBackground hyphens-auto overflow-hidden")} value={textarea} onInput={onTextareaInput} rows={1} onFocus={() => {setSpellChecking(true)}} onBlur={() => {setSpellChecking(false)}} spellCheck={spellChecking} autoFocus={focus}></textarea>
          <div ref={trashParentRef} className="flex items-center justify-end">
            <Plus className="cursor-pointer w-[--iconSize] h-[--iconSize] fill-lightText dark:fill-darkText" onClick={addNewCard} />
            <Trash className={tm("cursor-pointer w-[--iconSize] h-[--iconSize] fill-lightText dark:fill-darkText", deleted && "fill-red-600 dark:fill-red-600")} onClick={deleteSelf} />
          </div>
          {/* List all the cards */}
          {cards ? cards.map((card, index) => (
            card ? (
              <Card
                key={card.id} id={card.id}
                parentId={card.parentId} parentType={card.parentType}
                name={card.name}
                ref={(ref) => {
                  const cardRefs = callbackCardRefs()
                  cardRefs.current.push(ref)
                }}
                callbackCardRefs={callbackCardRefs}
                callbackListRefs={callbackListRefs}
                focus={(index === cards.length - 1 && focusCard) ? true : false}
                className="flex-shrink-0 col-span-2"
              />
            ) : null
          )): null}
        </div>
    </div>
  )
})

export default List