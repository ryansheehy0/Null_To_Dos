function listStartEndDragging(lists){
  lists.forEach(list => {
    list.addEventListener("dragstart", event => {
      if(list === event.target){
        list.classList.add("dragging")
      }
    })
    list.addEventListener("dragend", () => {
        list.classList.remove("dragging")
        localStorage.setItem("body", document.body.innerHTML)
    })
  })
}

function getListPos(x){
  const listsNotBeingDragged = [...document.querySelectorAll(".list:not(.dragging)")]

  let listsPos = []

  listsNotBeingDragged.forEach(list => {
    const box = list.getBoundingClientRect()
    const isInFront = box.left - x > 0 ? true : false
    const isBehind = x - box.right > 0 ? true : false
    const isLast = listsNotBeingDragged[listsNotBeingDragged.length - 1] === list ? true : false
    listsPos.push({isInFront: isInFront, isBehind: isBehind, list: list, isLast: isLast})
  })

  return listsPos
}

window.listDraggingEventsInit = () => {
  const lists = [...document.querySelectorAll(".list")]

  listStartEndDragging(lists)

  document.body.addEventListener("dragover", (event) => {
    // Get teh currently dragging list
      const draggingList = document.querySelector(".dragging")
    // Make sure that the currently dragging list is a list and not a card
      if(draggingList.classList.contains("card")){
        return
      }
    // Get the position of the lists relative to the mouse's x location
      const listsPos = getListPos(event.clientX)
    // Add the dragging list in teh correct position
    for(let i=0; i < listsPos.length; i++){
      const listPos = listsPos[i]

      if(listPos.isInFront){
        listPos.list.insertAdjacentElement("beforebegin"/*Before Element*/, draggingList)
        break
      }else if(listPos.isBehind && listPos.isLast){
        listPos.list.insertAdjacentElement("afterend"/*After Element*/, draggingList)
        break
      }
    }
  })
}