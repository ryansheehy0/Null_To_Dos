import Provider from "./utils/context.js"
import Navbar from "./components/Navbar/Navbar.js"
import Board from "./components/Board"

function App() {
  return (
    <Provider>
      <div className="bg-lightBackground dark:bg-darkBackground w-screen h-screen">
        <Navbar/>
        <Board boardId={1}/>
      </div>
    </Provider>
  )
}

export default App