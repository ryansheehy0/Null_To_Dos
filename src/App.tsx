import Provider from "./utils/context.jsx"
import Navbar from "./components/Navbar"

function App() {

  return (
    <Provider>
      <div className="bg-lightBackground dark:bg-darkBackground w-screen h-screen">
        <Navbar/>
      </div>
    </Provider>
  )
}

export default App
