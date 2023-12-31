import Trash from "../../assets/trash.svg?react"
import Plus from "../../assets/plus.svg?react"
import { twMerge as tm } from "tailwind-merge"
import { useState, useRef, useEffect } from "react"
import Container from "./Container"
import { useLiveQuery } from "dexie-react-hooks"
import { useGlobalContext } from "../../utils/context.js"
import { getCardsFromList, getCardsFromCard, recursivelyDeleteCard, recursivelyDeleteList, recursivelyDeleteBoard } from "../../utils/database.js"

type ItemProps = {
  id: number
  name: string
  includePlus: boolean
  itemType: "list" | "card" | "board"
  parentId?: number
  parentType?: "list" | "card"
}

export default function Item({id, name, includePlus, itemType, parentId, parentType}: ItemProps){
  const {db, globalState} = useGlobalContext()
  const cards = useLiveQuery(() => {
    if(itemType === "list"){
      return getCardsFromList(db, id)
    }else if(itemType === "card"){
      return getCardsFromCard(db, id)
    }
  })
  const [itemValue, setItemValue] = useState(name)
  const [deleted, setDeleted] = useState(false)
  const trashParentRef = useRef(null)

  // Remove deleted on click outside
  useEffect(() => {
    function handleClickOutside(event){
      if(!trashParentRef.current.lastChild) return
      if(!trashParentRef.current.lastChild.contains(event.target)){
        setDeleted(false)
      }
    }
    document.addEventListener("click", handleClickOutside)
    return(() => {
      document.removeEventListener("click", handleClickOutside)
    })
  }, [])

  async function autoTextAreaResizing(event){
    const textarea = event.target
    textarea.style.height = "fit-content"
    textarea.style.height = textarea.scrollHeight + "px"
    if(textarea.value.length > 64){
      setItemValue(textarea.value.substr(0, 64))
    }else{
      setItemValue(textarea.value)
    }
    // Save the changes
    if(itemType === "board"){
      await db.boards.update(id, {
        name: textarea.value
      })
    }else if(itemType === "list"){
      await db.lists.update(id, {
        name: textarea.value
      })
    }else if(itemType === "card"){
      await db.cards.update(id, {
        name: textarea.value
      })
    }
  }

  async function addNewCard() {
    // Create new card
    const newCardId = await db.cards.add({
      name: "",
      cards: []
    })
    // Add new card to parent's child references
    if(itemType === "list"){
      const list = await db.lists.get(id)
      await db.lists.update(id, {
        cards: [...list.cards, newCardId]
      })
    }else if(itemType === "card"){
      const card = await db.cards.get(id)
      await db.cards.update(id, {
        cards: [...card.cards, newCardId]
      })
    }
  }

  async function deleteSelf(){
    if(!deleted){
      setDeleted(true)
    }else{
      if(itemType === "list"){
        await recursivelyDeleteList(db, id, parentId)
      }else if(itemType === "card"){
        await recursivelyDeleteCard(db, id, parentId, parentType)
      }else if (itemType === "board"){
        await recursivelyDeleteBoard(db, id)
      }
    }
  }

  return (
    <div className="grid grid-cols-[auto_auto]">
      <textarea className="m-0 flex items-center border-none bg-transparent text-lightText dark:text-darkText text-base h-auto resize-none mt-auto mb-auto pl-1 focus:rounded focus:outline focus:outline-1 focus:dark:outline-darkBackground focus:outline-lightBackground" value={itemValue} onInput={autoTextAreaResizing} rows={1} spellCheck={false}></textarea>
      <div ref={trashParentRef} className="flex items-center justify-end">
        {includePlus ? <Plus className="cursor-pointer w-[--iconSize] h-[--iconSize] fill-lightText dark:fill-darkText" onClick={addNewCard} /> : ""}
        {(itemType !== "board" || id !== globalState.boardId) ? <Trash className={tm("cursor-pointer w-[--iconSize] h-[--iconSize] fill-lightText dark:fill-darkText", deleted && "fill-red-600 dark:fill-red-600")} onClick={deleteSelf} /> : ""}
      </div>
      {/* List all the cards */}
      {cards ? cards.map((card) => (
        <Container
          key={card.id} id={card.id}
          containerType="card"
          className="flex-shrink-0 col-span-2">
          <Item
            id={card.id}
            name={card.name}
            includePlus
            itemType="card"
            parentId={id}
            parentType={itemType}
          />
        </Container>
      )): ""}
    </div>
  )
}