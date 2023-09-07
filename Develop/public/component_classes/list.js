function List(){
  // Draggable events

  let uuid = window.getNewUUID()

  let element = window.elementFromHTML(`
    <div data-name="list" class="custom-text-color rounded-xl py-1.5 px-3 min-w-[16rem] w-fit grid grid-cols-[auto_auto] min-h-8 h-fit mx-1 my-2 custom-2nd-color box-content" data-uuid="${uuid}">
      <textarea class="m-0 flex items-center border-none bg-transparent custom-text-color text-base h-auto resize-none mt-auto mb-auto pl-1 focus:rounded focus:outline focus:outline-1 focus:custom-text-outline" oninput='this.style.height = this.scrollHeight + "px"' rows="1" spellcheck="false"></textarea>
      <div data-name="buttons" class="flex items-center justify-end">
        <img src="./assets/plus.svg" class="custom-img-color w-8 h-8">
        <img src="./assets/trash.svg" class="custom-img-color w-5 h-5">
      </div>
    </div>
  `)

  let plus = element.querySelector(`img[src*="plus"]`)
  let trash = element.querySelector(`img[src*="trash"]`)

  plus.addEventListener("click", () => {
  })

  trash.addEventListener("click", () => {
    // If it is already red remove the list
    if([...trash.classList].includes('custom-red-color')){
      element.remove()
      return
    }
    // Change trash to red
    trash.classList.add('custom-red-color')
  })

  document.addEventListener("click", (event) => {
    if(event.target !== trash){
      if([...trash.classList].includes('custom-red-color')){
        trash.classList.remove('custom-red-color')
      }
    }
  })

  this.getElement = function(){return element}

  this.addCard = function(card){
    element.insertAdjacentElement(`beforeend` /*Last Child*/, card.getElement())
  }
}

window.List = List