import { savePopupOpen, loadPopupOpen } from "./js/popups.js";

document.body.insertAdjacentHTML('beforeend',
   '<div id="popup" class="popup">\n' +
   '  <div class="popup__body">\n' +
   '    <div class="popup__content">\n' +
   '      <a href="" class="popup__close close-popup">&#10008;</a>\n' +
   '      <div class="popup__title">Enter the name of the game</div>\n' +
   '      <form>\n' +
   '        <input id="nameGame" type="text" value="" placeholder="Name">\n' +
   '        <input id="saveBtn" type="submit" value="OK">\n' +
   '      </form>\n' +
   '    </div>\n' +
   '  </div>\n' +
   '</div>'
);

document.body.insertAdjacentHTML('beforeend',
   '<div id="loadPopup" class="popup">\n' +
   '  <div class="popup__body">\n' +
   '    <div class="popup__content">\n' +
   '      <a href="" class="popup__close close-popup-load">&#10008;</a>\n' +
   '      <div class="popup__title">Select a saved game</div>\n' +
   '      <ul id="savesList">\n' +
   '      </ul>\n' +
   // '      <button>Load</button>\n' +
   '    </div>\n' +
   '  </div>\n' +
   '</div>'
);



class Box {
   constructor(x, y) {
      this.x = x;
      this.y = y;
   }

   getTopBox() {
      if (this.y === 0) return null;
      return new Box(this.x, this.y - 1);
   }

   getRightBox() {
      if (this.x === 3) return null;
      return new Box(this.x + 1, this.y);
   }

   getBottomBox() {
      if (this.y === 3) return null;
      return new Box(this.x, this.y + 1);
   }

   getLeftBox() {
      if (this.x === 0) return null;
      return new Box(this.x - 1, this.y);
   }

   getNextdoorBoxes() {
      return [
         this.getTopBox(),
         this.getRightBox(),
         this.getBottomBox(),
         this.getLeftBox()
      ].filter(box => box !== null);
   }

   getRandomNextdoorBox() {
      const nextdoorBoxes = this.getNextdoorBoxes();
      return nextdoorBoxes[Math.floor(Math.random() * nextdoorBoxes.length)];
   }
}

const swapBoxes = (grid, box1, box2) => {
   const temp = grid[box1.y][box1.x];
   grid[box1.y][box1.x] = grid[box2.y][box2.x];
   grid[box2.y][box2.x] = temp;
};

const isSolved = grid => {
   return (
      grid[0][0] === 1 &&
      grid[0][1] === 2 &&
      grid[0][2] === 3 &&
      grid[0][3] === 4 &&
      grid[1][0] === 5 &&
      grid[1][1] === 6 &&
      grid[1][2] === 7 &&
      grid[1][3] === 8 &&
      grid[2][0] === 9 &&
      grid[2][1] === 10 &&
      grid[2][2] === 11 &&
      grid[2][3] === 12 &&
      grid[3][0] === 13 &&
      grid[3][1] === 14 &&
      grid[3][2] === 15 &&
      grid[3][3] === 0
   );
};

const getRandomGrid = () => {
   let grid = [[1, 2, 3, 4], [5, 6, 7, 8], [9, 10, 11, 12], [13, 14, 15, 0]];

   // Shuffle
   let blankBox = new Box(3, 3);
   for (let i = 0; i < 1000; i++) {
      const randomNextdoorBox = blankBox.getRandomNextdoorBox();
      swapBoxes(grid, blankBox, randomNextdoorBox);
      blankBox = randomNextdoorBox;
   }

   if (isSolved(grid)) return getRandomGrid();
   return grid;
};

class State {
   constructor(grid, move, time, status) {
      this.grid = grid;
      this.move = move;
      this.time = time;
      this.status = status;
   }

   static ready() {
      return new State(
         [[0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]],
         0,
         0,
         "ready"
      );
   }

   static start() {
      return new State(getRandomGrid(), 0, 0, "playing");
   }
}

class Game {
   constructor(state) {
      this.state = state;
      // this.tickId = null;
      // this.stopWatch = this.stopWatch.bind(this);
      this.render();
      this.handleClickBox = this.handleClickBox.bind(this);
   }

   static ready() {
      return new Game(State.ready());
   }

   tick() {
      // this.setState({ time: this.state.time + 1 });
   }

   setState(newState) {
      this.state = { ...this.state, ...newState };
      this.render();
   }

