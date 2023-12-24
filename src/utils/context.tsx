import { createContext, useContext, useState } from 'react'
import { twMerge as tm } from 'tailwind-merge'

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
        <div className={tm(globalState.theme === "dark" ? "dark" : "")}>
          {children}
        </div>
    </Context.Provider>
  )
}