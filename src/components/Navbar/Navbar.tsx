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
import { useState, useRef } from "react"
import Item from "../Container/Item.js"
import getNewUUID from "../../utils/getNewUUID.js"

export default function Navbar(){
  const {globalState, setGlobalState} = useGlobalContext()
  const [boards, setBoards] = useState([])
  const boardRefs = useRef([])
  const boardContainerRef = useRef(null)

  function onBoardDrag(event){
    // Check if the board is inside the droppable area
    const boardContainerRect = boardContainerRef.current.getBoundingClientRect()
    console.log(boardContainerRect)
      // Loop through all the boards
        // Exclude the currently dragging board
        // Get the bounding box of that current board
        // Get the center y of that current board
        // If the dragging board is above the center of the current board then move it above and return
        // If the dragging board is below the center of the current board then move it below and return
  }

  function addNewBoard(){
    const newUUID = getNewUUID(boards)
    const newBoard = (
      <Container ref={(ref) => boardRefs.current.push(ref)} containerType="board" key={newUUID} onDrag={onBoardDrag}>
        <Item includePlus={false} setItems={setBoards} itemKey={newUUID}/>
      </Container>
    )
    setBoards([...boards, newBoard])
    console.log(boardRefs.current)
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
          <div ref={boardContainerRef} className={tm("mt-[calc(var(--iconSize)+2*var(--cardSpacing))] h-[calc(100vh-(var(--iconSize)+2*var(--cardSpacing)))] overflow-y-auto remove-scrollbar")}>
            {boards.map(board => board)}
            <Container containerType="card" onClick={addNewBoard}><AddElement text="Add another board"/></Container>
          </div>
        </>
      ): "" }
    </div>
  )
}