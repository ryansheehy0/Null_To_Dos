function Board(){
  let lists = []

  let css = `
    width: 100%;
    height: 100%;
  `

  let element = window.elementFromHTML(`
    <div class="board" style="${css}"></div>
  `)

  this.getElement = function(){return element}

  this.addList = function(list){
    // Add list to lists
    lists.push(list)
    // Put list inside board at the end
    element.insertAdjacentElement("beforeend"/*Last Child*/, list.getElement())
  }

  this.removeList = function(list){
    // Remove list from lists
    lists = lists.filter(item => {
      if(item === list){
        return false
      }
    })
    // Remove list form board
    element.removeChild(list)
  }

  this.getJson = function(){
    // Return the json
  }

}

window.Board