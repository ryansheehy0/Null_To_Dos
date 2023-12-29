async function populate(db, parentId, parentName, childName){
  const parent = await db[parentName].get(parentId)
  const children = await Promise.all(
    parent[childName].map(async (childId) => {
      const child = await db[childName].get(childId)
      return child
    })
  )
  return children
}

export async function getLists(db, boardId){
  const lists = await populate(db, boardId, "boards", "lists")
  return lists
}

export async function getCardsFromList(db, listId){
  const cards = await populate(db, listId, "lists", "cards")
  return cards
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