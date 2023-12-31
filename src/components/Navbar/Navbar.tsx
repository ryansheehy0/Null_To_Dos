import List from "../../assets/list.svg?react"
import Moon from "../../assets/moon.svg?react"
import Sun from "../../assets/sun.svg?react"
import Download from "../../assets/download.svg?react"
import Upload from "../../assets/upload.svg?react"
import { twMerge as tm } from "tailwind-merge"
import { useGlobalContext } from "../../utils/context.js"
import NavIcon from "./NavIcon.js"
import Container from "../Container/Container.js"
import AddElement from "../Container/AddElement.js"
import Item from "../Container/Item.js"
import { useLiveQuery } from "dexie-react-hooks"

export default function Navbar(){
  const {db, globalState, setGlobalState} = useGlobalContext()
  const boards = useLiveQuery(async () => {
    return await db.boards.toArray()
  }, [globalState.boardId])

  async function addNewBoard(){
    await db.boards.add({
      name: "",
      lists: []
    })
  }

  function selectBoard(event){
    let boardId
    if(event.target.tagName === "TEXTAREA"){
      boardId = event.target.parentNode.parentNode.dataset.id
    }else{
      boardId = event.target.dataset.id
    }
    if(boardId){
      const boardIdInt = parseInt(boardId)
      setGlobalState({...globalState, boardId: boardIdInt})
    }
  }

  return (
    <div
      className={tm("w-[--cardHeight] h-screen absolute left-0 top-0 bg-lightList dark:bg-darkList z-10",
      globalState.open && "w-fit pr-[--cardSpacing]")}>
      <NavIcon Icon={List} rightOffset={"right-[--cardSpacing]"} onClick={() => setGlobalState({...globalState, open: !globalState.open})} />
      {globalState.open ? (
        <>
          {globalState.theme === "dark" ? (
            <NavIcon Icon={Moon} rightOffset={"right-[calc(2*var(--cardSpacing)+var(--iconSize))]"} onClick={() => setGlobalState({...globalState, theme: "light"})} />
          ) : (
            <NavIcon Icon={Sun} rightOffset={"right-[calc(2*var(--cardSpacing)+var(--iconSize))]"} onClick={() => setGlobalState({...globalState, theme: "dark"})} />
          )}
          <NavIcon Icon={Upload} rightOffset={"right-[calc(3*var(--cardSpacing)+2*var(--iconSize))]"} />
          <NavIcon Icon={Download} rightOffset={"right-[calc(4*var(--cardSpacing)+3*var(--iconSize))]"} />
          <div className={tm("mt-[calc(var(--iconSize)+2*var(--cardSpacing))] h-[calc(100vh-(var(--iconSize)+2*var(--cardSpacing)))] overflow-y-auto remove-scrollbar")}>
            {/* Display all the boards */}
            {boards ? boards.map((board) => (
              <Container
                key={board.id} id={board.id}
                containerType="board"
                onClick={selectBoard}>
                <Item
                  id={board.id}
                  name={board.name}
                  includePlus={false}
                  itemType="board"/>
              </Container>
            )): ""}
            {/* Add new board button */}
            <Container
              containerType="board"
              onClick={addNewBoard}>
              <AddElement text="Add another board"/>
            </Container>
          </div>
        </>
      ): "" }
    </div>
  )
}