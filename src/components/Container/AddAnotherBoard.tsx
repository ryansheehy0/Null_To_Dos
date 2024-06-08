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

import Plus from "../../assets/plus.svg?react"
import { useGlobalContext } from "../../utils/context"

export default function AddAnotherBoard({setFocusBoard}){
  const {db} = useGlobalContext()

  async function addNewBoard(){
    // Add new board
    const newBoardId = await db.boards.add({
      name: "",
      lists: []
    })
    // Add new board to boardOrder
    const miscellaneous = await db.miscellaneous.get(1)
    await db.miscellaneous.update(1, {
      boardOrder: [...miscellaneous.boardOrder, newBoardId]
    })

    setFocusBoard(true)
  }

  return (
    <div
      className="rounded-xl py-1.5 px-3 min-w-[--cardWidth] w-min flex justify-center items-center min-h-[--cardHeight] h-fit my-[--cardSpacing] box-border ml-[--cardSpacing] bg-lightCard dark:bg-darkCard cursor-pointer"
      draggable="false"
      onClick={addNewBoard}>
        <div className="flex items-center justify-center text-lightText dark:text-darkText h-4 rounded-xl box-content">
          <Plus className="w-[--iconSize] h-[--iconSize]"/>
          Add another board
        </div>
    </div>
  )
}