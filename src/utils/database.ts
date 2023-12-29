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

export async function getCardsFromCard(db, cardId, boardId){
  const board = await db.boards(boardId)
  for(const list of board.lists){
    const possibleCard = recursivelyGetCardFromList(list, cardId)
    if(possibleCard) return possibleCard.cards
  }
}