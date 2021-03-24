import './App.css';
import Board from './Components/Board';

function App() {
  return (
    <div className="App">
      <div className='game'>
        <h1 className="title">Minesweeper by Carlitos</h1>
        <p className='instructions'>Find the hidden mines without exploding, the numbers inside the tiles indicate the amount of surrounding mines. Clear the map in the shortest time possible.</p>
        <p className='instructions'> Left-click: activates tile</p>
        <p className='instructions'> Right-click: places a flag</p>
        <p className='instructions'> Double-click: activates surrounding tiles</p>
        <Board/>
      </div>
    </div>
  );
}

export default App;
