window.trashButtonInit = (event) => {
  // Dom elements
  const modal = document.querySelector("#modal")
  const bodyContainer = document.querySelector("#body-container")
  const cancel = document.querySelector("#cancel")
  const ok = document.querySelector("#ok")

  if(event.target.className.includes("trash-icon")){
    modal.style.visibility = "visible"; // Show modal
    bodyContainer.style.pointerEvents = "none" // Don't allow clicking the background
    // OK is pressed
    const okEventListener = () => {
      event.target.parentNode.parentNode.remove() // Removes the card or list
      modal.style.visibility = "hidden";
      bodyContainer.style.pointerEvents = "auto" // Allow clicking the background
      localStorage.setItem("body", document.body.innerHTML)
    }
    ok.addEventListener("click", okEventListener)
    // Cancel is pressed
    cancel.addEventListener("click", () => {
      modal.style.visibility = "hidden";
      bodyContainer.style.pointerEvents = "auto" // Allow clicking the background
      ok.removeEventListener("click", okEventListener); // So future ok presses don't delete other cards or lists
    })
  }
}