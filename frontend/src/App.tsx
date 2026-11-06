
import { useState, useEffect } from 'react'
import { Chess } from 'chess.js'
import { Chessboard } from 'react-chessboard'
import {
  Activity,
  BarChart3,
  ChevronLeft,
  ChevronRight,
  CircleHelp,
  Clock3,
  Crown,
  FileUp,
  RotateCcw,
  Settings,
  Undo2,
  Upload,
} from 'lucide-react'
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import './App.css'

const demoEvaluation = [
  { move: '1', value: 0 },
  { move: '2', value: 0.2 },
  { move: '3', value: 0.1 },
  { move: '4', value: 0.5 },
  { move: '5', value: 0.3 },
  { move: '6', value: 0.8 },
  { move: '7', value: 0.6 },
  { move: '8', value: 1.1 },
]

function App() {
  const [game, setGame] = useState(() => new Chess())
  const [history, setHistory] = useState<string[]>([])
  const [orientation, setOrientation] = useState<'white' | 'black'>('white')
  const [apiStatus, setApiStatus] = useState<
  'checking' | 'connected' | 'error'>('checking')

  useEffect(() => {
    fetch('http://localhost:8081/api/chess/status')
      .then((response) => {
        if (!response.ok) {
          throw new Error('Erreur serveur')
        }
        return response.text()
      })
      .then((message) => {
        setApiStatus('connected')
        setApiMessage(message)
      })
      .catch(() => {
        setApiStatus('error')
        setApiMessage('Backend indisponible')
      })
  }, [])


const [apiMessage, setApiMessage] = useState('Vérification du backend...')
  const moves = game.history({ verbose: true })

  function updateGame(nextGame: Chess) {
    setGame(nextGame)
    setHistory(nextGame.history())
  }

  function handlePieceDrop({
    sourceSquare,
    targetSquare,
  }: {
    sourceSquare: string
    targetSquare: string | null
  }) {
    if (!targetSquare) return false

    const nextGame = new Chess(game.fen())

    try {
      nextGame.move({
        from: sourceSquare,
        to: targetSquare,
        promotion: 'q',
      })
      updateGame(nextGame)
      return true
    } catch {
      return false
    }
  }

  function undoMove() {
    const nextGame = new Chess(game.fen())
    nextGame.undo()
    updateGame(nextGame)
  }

  function resetGame() {
    updateGame(new Chess())
  }

  function flipBoard() {
    setOrientation((current) => current === 'white' ? 'black' : 'white')
  }

  const status = game.isCheckmate()
    ? 'Échec et mat'
    : game.isDraw()
      ? 'Partie nulle'
      : game.isCheck()
        ? 'Échec'
        : game.turn() === 'w'
          ? 'Aux blancs de jouer'
          : 'Aux noirs de jouer'

  const chessboardOptions = {
    id: 'chess-analyzer-board',
    position: game.fen(),
    boardOrientation: orientation,
    allowDragging: !game.isGameOver(),
    onPieceDrop: handlePieceDrop,
    showNotation: true,
    animationDurationInMs: 180,
    darkSquareStyle: { backgroundColor: '#77966d' },
    lightSquareStyle: { backgroundColor: '#eeeed2' },
    boardStyle: {
      borderRadius: '4px',
      boxShadow: '0 8px 30px rgba(0,0,0,0.25)',
    },
  }

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-icon"><Crown size={22} /></div>
          <div>
            <h1>Chess<span>Lab</span></h1>
            <small>ANALYSIS STUDIO</small>
          </div>
        </div>

        <div className="sidebar-section">
          <p className="sidebar-label">WORKSPACE</p>
          <button className="nav-item active"><Activity size={18} /> Analyse</button>
          <button className="nav-item"><BarChart3 size={18} /> Statistiques</button>
          <button className="nav-item"><Clock3 size={18} /> Historique</button>
        </div>

        <div className="sidebar-section">
          <p className="sidebar-label">OUTILS</p>
          <button className="nav-item"><Upload size={18} /> Importer une partie</button>
          <button className="nav-item"><FileUp size={18} /> Importer une position</button>
        </div>

        <div className="sidebar-bottom">
          <button className="nav-item"><Settings size={18} /> Paramètres</button>
          <button className="nav-item"><CircleHelp size={18} /> Aide</button>
          <div className="engine-status">
  <span
    className={`status-dot ${
      apiStatus === 'connected'
        ? 'connected'
        : apiStatus === 'error'
          ? 'error'
          : ''
    }`}
  />
  <div>
    <strong>
      {apiStatus === 'checking'
        ? 'Connexion en cours...'
        : apiStatus === 'connected'
          ? 'Backend connecté'
          : 'Backend déconnecté'}
    </strong>
    <small>{apiMessage}</small>
  </div>
</div>
        </div>
      </aside>

      <main className="main-content">
        <header className="topbar">
          <div>
            <div className="breadcrumb">Workspace <span>/</span> Analyse</div>
            <h2>Analyse d'échecs</h2>
          </div>
          <div className="topbar-actions">
            <span className="local-badge">MODE LOCAL</span>
            <button className="new-game-button" onClick={resetGame}>+ Nouvelle partie</button>
          </div>
        </header>

        <div className="dashboard">
          <section className="board-column">
            <div className="board-card">
              <div className="board-card-header">
                <div>
                  <h3>Échiquier</h3>
                  <p>Jouez et analysez vos coups</p>
                </div>
                <button className="icon-button" onClick={flipBoard} title="Retourner l'échiquier">
                  <RotateCcw size={17} />
                </button>
              </div>

              <div className="board-layout">
                <div className="evaluation-bar">
                  <div className="eval-black" />
                  <div className="eval-white" />
                </div>
                <div className="chessboard-wrapper">
                  <Chessboard options={chessboardOptions} />
                </div>
              </div>

              <div className="board-footer">
                <div className="player">
                  <div className="player-avatar white-avatar">♔</div>
                  <div><strong>Blancs</strong><small>Joueur 1</small></div>
                </div>
                <div className="turn-indicator">{status}</div>
                <div className="player player-right">
                  <div><strong>Noirs</strong><small>Joueur 2</small></div>
                  <div className="player-avatar black-avatar">♚</div>
                </div>
              </div>
            </div>

            <div className="moves-card">
              <div className="section-heading">
                <div><h3>Historique des coups</h3><p>{moves.length} demi-coups joués</p></div>
                <div className="move-controls">
                  <button className="icon-button" onClick={undoMove} disabled={moves.length === 0} title="Annuler le dernier coup"><Undo2 size={17} /></button>
                  <button className="icon-button" onClick={resetGame} title="Recommencer"><RotateCcw size={17} /></button>
                </div>
              </div>
              <div className="move-list">
                {moves.length === 0 ? (
                  <p className="empty-moves">Les coups joués apparaîtront ici.</p>
                ) : (
                  Array.from({ length: Math.ceil(moves.length / 2) }, (_, index) => (
                    <div className="move-row" key={index}>
                      <span className="move-number">{index + 1}.</span>
                      <span className="move-san">{moves[index * 2]?.san ?? ''}</span>
                      <span className="move-san">{moves[index * 2 + 1]?.san ?? ''}</span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </section>

          <aside className="analysis-column">
            <div className="analysis-card">
              <div className="section-heading">
                <div><h3>Évaluation</h3><p>Position actuelle</p></div>
                <span className="demo-tag">APERÇU</span>
              </div>
              <div className="evaluation-value">+0.0 <span>égalité</span></div>
              <div className="evaluation-meter"><div /></div>
              <p className="muted-note">Évaluation indicative. Stockfish n'est pas encore connecté.</p>
            </div>

            <div className="analysis-card">
              <div className="section-heading">
                <div><h3>Graphique d'évaluation</h3><p>Évolution de la position</p></div>
              </div>
              <div className="chart-container">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={demoEvaluation}>
                    <defs>
                      <linearGradient id="evalGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#81b64c" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#81b64c" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid stroke="#28313e" strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="move" stroke="#7f8999" tickLine={false} axisLine={false} />
                    <YAxis stroke="#7f8999" tickLine={false} axisLine={false} width={28} />
                    <Tooltip contentStyle={{ background: '#191f29', border: '1px solid #303b49', borderRadius: 8 }} />
                    <Area type="monotone" dataKey="value" stroke="#81b64c" fill="url(#evalGradient)" strokeWidth={2} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
              <p className="muted-note">Données de démonstration, non calculées par un moteur.</p>
            </div>

            <div className="analysis-card engine-card">
              <div className="engine-icon"><Activity size={20} /></div>
              <div><h3>Moteur d'analyse</h3><p>Stockfish sera intégré à l'étape suivante.</p></div>
              <span className="coming-soon">À VENIR</span>
            </div>

            <div className="analysis-card quick-actions">
              <h3>Actions rapides</h3>
              <button onClick={resetGame}><RotateCcw size={16} /> Nouvelle position</button>
              <button onClick={flipBoard}><RotateCcw size={16} /> Retourner l'échiquier</button>
            </div>
          </aside>
        </div>
      </main>
    </div>
  )
}

export default App
