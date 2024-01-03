import Provider from "./utils/context.js"
import Navbar from "./components/Navbar/Navbar.js"
import BoardView from "./components/BoardView.js"

function App() {
  return (
    <Provider>
      <div className="bg-lightBackground dark:bg-darkBackground w-screen h-screen">
        <Navbar/>
        <BoardView/>
      </div>
    </Provider>
  )
}

export default App