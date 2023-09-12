function Item(parentItem){
  // Variables
    let uuid = window.getNewUUID()

    let element = window.elementFromHTML(`
      <div data-name="" class="custom-text-color rounded-xl py-1.5 px-3 min-w-[16rem] w-min grid grid-cols-[auto_auto] min-h-8 h-fit my-2 box-content" data-uuid="${uuid}">
        <textarea class="m-0 flex items-center border-none bg-transparent custom-text-color text-base h-auto resize-none mt-auto mb-auto pl-1 focus:rounded focus:outline focus:outline-1 focus:custom-text-outline" oninput='this.style.height = "fit-content"; this.style.height = this.scrollHeight + "px"' rows="1" spellcheck="false"></textarea>
        <div data-name="buttons" class="flex items-center justify-end">
          <img src="./assets/plus.svg" class="custom-img-color w-8 h-8">
          <img src="./assets/trash.svg" class="custom-img-color w-5 h-5">
        </div>
      </div>
    `)
    this.element = element // Pass to children

    let plus = element.querySelector(`img[src*="plus"]`)
    let trash = element.querySelector(`img[src*="trash"]`)
    let textarea = element.querySelector(`textarea`)

  new window.Event(this, plus, trash, textarea, element, parentItem) // Set the event listeners

  // Methods
    this.getElement = function(){return element}

    this.addCard = function(card){
      element.insertAdjacentElement(`beforeend` /*Last Child*/, card.getElement())
    }

    this.focus = function(){
      textarea.focus()
    }
}

window.Item = Item