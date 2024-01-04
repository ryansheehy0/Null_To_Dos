import { twMerge as tm } from "tailwind-merge"
import { useGlobalContext } from "../utils/context.js"
import { useLiveQuery } from "dexie-react-hooks"
import { getLists } from "../utils/database.js"
import { useEffect, useRef } from "react"
import { isMouseLeftOrRightHalf } from "../utils/rectangleFunctions.js"
import List from "./Container/List.js"
import AddAnotherList from "./Container/AddAnotherList.js"

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
    listRefs.current = listRefs.current.filter((refs) => {return refs !== null})
    // Remove duplicates from listRefs
    listRefs.current = [...new Set(listRefs.current)]
  }, [lists])

  // dragging
  function getListRect(list){
    for(const listRef of listRefs.current){
      if(!listRef) continue
      if(listRef.dataset.id == list.id){
        return listRef.getBoundingClientRect()
      }
    }
  }

  async function putDraggingListToLeftOrRight(draggingListId, list, leftOrRight: "left" | "right"){
    const board = await db.boards.get(globalState.boardId)
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
    await db.boards.update(globalState.boardId, {
      lists: [...board.lists]
    })
  }

  async function onListDrag(event){
    const draggingListId = parseInt(event.target.dataset.id)
    for(const list of lists){
      const listRect = getListRect(list)
      // Exclude the currently dragging list
      if(draggingListId === list.id) continue
      // Check if the dragging list is left or right
      const leftOrRight = isMouseLeftOrRightHalf(listRect, event.clientX)
      if(leftOrRight === "left"){
        await putDraggingListToLeftOrRight(db, draggingListId, list, "left")
        return
      }else if(leftOrRight === "right"){
        await putDraggingListToLeftOrRight(db, draggingListId, list, "right")
        return
      }
    }
  }

  return (
    <div
      className={tm("w-[calc(100vw-var(--cardHeight))] overflow-auto h-screen bg-lightText dark:bg-darkText absolute top-0 right-0 flex justify-start", 
      globalState.open && "w-[calc(100vw-(var(--cardWidth)+(2*var(--cardSpacing))))]")}>
      {/* Display all the lists in the board */}
      {lists ? lists.map((list) => (
        <List
          key={list.id} id={list.id}
          name={list.name}
          ref={(ref) => listRefs.current.push(ref)}
          callbackCardRefs={() => {return cardRefs}}
          callbackListRefs={() => {return listRefs}}
          className="flex-shrink-0"
        />
      )): ""}
      {/* Add new list button */}
      <AddAnotherList />
    </div>
  )
}