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
import { useGlobalContext } from "../utils/context.js"
import { useLiveQuery } from "dexie-react-hooks"
import { getLists } from "../utils/database.js"
import { useEffect, useRef } from "react"
import List from "./Container/List.js"
import AddAnotherList from "./Container/AddAnotherList.js"
import { isValidRect } from "../utils/rectangleFunctions.js"

export default function BoardView(){
  const {db, globalState} = useGlobalContext()
  const lists = useLiveQuery(async () => {
    return await getLists(db, globalState.boardId)
  }, [globalState.boardId])
  const listRefs = useRef([])
  const cardRefs = useRef([])

  // Resets listRefs
  useEffect(() => {
    // Remove nulls from listRefs
    listRefs.current = listRefs.current.filter((ref) => {return ref !== null})
    // Remove invalid refs
    listRefs.current = listRefs.current.filter((ref) => {return isValidRect(ref.getBoundingClientRect())})
    // Remove duplicates from listRefs
    listRefs.current = [...new Set(listRefs.current)]
  }, [lists])

  return (
    <div
      className={tm("w-[calc(100vw-var(--cardHeight))] overflow-auto h-screen bg-lightText dark:bg-darkText absolute top-0 right-0 flex justify-start", 
      globalState.open && "w-[calc(100vw-(var(--cardWidth)+(2*var(--cardSpacing))))]")}>
      {/* Display all the lists in the board */}
      {lists ? lists.map((list) => (
        list ? (
          <List
            key={list.id} id={list.id}
            name={list.name}
            ref={(ref) => listRefs.current.push(ref)}
            callbackCardRefs={() => {return cardRefs}}
            callbackListRefs={() => {return listRefs}}
            className="flex-shrink-0"
          />
        ) : null
      )): null}
      {/* Add new list button */}
      <AddAnotherList />
    </div>
  )
}