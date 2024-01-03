import { twMerge as tm } from "tailwind-merge"
import Item from "./Item"
import AddElement from "./AddElement"
import React from "react"

type ContainerProps = {
  id?: number
  containerType: "card" | "list" | "board"
  children: React.ReactElement<typeof AddElement> | React.ReactElement<typeof Item>
  className?: string
} & React.HTMLProps<HTMLDivElement>

const Container = React.forwardRef(({id, containerType, children, className, ...props} : ContainerProps, ref) => {


  return (
    <div
      ref={ref}
      data-id={id}
      className={tm("rounded-xl py-1.5 px-3 min-w-[--cardWidth] w-min flex justify-center items-center min-h-[--cardHeight] h-fit my-[--cardSpacing] box-border ml-[--cardSpacing]",
        (containerType === "card" || containerType === "board") && "bg-lightCard dark:bg-darkCard border border-solid border-lightBackground dark:border-darkBackground",
        containerType === "list" && "bg-lightList dark:bg-darkList",
        children.type === AddElement && "cursor-pointer",
        className
      )}
      draggable={children.type === Item && (containerType === "card" || containerType === "list") ? "true" : "false"}
      {...props}>
      {children}
    </div>
  )
})

export default Container