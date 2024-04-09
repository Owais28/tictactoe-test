"use client";

import { useEffect, useState } from "react";
import Confetti from "react-confetti";

const Player = {
  None: null,
  One: "X",
  Two: "O",
  Three: "Z",
};

function App() {
  const [board, setBoard] = useState(
    Array(5)
      .fill(0)
      .map(() => Array(5).fill(Player.None))
  );

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [winner, setWinner] = useState("");
  const [windowWidth, setWindowWidth] = useState(0);
  const [windowHeight, setWindowHeight] = useState(0);

  useEffect(() => {
    setWindowWidth(window.innerWidth);
    setWindowHeight(window.outerHeight);
  }, []);

  const [currentPlayer, setCurrentPlayer] = useState(Player.One);

  const confettiConfig = {
    angle: 90,
    spread: 360,
    startVelocity: 30,
    elementCount: 70,
    dragFriction: 0.12,
    duration: 3000,
    stagger: 3,
    width: "10px",
    height: "10px",
    perspective: "500px",
    colors: ["#a864fd", "#29cdff", "#78ff44", "#ff718d", "#fdff6a"],
  };

  function handleClick(x: number, y: number) {
    if (board[x][y] !== Player.None) return;
    // Create a copy of the board and update it
    const newBoard = board.map((row) => [...row]);
    newBoard[x][y] = currentPlayer;
    // Check the winner using the updated board
    const winner = checkWinner(newBoard);
    if (winner) {
      setWinner(winner);
      setIsModalOpen(true);
    }
    // Update the state
    setBoard(newBoard);
    setCurrentPlayer((prev) =>
      prev === Player.One
        ? Player.Two
        : prev === Player.Two
        ? Player.Three
        : Player.One
    );
  }

  function resetGame() {
    setBoard(
      Array(5)
        .fill(0)
        .map(() => Array(5).fill(Player.None))
    );
    setCurrentPlayer(Player.One);
    setWinner("");
  }

  function checkWinner(board: Array<Array<string>>) {
    // Check rows
    for (let i = 0; i < 5; i++) {
      if (
        board[i][0] &&
        board[i][0] === board[i][1] &&
        board[i][1] === board[i][2] &&
        board[i][2] === board[i][3] &&
        board[i][3] === board[i][4]
      ) {
        return board[i][0];
      }
    }

    // Check columns
    for (let i = 0; i < 5; i++) {
      if (
        board[0][i] &&
        board[0][i] === board[1][i] &&
        board[1][i] === board[2][i] &&
        board[2][i] === board[3][i] &&
        board[3][i] === board[4][i]
      ) {
        return board[0][i];
      }
    }

    // Check diagonals
    if (
      board[0][0] &&
      board[0][0] === board[1][1] &&
      board[1][1] === board[2][2] &&
      board[2][2] === board[3][3] &&
      board[3][3] === board[4][4]
    ) {
      return board[0][0];
    }
    if (
      board[0][4] &&
      board[0][4] === board[1][3] &&
      board[1][3] === board[2][2] &&
      board[2][2] === board[3][1] &&
      board[3][1] === board[4][0]
    ) {
      return board[0][4];
    }

    return null;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      {winner && <Confetti width={windowWidth} height={windowHeight} />}
      <div className="grid grid-cols-5 gap-4">
        {board.map((row: Array<string>, x: number) =>
          row.map((cell: string, y: number) => (
            <button
              key={`${x}-${y}`}
              className={`w-14 h-14 bg-white border-2 border-gray-200 rounded-md flex items-center justify-center text-2xl font-bold 
              ${
                cell === Player.One
                  ? "text-red-500"
                  : cell === Player.Two
                  ? "text-blue-500"
                  : "text-green-500"
              }`}
              onClick={() => handleClick(x, y)}
            >
              {cell}
            </button>
          ))
        )}
        {isModalOpen && (
          <div className="fixed z-10 inset-0 overflow-y-auto">
            <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
              <div
                className="fixed inset-0 transition-opacity"
                aria-hidden="true"
              >
                <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
              </div>
              <span
                className="hidden sm:inline-block sm:align-middle sm:h-screen"
                aria-hidden="true"
              >
                &#8203;
              </span>
              <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <div className="sm:flex sm:items-start">
                    <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                      <h3
                        className="text-lg leading-6 font-medium text-gray-900"
                        id="modal-title"
                      >
                        Player {winner} Wins!
                      </h3>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                  <button
                    type="button"
                    className="mt-3 w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                    onClick={() => {
                      setIsModalOpen(false);
                      resetGame();
                    }}
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      <div className="mt-4 text-2xl">
        Current Player: <strong>{currentPlayer}</strong>
      </div>
    </div>
  );
}

export default App;
