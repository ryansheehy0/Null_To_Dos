function matchesAnId(ids, match){
  ids.forEach(id => {
    if(id === match){
      return true
    }
  })
  return false
}

// Used to guarantee a unique identifier
window.getNewUUID = () => {
  let allIds = [...document.querySelectorAll("[data-uuid]")]
  allIds = allIds.map((element) => {
    return element.dataset.uuid
  })
  let uuid = crypto.randomUUID()
  // If the generated uuid is the same as an id then regenerate another uuid
  while(matchesAnId(allIds, uuid)){
    uuid = crypto.randomUUID()
  }
  return uuid
}