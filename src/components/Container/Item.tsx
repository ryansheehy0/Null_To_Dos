import Trash from "../../assets/trash.svg?react"
import Plus from "../../assets/plus.svg?react"
import { twMerge as tm } from "tailwind-merge"
import { useState, useRef, useEffect } from "react"
import Container from "./Container"
import { useLiveQuery } from "dexie-react-hooks"
import { useGlobalContext } from "../../utils/context.js"
import { getCardsFromList, getCardsFromCard, recursivelyDeleteCard, recursivelyDeleteList, recursivelyDeleteBoard } from "../../utils/database.js"
import { isMouseAboveInsideOrBelow, isMouseHorizontallyInside } from "../../utils/rectangleFunctions.js"

type ItemProps = {
  id: number
  name: string
  includePlus: boolean
  itemType: "list" | "card" | "board"
  parentId?: number
  parentType?: "list" | "card"
  callbackListRefs?: any
}

export default function Item({id, name, includePlus, itemType, parentId, parentType, callbackListRefs, callbackCardRefs}: ItemProps){
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

  // Dragging
  function getCardRect(card){
    const cardRefs = callbackCardRefs()
    for(const cardRef of cardRefs.current){
      if(!cardRef) continue
      if(cardRef.dataset.id == card.id){
        return cardRef.getBoundingClientRect()
      }
    }
  }

  async function putDraggingCardAboveOrBelow(draggingCardId, currentCard, aboveOrBelow: "above" | "below", parentType: "list" | "card"){
    const draggingCard = await db.cards.get(draggingCardId)
    // Remove dragging card from it's parent
    const draggingCardTable = draggingCard.parentType + "s"
    const draggingCardParent = await db[draggingCardTable].get(draggingCard.parentId)
    draggingCardParent.cards = draggingCardParent.cards.filter((cardId) => {return cardId !== draggingCardId})
    await db[draggingCardTable].update(draggingCardParent.id, {
      cards: [...draggingCardParent.cards]
    })

    // Get insertion index
    const currentCardTable = currentCard.parentType + "s"
    const currentCardParent = await db[currentCardTable].get(currentCard.parentId)
    const currentCardIndex = currentCardParent.cards.findIndex((cardId) => {return cardId === currentCard.id})
    const insertingIndex = aboveOrBelow === "above" ? currentCardIndex : (currentCardIndex + 1)
    // Insert dragging card above or below the current card
    currentCardParent.cards.splice(insertingIndex, 0, draggingCardId)
    await db[currentCardTable].update(currentCardParent.id, {
      cards: [...currentCardParent.cards]
    })

    // Change draggingCard's parentType and parentId
    await db.cards.update(draggingCardId, {
      parentId: currentCardParent.id,
      parentType: currentCard.parentType
    })

    //debugger
    // Change to filter function

    /*
    // Go through all the cards and list to remove the dragging card reference
    let lists = await db.lists.toArray()
    let hasDraggingCard = false
    for(const list of lists){
      const newCards = list.cards.filter((cardId) => {return cardId !== draggingCardId})
      if(newCards.length !== list.cards.length){
        hasDraggingCard = true
        await db.lists.update(list.id, {
          cards: [...newCards]
        })
        break
      }
    }

    if(!hasDraggingCard){
      const cards = await db.cards.toArray()
      for(const card of cards){
        if(card.id === draggingCardId) continue
        const newCards = []
        let hasDraggingCard = false
        for(const cardId of card.cards){
          if(cardId === draggingCardId){
            hasDraggingCard = true
          }else{
            newCards.push(cardId)
          }
        }
        if(hasDraggingCard){
          await db.cards.update(card.id, {
            cards: [...newCards]
          })
          break
        }
      }
    }

    // Find current card's reference and put dragging card in front or below
    // Check lists
    lists = await db.lists.toArray()
    let hasCurrentCard = false
    for(const list of lists){
      const currentCardIndex = list.cards.findIndex((cardId) => {return cardId === currentCard.id})
      if(currentCardIndex !== -1){// current card is in list
        console.log(list.cards)
        hasCurrentCard = true
        // Get insertion index
        const insertingIndex = aboveOrBelow === "above" ? currentCardIndex : (currentCardIndex + 1)
        // Insert the currently dragging card
        list.cards.splice(insertingIndex, 0, draggingCardId)
        await db.lists.update(list.id, {
          cards: [...list.cards]
        })
        break
      }
    }
    console.log(aboveOrBelow)
    // Check cards
    if(!hasCurrentCard){
      const cards = await db.cards.toArray()
      for(const card of cards){
        const currentCardIndex = card.cards.findIndex((cardId) => {
          return cardId === currentCard.id
        })
        if(currentCardIndex !== -1){// current card is in list
          // Get insertion index
          const insertingIndex = aboveOrBelow === "above" ? currentCardIndex : (currentCardIndex + 1)
          // Insert the currently dragging card
          card.cards.splice(insertingIndex, 0, draggingCardId)
          await db.cards.update(card.id, {
            cards: [...card.cards]
          })
          break
        }
      }
    }
    */
  }

  async function putDraggingCardInside(draggingCardId, card, parentType: "list" | "card"){
    // Remove dragging card from parent
    let parent
    if(parentType === "list"){
      parent = await db.lists.get(parentId)
    }else if(parentType === "card"){
      parent = await db.cards.get(parentId)
    }
    // Remove the currently dragging card
    parent.cards = parent.cards.filter((cardId) => {return cardId != draggingCardId})
    // Update the parent's cards
    if(parentType === "list"){
      await db.lists.update(parentId, {
        cards: [...parent.cards]
      })
    }else if(parentType === "card"){
      await db.cards.update(parentId, {
        cards: [...parent.cards]
      })
    }

    // Put dragging card into current card's cards at the end
    card.cards.push(draggingCardId)
    await db.cards.update(card.id, {
      cards: [...card.cards]
    })
  }

  async function cardDragging(event, cards, parentType: "list" | "card"){
    const draggingCardId = parseInt(event.target.dataset.id)
    for(const cardId of cards){
      const card = await db.cards.get(cardId)
      const cardRect = getCardRect(card)
      // Exclude the currently dragging card
      if(draggingCardId === card.id) continue
      // Check if the dragging card is above, inside, or below
      const aboveInsideOrBelow = isMouseAboveInsideOrBelow(cardRect, event.clientY)
      if(aboveInsideOrBelow === "above"){
        await putDraggingCardAboveOrBelow(draggingCardId, card, "above", parentType)
        return
      }else if(aboveInsideOrBelow === "inside"){
        //debugger
        if(card.cards.length !== 0){
          await cardDragging(event, card.cards, "card")
        }else{
          await putDraggingCardInside(draggingCardId, card, parentType)
          return
        }
      }else if(aboveInsideOrBelow === "below"){
        await putDraggingCardAboveOrBelow(draggingCardId, card, "below", parentType)
        return
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
    const board = await db.boards.get(globalState.boardId)
    for(const listId of board.lists){
      const list = await db.lists.get(listId)
      const listRect = getListRect(list)
      // Find which list the dragging card is in
      if(!isMouseHorizontallyInside(listRect, event.clientX)) continue

      if(list.cards.length !== 0){
        await cardDragging(event, list.cards, "list")
      }else{
        // Add dragging card into list
      }
    }
  }

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

  async function addNewCard(){
    // Create new card
    const newCardId = await db.cards.add({
      name: "",
      cards: [],
      parentId: id,
      parentType: itemType
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
          className="flex-shrink-0 col-span-2"
          ref={(ref) => {
            const cardRefs = callbackCardRefs()
            cardRefs.current.push(ref)
          }}
          onDrag={onCardDrag}
          >
          <Item
            id={card.id}
            name={card.name}
            includePlus
            itemType="card"
            parentId={id}
            parentType={itemType}
            callbackListRefs={callbackListRefs}
            callbackCardRefs={callbackCardRefs}
          />
        </Container>
      )): ""}
    </div>
  )
}