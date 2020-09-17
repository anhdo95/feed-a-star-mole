function Game() {
  const NEXT_FRAME_INTERVAL = 10000
  const STATUS = {
    SAD: 'SAD',
    HUNGRY: 'HUNGRY',
    LEAVING: 'LEAVING',
    GONE: 'GONE',
  }

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


  function getDefaultInterval() {
    return Date.now() + 1000
  }

  this.start = function() {
    let runAgainAt = Date.now()

    function nextFrame() {
      if (runAgainAt < Date.now()) {
        getMoles().forEach(function(mole) {
          console.log('mole :>> ', mole);
        })

        runAgainAt = Date.now() + NEXT_FRAME_INTERVAL
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