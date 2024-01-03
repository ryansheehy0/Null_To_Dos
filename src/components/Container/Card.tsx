import { twMerge as tm } from "tailwind-merge"
import { useGlobalContext } from "../../utils/context"
import { useState, useRef, useEffect } from "react"
import Trash from "../../assets/trash.svg?react"
import Plus from "../../assets/plus.svg?react"
import { recursivelyDeleteCard, getCardsFromCard } from "../../utils/database"
import { useLiveQuery } from "dexie-react-hooks"
import React from "react"

const Card = React.forwardRef(({id, name, parentId, parentType, callbackCardRefs, callbackListRefs, className, ...props}, ref) => {
  const {db} = useGlobalContext()
  const [textarea, setTextarea] = useState(name)
  const trashParentRef = useRef(null)
  const [deleted, setDeleted] = useState(false)
  const cards = useLiveQuery(() => {
    return getCardsFromCard(db, id)
  })

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

  async function onTextareaInput(event){
    // Resize text area
    const textarea = event.target
    textarea.style.height = "fit-content"
    textarea.style.height = textarea.scrollHeight + "px"
    // Limit the input to 64 characters
    if(textarea.value.length > 64){
      setTextarea(textarea.value.substr(0, 64))
    }else{
      setTextarea(textarea.value)
    }
    // Save the name change to db
    await db.cards.update(id, {
      name: textarea.value
    })
  }

  async function deleteSelf(){
    if(!deleted){
      setDeleted(true)
    }else{
      await recursivelyDeleteCard(db, id, parentId, parentType)
    }
  }

  async function addNewCard(){
    // Create new card
    const newCardId = await db.cards.add({
      name: "",
      cards: [],
      parentId: id,
      parentType: "card"
    })
    // Add new card to parent's child references
    const card = await db.cards.get(id)
    await db.cards.update(id, {
      cards: [...card.cards, newCardId]
    })
  }

  return (
    <div
      ref={ref}
      data-id={id}
      className={tm("rounded-xl py-1.5 px-3 min-w-[--cardWidth] w-min flex justify-center items-center min-h-[--cardHeight] h-fit my-[--cardSpacing]  box-border ml-[--cardSpacing]", "bg-lightCard dark:bg-darkCard border border-solid border-lightBackground dark:border-darkBackground", className)}
      draggable="true"
      {...props}>
        <div className="grid grid-cols-[auto_auto]">
          <textarea className="m-0 flex items-center border-none bg-transparent text-lightText dark:text-darkText text-base h-auto resize-none mt-auto mb-auto pl-1 focus:rounded focus:outline focus:outline-1 focus:dark:outline-darkBackground focus:outline-lightBackground" value={textarea} onInput={onTextareaInput} rows={1} spellCheck={false}></textarea>
          <div ref={trashParentRef} className="flex items-center justify-end">
            <Plus className="cursor-pointer w-[--iconSize] h-[--iconSize] fill-lightText dark:fill-darkText" onClick={addNewCard} />
            <Trash className={tm("cursor-pointer w-[--iconSize] h-[--iconSize] fill-lightText dark:fill-darkText", deleted && "fill-red-600 dark:fill-red-600")} onClick={deleteSelf} />
          </div>
          {/* List all the cards */}
          {cards ? cards.map((card) => (
            <Card
              key={card.id} id={card.id}
              name={card.name}
              parentId={card.parentId} parentType={card.parentType}
              callbackCardRefs={callbackCardRefs}
              callbackListRefs={callbackListRefs}
              className="flex-shrink-0 col-span-2"
            />
          )): ""}
        </div>
    </div>
  )
})

export default Card