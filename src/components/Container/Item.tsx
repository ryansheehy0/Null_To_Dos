import Trash from "../../assets/trash.svg?react"
import Plus from "../../assets/plus.svg?react"
import { twMerge as tm } from "tailwind-merge"
import { useState, useRef, useEffect } from "react"
import Container from "./Container"
import getNewUUID from "../../utils/getNewUUID"
import { useLiveQuery } from "dexie-react-hooks"
import { useGlobalContext } from "../utils/context.js"
import { getCardsFromList, getCardsFromCard } from "../../utils/database.js"

type ItemProps = {
  id: number
  name: string
  includePlus: boolean
  itemType: "list" | "card"
  deleteItem: (event) => void
}

export default function Item({id, name, includePlus, itemType, deleteItem}: ItemProps){
  const {db, globalState} = useGlobalContext()
  const cards = useLiveQuery(async () => {
    if(itemType === "list"){
      return await getCardsFromList(id)
    }else if(itemType === "card"){
      return await getCardsFromCard(id)
    }
  }, [])

  const [itemValue, setItemValue] = useState(name)
  const [deleted, setDeleted] = useState(false)

  const trashParentRef = useRef(null)

  useEffect(() => {
    function handleClickOutside(event){
      if(!trashParentRef.current.lastChild.contains(event.target)){
        setDeleted(false)
      }
    }
    document.addEventListener("click", handleClickOutside)
    return(() => {
      document.removeEventListener("click", handleClickOutside)
    })
  }, [])

  function autoTextAreaResizing(event){
    const textarea = event.target
    textarea.style.height = "fit-content"
    textarea.style.height = textarea.scrollHeight + "px"
    if(textarea.value.length > 64){
      setItemValue(textarea.value.substr(0, 64))
    }else{
      setItemValue(textarea.value)
    }
  }

  async function addNewCard() {
    const card = await db.cards.add({name: "", cards: []})
    const cardIds = cards.map((card) => {return card.id})
    if(itemType === "list"){
      await db.lists.update(id, {
        cards: [...cardIds, card.id]
      })
    }else if(itemType === "card"){
      await db.cards.update(id, {
        cards: [...cardIds, card.id]
      })
    }
  }

  function deleteSelf(event){
    if(!deleted){
      setDeleted(true)
    }else{
      deleteItem(event)
    }
  }

  return (
    <div className="grid grid-cols-[auto_auto]">
      <textarea className="m-0 flex items-center border-none bg-transparent text-lightText dark:text-darkText text-base h-auto resize-none mt-auto mb-auto pl-1 focus:rounded focus:outline focus:outline-1 focus:dark:outline-darkBackground focus:outline-lightBackground" value={itemValue} onInput={autoTextAreaResizing} rows={1} spellCheck={false}></textarea>
      <div ref={trashParentRef} className="flex items-center justify-end">
        {includePlus ? <Plus className="cursor-pointer w-[--iconSize] h-[--iconSize] fill-lightText dark:fill-darkText" onClick={addNewCard} /> : ""}
        <Trash className={tm("cursor-pointer w-[--iconSize] h-[--iconSize] fill-lightText dark:fill-darkText", deleted && "fill-red-600 dark:fill-red-600")} onClick={deleteSelf} />
      </div>
      {cards.map((card) => (
        <Container
          key={card.id} id={card.id}
          containerType="card"
          className="flex-shrink-0 col-span-2">
          <Item
            id={card.id}
            name={card.name}
            includePlus
            itemType="card"

            setItems={setCards}
//{id, name, includePlus, itemType, deleteItem
          />
        </Container>
      ))}
    </div>
  )
}