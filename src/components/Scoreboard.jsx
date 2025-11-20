export default function Scoreboard({ history, scores, onResetHistory, onResetScores }) {
  return (
    <div className="scoreboard">
      <h3>Historique & Scores</h3>

      <div className="scores">
        <div><span className="rouge"> Joueur 1</span> : {scores.player1}</div>
        <div><span className="jaune"> Joueur 2</span> : {scores.player2}</div>
        <div> Nuls: {scores.ties}</div>
      </div>

      <div className="history">
        <h4>Parties</h4>
        {history.length === 0 ? (
            <div>Aucune partie enregistrée</div>
        ) : (
            <ul>
            {history.map((h, i) => (
                <li key={i}>
                Partie {history.length - i} : Gagnant <span className={h.winner === 0 ? "" : h.winner === 1 ? "rouge" : "jaune"}>{h.winner === 0 ? "Nul" : h.winner === 1 ? "Joueur 1" : "Joueur 2 "}</span>
                </li>
            ))}
            </ul>
        )}
        </div>

      <div className="scoreboard-actions">
        <button onClick={onResetHistory}>Reset historique</button>
        <button onClick={onResetScores}>Reset scores</button>
      </div>
    </div>
  );
}