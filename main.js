// EventListener for interaction with the game
startGameButton.addEventListener('click', startGame, false);
for (let i = 0; i < 9; i++) {
  eval("cell" + i).addEventListener('click', humanTurn, false);
}
noCursor()

// 2.Ggf. die Winning-Konstellation gesondert hervorheben

// Starts the Game
function startGame() {
  document.getElementById("startGameButton").innerHTML = "Game running...";
  fireworks.classList.remove("pyro")
// Initializes/Resets the board and decides the first player
    nextTurn.textContent = ""
// Removes classes from cells (only relevant for restarted Game)
    let str = ""
    let playerSign = playerChoice()
    cursor()
    for (let i = 0; i < 9; i++) {
      str = '"cell' + i + '"';
      document.getElementById(eval(str)).classList.remove("x");
      document.getElementById(eval(str)).classList.remove("o");
    }
// Starting player
    if (xOrOChoice() === "x") {
      nextTurn.textContent = "X-Turn!"
    } else {
      nextTurn.textContent = "O-Turn!"
    }
// Deletes inputs on the board from previous game (only relevant for restarted Game)
    let board = [["","",""],["","",""],["","",""]]
    updateBoard(board)
// Gets the buttons working properly
  startGameButton.classList.remove("endButton")
    if ((playerSign==="x" && nextTurn.textContent === "O-Turn!") || (playerSign==="o" && nextTurn.textContent === "X-Turn!")) {
      setTimeout(enemyTurn, 1000)
    }
    return board
}

// "Helper Functions"
function getBoard() {
// Returns the board in its current state
  let board = [[],[],[]]
  for(let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      board[i].push(document.getElementById('cell' + (i*3 + j)).textContent)
    }
  }
  return board
}

function updateBoard(board) {
// Updates the board after a move has been made
  for(let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      document.getElementById('cell' + (i*3 + j)).textContent = board[i][j]
    }
  }
}

function openSquares(board) {
// Checks which squares are not occupied
  let availableMoves = [];
  for (let i = 0; i < board.length; i++) {
    for (let j = 0; j < board[i].length; j++) {
      if (board[i][j] !== "x" && board[i][j] !== "o") {
        availableMoves.push(i*3 + j)
      }
    }
  
  }
  return availableMoves
}

function isWinner(board) {
// Checks if there currently is a winner on the board
    let xWins = "xxx"
    let oWins = "ooo"
    // let dia1Form = ["cell0", "cell4", "cell8"]
    // let dia2Form = ["cell2", "cell4", "cell6"]
    // let row1Form = ["cell0", "cell1", "cell2"]
    // let row2Form = ["cell3", "cell4", "cell5"]
    // let row3Form = ["cell6", "cell7", "cell8"]
    // let col1Form = ["cell0", "cell3", "cell6"]
    // let col2Form = ["cell1", "cell4", "cell7"]
    // let col3Form = ["cell2", "cell5", "cell8"]
    let dia1 = board[0][0] + board[1][1] + board[2][2];
    let dia2 = board[0][2] + board[1][1] + board[2][0];
    if (dia1 === xWins || dia2 === xWins) {
        return "x"
    } else if (dia1 === oWins || dia2 === oWins) {
        return "o"
    }
    
    for (let i = 0; i < board.length; i++) {
        let row = board[i].join("")
        if (row === xWins) {
            return "x"
        } else if (row === oWins) {
            return "o"
        }
    }

    for (let i = 0; i < board.length; i++) {
        let col = []
        for (let j = 0; j < board[i].length; j++) {
            col.push(board[j][i])
        }
        col = col.join("")
        if (col === xWins) {
            return "x"
        } else if (col === oWins) {
            return "o"
        }
    }
    
    return false
}

function chooseSquare(array) {
// Picks an open square at random
    let myMax = array.length - 1
    let myMin = 0
    let chosenSquare = Math.floor(Math.random() * ((myMax - myMin) + 1) + myMin)
    return array[chosenSquare]
}

