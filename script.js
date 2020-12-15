(function () {
  'use strict'

  let order = []
  let clickedOrder = []
  let score = 0

  const green = document.querySelector('.green')
  const blue = document.querySelector('.blue')
  const yellow = document.querySelector('.yellow')
  const red = document.querySelector('.red')
  const messager = document.getElementById('message')
  const btnMessage = messager.getElementsByTagName('button')[0]
  const register = document.getElementById('register')
  const btnRegister = document.getElementById('registrar')
  const btnCancel = document.getElementById('cancelar')

  // cria ordem aleatoria
  const suffleOrder = () => {
    const orderColor = Math.floor(Math.random() * 4)
    order.push(orderColor)
    clickedOrder = []

    order.forEach((color, indice) => lightColor(createColoElement(color), Number(indice) + 1))
  }
  // acende a cor selecionada
  const lightColor = (element, number) => {
    number = number * 500
    setTimeout(() => {
      playSound(element)
      element.classList.add('select')
    }, number - 250)
    setTimeout(() => {
      element.classList.remove('select')
    }, number)
  }
  // verifica se a ordem clicada é a mesma que a gerada no jogo
  const checkOrder = () => {
    let cont = 0
    clickedOrder.forEach((color, i) => { if (color !== order[i]) { return cont++ } })
    if (cont !== 0) { return checkRecord(score) }

    if (clickedOrder.length === order.length) {
      showMessage(`Parabens!!!<br><br>Voce acertou o nivel ${score}<br><br>Iniciar o proximo nivel`, nextLevel)
    }
  }
  // armazena a oredem clicada pelo usuario
  const click = (color) => {
    playSound(color)
    clickedOrder.push(color)
    createColoElement(color).classList.add('select')
    setTimeout(() => {
      createColoElement(color).classList.remove('select')
      checkOrder()
    }, 250)
  }
  // retorna o numero de acordo com a cor
  const createColoElement = (color) => {
    if (color === 0) {
      return green
    } else if (color === 1) {
      return red
    } else if (color === 2) {
      return yellow
    } else if (color === 3) {
      return blue
    }
  }
  // inicia o proximo nivel
  const nextLevel = () => {
    score++
    document.querySelector('.score').innerHTML = `Nivel : ${score}<br><br><br> Champion :<br> ${atualChampion.name}<br><br>record :<br>Nivel ${atualChampion.score}`
    suffleOrder()
  }
  // retorna fim de jogo
  const gameOver = () => {
    showMessage(`Game over !!!<br><br>Voce errou o nivel ${score}<br><br>clique em start para reiniciar`, playGame)
    order = []
    clickedOrder = []
    score = 0
  }

  // inicia o jogo
  const playGame = () => {
    showMessage('Bem vindo ao Genius!!!<br><br> iniciar o jogo', nextLevel)
  }
  green.onclick = () => click(0)
  red.onclick = () => click(1)
  yellow.onclick = () => click(2)
  blue.onclick = () => click(3)
  // green.addEventListener('click', click(0))
  // red.addEventListener('click', click(1))
  // yellow.addEventListener('click', click(2))
  // blue.addEventListener('click', click(3))

  // emite o som do jogo
  const playSound = (color) => {
    const sound = document.createElement('audio')
    if (color === green || color === 0) {
      sound.src = './sound/green.wav'
    } else if (color === red || color === 1) {
      sound.src = './sound/red.wav'
    } else if (color === yellow || color === 2) {
      sound.src = './sound/yellow.wav'
    } else if (color === blue || color === 3) {
      sound.src = './sound/blue.wav'
    }
    sound.addEventListener('canplaythrough', function () {
      sound.play()
    }, false)
  }

  // emite as mensagens de interação com o jogador
  const showMessage = (message, cb) => {
    messager.classList.add('show')
    messager.getElementsByTagName('p')[0].innerHTML = message
    btnMessage.focus()

    btnMessage.addEventListener('click', callBack)

    function callBack (e) {
      e.preventDefault()
      messager.classList.remove('show')
      btnMessage.removeEventListener('click', callBack)
      cb()
    }
  }

  // verifica se o score foi maior que o registro atual
  function checkRecord (score) {
    if (score > atualChampion.score) { return registerChampion(score) }
    gameOver()
  }

  // regitra os dados do novo recorde
  function registerChampion (score) {
    register.classList.add('show')
    register.getElementsByTagName('p')[0].innerHTML = `nivel: ${score}`

    btnCancel.addEventListener('click', registerCancel)
    function registerCancel (e) {
      e.preventDefault()
      register.classList.remove('show')
      gameOver()
      btnCancel.removeEventListener('click', registerCancel)
    }

    btnRegister.addEventListener('click', registerGamer)
    function registerGamer (e) {
      e.preventDefault()
      const newName = document.getElementById('name').value
      atualChampion = new Gamer(newName, score)

      setNewSave()
      register.classList.remove('show')
      gameOver()
      btnRegister.removeEventListener('click', registerGamer)
    }
  }

  // constroi o objeto Gamer para registro de record
  function Gamer (name, score) {
    this.name = name
    this.score = score
  }

  // faz a requisição dos dados do ultimo chapion
  function getChampionSave () {
    let champ = localStorage.getItem('champion')
    champ = JSON.parse(champ)
    return champ || {
      name: 'Gamer',
      score: 0
    }
  }

  // altera os registro para o novo recorde
  function setNewSave () {
    localStorage.setItem('champion', JSON.stringify(atualChampion))
  }

  let atualChampion = getChampionSave()

  getChampionSave()

  playGame()
})()
