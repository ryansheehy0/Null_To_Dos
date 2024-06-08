/*
 * This file is part of Null Todos.
 *
 * Null Todos is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * Null Todos is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with Null Todos. If not, see <https://www.gnu.org/licenses/>.
 */

import { saveAs } from "file-saver"
import transact from "./transaction"

async function readFile(file){
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onloadend = function(event){
      resolve(event.target?.result)
    }
    reader.onerror = function(event){
      reject(event)
    }
    reader.readAsText(file)
  })
}

function isObjBoard(obj){
  return (
    "name" in obj && typeof obj.name === "string" &&
    "lists" in obj && Array.isArray(obj.lists) && obj.lists.every(list => typeof list === "number") &&
    "id" in obj && typeof obj.id === "number"
  )
}

function isObjList(obj){
  return (
    "name" in obj && typeof obj.name === "string" &&
    "cards" in obj && Array.isArray(obj.cards) && obj.cards.every(card => typeof card === "number") &&
    "id" in obj && typeof obj.id === "number"
  )
}

function isObjCard(obj){
  return (
    "name" in obj && typeof obj.name === "string" &&
    "cards" in obj && Array.isArray(obj.cards) && obj.cards.every(card => typeof card === "number") &&
    "parentId" in obj && typeof obj.parentId === "number" &&
    "parentType" in obj && typeof obj.parentType === "string" && (obj.parentType === "card" || obj.parentType === "list") &&
    "id" in obj && typeof obj.id === "number"
  )
}

function isObjMiscellaneous(obj){
  return (
    "theme" in obj && typeof obj.theme === "string" &&
    "open" in obj && typeof obj.open === "boolean" &&
    "boardId" in obj && typeof obj.boardId === "number" &&
    "boardOrder" in obj && Array.isArray(obj.boardOrder) && obj.boardOrder.every(board => typeof board === "number") &&
    "id" in obj && typeof obj.id === "number"
  )
}

function isObjUploadedObj(obj){
  return (
    "boards" in obj && Array.isArray(obj.boards) && obj.boards.every(board => isObjBoard(board)) &&
    "lists" in obj && Array.isArray(obj.lists) && obj.lists.every(list => isObjList(list)) &&
    "cards" in obj && Array.isArray(obj.cards) && obj.cards.every(card => isObjCard(card)) &&
    "miscellaneous" in obj && Array.isArray(obj.miscellaneous) && isObjMiscellaneous(obj.miscellaneous[0])
  )
}

export async function upload(db, event){
  try{
    // Get the uploaded file
    const uploadedFile =  event.target.files[0]
    const uploadedJson = await readFile(uploadedFile)
    // Convert json to obj
    const uploadedObj = JSON.parse(uploadedJson)
    // Validate input file is correct
    if(!isObjUploadedObj(uploadedObj)) return
    // Set db with values from the object
    await transact(db, async () => {
      // Add boards
      await db.boards.clear()
      for(const board of uploadedObj.boards){
        await db.boards.add(board)
      }
      // Add lists
      await db.lists.clear()
      for(const list of uploadedObj.lists){
        await db.lists.add(list)
      }
      // Add cards
      await db.cards.clear()
      for(const card of uploadedObj.cards){
        await db.cards.add(card)
      }
      // Add miscellaneous
      await db.miscellaneous.clear()
      await db.miscellaneous.add(uploadedObj.miscellaneous[0])
    })
  }catch(error){
    console.error(error)
  }finally{
    // Reset value so onChange runs again
    event.target.value = ""
  }
}

export async function download(db){
  const boards = await db.boards.toArray()
  const lists = await db.lists.toArray()
  const cards = await db.cards.toArray()
  const miscellaneous = await db.miscellaneous.toArray()
  const downloadObj = {
    boards,
    lists,
    cards,
    miscellaneous
  }

  const downloadJson = JSON.stringify(downloadObj, null, 2)
  const blob = new Blob([downloadJson], { type: "application/json"})
  saveAs(blob, "null_todos.json")
}