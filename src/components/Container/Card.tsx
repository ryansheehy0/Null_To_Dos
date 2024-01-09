import { twMerge as tm } from "tailwind-merge"
import { useGlobalContext } from "../../utils/context"
import { useState, useRef, useEffect } from "react"
import Trash from "../../assets/trash.svg?react"
import Plus from "../../assets/plus.svg?react"
import { recursivelyDeleteCard, getCardsFromCard } from "../../utils/database"
import { useLiveQuery } from "dexie-react-hooks"
import React from "react"
import { isMouseHorizontallyInside, isMouseAboveInsideOrBelow, isValidRect } from "../../utils/rectangleFunctions"
import transact from "../../utils/transaction"

const Card = React.forwardRef(({id, name, parentId, parentType, callbackCardRefs, callbackListRefs, className, ...props}, ref) => {
  const {db, globalState} = useGlobalContext()
  const [textarea, setTextarea] = useState(name)
  const trashParentRef = useRef(null)
  const [deleted, setDeleted] = useState(false)
  const cards = useLiveQuery(async () => {
    return getCardsFromCard(db, id)
  }, [globalState.boardId])
  const [hideCard, setHideCard] = useState(false)
  const [startDragEvents, setStartDragEvents] = useState(false)
  const [spellChecking, setSpellChecking] = useState(false)
  const textareaRef = useRef(null)

  // Need to leave comments explaining what the problem is and why hideCard is necessary
  // Dragging not working

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
    /*
    if(textarea.value.length > 64){
      setTextarea(textarea.value.substr(0, 64))
    }else{
      setTextarea(textarea.value)
    }
    */
    setTextarea(textarea.value)
    // Save the name change to db
    await db.cards.update(id, {
      name: textarea.value
    })
  }

  // Size the textarea on load
  useEffect(() => {
    const textarea = textareaRef.current
    textarea.style.height = "fit-content"
    textarea.style.height = textarea.scrollHeight + "px"
  }, [])


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
        const cardRect = cardRef.getBoundingClientRect()
        // Filter out invalid cardRects
        if(!isValidRect(cardRect)) continue
        return cardRect
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

      // If the parent of the draggingCard is the same as the parent of the currentCard
      if(draggingCard.parentId === currentCard.parentId && draggingCard.parentType === currentCard.parentType){
        // Unhide dragging card
        setHideCard(false)
      }else{
        // Hide dragging card
        setHideCard(true)
      }
    })
  }

  async function putDraggingCardInside(draggingCardId, item, cardOrList: "card" | "list"){
    // Note: This only runs when currentCard has no children
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

      // Remove the dragging card from the item
      item.cards = item.cards.filter((cardId) => {return cardId !== draggingCardId})
      // Insert the draggingCardId to the end of the item's cards
      item.cards.push(draggingCardId)
      // Update current card
      await db[cardOrList + "s"].update(item.id, {
        cards: [...item.cards]
      })
      // set newDraggingCard
      setNewDraggingCard({
        ...newDraggingCard,
        parentId: item.id,
        parentType: cardOrList
      })
      // If the item is the parent of the draggingCard
      if((item.id === draggingCard.parentId) && (draggingCard.parentType == cardOrList)){
        // Un-hide
        setHideCard(false)
      }else{
        // Hide
        setHideCard(true)
      }
    })
  }

  async function cardDragging(draggingCardId, clientY, cards){
    for(const [i, cardId] of cards.entries()){
      // Exclude the currently dragging card
      if(draggingCardId === cardId) continue
      // Get card
      const card = await db.cards.get(cardId)
      const cardRect = getCardRect(card)
      // Check if the dragging card is above, inside, or below
      const aboveInsideOrBelow = isMouseAboveInsideOrBelow(cardRect, clientY)
      if(aboveInsideOrBelow === "above"){
        await putDraggingCardAboveOrBelow(draggingCardId, card, "above")
        return
      }else if(aboveInsideOrBelow === "inside"){
        if((card.cards.length === 0) || (card.cards.length === 1 && card.cards[0] === draggingCardId)){ // What if the inside card is the hidden card?
          await putDraggingCardInside(draggingCardId, card, "card")
        }else{
          await cardDragging(draggingCardId, clientY, card.cards)
        }
        return
      }else if(aboveInsideOrBelow === "below"){
        if((i === cards.length - 1 && cards.at(-1) !== draggingCardId) || (i === cards.length - 2 && cards.at(-1) === draggingCardId)){ // What about if it isn't the last card because of the hidden card?
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
    if(!startDragEvents) return

    setStartDragEvents(false) // Used to prevent other drag events running while a previous await drag event is running

    try{
      const board = await db.boards.get(globalState.boardId)
      for(const listId of board.lists){
        const list = await db.lists.get(listId)
        const listRect = getListRect(list)
        // Find which list the dragging card is in
        if(!isMouseHorizontallyInside(listRect, event.clientX)) continue

        const draggingCardId = parseInt(event.target.dataset.id)
        const clientY = event.clientY

        if((list.cards.length === 0) || (list.cards.length === 1 && list.cards[0] === draggingCardId)){ // What if the last element in the list is the hidden dragging element?
          // Add dragging card into list
          putDraggingCardInside(draggingCardId, list, "list")
        }else{
          await cardDragging(draggingCardId, clientY, list.cards)
        }
        break
      }
    }catch(error){console.error(error)}

    setStartDragEvents(true)
  }

  function onDragStart(){
    // Used to ensure the browser has time to set the dragging image
    setTimeout(async () => {
      setStartDragEvents(true)
    }, 400)
  }

  async function onDragEnd(){
    if(hideCard){
      // Get previous values of card
      const card = await db.cards.get(id)
      const oldParentId = card.parentId
      const oldParentType = card.parentType
      // Update db value of card
      await db.cards.update(id, {
        parentId: newDraggingCard.parentId,
        parentType: newDraggingCard.parentType,
      })
      // Remove reference to card in parent
      const parent = await db[oldParentType + "s"].get(oldParentId)
      parent.cards = parent.cards.filter((cardId) => {return cardId !== id})
      await db[oldParentType + "s"].update(oldParentId, {
        cards: [...parent.cards]
      })
    }
    setStartDragEvents(false)
  }

  return (
    <div
      ref={ref}
      data-id={id}
      className={tm("rounded-xl pt-1.5 px-1.5 min-w-[--cardWidth] w-min flex justify-center items-center min-h-[--cardHeight] h-fit mt-[--cardSpacing]  box-border mx-[calc(var(--cardSpacing)/2)]", "bg-lightCard dark:bg-darkCard border border-solid border-lightBackground dark:border-darkBackground", className, hideCard && "hidden", cards?.length !== 0 ? "pb-[calc(var(--cardSpacing)*1.5)]" : "pb-1.5")}
      draggable="true"
      onDragStart={onDragStart}
      onDrag={onCardDrag}
      onDragEnd={onDragEnd}
      {...props}>
        <div className="grid grid-cols-[auto_auto]">
          <textarea ref={textareaRef} className="m-0 flex items-center border-none bg-transparent text-lightText dark:text-darkText text-sm h-auto resize-none mt-auto mb-auto pl-1 focus:rounded focus:outline focus:outline-1 focus:dark:outline-darkBackground focus:outline-lightBackground hyphens-auto" value={textarea} onInput={onTextareaInput} rows={1} onFocus={() => {setSpellChecking(true)}} onBlur={() => {setSpellChecking(false)}} spellCheck={spellChecking}></textarea>
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