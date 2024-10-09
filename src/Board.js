import React from 'react';

export function NhacNhacBoard({ctx, G, moves}) {

    const chooseGobblerFromStock = (size, playerID) => moves.chooseGobbler(null, size, playerID);
    
    const clickCell = (id) => {

        if (ctx.activePlayers[ctx.currentPlayer] === "chooseGobbler") {  
            let length = G.cells[id].length;
            moves.chooseGobbler(id, (length > 0) ? G.cells[id][length-1].size : null);
        }
            
        else {
            moves.placeGobbler(id);
        }
    }
        
    // RESULTADO
    let result = ""
    if (ctx.gameover) {
        result = (ctx.gameover.winner) ? "Winner: " + (ctx.gameover.winner === "0" ? "ORANGE" : "BLUE"): "Draw!"
    }
    let resultElement = <div id="result">{result}</div>;

    // TABULEIRO
    let cells = [];
    for (let i=0; i<3; i++) {
        for (let j=0; j<3; j++) {

            const id = 3*i + j;
            
            // DESENHANDO CADA GOBBLER
            let length = G.cells[id].length
            let gobblers = G.cells[id];
            let gobblersChars = [];

            for (let k=0; k<length; k++) {
                
                // Caracteres (gobblers)
                gobblersChars.push(
                    
                    <div className="gobbler" 
                         data-size={gobblers[k].size} 
                         data-player={gobblers[k].playerID} 
                         data-selected={gobblers[k].toMove}>O</div>
                );
            }

            // Adicionando células à lista de células da linha
            cells.push(
            
                <div className="board-cell" onClick={()=>clickCell(id)}>{gobblersChars}</div>
            );
        }
    }

    // Listando elementos da seleção de gobblers
    let selections = [[], []];
    for (let playerID=0; playerID<2; playerID++) {
        for (let size=0; size<3; size++) {

            let amount = G.stock[playerID][size];
            let selected = G.gobblerChose != null && G.gobblerChose.size === size && G.gobblerChose.playerID === String(playerID) && !G.gobblerChose.toMove;
            
            selections[playerID].push(

                <div className="stock-cell" data-amount={amount} onClick={()=>chooseGobblerFromStock(size, playerID)}>
                    <div className="stock-amount">{amount}</div>
                    <div className="gobbler" 
                            data-size={size} 
                            data-player={playerID} 
                            data-amount={amount} 
                            data-selected={selected}>O</div>
                </div>
            );
        }
    }

    return (

        <div className="parent-grid-container">

            {/* Seleção de peça do jogador 0 */}
            <div className="stock-container">
                {selections[0]}
            </div>

            {/* Tabuleiro */}
            <div className="board-container">
                {cells}
            </div>

            {/* Seleção de peça do jogador 1 */}
            <div className="stock-container"> 
                {selections[1]}
            </div>

            {/* Resultado */}
            {resultElement}

        </div>
    )
}