//Factory function to create Players
const Player = (name, marker) => {
  let playerCells = []; //Array whe store player's marked fields
  clearCells = () => playerCells.length = 0; //Clears playerCells array
  return {name, marker, playerCells, clearCells};
};

//Creates players
const player1 = Player("Player X", "X");
const player2 = Player("Player O", "O");

//Gameboard module
const GameBoard = (() => {
  //Creates boardlayout array as 3x3 grid
  let boardLayout = Array(3).fill(null).map(() => Array(3).fill(undefined));

  getBoardLayout = () => boardLayout;

  //Render gameboard to web page
  renderGameBoard = () => {
    const gameOver = Controller.getGameStatus();
    const gameBoardContainer = document.getElementById("gameBoard");
    gameBoardContainer.innerHTML = "";
    //Creates table to display the 3x3 grid layout
    for (let rowIndex = 0; rowIndex < boardLayout.length; rowIndex++) {
      const newRow = document.createElement("tr");
      for (let colIndex = 0; colIndex < boardLayout[rowIndex].length; colIndex++) {
        const cell = document.createElement("td");
        cell.dataset.row = rowIndex;
        cell.dataset.col = colIndex;
        cell.textContent = boardLayout[rowIndex][colIndex]; //Displays value (players marker) from gameboard array if there is any
        //Add eventlistener to gameboard only if game is not over
        if(!gameOver) {
          cell.addEventListener("click", e => Controller.move(e.target.dataset.row, e.target.dataset.col));
        };
        newRow.appendChild(cell);
      };
      gameBoardContainer.appendChild(newRow);
    };
  };

  //Clears gameboard array
  clearGameBoard = () => boardLayout = Array(3).fill(null).map(() => Array(3).fill(undefined));

  return {getBoardLayout, clearGameBoard, renderGameBoard};
})();

const Controller = (() => {
  let activePlayer = player1; //Sets player1 as first player to make  amove
  let gameOver = false; //Sets initial game status

  getGameStatus = () => gameOver;
  
  //Toggle active players
  togglePlayer = (player) => {
    if (player == player1) {
      activePlayer = player2;
    }
    else {
      activePlayer = player1;
    }
  };

  //Function for player to make a move
  move = (row, column) => {
    const boardLayout = GameBoard.getBoardLayout(); //Gets current gameboard
    const gameInfo = document.getElementById("gameInfo");
    if (boardLayout[row][column] === undefined) { //If field is empty
      boardLayout[row][column] = activePlayer.marker; //adds active player marker in it
      activePlayer.playerCells.push(`${row}${column}`); //and adds marked field to playerCellls array
      checkWinner(activePlayer);
      GameBoard.renderGameBoard();
      if(!gameOver) { //If game is not over, toggles players and shows who players makes next move
        togglePlayer(activePlayer);
        gameInfo.textContent = `It is ${activePlayer.name} turn`;
      };
    };
  };

  //Function to check win or draw
  checkWinner = (player) => {
    //Arrays with win values to compare with playerCells arrays
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

    let gameInfo = document.getElementById("gameInfo");
    let winnersCup = document.getElementById("cup");
    let cupImage = document.getElementById("cupImg");

    //Checks if player won
    for (let condition of winConditions) {
      if ((condition.every(cell => player.playerCells.includes(cell)))) {
        GameBoard.renderGameBoard();
        //Show winners cup and message
        cupImage.setAttribute("src", "Assets/win.png");
        winnersCup.setAttribute("class", "show");
        gameInfo.textContent = `${player.name} wins!`;
        gameOver = true; //Set game status as over
        return;
      };
    };

    //Check if is a draw
    if (player1.playerCells.length + player2.playerCells.length == 9) {
      GameBoard.renderGameBoard();
      //Show a draw image and message
      cupImage.setAttribute("src", "Assets/draw.png");
      winnersCup.setAttribute("class", "show");
      gameInfo.textContent = "It's a draw!";
      gameOver = true; //Set game status as over
      return;
    };
  };

  //Restart game
   restartGame = () => {
    gameOver = false;
    let gameInfo = document.getElementById("gameInfo");
    gameInfo.textContent = `It is ${activePlayer.name} turn`;
    let winnersCup = document.getElementById("cup");
    winnersCup.setAttribute("class", "hidden"); //Hides win or draw div
    player1.clearCells();
    player2.clearCells();
    GameBoard.clearGameBoard();
    GameBoard.renderGameBoard();
   };
  
  return {move, getGameStatus, restartGame};
})();

const Game = (() => {
  //Dialog where choose between PvP and PvC
  const gameVersion = document.getElementById("gameVersion");
  gameVersion.showModal();
  
  //PvP game
  let pvpBtn = document.getElementById("pvpBtn");
  pvpBtn.addEventListener("click", () => {
    gameVersion.close();
    //Dialog where input player names
    const pvpGame = document.getElementById("pvpGame");
    pvpGame.showModal();
    //Clears input fields
    document.getElementById("p1").value = "";
    document.getElementById("p2").value = "";
    //Function to start game
    const startGame = document.getElementById("startPVP");
    startGame.addEventListener("click", () => {
      //Gets player names from inputs or sets them to default values
      const player1Name = document.getElementById("p1").value || "Player X";
      const player2Name = document.getElementById("p2").value || "Player O";
      player1.name = player1Name;
      player2.name = player2Name;
      const gameInfo = document.getElementById("gameInfo");
      gameInfo.textContent = `It is ${player1.name} turn`;
      restartBtn.style.visibility = "visible"; //Makes Play again button visible
      GameBoard.renderGameBoard(); //Displays gameboard
      pvpGame.close(); //and closes dialog modal
    });
  });

  //PvC game in development
  let pvcBtn = document.getElementById("pvcBtn")
  pvcBtn.addEventListener("click", () => {
    gameVersion.close();
    const pvcGame = document.getElementById("pvcGame");
    pvcGame.showModal();
  });

  const restartBtn = document.getElementById("restart");
  restartBtn.addEventListener("click", Controller.restartGame);

})();