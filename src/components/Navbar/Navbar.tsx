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
import { useState, createRef } from "react"
import Item from "../Container/Item.js"
import getNewUUID from "../../utils/getNewUUID.js"
import { useDrop } from "react-dnd"

export default function Navbar(){
  const {globalState, setGlobalState} = useGlobalContext()
  const [boards, setBoards] = useState([])
  const [, drop] = useDrop({
    accept: "board",
    hover(item, monitor) {
      console.log(monitor.getClientOffset())
      console.log(item)
      console.log(boards[0])
    }
  })

  function addNewBoard(){
    const newUUID = getNewUUID(boards)
    const newBoard = (
      <Container containerType="board" key={newUUID} itemKey={newUUID}>
        <Item includePlus={false} setItems={setBoards} itemKey={newUUID}/>
      </Container>
    )
    setBoards([...boards, newBoard])
  }

  return (
    <div className={tm("w-[--cardHeight] h-screen absolute left-0 top-0 bg-lightList dark:bg-darkList z-10", globalState.open && "w-fit pr-[--cardSpacing]")}>
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
          {/* Boards */}
          <div ref={drop} className={tm("mt-[calc(var(--iconSize)+2*var(--cardSpacing))] h-[calc(100vh-(var(--iconSize)+2*var(--cardSpacing)))] overflow-y-auto remove-scrollbar")}>
            {boards.map(board => board)}
            <Container containerType="card" onClick={addNewBoard}><AddElement text="Add another board"/></Container>
          </div>
        </>
      ): "" }
    </div>
  )
}