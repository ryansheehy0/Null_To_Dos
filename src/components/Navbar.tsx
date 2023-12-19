import { useState } from "react"
import List from "../assets/list-cropped.svg?react"
import Moon from "../assets/moon.svg?react"
import Sun from "../assets/sun.svg?react"
import Download from "../assets/download.svg?react"
import Upload from "../assets/upload.svg?react"
import { twMerge as tm } from "tailwind-merge"
import { useGlobalContext } from "../utils/context.jsx"

export default function Navbar(){
  const [open, setOpen] = useState(false)
  const {theme, setTheme} = useGlobalContext()

  return (
    <div className={tm("w-[--cardHeight] h-screen left-0 top-0 bg-lightCard dark:bg-darkCard relative", open && "w-[--cardWidth]")}>
        <List className={tm("w-[--iconSize] h-[--iconSize] absolute top-[--cardSpacing] right-[--cardSpacing] fill-lightText dark:fill-darkText")} onClick={() => setOpen(!open)} />
        {open ? (
          (open && theme === "dark" ?
            <Moon className={tm("w-[--iconSize] h-[--iconSize] absolute top-[--cardSpacing] right-[calc(2*var(--cardSpacing)+var(--iconSize))] fill-lightText dark:fill-darkText")} onClick={() => setTheme("light")}/> :
            <Sun className={tm("w-[--iconSize] h-[--iconSize] absolute top-[--cardSpacing] right-[calc(2*var(--cardSpacing)+var(--iconSize))] fill-lightText dark:fill-darkText")} onClick={() => setTheme("dark")}/>)
        ):""}
        {open ? (
          <Upload className={tm("w-[--iconSize] h-[--iconSize] absolute top-[--cardSpacing] right-[calc(3*var(--cardSpacing)+2*var(--iconSize))] fill-lightText dark:fill-darkText")} />
        ):""}
        {open ? (
          <Download className={tm("w-[--iconSize] h-[--iconSize] absolute top-[--cardSpacing] right-[calc(4*var(--cardSpacing)+3*var(--iconSize))] fill-lightText dark:fill-darkText")} />
        ):""}
    </div>
  )
}