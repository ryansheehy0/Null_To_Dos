import { createContext, useContext, useEffect, useState } from 'react'
import Dexie from "dexie"

const Context = createContext()
export const useGlobalContext = () => useContext(Context) // Returns the value attribute in the provider

export default function Provider({children}){
  const [loading, setLoading] = useState(true)
  // Set up db
  let db = new Dexie("Null_Todos")
  db.version(1).stores({
    boards: "++id,name,lists",
    lists: "++id,name,cards",
    cards: "++id,name,cards,parentId,parentType"
  })

  useEffect(() => {
    async function addBoardIfNone(){
      const boards = await db.boards.toArray()
      if(boards.length === 0){
        await db.boards.add({
          name: "",
          lists: []
        })
      }
      setLoading(false)
    }
    addBoardIfNone()
  }, [])

  // Set up global state
  const [globalState, setGlobalState] = useState({
    theme: "dark",
    open: false,
    boardId: 1
  })

  if(loading) return null

  return (
    <Context.Provider value={{db, globalState, setGlobalState}} >
        <div className={globalState.theme === "dark" ? "dark" : ""}>
          {children}
        </div>
    </Context.Provider>
  )
}