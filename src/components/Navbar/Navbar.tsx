import List from "../../assets/list.svg?react"
import Moon from "../../assets/moon.svg?react"
import Sun from "../../assets/sun.svg?react"
import Download from "../../assets/download.svg?react"
import { download, upload } from "../../utils/uploadAndDownload.js"
import Upload from "../../assets/upload.svg?react"
import { twMerge as tm } from "tailwind-merge"
import { useGlobalContext } from "../../utils/context.js"
import NavIcon from "./NavIcon.js"
import { useLiveQuery } from "dexie-react-hooks"
import Board from "../Container/Board.js"
import AddAnotherBoard from "../Container/AddAnotherBoard.js"
import { useRef } from "react"

export default function Navbar(){
  const {db, globalState, setGlobalState} = useGlobalContext()
  const boards = useLiveQuery(async () => {
    return await db.boards.toArray()
  }, [])
  const uploadFileRef = useRef(null)

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
          <NavIcon Icon={Upload} rightOffset={"right-[calc(3*var(--cardSpacing)+2*var(--iconSize))]"} onClick={() => {uploadFileRef.current.click()}}/>
          <input type="file" ref={uploadFileRef} className="hidden" accept=".json" onChange={(event) => upload(db, event)}/>
          <NavIcon Icon={Download} rightOffset={"right-[calc(4*var(--cardSpacing)+3*var(--iconSize))]"} onClick={() => download(db)}/>
          <div className={tm("mt-[calc(var(--iconSize)+2*var(--cardSpacing))] h-[calc(100vh-(var(--iconSize)+2*var(--cardSpacing)))] overflow-y-auto remove-scrollbar")}>
            {/* Display all the boards */}
            {boards ? boards.map((board) => (
              <Board
                key={board.id} id={board.id}
                name={board.name}
                onClick={selectBoard}
              />
            )): ""}
            {/* Add new board button */}
            <AddAnotherBoard />
          </div>
        </>
      ): "" }
    </div>
  )
}