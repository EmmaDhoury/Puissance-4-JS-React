import Cell from "./Cell";

export default function Board({ board, onColumnClick, winningPositions, falling }) {
  const rows = board.length;
  const cols = board[0].length;

  const isWinning = (r, c) =>
    winningPositions && winningPositions.some(([wr, wc]) => wr === r && wc === c);

  return (
    <div className="board" style={{ position: "relative" }}>
      {board.map((rowArr, r) => (
        <div className="board-row" key={r}>
          {rowArr.map((cell, c) => (
            <div key={c} className={`board-cell ${isWinning(r, c) ? "winning" : ""}`}>
               <Cell value={cell} row={r} col={c} onClick={() => onColumnClick(c)} />
            </div>
          ))}
        </div>
      ))}

      {falling && (
        <div
          className={`falling-jeton player${falling.player}`}
          style={{
            left: `${falling.col * 102 + 28}px`,       
            top: `${falling.row * 102 + 28 }px`,     
          }}
        />
      )}
    </div>
  );
}

