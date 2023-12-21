import Plus from "../../assets/plus.svg?react"

type AddElementProps = {
  text: string
} & React.HTMLProps<HTMLDivElement>

export default function AddElement({text, ...props}: AddElementProps){
  return (
    <div className="cursor-pointer flex items-center justify-center text-lightText dark:text-darkText h-4 rounded-xl box-content" {...props}>
      <Plus className="w-[--iconSize] h-[--iconSize]"/>
      {text}
    </div>
  )
}