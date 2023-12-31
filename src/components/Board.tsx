import { twMerge as tm } from "tailwind-merge"
import Container from "./Container/Container.js"
import { useGlobalContext } from "../utils/context.js"
import AddElement from "./Container/AddElement.js"
import Item from "./Container/Item.js"
import { useLiveQuery } from "dexie-react-hooks"
import { getLists } from "../utils/database.js"
import { useEffect, useRef } from "react"
import { isMouseLeftOrRightCenter } from "../utils/rectangleFunctions.js"

export default function Board(){
  const {db, globalState} = useGlobalContext()
  const lists = useLiveQuery(async () => {
    return await getLists(db, globalState.boardId)
  }, [globalState.boardId])
  const listRefs = useRef([])

  // Need to reset listRefs
  // Need to prevent spamming when on dragging to the left

  function getListBoundingBox(list){
    console.log(listRefs.current)
    for(const listRef of listRefs.current){
      if(!listRef) continue
      if(listRef.dataset.id == list.id){
        return listRef.getBoundingClientRect()
      }
    }
  }

  async function onListDrag(event){
    const draggingListId = parseInt(event.target.dataset.id)
    for(const [i, list] of lists.entries()){
      const listRect = getListBoundingBox(list)
      // Exclude the currently dragging list
      if(draggingListId === list.id) continue
      // Check if the dragging list is left or right
      const leftOrRight = isMouseLeftOrRightCenter(listRect, event.clientX)
      if(leftOrRight === "left"){
        // Re-order the dragging list to be in front of the current list in this board's lists
          const board = await db.boards.get(globalState.boardId)
          // Get index of current list
          const listIndex = board.lists.findIndex((listId) => {
            return listId === list.id
          })
          // Remove the currently dragging list
          board.lists = board.lists.filter((listId) => {return listId != draggingListId})
          // Insert the currently dragging list in front of listIndex
          board.lists.splice(listIndex, 0, draggingListId)
          // Update the board's lists
          await db.boards.update(globalState.boardId, {
            lists: [...board.lists]
          })
          return
      }else if(leftOrRight === "right"){
        if(i === (lists.length - 1)){
          const board = await db.boards.get(globalState.boardId)
          // Remove the currently dragging list
          board.lists = board.lists.filter((listId) => {return listId !== draggingListId})
          // Add currently dragging list to the end
          board.lists.push(draggingListId)
          // Update the board's lists
          await db.boards.update(globalState.boardId, {
            lists: [...board.lists]
          })
        }
      }
    }
  }

  async function addNewList(){
    // Create new list
    const newListId = await db.lists.add({
      name: "",
      cards: []
    })
    // Add new list to board's lists
    const board = await db.boards.get(globalState.boardId)
    await db.boards.update(globalState.boardId, {
      lists: [...board.lists, newListId]
    })
  }

  return (
    <div
      className={tm("w-[calc(100vw-var(--cardHeight))] overflow-auto h-screen bg-lightText dark:bg-darkText absolute top-0 right-0 flex justify-start", 
      globalState.open && "w-[calc(100vw-(var(--cardWidth)+(2*var(--cardSpacing))))]")}>
      {/* Display all the lists in the board */}
      {lists ? lists.map((list) => (
        <Container
          key={list.id} id={list.id}
          containerType="list"
          className="flex-shrink-0"
          ref={(ref) => listRefs.current.push(ref)}
          onDrag={onListDrag}>
          <Item
            id={list.id}
            name={list.name}
            includePlus
            itemType="list"
            parentId={globalState.boardId}
          />
        </Container>
      )): ""}
      {/* Add new list button */}
      <Container
        containerType="list"
        className="mr-[--cardSpacing]"
        onClick={addNewList}>
        <AddElement text="Add another list" />
      </Container>
    </div>
  )
}