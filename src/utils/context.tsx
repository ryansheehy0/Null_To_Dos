import { createContext, useContext, useState } from 'react'
import { twMerge as tm } from 'tailwind-merge'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'

const Context = createContext()
export const useGlobalContext = () => useContext(Context) // Returns the value attribute in the provider

export default function Provider({children}){
  const [globalState, setGlobalState] = useState({
    theme: "dark",
    open: false
  })

  let uuids: number[] = []

  return (
    <Context.Provider value={{uuids, globalState, setGlobalState}} >
      <DndProvider backend={HTML5Backend}>
        <div className={tm(globalState.theme === "dark" ? "dark" : "")}>
          {children}
        </div>
      </DndProvider>
    </Context.Provider>
  )
}