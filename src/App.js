import { Client } from 'boardgame.io/react';
import { NhacNhac } from './Game';
import { NhacNhacBoard } from './Board';

const App = Client({ 
  game: NhacNhac,
  board: NhacNhacBoard
});

export default App;