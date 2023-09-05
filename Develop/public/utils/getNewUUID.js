function getNewUUID() {
  // Get all UUIDs
  let allUUIDs = [...document.querySelectorAll(`[data-uuid]`)]
  allUUIDs = allUUIDs.map(element => {
    return element.dataset.uuid
  })

  // Generate new UUID
  let newUUID = crypto.randomUUID()

  // Check if the new uuid is actually unique
  while(allUUIDs.includes(newUUID)){
    newUUID = crypto.randomUUID()
  }

  return newUUID
}

window.getNewUUID = getNewUUID