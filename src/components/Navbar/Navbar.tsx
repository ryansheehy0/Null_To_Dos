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

import List from "../../assets/list.svg?react"
import Moon from "../../assets/moon.svg?react"
import Sun from "../../assets/sun.svg?react"
import Download from "../../assets/download.svg?react"
import { download, upload } from "../../utils/uploadAndDownload.js"
import Upload from "../../assets/upload.svg?react"
import { twMerge as tm } from "tailwind-merge"
import { useGlobalContext } from "../../utils/context.js"
import NavIcon from "./NavIcon.js"
import { useLiveQuery } from "dexie-react-hooks"
import Board from "../Container/Board.js"
import AddAnotherBoard from "../Container/AddAnotherBoard.js"
import { useRef, useEffect } from "react"
import { getBoards } from "../../utils/database.js"
import { isValidRect } from "../../utils/rectangleFunctions.js"

export default function Navbar(){
  const {db, globalState, setGlobalState} = useGlobalContext()
  const boards = useLiveQuery(async () => {
    return await getBoards(db)
  })
  const uploadFileRef = useRef(null)
  const boardRefs = useRef([])

  // Resets boardRefs
  useEffect(() => {
    // Remove nulls from boardRefs
    boardRefs.current = boardRefs.current.filter((ref) => {return ref !== null})
    // Remove invalid refs
    boardRefs.current = boardRefs.current.filter((ref) => {return isValidRect(ref.getBoundingClientRect())})
    // Remove duplicates from cardRefs
    boardRefs.current = [...new Set(boardRefs.current)]
  }, [boards])

  async function selectBoard(event){
    let boardId
    if(event.target.tagName === "TEXTAREA"){
      boardId = event.target.parentNode.parentNode.dataset.id
    }else{
      boardId = event.target.dataset.id
    }
    if(boardId){
      const boardIdInt = parseInt(boardId)
      setGlobalState({...globalState, boardId: boardIdInt})
      await db.miscellaneous.update(1, {
        boardId: boardIdInt
      })
    }
  }

  return (
    <div
      className={tm("w-[--cardHeight] h-screen absolute left-0 top-0 bg-lightList dark:bg-darkList z-10",
      globalState.open && "w-fit pr-[--cardSpacing]")}>
      <NavIcon Icon={List} rightOffset={"right-[--cardSpacing]"} onClick={async () => {
        await db.miscellaneous.update(1, {
          open: !globalState.open
        })
        setGlobalState({...globalState, open: !globalState.open})
      }} />
      {globalState.open ? (
        <>
          {globalState.theme === "dark" ? (
            <NavIcon Icon={Moon} rightOffset={"right-[calc(2*var(--cardSpacing)+var(--iconSize))]"} onClick={async () => {
              setGlobalState({...globalState, theme: "light"})
              await db.miscellaneous.update(1, {
                theme: "light"
              })
            }} />
          ) : (
            <NavIcon Icon={Sun} rightOffset={"right-[calc(2*var(--cardSpacing)+var(--iconSize))]"} onClick={async () => {
              setGlobalState({...globalState, theme: "dark"})
              await db.miscellaneous.update(1, {
                theme: "dark"
              })
            }} />
          )}
          <NavIcon Icon={Upload} rightOffset={"right-[calc(3*var(--cardSpacing)+2*var(--iconSize))]"} onClick={() => {uploadFileRef.current.click()}}/>
          <input type="file" ref={uploadFileRef} className="hidden" accept=".json" onChange={(event) => upload(db, event)}/>
          <NavIcon Icon={Download} rightOffset={"right-[calc(4*var(--cardSpacing)+3*var(--iconSize))]"} onClick={() => download(db)}/>
          <div className={tm("mt-[calc(var(--iconSize)+2*var(--cardSpacing))] h-[calc(100vh-(var(--iconSize)+2*var(--cardSpacing)))] overflow-y-auto remove-scrollbar")}>
            {/* Display all the boards */}
            {boards ? boards.map((board) => (
              board ? (
                <Board
                  key={board.id} id={board.id}
                  ref={(ref) => boardRefs.current.push(ref)}
                  name={board.name}
                  callbackBoardRefs={() => {return boardRefs}}
                  onClick={selectBoard}
                />
              ) : null
            )): null}
            {/* Add new board button */}
            <AddAnotherBoard />
          </div>
        </>
      ): "" }
    </div>
  )
}