import { INVALID_MOVE } from 'boardgame.io/core';

function cellsWinner(cells) {

  const rows = [
    
    [0,1,2], [3,4,5], [6,7,8],  // Horizontal
    [0,3,6], [1,4,7], [2,5,8],  // Vertical
    [0,4,8], [6,4,2]            // Diagonal
  ];

  const rowWinner = (row) => {
    
    // Gera um array com as id das jogadas nas celúlas correspondentes
    const rowPlayerIds = row.map(cellId => cells[cellId]);

    // Se alguém ganhou essa sequência, retornar o vencedor
    if (rowPlayerIds.every(playerId => (playerId!==null && playerId!=="D" && playerId===rowPlayerIds[0])))
      return rowPlayerIds[0];
    else
      return null;
  }

  // Se alguma sequência tiver um vencedor, retornar o vencedor
  for (let i=0; i<rows.length; i++) {
    let currentRowWinner = rowWinner(rows[i]);
    if (currentRowWinner != null) {
      return currentRowWinner;
    }
  }

  // Se nenhuma tiver um vencedor, retornar null
  return null;
}

function IsDrawn(cells) {

  // Empate é quando tudo está preenchido - desnecessário verificar não-vitória
  for (let i=0; i<cells.length; i++) {
    if (cells[i] == null)
      return false;
  };

  return true;
}

// Criando todas as células
let superCells = Array(9).fill(null);
for (let i=0; i<9; i++) {  
  superCells[i] = Array(9).fill(null)
}

// Define o jogo, como se inicia, quais os possíveis movimentos
// E o que acontece quando se faz uma jogada
export const SuperTicTacToe = {

  setup: () => ({ 
  
    currentSuperCell : null,
    superCellsWinners : Array(9).fill(null),
    superCells : superCells,
  }),

  // Define que cada turno tem EXATAMENTE 1 jogada
  turn: {
    minMoves: 1,
    maxMoves: 1,
    },
  
  // Define os movimentos possíveis, e como é feito cada movimento
  moves: {
    
    clickCell: ({ G, playerID }, superId, id) => {
      
      // Não pode ser super célula vencida
      if (G.superCellsWinners[superId] != null) 
        return INVALID_MOVE;

      // Não pode ser diferente da super célula prevista, caso ela esteja definida
      if (G.currentSuperCell != null && G.currentSuperCell !== superId)
        return INVALID_MOVE;
      
      // Não pode ser uma célula já jogada
      if (G.superCells[superId][id] != null)
        return INVALID_MOVE;

      // Registrando autor da jogada
      G.superCells[superId][id] = playerID;
      
      // Definindo vencedor da super célula
      G.superCellsWinners[superId] = cellsWinner(G.superCells[superId]);

      // Se empatou, marcar como -1
      if (IsDrawn(G.superCells[superId]))
        G.superCellsWinners[superId] = "D"

      // Se a próxima super célula não estiver ganha, definir como próxima
      if (G.superCellsWinners[id] == null)
        G.currentSuperCell = id;
      else
        G.currentSuperCell = null;

      // Pq quando imprimo G.superCells[superId] o resultado não bate com 
      // o esperado, apesar do algoritmo funcionar como esperado?
    }
    
  },

  ai : {

    enumerate : (G, ctx) => {
      
      let moves = [];
      // Para cada super célula
      for (let i=0; i<9;i++) 
        // Se não for uma super célula vencida E (a próxima super célula não está definida OU é a super célula definida.  
        if (G.superCellsWinners[i] == null 
          && (G.currentSuperCell == null || G.currentSuperCell === i))
          // Para cada sub célula
          for (let j=0; j<9; j++) 
            // Se não tiver sido marcada ainda
            if (G.superCells[i][j] == null)
              // Listar como jogada possível
              moves.push({move: 'clickCell', args: [i, j]})


      return moves;
    }   
  },

  endIf: ({G, ctx}) => {

    // Se tiver algum ganhador das super células
    if (cellsWinner(G.superCellsWinners) != null)
      return { winner: ctx.currentPlayer }
  
    if (IsDrawn(G.superCellsWinners))
      return { drawn: true }
  }

  
}