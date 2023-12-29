export default async function getNewUUID(board, itemType: "card" | "list" | "board"){
  if(itemType === "card"){
    let maxCardId = 0
    board.lists.forEach((list) => {
      if(list.cards.length > 0){

      }else{
        
      }
    })
  }
}

