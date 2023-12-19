import { twMerge as tm } from "tailwind-merge"

type ContainerProps = {
  cardOrList: "card" | "list"
  children: React.ReactNode
}

export default function Container({cardOrList, children} : ContainerProps){

  return (
    <div className={tm("rounded-xl py-1.5 px-3 min-w-[--cardWidth] w-min grid grid-cols-[auto_auto] min-h-8 h-fit my-2 box-content",
      cardOrList === "card" && "bg-lightCard dark:bg-darkCard border-1 border-solid border-lightBackground dark:border-darkBackground",
      cardOrList === "list" && "bg-lightList dark:bg-darkList"
    )}>
      {children}
    </div>
  )
}