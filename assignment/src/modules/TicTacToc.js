import React, { useEffect, useState } from 'react';

function TicTacToc(props) {
    
    const rowColCount = 5;
    const defaultMatrix = [
        ["", "", "", ""],
        ["", "", "", ""],
        ["", "", "", ""],
        ["", "", "", ""],
    ]


    const [status, setStatus] = useState({
        gameStarted: false, 
        player: "O",
        hasPlayerWon: false,
        playerWon: "",
    })
    const [matrix, setMatrix] = useState(defaultMatrix)

    const handlePlayerClick = (rowIndex, colIndex) => {

        let localMatrix = deepCopyValue(matrix);
        if(!status.gameStarted){
            return; 
        }
        else if(localMatrix[rowIndex][colIndex]){
            return;
        }

        localMatrix[rowIndex][colIndex] = status.player;
        let hasPlayerWon = checkWinningPlayer(rowIndex, colIndex, localMatrix);
        setStatus({ ... status, hasPlayerWon: hasPlayerWon, playerWon: status.player, player: status.player == 'X' ? 'O' : 'X',});
        setMatrix(localMatrix);
    }
    
    // checking winning player via row, col, dia and rev dia check
    const checkWinningPlayer = (row, col, localMatrix) => {
        
        let hasDia = true;
        // checking first dia
        if(row == col){
            for(let index= 0; index < rowColCount; index++){
                if(matrix[index][index] !== status.player){
                    hasDia = false;
                } 
            }
        }
        else {
            hasDia = false;
        }

        // rev dia
        let hasRevDia= true
        if((row + col)  == (rowColCount - 1)){
            let lastIndex = rowColCount-1;
            let revDia = [];
            for(let i=0; i<rowColCount; i++){
                revDia.push(localMatrix[i][lastIndex]);
                lastIndex--;
            }
            let checkRevDia = revDia.filter(elem => elem !== status.player)
            if(checkRevDia.length){
                hasRevDia = false;
            }
        }
        else{
            hasRevDia = false;
        }

        // row check;
        let hasRow = true
        let checkRow =  localMatrix[row].filter(elem => elem !== status.player)
        if(checkRow.length){
            hasRow = false;
        }

        // col check;
        let hasCol = true
        let colArray = []
        for(let i = 0; i<rowColCount; i++){
            colArray.push(localMatrix[i][col]);
        }
        let checkCol =  colArray.filter(elem => elem !== status.player)
        if(checkCol.length){
            hasCol = false;
        }

        return (hasDia || hasRevDia || hasRow || hasCol) ;

    }

    // game start and reset function 
    const handleGameStartReset = () => {
        if(status.gameStarted){
            // reset the game
            defaultDynamicMatrix();
        }
        else {
            // start game
            setStatus({...status, gameStarted: true, hasPlayerWon: false, playerWon: "",});
        }
    }

    // util function -- deep coly value
    const deepCopyValue = (value) => {
        return JSON.parse(JSON.stringify(value));
    }

    // dynmaically create matrix of given number
    const defaultDynamicMatrix = () => {

        let dynamicMatrix = [];
        for(let row = 0; row < rowColCount; row++){
            let arr = []
            for(let col = 0; col < rowColCount; col++){
                arr[col] = "";
            }
            dynamicMatrix.push(arr);
        }
        console.log(dynamicMatrix);
        setMatrix(dynamicMatrix);
    }

    useEffect(() => {
        defaultDynamicMatrix()
    },[])

    return (
        <div>
            <h1 className={`textCenter`}>Tic Tac Toc ({rowColCount} x {rowColCount})</h1>

            {
                matrix.map((row, rowIndex) => {
                    return(
                        <div className={`flex justify-content-center`}>
                            {row.map((col, colIndex) => {
                                return (
                                    <span 
                                        // key=
                                        onClick={() => handlePlayerClick(rowIndex, colIndex)}
                                        className={`gameCell ${status.gameStarted ? 'pointer' : 'notAllowed'}`}
                                    > {matrix[rowIndex][colIndex] ? matrix[rowIndex][colIndex] : "---"} 
                                    </span>
                                )
                            })}
                        </div>
                    )
                })
            }
            <div className={`textCenter mrgTop`}>
                {
                    status.gameStarted ?
                    <button className={`btn outlinedBtn`} onClick={handleGameStartReset}>Reset</button> :
                    <button className={`btn outlinedBtn`} onClick={handleGameStartReset}>Start</button>
                }
                <span> Player: {status.player}</span>
                {
                    status.hasPlayerWon &&
                    <span>'{status.playerWon}' Player WON!!</span>

                }

            </div>
        </div>
    );
}

export default TicTacToc;