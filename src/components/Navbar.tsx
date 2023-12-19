import { useState } from "react"
import List from "../assets/list.svg?react"
import Moon from "../assets/moon.svg?react"
import Sun from "../assets/sun.svg?react"
import Download from "../assets/download.svg?react"
import Upload from "../assets/upload.svg?react"
import { twMerge as tm } from "tailwind-merge"
import { useGlobalContext } from "../utils/context.jsx"
import NavIcon from "./Navbar/NavIcon.js"
import Container from "./Container/Container.js"

export default function Navbar(){
  const {globalState, setGlobalState} = useGlobalContext()

  return (
    <div className={tm("w-[--cardHeight] h-screen absolute left-0 top-0 bg-lightList dark:bg-darkList z-10", globalState.open && "w-[--cardWidth]")}>
      <NavIcon Icon={List} rightOffset={"right-[--cardSpacing]"} onClick={() => setGlobalState({...globalState, open: !globalState.open})} />
      {globalState.open ? (
        <>
          {globalState.theme === "dark" ? (
            <NavIcon Icon={Moon} rightOffset={"right-[calc(2*var(--cardSpacing)+var(--iconSize))]"} onClick={() => setGlobalState({...globalState, theme: "light"})} />
          ) : (
            <NavIcon Icon={Sun} rightOffset={"right-[calc(2*var(--cardSpacing)+var(--iconSize))]"} onClick={() => setGlobalState({...globalState, theme: "dark"})} />
          )}
          <NavIcon Icon={Upload} rightOffset={"right-[calc(3*var(--cardSpacing)+2*var(--iconSize))]"} />
          <NavIcon Icon={Download} rightOffset={"right-[calc(4*var(--cardSpacing)+3*var(--iconSize))]"} />
          <Container cardOrList="card">

          </Container>
        </>
      ): "" }
    </div>
  )
}