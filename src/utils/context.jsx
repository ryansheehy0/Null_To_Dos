import { createContext, useContext, useState } from 'react'
import { twMerge as tm } from 'tailwind-merge'

const Context = createContext()
export const useGlobalContext = () => useContext(Context) // Returns the value attribute in the provider

export default function Provider({children}){
  const [theme, setTheme] = useState("dark")

  return (
    <Context.Provider value={{theme, setTheme}} >
      <div className={tm(theme === "dark" ? "dark" : "")}>
        {children}
      </div>
    </Context.Provider>
  )
}