import { createContext, useContext, useEffect, useState } from 'react'
import Dexie from "dexie"

const Context = createContext()
export const useGlobalContext = () => useContext(Context) // Returns the value attribute in the provider

export default function Provider({children}){
  const [loading, setLoading] = useState(true)
  const [globalState, setGlobalState] = useState({
    theme: "dark",
    open: false,
    boardId: 1
  })
  // Set up db
  let db = new Dexie("Null_Todos")
  db.version(1).stores({
    miscellaneous: "++id,theme,open,boardId,boardOrder",
    boards: "++id,name,lists",
    lists: "++id,name,cards",
    cards: "++id,name,cards,parentId,parentType"
  })

  useEffect(() => {
    async function loadApp(){
      // If there aren't any boards then add one
      const boards = await db.boards.toArray()
      if(boards.length === 0){
        await db.boards.add({
          name: "",
          lists: []
        })
      }

      // If there isn't a miscellaneous then add one
      const miscellaneous = await db.miscellaneous.get(1)
      if(!miscellaneous){
        const boards = await db.boards.toArray()
        const boardIds = boards.map(board => {return board.id})
        await db.miscellaneous.add({
          theme: "dark",
          open: false,
          boardId: 1,
          boardOrder: boardIds
        })
      }else{
        // Load the globalState
        setGlobalState({
          theme: miscellaneous.theme,
          open: miscellaneous.open,
          boardId: miscellaneous.boardId
        })
      }

      setLoading(false)
    }

    loadApp()
  }, [])

  if(loading) return null

  return (
    <Context.Provider value={{db, globalState, setGlobalState}} >
        <div className={globalState.theme === "dark" ? "dark" : ""}>
          {children}
        </div>
    </Context.Provider>
  )
}