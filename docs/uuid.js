function matchesAnId(ids, match){
  ids.forEach(id => {
    if(id === match){
      return true
    }
  })
  return false
}

// Used to guarantee a unique identifier
const getUUID = () => {
  let allIds = [...document.querySelectorAll("body [id]")]
  allIds = allIds.map((element) => {
    return element.id
  })
  let uuid = crypto.randomUUID()
  //if the generated uuid is the same as an id then regenerate another uuid
  while(matchesAnId(allIds, uuid)){
    uuid = crypto.randomUUID()
  }
  return uuid
}

// Export
window.uuid = {
  getUUID
}
