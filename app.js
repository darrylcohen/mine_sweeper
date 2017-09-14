var viewer = function() {
  var myController;
  var myGrid = document.querySelector('#grid')
  var scoreDiv = document.querySelector('#score')
  var mineGrid = []

  var viewerI = {
    initialise : function(aController) {
      myController = aController;
    },
    updateScore : function(score) {
      scoreDiv.textContent = score;
    },

    displayGrid : function(aGrid) {
      viewerI.clearGrid();
      var count = 0;
      for (var i = 0; i < aGrid.length; i++) {
        var row = document.createElement('div');
        var mineRow = []
        row.classList.add('row');
        for (var j = 0; j < aGrid[i].length; j++) {
          var block = document.createElement('div');
          block.setAttribute('data-row', i);
          block.setAttribute('data-col', j);
          block.setAttribute('data-pos', count);
          block.classList.add('block');
          block.id = count;

          row.appendChild(block)
          mineRow.push(block)
          count++;
        }
        myGrid.appendChild(row)
        mineGrid.push(mineRow)

      }
    },

    clearGrid : function(playersDiv) {
      while (myGrid.firstChild) {
      myGrid.removeChild(myGrid.firstChild);
    }
  },

    displaySymbol : function(aSymbol, row, col, colour) {
      mineGrid[row][col].textContent = aSymbol;
      mineGrid[row][col].style.color = colour;
    },
  }
  return viewerI
}

var listener = function () {
  var myController
  var gridListener = document.querySelector('#grid')
  var playAgain = document.querySelector('#playAgainBTN')
  var listenerI = {
    initialise : function(aController) {
      myController = aController;
      gridListener.addEventListener('click', function(event){
        myController.blockClicked(event)
      })
      gridListener.addEventListener('dblclick', function(event){
        myController.blockDblClicked(event)
      })
      gridListener.addEventListener('contextmenu', function(event){
        myController.blockRightClicked(event)
      },false)
      playAgain.addEventListener('click', function(){
        myController.playAgain();
      })
    },

  }
  return listenerI
}

var grid = function () {
  var myController
  var myGrid = [];
  var mines = [];
  var myGridSize = 0;

  var gridI = {
    initialise : function(aController) {
      myController = aController;
    },
    getGrid : function() {
        return myGrid;
    },

    buildGrid : function() {
      myGrid = [];
      for (var i = 0; i < myGridSize; i++) {
        var aRow = []
        for (var j = 0; j < myGridSize; j++) {
          aRow.push('E');
        }
        myGrid.push(aRow);
      }
      return myGrid;
    },

    setGridSize : function(aGridSize) {
      myGridSize = aGridSize;
    },

    placeClues : function() {
      for (var i = 0; i < myGridSize; i++) {
        for (var j = 0; j < myGridSize; j++) {
          var row  = i -1;
          var col = j - 1;
          if (myGrid[i][j] !== 'M') {
            var totalMines = gridI.checkForMines(row, col);
            myGrid[i][j] = totalMines
          }
        }
      }
    },

    checkForMines : function(row, col) {
      var totalMines = 0;
      var rowEnd = row + 3;
      var colEnd = col + 3;
      for (var i = row; i < rowEnd; i++) {
        for (var j = col; j < colEnd; j++) {
          if (i >= 0 && j >= 0 && i < 10 && j < 10) {
            if (myGrid[i][j] === 'M') {
              totalMines++;
            }
          }
        }
      }
      return totalMines;
    },

    getSymbol : function (row, col) {
      return myGrid[row][col];
    },

  }
  return gridI
}

var minePlacer = function () {
  var myController
  var mines =[]

  var minePlacerI = {
    initialise : function(aController) {
      myController = aController;
    },
    getAllMines : function() {
      return mines;

    },
    placeMines : function(numberMines, aGrid) {
      for (var i = 0; i < numberMines; i++) {
        var aRandomRow = minePlacerI.getRandom(1,10)
        var aRandomCol = minePlacerI.getRandom(1,10)
        if (aGrid[aRandomRow][aRandomCol] === 'E') {
          aGrid[aRandomRow][aRandomCol] = 'M'
          var minePos = [aRandomRow, aRandomCol]
          mines.push(minePos);
        }
      }
    },

    getRandom : function(min, max) {
      return Math.floor(Math.random() * (max - min)) + min;
    },
  }
  return minePlacerI
}

var controller = function () {
  var myViewer = viewer();
  var myListner = listener();
  var myGrid = grid();
  var myMinePlacer = minePlacer();
  var playingGame = true;
  var score = 0;

  var controllerI = {
    initialise : function() {
      myViewer.initialise(this);
      myListner.initialise(this);
      myGrid.initialise(this);
      myMinePlacer.initialise(this);
    },

    playGame : function() {
      myGrid.setGridSize(10);
      var aGrid = myGrid.buildGrid();
      myMinePlacer.placeMines(20, aGrid);
      myGrid.placeClues();
      myViewer.displayGrid(myGrid.getGrid());
    },
    blockClicked : function (event) {
      if (playingGame) {
        var row = Number(event.target.getAttribute('data-row'))
        var col = Number(event.target.getAttribute('data-col'))
        var symbol = myGrid.getSymbol(row, col);
        if (symbol !== "M") {
          myViewer.displaySymbol(symbol, row, col);
        } else {
         var mines = myMinePlacer.getAllMines();
         playingGame = false;
         mines.forEach(function(mine) {
           myViewer.displaySymbol(symbol, mine[0], mine[1], 'red');
         })
       }
     }
   },

   blockDblClicked : function (event) {
     if (playingGame) {

       var row = Number(event.target.getAttribute('data-row'))
       var col = Number(event.target.getAttribute('data-col'))
       myViewer.displaySymbol('?', row, col);
    }
   },
   blockRightClicked : function (event) {
     if (playingGame) {
       score++;
       var row = Number(event.target.getAttribute('data-row'))
       var col = Number(event.target.getAttribute('data-col'))
       myViewer.displaySymbol('Y', row, col, 'green');
       myViewer.updateScore(score);
     }
   },
   playAgain : function() {
     var myController = controller();
     playingGame = true;
     myController.initialise();
     myController.playGame();
   }

  }
  return controllerI;
}

var myController = controller();
myController.initialise();
myController.playGame();
