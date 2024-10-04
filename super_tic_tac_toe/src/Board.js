import React from 'react';

export function SuperTicTacToeBoard({ctx, G, moves}) {

  const onClick = (superId, id) => moves.clickCell(superId, id);

  const cellStyleBase = {
    opacity: 1,
    border: '2px solid #555',
    width: '50px',
    height: '50px',
    lineHeight: '50px',
    textAlign: 'center'
  }

  const cellStyleFaded = {
    opacity: 0.3,
    border: '2px solid #555',
    width: '50px',
    height: '50px',
    lineHeight: '50px',
    textAlign: 'center'
  }

  const wonCellStyle = {
    border: '2px solid #555',
    width: '176px',
    height: '176px',
    lineHeight: '176px',
    textAlign: 'center',
    fontSize: '48px',
  }

  const superCellStyle = {
    border: '2px solid #555',
    width: '176px',
    height: '176px',
    lineHeight: '176px',
  }

  // Linhas do tabuleiro
  let boardTableBody = [];
  for (let i=0; i<3; i++) {
    
    // Super células da linha
    let superCells = [];
    for (let j=0; j<3; j++) {

      const superId = 3*i + j;

      // Se for uma célula vencida
      if (G.superCellsWinners[superId]) {

        superCells.push(

          <td>
            <div style={wonCellStyle}>
              {G.superCellsWinners[superId] === 'D' ? '*' : (G.superCellsWinners[superId] === "0" ? "X" : "O")}
            </div>
          </td>

        );

        continue;
      }

      // Linhas de células das super células
      let tableBody = [];
      for (let k=0; k<3; k++) {

        // Células da linha 
        let cells = [];
        for (let l=0; l<3; l++) {
          
          const id = 3*k + l;
          
          // Selecionando opacidade na disponibilidade da célula
          let cellStyle = (G.currentSuperCell == null || G.currentSuperCell === superId) ? cellStyleBase : cellStyleFaded;

          cells.push(

            <td>

              {G.superCells[superId][id] ? (
              
                <div style={cellStyle}>{(G.superCells[superId][id] === "0" ? "X" : "O")}</div>
              ) : (
                <div style={cellStyle} onClick={()=>onClick(superId,id)}/>
              )}

            </td>
          );
        }

        tableBody.push(

          <tr>
            {cells}
          </tr>

        );
      }

      superCells.push(

        <td style={superCellStyle}>
          <table>
            <tbody>
              {tableBody}
            </tbody>
          </table>
        </td>
      );
    }

    boardTableBody.push(
    
      <tr>
        {superCells}
      </tr>
    )
  }

  // Criando campo de resultado
  let winner = "";
  if (ctx.gameover) {

    winner = (ctx.gameover.winner !== undefined) ? (
      <div id="winner">Winner: {(ctx.gameover.winner === "0" ? "X" : "O")}</div>
    ) : (
      <div id="winner">Draw!</div>
    );
  }

  return (

    <div> 
      <table id="board">
        <tbody>
          {boardTableBody}
        </tbody>
      </table>

      {winner}
    </div>
  )
}