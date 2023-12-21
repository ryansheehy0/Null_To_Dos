import { twMerge as tm } from "tailwind-merge"

export default function NavIcon({Icon, rightOffset, onClick = () => {}}){
  return (
    <Icon className={tm(`cursor-pointer w-[--iconSize] h-[--iconSize] absolute top-[--cardSpacing] ${rightOffset} fill-lightText dark:fill-darkText`)} onClick={onClick}/>
  )
}