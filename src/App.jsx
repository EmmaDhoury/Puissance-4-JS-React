import { useState, useCallback, useRef } from "react";
import Board from "./components/Board";
import Scoreboard from "./components/Scoreboard";
import useLocalStorage from "./hooks/useLocalStorage";
import "./style.css";

const ROWS = 6;
const COLS = 7;

function createEmptyBoard() {
  return Array.from({ length: ROWS }, () => Array.from({ length: COLS }, () => null));
}

// Victoire check
function checkWinner(board) {
  const directions = [
    [0, 1], 
    [1, 0], 
    [1, 1], 
    [1, -1], 
  ];

  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      const player = board[r][c];
      if (player) {
        for (const [dr, dc] of directions) {
          const positions = [[r, c]];
          for (let k = 1; k < 4; k++) {
            const nr = r + dr * k;
            const nc = c + dc * k;
            if (nr >= 0 && nr < ROWS && nc >= 0 && nc < COLS && board[nr][nc] === player) {
            positions.push([nr, nc]);
            }
          }
          if (positions.length === 4) {
            return { winner: player, winningPositions: positions };
          }
        }
      }  
    }
  }


  const isFull = board.every(row => row.every(cell => cell !== null));
  if (isFull) return { winner: 0, winningPositions: null }; 
  return { winner: null, winningPositions: null };
}

export default function App() {
  const [board, setBoard] = useState(createEmptyBoard());
  const [currentPlayer, setCurrentPlayer] = useState(1);
  const [gameOver, setGameOver] = useState(false);
  const [winningPositions, setWinningPositions] = useState(null);

  // Historique des scores
  const [history, setHistory] = useLocalStorage("puissance4.history", []);
  const [scores, setScores] = useLocalStorage("puissance4.scores", {
    player1: 0,
    player2: 0,
    ties: 0,
  });

  const resetBoard = () => {
    setBoard(createEmptyBoard());
    setCurrentPlayer(1);
    setGameOver(false);
    setWinningPositions(null);
  };

  const saveResult = (winner) => {
    const entry = { date: Date.now(), winner }; 
    setHistory(prev => [entry, ...prev]);
    setScores(prev => {
      const copy = { ...prev };
      if (winner === 0) copy.ties += 1;
      else if (winner === 1) copy.player1 += 1;
      else if (winner === 2) copy.player2 += 1;
      return copy;
    });
  };

const CELL_SIZE = 100;
const ANIM_DURATION = 300;
const [falling, setFalling] = useState(null);
const animatingRef = useRef(false);

// Gestion des pièces qui tombent
const onclickgame = (col) => {
  if (gameOver || animatingRef.current) return;
  if (falling !== null) return;

  const newBoard = [...board.map(row => [...row])];

  let targetRow = null;
  for (let r = ROWS - 1; r >= 0; r--) {
    if (newBoard[r][col] === null) {
      targetRow = r;
      break;
    }
  }

  if (targetRow === null) return;
  animatingRef.current = true;
  setFalling({
    row: -1,
    col: col,
    player: currentPlayer,
    targetRow: targetRow
  });

  setTimeout(() => {
    setFalling((prev) => ({ ...prev, row: targetRow }));
    animatingRef.current = false
  }, 20); 
  setTimeout(() => {
    const newBoard = board.map(row => row.slice());
    newBoard[targetRow][col] = currentPlayer;
    setBoard(newBoard);

    setFalling(null);

    // Vérifier la victoire !
    const res = checkWinner(newBoard);
    if (res.winner !== null) {
      setGameOver(true);
      setWinningPositions(res.winningPositions);
      saveResult(res.winner);
      return;
    }
    setBoard((prev) => {
      
      const updated = prev.map(row => [...row]);
      updated[targetRow][col] = currentPlayer;
      return updated;
    });

    setFalling(null);

    setCurrentPlayer((prev) => (prev === 1 ? 2 : 1));
  }, 300); 

};

  const onNewGame = () => {
    resetBoard();
  };

  const onResetHistory = () => {
    setHistory([]);
    if (gameOver) resetBoard();
  };

  const onResetScores = () => {
    setScores({ player1: 0, player2: 0, ties: 0 });
  };

  return (
    <div className="app">
      <h1>Puissance 4</h1>
      <main>
      <div className="top-row">
          <Board
            board={board}
            onColumnClick={onclickgame}
            winningPositions={winningPositions}
            falling={falling}
          />
      </div>

      <div>
          <div className="turn">Tour : <span className={gameOver ? "" : currentPlayer === 1 ? "rouge" : "jaune"}>{gameOver ? "" : currentPlayer === 1 ? "Joueur 1" : "Joueur 2"}</span></div>
          {gameOver && (
        <div className="gameover">
          
          {history[0].winner ? (
            <div>
              <p>
               Le gagnant est <span className= {history[0].winner === 1 ? "rouge" : "jaune"}>{history[0] && history[0].winner === 1 ? "Joueur 1 " : history[0] && history[0].winner === 2 ? "Joueur 2" : ""}</span> 
              </p>
            </div>
          ) : (
            <div><p>Match nul !</p></div>
          )}
        </div>
      )}
          <div className="controls">
            <button onClick={onNewGame}>Nouvelle partie</button>
          </div>
        </div>         
      <Scoreboard
          history={history}
          scores={scores}
          onResetHistory={onResetHistory}
          onResetScores={onResetScores}
        />
      </main>
      <p>Fait par Emma Dhoury</p>
    </div>
  );
}

//code à lancer pour faire tournr le serv : npm run dev
//lien : http://localhost:5173/