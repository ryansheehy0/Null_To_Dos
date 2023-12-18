import Item from "../item"

export default function Card(parentItem){
  Item.call(this, parentItem)
  this.element.classList.add("custom-3rd-color", "col-span-2", "custom-2nd-border")
  this.element.dataset.name = "card"
}