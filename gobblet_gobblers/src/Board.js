import React from 'react';

const baseCellstyle = {
    border: '1px solid #555',
    width: '50px',
    height: '50px',
    lineHeight: '50px',
    textAlign: 'center',

    // Centraliza o texto
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',  
}

const boardFontSizes = ['20px', '35px', '55px'];

const selectionCellstyle = {
    position: 'relative',

    border: '1px solid #555',
    width: '30px',
    height: '30px',
    lineHeight: '50px',
    textAlign: 'center',

    // Centraliza o texto
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',  
}

const selectionFontSizes = ['10px', '15px', '20px'];
const colors = ["orange", "blue"];

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
    let tbody = [];
    for (let i=0; i<3; i++) {
        
        let cells = [];
        for (let j=0; j<3; j++) {

            const id = 3*i + j;
            
            // DESENHANDO CADA GOBBLER
            let length = G.cells[id].length
            let gobblers = G.cells[id];
            let gobblersChars = [];

            for (let k=0; k<length; k++) {
                
                const fontSize = boardFontSizes[gobblers[k].size];
                let color = gobblers[k].playerID === "0" ? 'orange' : 'blue'; 

                const charstyle = {
                    position: 'absolute',
                    textAlign: 'center',
                    fontSize: fontSize,
                    color: gobblers[k].toMove ? 'red' : color
                }

                // Caracteres (gobblers)
                gobblersChars.push(
                    <div className="char" style={charstyle}>O</div>
                );
            }

            // Adicionando células à lista de células da linha
            cells.push(
            
                <td>
                    <div className="cell" style={baseCellstyle} onClick={()=>clickCell(id)}>
                        {gobblersChars}
                    </div>
                </td>
            );
        }

        // Adicionando linha de células ao sorpo da tabela 
        tbody.push(<tr>{cells}</tr>)
    }

    function gobblerStockCharStyle(playerID, size) {

        let color = colors[playerID];

        if (G.gobblerChose != null && G.gobblerChose.playerID === String(playerID) && G.gobblerChose.size === size)
            color = 'red';

        return {

            position: 'absolute',
            textAlign: 'center',
            fontSize: selectionFontSizes[size],
            color: color
        }
    } 

    const stockCharStyle = {

        position: 'absolute',
        top: 0,
        right: 0,
        fontSize: '10px'
    }

    // Listando elementos da seleção de gobblers
    let selections = [[], []];
    for (let player=0; player<2; player++) {
        for (let size=0; size<3; size++) {

            selections[player].push(

                <td>
                    <div style={selectionCellstyle} onClick={()=>chooseGobblerFromStock(size, player)}>
                        <div className="char" style={stockCharStyle}>{G.stock[player][size]}</div>
                        <div className="char" style={gobblerStockCharStyle(player, size, G.gobblerChose)}>O</div>
                    </div>
                </td>
            );
        }
    }

    return (

        <div>

            {/* Seleção de peça do jogador 0 */}
            <table id="0 selection">
                <tbody>
                    <tr>    
                        {selections[0]}
                    </tr>
                </tbody>
            </table>

            {/* Tabuleiro */}
            <table id="board">
                <tbody>
                    {tbody}
                </tbody>
            </table>

            {/* Seleção de peça do jogador 1 */}
            <table id="1 selection">
                <tbody>
                    <tr>    
                        {selections[1]}
                    </tr>
                </tbody>
            </table>

            {/* Resultado */}
            {resultElement}

        </div>
    )
}