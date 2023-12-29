/*
export default function getNewUUID(array: (JSX.Element & { key: React.Key})[]){
  const arrayKeys = array.map(element => {return parseInt(element.key)})
  let newUUID: number
  if(arrayKeys.length === 0){
    newUUID = 0
  }else{
    newUUID = Math.max(...arrayKeys) + 1
  }

  return newUUID
}
*/

export default function getNewUUID(array){

  const arrayKeys = array.map(element => {return parseInt(element.key)})
  let newUUID: number
  if(arrayKeys.length === 0){
    newUUID = 0
  }else{
    newUUID = Math.max(...arrayKeys) + 1
  }

  return newUUID
}