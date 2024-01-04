import { twMerge as tm } from "tailwind-merge"
import { useGlobalContext } from "../../utils/context"
import { useState, useRef, useEffect } from "react"
import Trash from "../../assets/trash.svg?react"
import Plus from "../../assets/plus.svg?react"
import { recursivelyDeleteCard, getCardsFromCard } from "../../utils/database"
import { useLiveQuery } from "dexie-react-hooks"
import React from "react"
import { isMouseHorizontallyInside, isMouseAboveInsideOrBelow } from "../../utils/rectangleFunctions"
import transact from "../../utils/transaction"

const Card = React.forwardRef(({id, name, parentId, parentType, callbackCardRefs, callbackListRefs, className, ...props}, ref) => {
  const {db, globalState} = useGlobalContext()
  const [textarea, setTextarea] = useState(name)
  const trashParentRef = useRef(null)
  const [deleted, setDeleted] = useState(false)
  const cards = useLiveQuery(() => {
    return getCardsFromCard(db, id)
  })
  const [hideCard, setHideCard] = useState(false)
  const [startDragEvents, setStartDragEvents] = useState(false)

  // Need to check dragging fast
  // Need to leave comments explaining what the problem is and why hideCard is necessary
  // Problem with adding multiple of the same card
  // Dragging out of another card creating just 1 layer of cards causes problems

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

  // Dragging functions
  function getCardRect(card){
    const cardRefs = callbackCardRefs()
    for(const cardRef of cardRefs.current){
      if(!cardRef) continue
      if(cardRef.dataset.id == card.id){
        return cardRef.getBoundingClientRect()
      }
    }
  }

  const [newDraggingCard, setNewDraggingCard] = useState({
    id,
    name,
    cards,
    parentId,
    parentType
  })

  async function putDraggingCardAboveOrBelow(draggingCardId, currentCard, aboveOrBelow: "above" | "below"){
    await transact(db, async () => {
      // Get dragging card
      const draggingCard = await db.cards.get(draggingCardId)

      // If the parent of the newDraggingCard isn't the same as the draggingCard
      if(!(newDraggingCard.parentId === draggingCard.parentId && newDraggingCard.parentType === draggingCard.parentType)){
        // Remove the newDraggingCard from its parent
        const newDraggingCardParent = await db[newDraggingCard.parentType + "s"].get(newDraggingCard.parentId)
        newDraggingCardParent.cards = newDraggingCardParent.cards.filter((cardId) => {return cardId !== newDraggingCard.id})
        await db[newDraggingCard.parentType + "s"].update(newDraggingCardParent.id, {
          cards: [...newDraggingCardParent.cards]
        })
      }

      console.log("draggingCard.parentId" , draggingCard.parentId)
      console.log("currentCard.parentId" , currentCard.parentId)
      console.log("draggingCard.parentType" , draggingCard.parentType)
      console.log("currentCard.parentType" , currentCard.parentType)
      // If the parent of the draggingCard is the same as the parent of the currentCard
      if(draggingCard.parentId === currentCard.parentId && draggingCard.parentType === currentCard.parentType){
        //debugger
        // Unhide dragging card
        setHideCard(false)
        // Get the current card's parent
        const parent = await db[currentCard.parentType + "s"].get(currentCard.parentId)
        // Remove the dragging card from the parent
        parent.cards = parent.cards.filter((cardId) => {return cardId !== draggingCardId})
        // Find index where to place
        const currentCardIndex = parent.cards.findIndex((cardId) => {return cardId === currentCard.id})
        const insertionIndex = aboveOrBelow === "above" ? currentCardIndex : (currentCardIndex + 1)
        // Insert the draggingCardId into the parent cards
        parent.cards.splice(insertionIndex, 0, draggingCardId)
        // Update parent's cards
        await db[currentCard.parentType + "s"].update(parent.id, {
          cards: [...parent.cards]
        })
        // Set newDraggingCard
        setNewDraggingCard({
          ...newDraggingCard,
          parentId: currentCard.parentId,
          parentType: currentCard.parentType
        })
      }else{
        // Get the current card's parent
        const parent = await db[currentCard.parentType + "s"].get(currentCard.parentId)
        // Find index where to place
        const currentCardIndex = parent.cards.findIndex((cardId) => {return cardId === currentCard.id})
        const insertionIndex = aboveOrBelow === "above" ? currentCardIndex : (currentCardIndex + 1)
        // Insert the draggingCardId into the parent cards
        parent.cards.splice(insertionIndex, 0, draggingCardId)
        // Update parent's cards
        await db[currentCard.parentType + "s"].update(parent.id, {
          cards: [...parent.cards]
        })
        // Set newDraggingCard
        setNewDraggingCard({
          ...newDraggingCard,
          parentId: currentCard.parentId,
          parentType: currentCard.parentType
        })
        // Hide dragging card
        setHideCard(true)
      }
    })
  }

  async function cardDragging(event, cards){
    const draggingCardId = parseInt(event.target.dataset.id)
    //debugger
    for(const [i, cardId] of cards.entries()){
      // Exclude the currently dragging card
      if(draggingCardId === cardId) continue
      // Get card
      const card = await db.cards.get(cardId)
      const cardRect = getCardRect(card)
      // Check if the dragging card is above, inside, or below
      const aboveInsideOrBelow = isMouseAboveInsideOrBelow(cardRect, event.clientY)
      if(aboveInsideOrBelow === "above"){
        console.log("above")
        await putDraggingCardAboveOrBelow(draggingCardId, card, "above")
        return
      }else if(aboveInsideOrBelow === "inside"){
        if(card.cards.length !== 0){
          await cardDragging(event, card.cards)
          return
        }else{
          //await putDraggingCardInside(draggingCardId, card, parentType)
          console.log("inside")
          return
        }
      }else if(aboveInsideOrBelow === "below"){
        if((i === cards.length - 1 && cards.at(-1) !== draggingCardId) || (i === cards.length - 2 && cards.at(-1) === draggingCardId)){ // What about if it isn't the last card because of the hidden element?
          console.log("below")
          await putDraggingCardAboveOrBelow(draggingCardId, card, "below")
          return
        }
      }
    }
  }

  function getListRect(list){
    const listRefs = callbackListRefs()
    for(const listRef of listRefs.current){
      if(!listRef) continue
      if(listRef.dataset.id == list.id){
        return listRef.getBoundingClientRect()
      }
    }
  }

  async function onCardDrag(event){
    event.stopPropagation()
    if(!startDragEvents){
      console.log("prevented")
      return
    }

    setStartDragEvents(false) // Used to prevent other drag events running while a previous await drag event is running

    try{
      const board = await db.boards.get(globalState.boardId)
      for(const listId of board.lists){
        const list = await db.lists.get(listId)
        const listRect = getListRect(list)
        // Find which list the dragging card is in
        if(!isMouseHorizontallyInside(listRect, event.clientX)) continue

        if(list.cards.length !== 0){
          await cardDragging(event, list.cards)
        }else{
          // Add dragging card into list
        }
        break
      }
    }catch(error){console.error(error)}

    setStartDragEvents(true)
  }

  function onDragStart(event){
    // Used to ensure the browser has time to set the dragging image
    setTimeout(async () => {
      setStartDragEvents(true)
    }, 400)
  }

  async function onDragEnd(){
    console.log("drag ending")
    if(hideCard){
      // Update db value of dragging card
      await db.cards.update(id, {
        parentId: newDraggingCard.parentId,
        parentType: newDraggingCard.parentType,
      })
      // Remove reference to card in parent
      const parent = await db[parentType + "s"].get(parentId)
      parent.cards = parent.cards.filter((cardId) => {return cardId !== id})
      await db[parentType + "s"].update(parentId, {
        cards: [...parent.cards]
      })
    }
    setStartDragEvents(false)
  }

  return (
    <div
      ref={ref}
      data-id={id}
      className={tm("rounded-xl py-1.5 px-3 min-w-[--cardWidth] w-min flex justify-center items-center min-h-[--cardHeight] h-fit my-[--cardSpacing]  box-border ml-[--cardSpacing]", "bg-lightCard dark:bg-darkCard border border-solid border-lightBackground dark:border-darkBackground", className, hideCard && "hidden")}
      draggable="true"
      onDragStart={onDragStart}
      onDrag={onCardDrag}
      onDragEnd={onDragEnd}
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
              ref={(ref) => {
                const cardRefs = callbackCardRefs()
                cardRefs.current.push(ref)}
              }
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