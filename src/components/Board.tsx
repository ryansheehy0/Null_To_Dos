import { twMerge as tm } from "tailwind-merge"
import Container from "./Container/Container.js"
import { useGlobalContext } from "../utils/context.js"
import AddElement from "./Container/AddElement.js"
import Item from "./Container/Item.js"
import { useLiveQuery } from "dexie-react-hooks"
import { getLists } from "../utils/database.js"

type BoardProps = {
  boardId: number
}

export default function Board({boardId}: BoardProps){
  const {db, globalState} = useGlobalContext()
  const lists = useLiveQuery(async () => {
    return await db.boards.get(boardId).lists
  })

  async function addNewList(){
    const board = db.boards.get(boardId)
    await db.boards.update(boardId, {
      lists: [...board.lists, {}]
    })
    // Create new list
    const newListId = await db.lists.add({
      name: "",
      cards: []
    })
    // Add new list to board's lists
    const board = await db.boards.get(boardId)
    await db.boards.update(boardId, {
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
          className="flex-shrink-0">
          <Item
            id={list.id}
            name={list.name}
            includePlus
            itemType="list"
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