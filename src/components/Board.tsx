import { twMerge as tm } from "tailwind-merge"
import Container from "./Container/Container.js"
import { useGlobalContext } from "../utils/context.jsx"

export default function Board(){
  const {globalState, setGlobalState} = useGlobalContext()

  return (
    <div className={tm("w-[calc(100vw-var(--cardHeight))] h-screen bg-lightText dark:bg-darkText absolute top-0 right-0", globalState.open && "w-[calc(100vw-var(--cardWidth))]")}>
      <Container cardOrList="list">
        Test
      </Container>
    </div>
  )
}
