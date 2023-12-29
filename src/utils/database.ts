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