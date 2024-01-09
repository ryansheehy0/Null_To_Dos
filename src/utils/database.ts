// Getting
async function populate(db, parentId, parentName, childName){
  const parent = await db[parentName].get(parentId)
  if(!parent) return []
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

export async function getBoards(db){// Gets the boards in the boardOrder
  // Get the board order
  const miscellaneous = await db.miscellaneous.get(1)
  const boardOrder = miscellaneous.boardOrder
  // Get the boards according to the board order
  let boards = []
  for(const boardId of boardOrder){
    const board = await db.boards.get(boardId)
    boards.push(board)
  }

  return boards
}

// Deleting
export async function recursivelyDeleteCard(db, id, parentId, parentType: "list" | "card"){
  // Delete all cards in card
  const card = await db.cards.get(id)
  for(const cardId of card.cards){
    await recursivelyDeleteCard(db, cardId, id, "card")
  }
  // Remove reference to self in parentType
  if(parentType === "list"){
    const list = await db.lists.get(parentId)
    list.cards = list.cards.filter((cardId) => {return cardId !== id})
    await db.lists.update(parentId, {
      cards: [...list.cards]
    })
  }else if(parentType === "card"){
    const card = await db.cards.get(parentId)
    if(card){
      card.cards = card.cards.filter((cardId) => {return cardId !== id})
      await db.cards.update(parentId, {
        cards: [...card.cards]
      })
    }
  }
  // Delete self(card)
  await db.cards.delete(id)
}

export async function recursivelyDeleteList(db, id, parentId){
  // Delete all cards in list
  const list = await db.lists.get(id)
  for(const cardId of list.cards){
    await recursivelyDeleteCard(db, cardId, id, "list")
  }
  // Remove reference to self in boards
  const board = await db.boards.get(parentId)
  board.lists = board.lists.filter((listId) => {return listId !== id})
  await db.boards.update(parentId, {
    lists: [...board.lists]
  })
  // Delete self(list)
  await db.lists.delete(id)
}

export async function recursivelyDeleteBoard(db, id){
  // Delete all lists in board
  const board = await db.boards.get(id)
  for(const listId of board.lists){
    await recursivelyDeleteList(db, listId, id)
  }
  // Delete self(board)
  await db.boards.delete(id)
}