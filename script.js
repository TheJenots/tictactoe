const Player = (name, marker) => {
  let playerCells = [];
  clearCells = () => playerCells.length = 0;
  return {name, marker, playerCells, clearCells};
};

const player1 = Player("Player X", "X");
const player2 = Player("Player O", "O");

const GameBoard = (() => {
  let boardLayout = Array(3).fill(null).map(() => Array(3).fill(undefined));

  getBoardLayout = () => boardLayout;

  renderGameBoard = () => {
    const gameOver = Controller.getGameStatus();
    const gameBoardContainer = document.getElementById("gameBoard");
    gameBoardContainer.innerHTML = "";
    for (let rowIndex = 0; rowIndex < boardLayout.length; rowIndex++) {
      const newRow = document.createElement("tr");
      for (let colIndex = 0; colIndex < boardLayout[rowIndex].length; colIndex++) {
        const cell = document.createElement("td");
        cell.dataset.row = rowIndex;
        cell.dataset.col = colIndex;
        cell.textContent = boardLayout[rowIndex][colIndex];
        if(!gameOver) {
          cell.addEventListener("click", e => Controller.move(e.target.dataset.row, e.target.dataset.col));
        };
        newRow.appendChild(cell);
      };
      gameBoardContainer.appendChild(newRow);
    };
  };

  clearGameBoard = () => boardLayout = Array(3).fill(null).map(() => Array(3).fill(undefined));

  return {getBoardLayout, clearGameBoard, renderGameBoard};
})();

const Controller = (() => {
  let activePlayer = player1;
  let gameOver = false;

  getGameStatus = () => gameOver;
   
  togglePlayer = (player) => {
    if (player == player1) {
      activePlayer = player2;
    }
    else {
      activePlayer = player1;
    }
  };

  move = (row, column) => {
    const boardLayout = GameBoard.getBoardLayout();
    const gameInfo = document.getElementById("gameInfo");
    if (boardLayout[row][column] === undefined) {
      boardLayout[row][column] = activePlayer.marker;
      activePlayer.playerCells.push(`${row}${column}`);
      checkWinner(activePlayer);
      GameBoard.renderGameBoard();
      if(!gameOver) {
        togglePlayer(activePlayer);
        gameInfo.textContent = `It is ${activePlayer.name} turn`;
      };
    }
    else {
      alert("Already taken! Choose another one!");
    }
  };

  checkWinner = (player) => {
    const winConditions = [
      ["00", "10", "20"],
      ["00", "11", "22"],
      ["01", "11", "21"],
      ["02", "12", "22"],
      ["02", "11", "20"],
      ["00", "01", "02"],
      ["10", "11", "12"],
      ["20", "21", "22"]
    ];

    for (let condition of winConditions) {
      let gameInfo = document.getElementById("gameInfo");
      if ((condition.every(cell => player.playerCells.includes(cell)))) {
        GameBoard.renderGameBoard();
        gameInfo.textContent = `${player.name} wins!`;
        gameOver = true;
        return;
      } else if (player.playerCells.length > 4) {
        GameBoard.renderGameBoard();
        gameInfo.textContent = "It's a draw!";
        gameOver = true;
        return;
      }
    };
   };

   restartGame = () => {
    gameOver = false;
    let gameInfo = document.getElementById("gameInfo");
    gameInfo.textContent = `It is ${activePlayer.name} turn`;
    player1.clearCells();
    player2.clearCells();
    GameBoard.clearGameBoard();
    GameBoard.renderGameBoard();
   };
  
  return {move, getGameStatus, restartGame};
})();

const Game = (() => {
  const dialog = document.querySelector("dialog");
  dialog.showModal();
  document.getElementById("p1").value = "";
  document.getElementById("p2").value = "";
  const startGame = document.getElementById("start");
  startGame.addEventListener("click", () => {
    const player1Name = document.getElementById("p1").value || "Player X";
    const player2Name = document.getElementById("p2").value || "Player O";
    player1.name = player1Name;
    player2.name = player2Name;
    const gameInfo = document.getElementById("gameInfo");
    gameInfo.textContent = `It is ${player1.name} turn`;
    restartBtn.style.visibility = "visible";
    GameBoard.renderGameBoard();
    dialog.close();
  });
  const restartBtn = document.getElementById("restart");
  restartBtn.addEventListener("click", Controller.restartGame);
})();
