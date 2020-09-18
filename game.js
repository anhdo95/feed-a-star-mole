function Game() {
  const NEXT_FRAME_INTERVAL = 100
  const STATUS = {
    SAD: 'SAD',
    HUNGRY: 'HUNGRY',
    LEAVING: 'LEAVING',
    GONE: 'GONE',
  }

  const moles = getMoles()

  function getMoles() {
    return Array
      .from(document.getElementsByClassName('mole'))
      .map(function(mole) {
        return {
          status: STATUS.SAD,
          next: getDefaultInterval(),
          node: mole
        }
      })
  }

  function random(min, max) {
    return Math.floor(Math.random() * max - min) + min
  }

  function getDefaultInterval() {
    return Date.now() + 500
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
        mole.status = STATUS.HUNGRY
        mole.next = getDefaultInterval()
        mole.node.src = './static/mole-leaving.png'
        return

      case STATUS.HUNGRY:
        mole.status = STATUS.LEAVING
        mole.next = getGoneInterval()
        mole.node.className = 'mole gone'
        return

      case STATUS.LEAVING:
        mole.status = STATUS.GONE
        mole.next = getLeavingInterval()
        mole.node.src = './static/mole-hungry.png'
        mole.node.className = 'mole hungry'
        return

      case STATUS.GONE:
        mole.status = STATUS.SAD
        mole.next = getDefaultInterval()
        mole.node.src = './static/mole-sad.png'
        mole.node.className = 'mole'
        break;
    }
  }

  function updateMolesStatus(now) {
    moles.forEach(function(mole) {
      if (mole.next < now) {
        updateNextStatus(mole)
      }
    })
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
  }
}

Game.run = function() {
  const game = new Game()
  game.start()
}

Game.run()