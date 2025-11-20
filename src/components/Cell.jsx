export default function Cell({ value, row, col, onClick }) {
  const className = `cell ${value ? (value === 1 ? "red" : "yellow") : ""}`;
  return (
    <div className={className} onClick={() => onClick(col)} role="button" aria-label={'cell-${row}-${col}'}>
      <div className="jeton" />
    </div>
  );
}