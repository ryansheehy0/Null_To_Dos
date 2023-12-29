import { twMerge as tm } from "tailwind-merge"
import Container from "./Container/Container.js"
import { useGlobalContext } from "../utils/context.js"
import AddElement from "./Container/AddElement.js"
import Item from "./Container/Item.js"
import { useLiveQuery } from "dexie-react-hooks"
import { getLists } from "../utils/database.js"
import { getNewListUUID } from "../utils/getNewUUID.js"

type BoardProps = {
  boardId: number
}

export default function Board({boardId}: BoardProps){
  const {db, globalState} = useGlobalContext()
  const lists = useLiveQuery(async () => {
    const board = await db.boards.get(boardId)
    return board.lists
  })

  async function addNewList(){
    const newId = await getNewListUUID(db, boardId)
    await db.update(boardId, {
      lists: [...lists, {
        id: newId,
        name: "",
        cards: []
      }]
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