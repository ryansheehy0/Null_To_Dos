/*
 * This file is part of Null Todos.
 *
 * Null Todos is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * Null Todos is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with Null Todos. If not, see <https://www.gnu.org/licenses/>.
 */

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