   handleClickBox(box) {
      return function () {
         const nextdoorBoxes = box.getNextdoorBoxes();
         const blankBox = nextdoorBoxes.find(
            nextdoorBox => this.state.grid[nextdoorBox.y][nextdoorBox.x] === 0
         );
         if (blankBox) {
            const newGrid = [...this.state.grid];
            swapBoxes(newGrid, box, blankBox);
            if (isSolved(newGrid)) {
               // clearInterval(this.tickId);
               this.setState({
                  status: "won",
                  grid: newGrid,
                  move: parseInt(this.state.move) + 1
               });
            } else {
               this.setState({
                  grid: newGrid,
                  move: parseInt(this.state.move) + 1
               });
            }
         }
      }.bind(this);
   }


   render() {
      let { grid, move, time, status } = this.state;

      // Render grid
      const newGrid = document.createElement("div");
      newGrid.className = "grid";
      for (let i = 0; i < 4; i++) {
         for (let j = 0; j < 4; j++) {
            const button = document.createElement("button");
            button.textContent = grid[i][j] === 0 ? "" : grid[i][j].toString();
            const dragStart = function () {
               setTimeout(() => {
                  this.classList.add('hide')
               }, 0)
            }
            const dragEnd = function () {
               this.classList.remove('hide')
            }
            const dragOver = function (evt) {
               evt.preventDefault();
            }
            const dragEnter = function (evt) {
               evt.preventDefault();
               this.classList.add('hovered')
            }
            const dragLeave = function () {
               this.classList.remove('hovered')
            }
            const dragDrop = function () {
               document.querySelector('.hide').click()
               this.classList.remove('hovered')
            }
            if (button.textContent === '') {
               button.className = "blank"
               button.addEventListener('dragover', dragOver)
               button.addEventListener('dragenter', dragEnter)
               button.addEventListener('dragleave', dragLeave)
               button.addEventListener('drop', dragDrop)

            } else {
               button.className = "card"
               button.setAttribute('draggable', true)
               button.addEventListener('dragstart', dragStart)
               button.addEventListener('dragend', dragEnd)
            }

            if (status === "playing") {
               button.addEventListener("click", this.handleClickBox(new Box(j, i)));
            }

            newGrid.appendChild(button);
         }
      }
      document.querySelector(".grid").replaceWith(newGrid);

      let seconds = 0;
      let minutes = 0;
      let displaySeconds = 0;
      let displayMinutes = 0;

      function stopWatch() {
         seconds++;
         if (seconds / 60 === 1) {
            seconds = 0;
            minutes++
         }
         if (seconds < 10) {
            displaySeconds = "0" + seconds.toString()
         } else {
            displaySeconds = seconds
         }
         if (minutes < 10) {
            displayMinutes = "0" + minutes.toString()
         } else {
            displayMinutes = minutes
         }
         document.getElementById('time').innerHTML = displayMinutes + ':' + displaySeconds
      }

      // Render play button
      const newButton = document.createElement("button");
      if (status === "ready") newButton.textContent = "Play";
      if (status === "playing") newButton.textContent = "Reset";
      if (status === "won") newButton.textContent = "Play";
      newButton.addEventListener("click", () => {
         clearInterval(this.tickId);
         this.tickId = setInterval(stopWatch, 1000);
         this.setState(State.start());
      });
      document.querySelector(".footer button").replaceWith(newButton);

      // Render move
      document.getElementById("move").textContent = `Move: ${move}`;

      // Render save button
      const saveButton = document.createElement("button");
      saveButton.textContent = "Save"

      saveButton.addEventListener("click", (e) => {
         savePopupOpen(grid)
         e.preventDefault()
      })

      let oldSave = document.body.children[1].children[2].children[1]
      oldSave.replaceWith(saveButton)

      // Render load
      const loadButton = document.createElement("button");
      loadButton.textContent = "Load"
      loadButton.addEventListener("click", (e) => {
         loadPopupOpen()
         e.preventDefault()
      })
      let oldLoad = document.body.children[1].children[2].children[2]
      oldLoad.replaceWith(loadButton)

      // Render message
      if (status === "won") {
         document.querySelector(".message").textContent = "You win!";
      } else {
         document.querySelector(".message").textContent = "";
      }
   }
}

function loadGame(e, gameState) {
   e.preventDefault()
   const reset = document.querySelector('.footer button')
   reset.click()
   new Game(gameState.state)
}

const GAME = Game.ready();
export { loadGame, State }