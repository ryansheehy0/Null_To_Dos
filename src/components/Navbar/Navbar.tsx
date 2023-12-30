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
import { useRef } from "react"
import Item from "../Container/Item.js"
import { isMouseInside, isMouseAboveOrBelowCenter } from "../../utils/rectangleFunctions.js"
import { useLiveQuery } from "dexie-react-hooks"

export default function Navbar(){
  const {db, globalState, setGlobalState} = useGlobalContext()
  const boards = useLiveQuery(async () => {
    return await db.boards.toArray()
  }, [globalState.boardId])
  const boardRefs = useRef([])
  const boardContainerRef = useRef(null)

  /*
  function getBoardsBoundingBox(board){
    for(let i = 0; i < boardRefs.current.length; i++){
      const boardRef = boardRefs.current[i]
      if(!boardRef) continue
      if(boardRef.dataset.key == board.key){
        return boardRef.getBoundingClientRect()
      }
    }
  }

  function onBoardDrag(event){
    // Check if the board is inside the droppable area
    const boardContainerRect = boardContainerRef.current.getBoundingClientRect()
    if(!isMouseInside(boardContainerRect, event.clientX, event.clientY)) return
      setBoards((boards) => {
        for(let i = 0; i < boards.length; i++){
          const board = boards[i]
          const boardRect = getBoardsBoundingBox(board)
          // Exclude the currently dragging board
          if(event.target.dataset.key == board.key) continue
          const aboveOrBelow = isMouseAboveOrBelowCenter(boardRect, event.clientY)
          if(aboveOrBelow === "above"){
            let newBoards = []
            // Remove dragged board from boards state
            let draggedBoard
            boards.forEach((board) => {
              if(board.key == event.target.dataset.key){
                draggedBoard = board
              }else{
                newBoards.push(board)
              }
            })
            // Find the boardRef in boards
            let draggedBoardIndex
            newBoards.forEach((newBoard, index) => {
              if(newBoard.key == board.key){
                draggedBoardIndex = index
              }
            })
            // Put the removed draggable board above that
            newBoards.splice(draggedBoardIndex, 0, draggedBoard)
            return newBoards
          }else{
            if(i === boards.length - 1){
              let newBoards = []
              // Remove dragged board from boards state
              let draggedBoard
              boards.forEach((board) => {
                if(board.key == event.target.dataset.key){
                  draggedBoard = board
                }else{
                  newBoards.push(board)
                }
              })
              newBoards.push(draggedBoard)
              return newBoards
            }
          }
        }
        return boards
      })

  }
  */
  function onBoardDrag(){}

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
          <div ref={boardContainerRef} className={tm("mt-[calc(var(--iconSize)+2*var(--cardSpacing))] h-[calc(100vh-(var(--iconSize)+2*var(--cardSpacing)))] overflow-y-auto remove-scrollbar")}>
            {/* Display all the boards */}
            {boards ? boards.map((board) => (
              <Container
                key={board.id} id={board.id}
                containerType="board"
                ref={(ref) => boardRefs.current.push(ref)}
                onDrag={onBoardDrag}
                onClick={selectBoard}
                >
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