import { INVALID_MOVE } from 'boardgame.io/core';

export function FindCurrentSize(cells, id) {

  for (let i=cells[id].length-1; i>=0; i--) {
    if (cells[id][i] != null) {
      return i;
    }
  }
  return null;
}

function getCellsTop(cells) {

  let cellsTop = Array(9).fill(null);

  for (let id=0; id<cells.length; id++) {
    
    let length = cells[id].length
    cellsTop[id] = (length > 0) ? cells[id][length-1].playerID : null;
  }

  return cellsTop;
}

function IsVictory(cells) {

  let cellsTop = getCellsTop(cells);

  const rows = [
    // Horizontal
    [0,1,2], [3,4,5], [6,7,8],
    // Vertical
    [0,3,6], [1,4,7], [2,5,8],
    // Diagonal
    [0,4,8], [6,4,2]
  ];

  const isRowComplete = (row) => {
    
    const rowPlayerIds = row.map(cellId => cellsTop[cellId]);
    return rowPlayerIds.every(playerID => (playerID!=null && playerID===rowPlayerIds[0]));
  }
  
  // Internamente faz um mapping e verifica se algum retorno é true
  return rows.map(isRowComplete).some(i=>i===true);
}

function placeGobbler({ G, events, playerID }, id) {

  // Verificando validade das células
  if (id < 0 || id > 8)
    return INVALID_MOVE;

  // Reposicionando
  if (G.gobblerChose.toMove) {

    // Não deixar mover pro mesmo lugar
    if (G.gobblerChose.id === id)
      return INVALID_MOVE

    G.gobblerChose.toMove = false;
    G.cells[G.gobblerChose.id].pop()
  }

  else {
    // Decrementar estoque, se necessário
    G.stock[playerID][G.gobblerChose.size]--;
  }

  // Achando o maior tamanho jogado nesta célula
  let length = G.cells[id].length
  let lastGobbler = length>0 ? G.cells[id][length-1] : null;

  // Se não tem gobbler, ou o gobble é válido
  if (lastGobbler == null || G.gobblerChose.size > lastGobbler.size) {

    // Definir id e colocar
    G.gobblerChose.id = id; 
    G.cells[id].push(G.gobblerChose);

    // Anulando
    G.gobblerChose = null;

    events.endTurn();
  }
  
  else {  

    return INVALID_MOVE;
  }
}

function chooseGobbler({G, events, playerID }, id, size, stockPlayerID=null) {

  // Verificando se é caa sem gobbler
  if (size == null)
    return INVALID_MOVE

  // N deixar escolher gobbler do adversário
  if (stockPlayerID != null && String(stockPlayerID) !== playerID)
    return INVALID_MOVE

  if (size === undefined)
    return INVALID_MOVE

  // Marcando que gobbler escolhido será movido
  if (id != null) {

    let gobbler = G.cells[id][G.cells[id].length-1];
    
    // Se for de outro player, anunciar jogada inválida
    if (gobbler.playerID !== playerID)
      return INVALID_MOVE;

    gobbler.toMove = true;
    G.gobblerChose = gobbler;
  }

  else {

    // Verificando estoque
    if (G.stock[playerID][size] < 1)
      return INVALID_MOVE;

    // Criando gobbler do estoque
    G.gobblerChose = {
      id: id,
      toMove: false,
      playerID: playerID,
      size: size
    }
  }
  
  events.setStage('placeGobbler');
}

export const NhacNhac = {
  
  setup: () => ({ 
    
    cells: Array(9).fill([]),
    stock: [[2,2,2], [2,2,2]],
    gobblerChose: null
  }),

  turn: {
    
    // Começa o turno com o jogador atual no seguinte stage
    activePlayers: { currentPlayer: 'chooseGobbler' },

    stages: {

      chooseGobbler: {

        moves: { chooseGobbler }
      },

      // É ativado ao fim do stage anterior, e quando concluído, termina o turn
      placeGobbler: {

        moves: { placeGobbler }
      }
    }
  },

  ai : {

    enumerate : (G, ctx) => {
      
      let moves = [];
      
      // Se jogo não tiver terminado
      if (!ctx.gameover) {
        
        // Encontrar o movimento disponível de acordo com o stage atual
        let move = ctx.activePlayers[ctx.currentPlayer];
        
        if (move === 'chooseGobbler') {
          
          // ==== ESCOLHENDO DO ESTOQUE =====

          for (let size=0; size<3; size++)

            // Se tiver estoque
            if (G.stock[ctx.currentPlayer][size] > 0)
              moves.push({move:'chooseGobbler', args:[null, size, null]});

          // ==== ESCOLHENDO DO TABULEIRO =====

          // Para cada casa do tabuleiro
          for (let id=0; id<9; id++) {

            // Quantidade de gobblers
            let length = G.cells[id].length;

            // Se tiver gobbler, e o último for do player
            if (length > 0 && G.cells[id][length-1].playerID === String(ctx.currentPlayer))
              moves.push({move:'chooseGobbler', args:[id, G.cells[id][length-1].size, null]});
          }
        }

        else if (move === 'placeGobbler') {
          
          // Para cada casa do tabuleiro
          for (let id=0; id<9; id++) {

            // Quantidade de gobblers
            let length = G.cells[id].length;

            // Se estiver livre
            if (length === 0)
              moves.push({move: 'placeGobbler', args: [id]});
            
            // Ou se último gobbler for menor que o gobbler escolhido
            else if (G.gobblerChose.size > G.cells[id][length-1].size)
              moves.push({move: 'placeGobbler', args: [id]});
          }
        }
      }

      return moves;
    }   
  },

  endIf: ({G, ctx}) => {

    if (IsVictory(G.cells))
      return { winner: ctx.currentPlayer }
  }
};