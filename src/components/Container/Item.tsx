import Trash from "../../assets/trash.svg?react"
import Plus from "../../assets/plus.svg?react"
import { twMerge as tm } from "tailwind-merge"
import { useState } from "react"

export default function Item(){
  const [itemValue, setItemValue] = useState("")

  function autoTextAreaResizing(event){
    const textarea = event.target
    textarea.style.height = "fit-content"
    textarea.style.height = textarea.scrollHeight + "px"
    if(textarea.value.length > 64){
      setItemValue(textarea.value.substr(0, 64))
    }else{
      setItemValue(textarea.value)
    }
  }

  return (
    <div className="grid grid-cols-[auto_auto]">
      <textarea className="m-0 flex items-center border-none bg-transparent text-lightText dark:text-darkText text-base h-auto resize-none mt-auto mb-auto pl-1 focus:rounded focus:outline focus:outline-1 focus:dark:outline-darkBackground focus:outline-lightBackground" value={itemValue} onInput={autoTextAreaResizing} rows={1} spellCheck={false} ></textarea>
      <div className="flex items-center justify-end">
        <Plus className="cursor-pointer w-[--iconSize] h-[--iconSize] fill-lightText dark:fill-darkText" />
        <Trash className="cursor-pointer w-[--iconSize] h-[--iconSize] fill-lightText dark:fill-darkText" />
      </div>
    </div>
  )
}