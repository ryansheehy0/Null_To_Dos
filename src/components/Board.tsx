import { twMerge as tm } from "tailwind-merge"
import Container from "./Container/Container.js"
import { useGlobalContext } from "../utils/context.js"
import AddElement from "./Container/AddElement.js"
import Item from "./Container/Item.js"
import { useLiveQuery } from "dexie-react-hooks"
import { getLists } from "../utils/database.js"

export default function Board({boardId}){
  const {db, globalState} = useGlobalContext()
  const lists = useLiveQuery(async () => {
    return await getLists(boardId)
  }, [])

  async function addNewList(){
    await db.boards.update(boardId, {
      lists: [...lists, {name: "", cards: []}]
    })
  }

  return (
    <div className={tm("w-[calc(100vw-var(--cardHeight))] overflow-auto h-screen bg-lightText dark:bg-darkText absolute top-0 right-0 flex justify-start", globalState.open && "w-[calc(100vw-(var(--cardWidth)+(2*var(--cardSpacing))))]")}>
      {lists.map(list => (
        <Container
          key={list.id} id={list.id}
          containerType="list"
          className="flex-shrink-0">
          <Item
            id={list.id}
            name={list.name}
            includePlus
          />
        </Container>
      ))}
      <Container
        containerType="list"
        className="mr-[--cardSpacing]"
        onClick={addNewList}>
        <AddElement text="Add another list" />
      </Container>
    </div>
  )
}