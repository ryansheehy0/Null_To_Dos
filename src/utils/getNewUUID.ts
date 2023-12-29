function recursivelyGetMaxIdOfCard(card){
  let maxCardId = card.id
  for(const childCard of card.cards){
    const maxCardIdOfChildren = recursivelyGetMaxIdOfCard(childCard)
    if(maxCardId < maxCardIdOfChildren){
      maxCardId = maxCardIdOfChildren
    }
  }
  return maxCardId
}

function getMaxCardIdFromList(list){
  let maxCardId = 0
  for(const childCard of list.cards){
    const maxCardIdOfChildren = recursivelyGetMaxIdOfCard(childCard)
    if(maxCardId < maxCardIdOfChildren){
      maxCardId = maxCardIdOfChildren
    }
  }
  return maxCardId
}

export async function getNewCardUUID(db, boardId){
  const board = await db.boards.get(boardId)
  let maxCardId = 0
  for(const childList of board.lists){
    const maxCardIdOfChildren = getMaxCardIdFromList(childList)
    if(maxCardId < maxCardIdOfChildren){
      maxCardId = maxCardIdOfChildren
    }
  }
  return (maxCardId + 1)
}

export async function getNewListUUID(db, boardId){
  const board = await db.boards.get(boardId)
  let maxListId = 0
  for(const list of board.lists){
    if(maxListId < list.id){
      maxListId = list.id
    }
  }
  return (maxListId + 1)
}