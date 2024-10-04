import { Client } from 'boardgame.io/react';
import { SuperTicTacToe } from './Game';
import { SuperTicTacToeBoard } from './Board';

const App = Client({ 
  game: SuperTicTacToe,
  board: SuperTicTacToeBoard, 
});

export default App;