function checkWinnerOrTie(board, availableMoves) {
// Checks if there is either a winner or a tie
  if (isWinner(board)) {
      youWon(isWinner(board))
      changeColorButtonsEndOfGame();
      return
    }
    if (availableMoves.length === 0) {
      nextTurn.textContent = "It's a TIE!!"
      changeColorButtonsEndOfGame();
      return 
    }
}

function changePlayer(playerSign) {
// Swaps players
  if (playerSign === "x") {
      nextTurn.textContent = "O-Turn!"
    } else {
      nextTurn.textContent = "X-Turn!"
    }
  if ((playerChoice() === "x" && nextTurn.textContent === "O-Turn!") || (playerChoice() === "o" && nextTurn.textContent === "X-Turn!")) {
    noCursor()
  } else {
    cursor()
  }
}

function computerSymbol() {
// Gives the computer either "x" or "o" (depending on human's choice)
  if (playerChoice() === "o") {
    return "x"
  } else {
    return "o"
  } 
}

// Moves of the human and computer (+ execution)
function humanTurn() {
// Lets the Human choose a square via clicking on it
  let playerSign = playerChoice()
  let board = getBoard()
  if ((playerSign==="x" && nextTurn.textContent === "X-Turn!") || (playerSign==="o" && nextTurn.textContent === "O-Turn!")) {
    let fieldName = this.id
    let num = parseInt(fieldName.charAt(fieldName.length-1), 10)
    board = makeMove(num,board,playerSign)
    changeColorViaClass(fieldName, playerSign)
    updateBoard(board)
    checkWinnerOrTie(board, openSquares(board))
    !isWinner(board) ? setTimeout(enemyTurn, 1000) : null
  }
}

function enemyTurn() {
// Picks the correct enemy and executes its turn
  let enemy = enemyChoice()
  eval(enemy)
}

function computerTurn() {
// Normal Computer chooses a square and makes the move (at random)
  let board = getBoard()
  let availableMoves = openSquares(board)
  let playerSign = computerSymbol()
  let move = chooseSquare(availableMoves)
  board = makeMove(move, board, playerSign)
  changeColorViaClass("cell" + move, playerSign)
  updateBoard(board)
  checkWinnerOrTie(board, openSquares(board))
  return board
}

function superComputerTurn() {
// Super Computer picks a square and makes the move
  let board = getBoard()
  let squareList = openSquares(board);
  let playerSign = computerSymbol()
  board = makeMove_superComputer(board, playerSign)
  updateBoard(board)
  checkWinnerOrTie(board, openSquares(board))
  return board
}

function minimax(boardstate, playerSign, maxPlayer, bestPos = null, bestScore = null) {
// Minimax-Algorithm to let the super Computer make the best available move
    // Implement baseCase and bestCase
    let max_player = maxPlayer
    let other_player = ""
    let remSquares = openSquares(boardstate)
    let best = {
        "position": bestPos,
        "score": bestScore
    }
    if (playerSign === "o") {
        other_player = "x"
    } else {
        other_player = "o"
    }
    if (isWinner(boardstate)) {
        let winner = isWinner(boardstate)
        if (winner === other_player) {
            if (max_player === other_player) {
                return {"position": null, "score": 1*(remSquares.length + 1)}
            } else {
                return {"position": null, "score": (-1)*(remSquares.length + 1)}
            }
        } else if (winner === playerSign) {
            if (max_player === playerSign) {
                return {"position": null, "score": 1*(remSquares.length + 1)}
            } else {
                return {"position": null, "score": (-1)*(remSquares.length + 1)}
            }

        }
    }
    
    if (remSquares.length === 0) {
        return {"position": null, "score": 0}
    }

    if (playerSign === maxPlayer) {
        best["position"] = null
        best["score"] = Number.NEGATIVE_INFINITY
    } else {
        best["position"] = null
        best["score"] = Number.POSITIVE_INFINITY
    }
    for (let i = 0; i < remSquares.length; i++) {
        // Test a Move
        boardstate = makeMove(remSquares[i],boardstate,playerSign)
        sim_score = minimax(boardstate, other_player, max_player, best["position"], best["score"])
        // Undo the Move
        boardstate = undoMove(remSquares[i], boardstate)
        sim_score["position"] = remSquares[i]
    
        if (playerSign === maxPlayer) {
            if (sim_score["score"] > best["score"]) {
                best = sim_score
            } 
        } else {
            if (sim_score["score"] < best["score"])
                best = sim_score
        }
    }
    return best
}

