import { createContext, useContext, useState } from 'react'
import { twMerge as tm } from 'tailwind-merge'
import Dexie from "dexie"

let db = new Dexie("Null_Todos")
db.version(1).stores({
  boards: "++id,name,lists",
  lists: "++id,name,cards",
  cards: "++id,name,cards"
})

async function addBoardIfNone(){
  const boards = await db.boards.toArray()
  if(boards.length === 0){
    await db.boards.add({
      name: "",
      lists: []
    })
  }
}
addBoardIfNone()

const Context = createContext()
export const useGlobalContext = () => useContext(Context) // Returns the value attribute in the provider

export default function Provider({children}){
  const [globalState, setGlobalState] = useState({
    theme: "dark",
    open: false,
    boardId: 0
  })

  let uuids: number[] = []

  return (
    <Context.Provider value={{uuids, db, globalState, setGlobalState}} >
        <div className={tm(globalState.theme === "dark" ? "dark" : "")}>
          {children}
        </div>
    </Context.Provider>
  )
}