import { createContext, useContext, useState } from 'react'
import Dexie from "dexie"

const Context = createContext()
export const useGlobalContext = () => useContext(Context) // Returns the value attribute in the provider

export default function Provider({children}){
  // Set up db
  let db = new Dexie("Null_Todos")
  db.version(1).stores({
    boards: "++id,name,lists"
  })

  // Have provider wait for new board to be added to prevent errors
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

  // Set up global state
  const [globalState, setGlobalState] = useState({
    theme: "dark",
    open: false,
    boardId: 0
  })

  return (
    <Context.Provider value={{db, globalState, setGlobalState}} >
        <div className={globalState.theme === "dark" ? "dark" : ""}>
          {children}
        </div>
    </Context.Provider>
  )
}