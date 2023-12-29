export async function getCardsFromList(db, listId, boardId){
  const board = await db.boards.get(boardId)
  for(const list of board.lists){
    if(list.id === listId){
      return list.cards
    }
  }
}


function recursivelyGetCard(card, cardId){
  if(card.id === cardId){
    return card
  }
  for(const childCard of card.cards){
    const possibleCard = recursivelyGetCard(childCard, cardId)
    if(possibleCard) return possibleCard
  }
  return null
}

function recursivelyGetCardFromList(list, cardId){
  for(const card of list.cards){
    const possibleCard = recursivelyGetCard(card, cardId)
    if(possibleCard) return possibleCard
  }
  return null
}

export async function getCardsFromCard(db, cardId){
  const cards = await populate(db, cardId, "cards", "cards")
  return cards
}

async function deleteItem(db, itemType: "card" | "list" | "board", id, parentId?: number, parenType?: "list" | "card"){
  if(itemType === "list"){
    // Remove reference to self in boards
    const board = await db.boards.get(parentId)
    board.lists = board.lists.filter((list) => { return list !== id })
    await db.boards.update(parentId, {
      lists: [...board.lists]
    })
    // Remove self from lists
    await db.lists.delete(id)
  }else if(itemType === "card"){
    // Remove reference to self in lists
    const list = await db.lists.get(parentId)
    list.cards = list.cards.filter((card) => { return card !== id })
    await db.lists.update(parentId, {
      cards: [...list.cards]
    })
    // Remove self from cards
    await db.cards.delete(id)
  }else if (itemType === "board"){
    // remove self from boards
    await db.boards.delete(id)
  }
}

async function recursivelyDeleteCard(db, id, parentId, parentType: "list" | "card"){
  // Get the card
  const card = await db.cards.get(id)
  // Check if there are any children
  if(card.cards.length > 0){
    card.cards.forEach(async (childCardId) => {
      await recursivelyDeleteCard(db, childCardId, id, "card")
    })
  }else{
    await deleteItem(db, "card", id, parentId, parentType)
  }
}

async function recursivelyDeleteList(db, id, parentId){
  // Get the list
  const list = await db.lists.get(id)
  // Check if there are any children
  if(list.cards.length > 0){
    list.cards.forEach(async (childCardId) => {
      await recursivelyDeleteCard(db, childCardId, id, "list")
    })
  }else{
    await deleteItem(db, "list", id, parentId)
  }
}

async function recursivelyDeleteBoard(db, id){
  // Get the board
  const board = await db.boards.get(id)
  // Check if there are any children
  if(board.lists.length > 0){
    board.lists.forEach(async (childListId) => {
      await recursivelyDeleteList(db, childListId, id)
    })
  }else{
    await deleteItem(db, "board", id)
  }
}

export async function recursivelyDeleteItem(db, itemType: "card" | "list" | "board", id, parentId?: number, parentType?: "list" | "card"){
  debugger
  if(itemType === "list"){
    await recursivelyDeleteList(db, id, parentId)
  }else if(itemType === "card"){
    await recursivelyDeleteCard(db, id, parentId, parentType)
  }else if (itemType === "board"){
    await recursivelyDeleteBoard(db, id)
  }
}