import { loadGame, State } from "../script.js";

let allSaves = []

function savePopupOpen(grid) {
   const currentPopup = document.getElementById('popup')
   currentPopup.classList.add('open')
   currentPopup.style.visibility = 'visible'
   const saveBtn = document.getElementById('saveBtn')
   const closeBtn = document.querySelector('.close-popup')
   saveBtn.addEventListener('click', (e) => {
      e.preventDefault()
      let gameName = document.getElementById('nameGame').value;
      let moves = document.getElementById('move').textContent
      let time = document.getElementById('time').textContent

      let currentGame = {
         name: gameName,
         state: new State(grid, moves.slice(6), time, 'playing')
      }

      if (gameName) {
         if (localStorage.getItem('gem-saves')) allSaves = localStorage.getItem('gem-saves')
         if (!allSaves.includes(gameName)) allSaves += ',' + gameName
         localStorage.setItem('gem-saves', allSaves.toString())
         localStorage.setItem(`${gameName}`, JSON.stringify(currentGame))
         popupClose(e, currentPopup)
      }
   });
   closeBtn.addEventListener("click", (e) => {
      popupClose(e, currentPopup)
   })
}

function loadPopupOpen() {
   let saves = localStorage.getItem('gem-saves')
   const list = document.getElementById('savesList')
   if (saves) {
      let listOfSaves = saves.split(',')
      listOfSaves.forEach((name) => {
         list.insertAdjacentHTML('afterbegin', `<a href="#" class="saves">${name}</a>`)
      })
      let games = document.querySelectorAll('.saves')
      games.forEach(x => x.addEventListener("click", (e) => {
         loadGame(e, JSON.parse(localStorage.getItem(`${x.innerHTML}`)))
      }))
   } else {
      list.insertAdjacentHTML('afterbegin', `<p>There's no saved games</p>`)
   }
   const currentPopup = document.getElementById('loadPopup')
   currentPopup.classList.add('open')
   currentPopup.style.visibility = 'visible'
   const closeBtn = document.querySelector('.close-popup-load')
   closeBtn.addEventListener("click", (e) => {
      popupClose(e, currentPopup)
   })
}

function popupClose(e, currentPopup) {
   e.preventDefault(e);
   const list = document.getElementById('savesList')
   list.innerHTML = ''
   currentPopup.classList.remove('open')
   currentPopup.style.visibility = 'hidden'

}

export { savePopupOpen, loadPopupOpen }