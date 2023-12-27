import { useGlobalContext } from "./context"

const {db} = useGlobalContext()

async function populate(parentId, parentName, childName){
  const parent = await db[parentName].get(parentId)
  let children = []
  parent[childName].forEach(async (childId) => {
    const child = await db[childName].get(childId)
    children.push(child)
  })
  return children
}

export async function getLists(boardId){
  const lists = await populate(boardId, "boards", "lists")
  return lists
}

export async function getCardsFromList(listId){
  const cards = await populate(listId, "lists", "cards")
  return cards
}

export async function getCardsFromCard(cardId){
  const cards = await populate(cardId, "cards", "cards")
  return cards
}