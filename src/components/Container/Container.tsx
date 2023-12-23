import { twMerge as tm } from "tailwind-merge"
import Item from "./Item"
import AddElement from "./AddElement"
import { useDrag } from "react-dnd"

type ContainerProps = {
  containerType: "card" | "list" | "board"
  children: React.ReactElement<typeof AddElement> | React.ReactElement<typeof Item>
  className?: string
  itemKey?: number
} & React.HTMLProps<HTMLDivElement>

export default function Container({containerType, children, className, itemKey, ...props} : ContainerProps){
  const [{ isDragging }, drag] = useDrag(
    () => ({
      type: containerType,
      collect: (monitor) => ({
        isDragging: !!monitor.isDragging()
      }),
      item: {itemKey}
    })
  )


  return (
    <div ref={children.type === Item ? drag : null} className={tm("rounded-xl py-1.5 px-3 min-w-[--cardWidth] w-min flex justify-center items-center min-h-[--cardHeight] h-fit my-[--cardSpacing] box-border ml-[--cardSpacing]",
      (containerType === "card" || containerType === "board") && "bg-lightCard dark:bg-darkCard border border-solid border-lightBackground dark:border-darkBackground",
      containerType === "list" && "bg-lightList dark:bg-darkList",
      children.type === AddElement && "cursor-pointer",
      isDragging && "opacity-60",
      className
    )} {...props}>
      {children}
    </div>
  )
}