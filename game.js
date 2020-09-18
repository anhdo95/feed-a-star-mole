function Game() {
  const NEXT_FRAME_INTERVAL = 100
  const STATUS = {
    SAD: 'SAD',
    HUNGRY: 'HUNGRY',
    LEAVING: 'LEAVING',
    GONE: 'GONE',
    FED: 'FED',
  }

  const bgElement = document.querySelector('.bg')
  const winElement = document.querySelector('.win')
  const moles = getMoles()
  let score = 0

  function getMoles() {
    return Array
      .from(document.getElementsByClassName('mole'))
      .map(function(mole, index) {
        mole.setAttribute('index', index)

        return {
          status: STATUS.SAD,
          next: getDefaultInterval(),
          node: mole,
        }
      })
  }

  function random(min, max) {
    return Math.floor(Math.random() * max - min) + min
  }

  function getDefaultInterval() {
    return Date.now() + 1000
  }

  function getLeavingInterval() {
    return Date.now() + random(1000, 15000)
  }

  function getGoneInterval() {
    return Date.now() + random(500, 2000)
  }

  function updateNextStatus(mole) {
    switch (mole.status) {
      case STATUS.SAD:
      case STATUS.FED:
        mole.status = STATUS.LEAVING
        mole.next = getLeavingInterval()
        mole.node.src = './static/mole-leaving.png'
        mole.node.className = 'mole'
        return

      case STATUS.LEAVING:
        mole.status = STATUS.GONE
        mole.next = getGoneInterval()
        mole.node.className = 'mole gone'
        return

      case STATUS.GONE:
        mole.status = STATUS.HUNGRY
        mole.next = getDefaultInterval()
        mole.node.src = './static/mole-hungry.png'
        mole.node.className = 'mole hungry'
        break;
      
      case STATUS.HUNGRY:
        mole.status = STATUS.SAD
        mole.next = getDefaultInterval()
        mole.node.src = './static/mole-sad.png'
        mole.node.className = 'mole'
        return
    }
  }

  function updateMolesStatus(now) {
    moles.forEach(function(mole) {
      if (mole.next < now) {
        updateNextStatus(mole)
      }
    })
  }

  function win() {
    bgElement.classList.add('hide')
    winElement.classList.remove('hide')
  }

  function feed(event) {
    if (
      !(event.target instanceof HTMLImageElement) ||
      !event.target.classList.contains("hungry")
    ) {
      return
    }

    const index = event.target.getAttribute('index')
    const mole = moles[index]

    mole.status = STATUS.FED
    mole.next = getDefaultInterval()
    mole.node.src = './static/king-mole-fed.png'
    mole.className = 'mole'

    score++

    if (score >= 10) {
      win()
    }
  }

  this.start = function() {
    let runAgainAt = Date.now()

    function nextFrame() {
      const now = Date.now()

      if (runAgainAt < now) {
        updateMolesStatus(now)
        runAgainAt = now + NEXT_FRAME_INTERVAL
      }

      requestAnimationFrame(nextFrame)
    }

    nextFrame()
    bgElement.addEventListener('click', feed)
  }
}

Game.run = function() {
  const game = new Game()
  game.start()
}

Game.run()