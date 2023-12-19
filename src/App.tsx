import Provider from "./utils/context.jsx"
import Navbar from "./components/Navbar"
import Board from "./components/Board"

function App() {

  return (
    <Provider>
      <div className="bg-lightBackground dark:bg-darkBackground w-screen h-screen">
        <Navbar/>
        <Board/>
      </div>
    </Provider>
  )
}

export default App
