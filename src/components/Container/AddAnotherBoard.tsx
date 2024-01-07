import { twMerge as tm } from "tailwind-merge"
import Plus from "../../assets/plus.svg?react"
import { useGlobalContext } from "../../utils/context"

export default function AddAnotherBoard(){
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
  }

  return (
    <div
      className={tm("rounded-xl py-1.5 px-3 min-w-[--cardWidth] w-min flex justify-center items-center min-h-[--cardHeight] h-fit my-[--cardSpacing] box-border ml-[--cardSpacing]", "bg-lightCard dark:bg-darkCard border border-solid border-lightBackground dark:border-darkBackground", "cursor-pointer")}
      draggable="false"
      onClick={addNewBoard}>
        <div className="flex items-center justify-center text-lightText dark:text-darkText h-4 rounded-xl box-content">
          <Plus className="w-[--iconSize] h-[--iconSize]"/>
          Add another board
        </div>
    </div>
  )
}