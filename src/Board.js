import React from 'react';

export function NhacNhacBoard({ctx, G, moves}) {

    function clickCell(id) {

        /*
        Seleciona e executa ação do click de acordo com o modo atual
        */

        if (ctx.activePlayers[ctx.currentPlayer] === "choosePiece") {  
            
            let length = G.cells[id].length;
            moves.choosePiece(id, (length > 0) ? G.cells[id][length-1].size : null);
        }
            
        else {
            
            moves.placePiece(id);
        }
    }

    function getCellsElements() {
    
        // Para cada célula
        let cells = [];
        for (let i=0; i<3; i++) {
            for (let j=0; j<3; j++) {
    
                const id = 3*i + j;
                
                // Desenhando cada peça
                let length = G.cells[id].length
                let pieces = G.cells[id];
                let piecesChars = [];
    
                for (let k=0; k<length; k++) {
                    
                    // Caracter da peça
                    piecesChars.push(
                        
                        <div className="piece"
                             data-size={pieces[k].size} 
                             data-player={pieces[k].playerID} 
                             data-selected={pieces[k].toMove}>O</div>
                    );
                }
    
                // Adicionando células à lista de células da linha
                cells.push(
                
                    <div className="board-cell" onClick={()=>clickCell(id)} key={id}>{piecesChars} </div>
                );
            }
        }

        return cells;
    }

    // ==================================================================

    function getStockElments(playerID) {

        // Ação de seleção do estoque
        const choosePieceFromStock = (size, playerID) => moves.choosePiece(null, size, playerID);

        // Listando elementos da seleção de pieces
        let selections = [];

        for (let size=0; size<3; size++) {

            let amount = G.stock[playerID][size];
            let selected = G.pieceChose != null && G.pieceChose.size === size && G.pieceChose.playerID === String(playerID) && !G.pieceChose.toMove;
            
            selections.push(

                <div className="stock-cell" data-amount={amount} onClick={()=>choosePieceFromStock(size, playerID)} key={size*(playerID+1)}>
                    <div className="stock-amount">{amount}</div>
                    <div className="piece" 
                            data-size={size} 
                            data-player={playerID} 
                            data-amount={amount} 
                            data-selected={selected}>O</div>
                </div>
            );
        }

        return selections;
    }

    // ==================================================================

    function getResultElement() {

        let result = ""
        if (ctx.gameover) {
            result = (ctx.gameover.winner) ? "Winner: " + (ctx.gameover.winner === "0" ? "ORANGE" : "BLUE"): "Draw!"
        }

        return <div className= "result" id="result">{result}</div>;
    }

    // ==================================================================

    return (

        <div className="parent-grid-container">

            {/* Estoque do jogador 0 */}
            <div className="stock-container">
                {getStockElments(0)}
            </div>

            {/* Tabuleiro */}
            <div className="board-container">
                {getCellsElements()}
            </div>

            {/* Estoque do jogador 1 */}
            <div className="stock-container"> 
                {getStockElments(1)}
            </div>

            {/* Resultado */}
            {getResultElement()}

        </div>
    )
}