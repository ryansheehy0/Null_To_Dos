import { createContext, useContext, useState } from 'react'
import { twMerge as tm } from 'tailwind-merge'
import Dexie from "dexie"

let db = new Dexie("Null_Todos")
db.version(1).stores({
  boards: "id,name,lists"
})

const Context = createContext()
export const useGlobalContext = () => useContext(Context) // Returns the value attribute in the provider

export default function Provider({children}){
  const [globalState, setGlobalState] = useState({
    theme: "dark",
    open: false
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