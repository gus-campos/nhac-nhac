import { INVALID_MOVE } from 'boardgame.io/core';

// ====================== FUNÇÕES AUXILIARES ======================

function getCellsTop(cells) {

  /*
  Pega a visão superior do jogo, considerando apenas as peças que estão por cima
  */

  let cellsTop = Array(9).fill(null);

  for (let id=0; id<cells.length; id++) {
    
    let length = cells[id].length
    cellsTop[id] = (length > 0) ? cells[id][length-1].playerID : null;
  }

  return cellsTop;
}

function isVictory(cells) {

  /*
  Vrifica se o jogo está ganho
  */

  let cellsTop = getCellsTop(cells);

  // Fileiras válidas
  const rows = [
    
    [0,1,2], [3,4,5], [6,7,8],  // Horizontal
    [0,3,6], [1,4,7], [2,5,8],  // Vertical
    [0,4,8], [6,4,2]            // Diagonal
  ];

  const isRowComplete = (row) => {
    
    const rowPlayerIds = row.map(cellId => cellsTop[cellId]);
    return rowPlayerIds.every(playerID => (playerID!=null && playerID===rowPlayerIds[0]));
  }
  
  // Verifica se alguma fileira está completa
  return rows.map(isRowComplete).some(i=>i===true);
}

function placePiece({ G, events, playerID }, id) {

  /*
  Faz as alterações necessárias no estado para posicionar uma peça
  */

  // Verificando validade da célula
  if (id < 0 || id > 8)
    return INVALID_MOVE;

  // REPOSICIONANDO

  if (G.pieceChose.toMove) {

    if (G.pieceChose.id === id)
      return INVALID_MOVE

    G.pieceChose.toMove = false;
    G.cells[G.pieceChose.id].pop()
  }

  // POSICIONANDO DO ESTOQUE

  else {
    G.stock[playerID][G.pieceChose.size]--;
  }

  // MODIFICANDO TABULEIRO
  let topPiece = getCellsTop(G.cells)[id];

  if (topPiece != null && G.pieceChose.size <= topPiece.size)
    return INVALID_MOVE;

  // Definir id e posicionar
  G.pieceChose.id = id; 
  G.cells[id].push(G.pieceChose);
  G.pieceChose = null;

  events.endTurn();
}

function choosePiece({G, events, playerID }, id, size, stockPlayerID=null) {

  // Validações

  if (size == null)
    return INVALID_MOVE

  if (stockPlayerID != null && String(stockPlayerID) !== playerID)
    return INVALID_MOVE

  if (size === undefined)
    return INVALID_MOVE

  // Se escolhido do tabuleiro
  if (id == null) {
    
    if (G.stock[playerID][size] <= 0)
      return INVALID_MOVE;
  
    G.pieceChose = {
      id: id,
      toMove: false,
      playerID: playerID,
      size: size
    }
  }
  
  // Se escolhido do estoque
  else {
    
    let topPiece = getCellsTop(G.cells)[id];
    
    if (topPiece.playerID !== playerID)
      return INVALID_MOVE;
  
    topPiece.toMove = true;
    G.pieceChose = topPiece;
  }
  
  events.setStage('placePiece');
}

// ========================= GAME =========================

// Obedecendo interface do gameboard.io
export const NhacNhac = {
  
  setup: () => ({ 
    
    cells: Array(9).fill([]),
    stock: [[2,2,2], [2,2,2]],
    pieceChose: null
  }),

  turn: {
    
    // Começa o turno com o jogador atual no choosePiece
    activePlayers: { currentPlayer: 'choosePiece' },

    stages: {

      choosePiece: {
        moves: { choosePiece }
      },

      placePiece: {
        moves: { placePiece }
      }
    }
  },

  ai : {

    // Listando jogadas possíveis para a IA
    enumerate : (G, ctx) => {
      
      /*
      Lista as jogadas possíveis para que a IA possa escolher entre elas
      */
      
      let moves = [];
      
      if (!ctx.gameover) {
        
        let move = ctx.activePlayers[ctx.currentPlayer];

        if (move === 'choosePiece') {
          
          // => Jogadas do estoque

          for (let size=0; size<3; size++)
            if (G.stock[ctx.currentPlayer][size] > 0) 
              moves.push({move:'choosePiece', args:[null, size, null]});

          // => Jogadas de deslocamento

          for (let id=0; id<9; id++) {

            let topPiece = getCellsTop(G.cells)[id];

            // Se for movível
            if (topPiece != null && topPiece.playerID === String(ctx.currentPlayer))
              moves.push({move:'choosePiece', args:[id, topPiece.size, null]});
          }
        }

        else if (move === 'placePiece') {
          
          for (let id=0; id<9; id++) {

            let topPiece = getCellsTop(G.cells)[id];

            if (topPiece === null || G.pieceChose.size > topPiece.size)
              moves.push({move: 'placePiece', args: [id]});
          }
        }
      }

      return moves;
    }   
  },

  endIf: ({G, ctx}) => {

    if (isVictory(G.cells))
      return { winner: ctx.currentPlayer }
  }
};