function makeMove(number, board, playerSign) {
// Makes the actual move
    let col = number % 3;
    let row = Math.floor(number/3);
    board[row][col] = playerSign
    changePlayer(playerSign)
    return board
}

function makeMove_superComputer(board, playerSign) {
// Super Computer chooses the appropriate square and makes the move
    let move = 0
    let maxPlayer = computerSymbol()    
    if (openSquares(board).length === 9) {
        let availableMoves = openSquares(board);
        move = chooseSquare(availableMoves);
        board = makeMove(move, board, playerSign)
    } else {
        move = minimax(board, maxPlayer, playerSign)["position"]
        board = makeMove(move, board, playerSign)
    }
    changeColorViaClass("cell" + move, playerSign)  
    return board
}

function undoMove(number, board) {
// Cancels the move of the Supercomputers miniMax-Function
    let col = number % 3;
    let row = Math.floor(number/3);
    board[row][col] = ""
    return board
}

// Settings
function xOrOChoice() {
// Checks, if the "x" or "o" starts
  if (document.getElementById('starterChoice').checked){
    return "x"
  } else {
    return "o"
  }
}

function playerChoice() {
// Checks, if the player uses the symbol "x" or "o"
  if (document.getElementById('xOrOChoice').checked){
    return "x"
  } else {
    return "o"
  }
}

function enemyChoice() {
// Checks if the human faces off against normal or super computer
  if (document.getElementById('enemyChoice').checked){
    return "superComputerTurn()"
  } else {
    return "computerTurn()"
  }
}

// Visuals
function changeColor(input, elem, elem2) {
// Changes the colors of the labels for the toggle switches
  if(document.getElementById("nextTurn").innerHTML === "X-Turn!" || document.getElementById("nextTurn").innerHTML === "O-Turn!" ) {
    document.getElementById(input).checked = false;
  }
  if(document.getElementById(input).checked) {
    document.getElementById(elem2).style.color = "rgba(23, 23, 23)";
    document.getElementById(elem).style.color = "white";
  } else {
    document.getElementById(elem2).style.color = "white";
    document.getElementById(elem).style.color = "rgb(23, 23, 23)";
  }
}

function changeColorViaClass(elem, playerSign) {
// Changes the color of the boxes if they belong to either "x" or "o"
  eval(elem).classList.add(playerSign)
}

function changeColorButtonsEndOfGame() {
// Changes the colors (and texts) of the buttons at the end of the game
  document.getElementById("startGameButton").innerHTML = "Restart Game";
  startGameButton.classList.add("endButton")
}

function noCursor() {
  for (let i = 0; i < 9; i++) {
    eval("cell" + i).classList.add("noCursor")
  }
}

function cursor() {
for (let i = 0; i < 9; i++) {
    eval("cell" + i).classList.remove("noCursor")
  }
}

function youWon(winner) {
  let playerSign = playerChoice();
  if(winner === playerSign) {
    nextTurn.textContent = "Congrats, you WON!! :)"
    fireworksFunction()
  } else {
    nextTurn.textContent = "Sorry, you LOST :("
  }
}

function fireworksFunction() {
  fireworks.classList.add("pyro")
}