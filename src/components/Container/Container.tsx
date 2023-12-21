import { twMerge as tm } from "tailwind-merge"

type ContainerProps = {
  cardOrList: "card" | "list"
  children: React.ReactNode
  className: string
}

export default function Container({cardOrList, children, className} : ContainerProps){

  return (
    <div className={tm("rounded-xl py-1.5 px-3 min-w-[--cardWidth] w-min flex justify-center items-center min-h-[--cardHeight] h-fit my-[--cardSpacing] box-border ml-[--cardSpacing]",
      cardOrList === "card" && "bg-lightCard dark:bg-darkCard border border-solid border-lightBackground dark:border-darkBackground",
      cardOrList === "list" && "bg-lightList dark:bg-darkList",
      className
    )}>
      {children}
    </div>
  )
}