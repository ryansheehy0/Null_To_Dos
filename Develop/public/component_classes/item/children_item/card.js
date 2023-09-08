function Card(){
  window.Item.call(this)
  this.element.classList.add("custom-3rd-color", "col-span-2", "custom-2nd-border")
  this.element.dataset.name = "card"
}

window.Card = Card