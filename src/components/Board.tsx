import { twMerge as tm } from "tailwind-merge"
import Container from "./Container/Container.js"
import { useGlobalContext } from "../utils/context.jsx"
import AddElement from "./Container/AddElement.js"
import Item from "./Container/Item.js"

export default function Board(){
  const {globalState, setGlobalState} = useGlobalContext()

  function addNewList(){
    console.log("test")
  }

  return (
    <div className={tm("w-[calc(100vw-var(--cardHeight))] overflow-auto h-screen bg-lightText dark:bg-darkText absolute top-0 right-0 flex justify-start", globalState.open && "w-[calc(100vw-(var(--cardWidth)+(2*var(--cardSpacing))))]")}>
      <Container cardOrList="list" className="ml-[--cardSpacing]"><Item /></Container>
      <Container cardOrList="list"><AddElement text="Add another card" onClick={addNewList}/></Container>
    </div>
  )
}