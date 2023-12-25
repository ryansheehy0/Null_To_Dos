import { twMerge as tm } from "tailwind-merge"
import Item from "./Item"
import AddElement from "./AddElement"
import React from "react"

type ContainerProps = {
  containerType: "card" | "list" | "board"
  containerKey?: number
  children: React.ReactElement<typeof AddElement> | React.ReactElement<typeof Item>
  className?: string
} & React.HTMLProps<HTMLDivElement>

const Container = React.forwardRef(({containerType, containerKey, children, className, ...props} : ContainerProps, ref) => {

  return (
    <div
      ref={ref}
      data-key={containerKey}
      className={tm("rounded-xl py-1.5 px-3 min-w-[--cardWidth] w-min flex justify-center items-center min-h-[--cardHeight] h-fit my-[--cardSpacing] box-border ml-[--cardSpacing]",
        (containerType === "card" || containerType === "board") && "bg-lightCard dark:bg-darkCard border border-solid border-lightBackground dark:border-darkBackground",
        containerType === "list" && "bg-lightList dark:bg-darkList",
        children.type === AddElement && "cursor-pointer",
        className
      )} {...props} draggable={children.type === Item ? "true" : "false"}>
      {children}
    </div>
  )
})

export default Container