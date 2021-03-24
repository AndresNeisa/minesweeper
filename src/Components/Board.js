import React from 'react';
import { useState, useEffect} from 'react'; 
import Tile from './Tile';

const Board = () => {
    const [config, setConfig] = useState({width: 0, height: 0, mines: 0, minesArray: [], flags: 0, activeTiles: 0});
    const [timer, setTimer] = useState(0);
    const [difficult, setDifficult] = useState(0);
    const [gameState, setGameState] = useState({gameOver: true, gameOn: false});

    const generateBoard = () => {
        let width;
        let height;
        let mines;
        switch (difficult){
            case 0:
            default:
                width = 9;
                height = 9;
                mines = 10;
                break;
            case 1:
                width = 16;
                height = 16;
                mines = 40;
                break
            case 2:
                width = 30;
                height = 16;
                mines = 99;
                break
        }

        setConfig({...config, width, height, mines, minesArray: [], flags: 0, activeTiles: 0});
    }

    const renderBoard = () => {
        const board = Array(config.height * config.width).fill(0).map((tile, index) => {
            return(
            <Tile 
                key={index + 1}
                id={index + 1}
                gameState = {gameState}
                setGameState = {setGameState}
                config = {config}
                setConfig = {setConfig}
                startGame = {startGame}
            />)} );
        
            return board;
    }

    const startGame = (mines) => {
        setGameState({gameOver: false, gameOn: true});
        setConfig({...config, minesArray: mines});
    }

    const getFace = () => {
        if(gameState.gameOver && gameState.gameOn){
            return 'fa-dizzy'
        } else if(!gameState.gameOver && !gameState.gameOn && (config.activeTiles + config.mines === config.width * config.height)){
            return 'fa-grin-stars'
        }
        else return 'fa-smile'
    } 

    const cleanGame = () => {
        generateBoard();
        setGameState({gameOver: true, gameOn: false});
        setTimer(0);
    }

    useEffect(() => {
        generateBoard();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    },[difficult])

    useEffect(() => {
        let interval = null;

        if(!gameState.gameOver && gameState.gameOn){
            interval = setInterval(() => {
              setTimer(timer + 1);
            }, 1000);
        }

        return () => clearInterval(interval);
    },[timer, gameState])

    useEffect(() => {
        if(gameState.gameOn && config.activeTiles + config.mines === config.width * config.height) {
            setGameState({gameOver: false, gameOn: false});
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    },[config.activeTiles])

    return(
        <React.Fragment>
            <div className='difficult-list'>
                <p className={`difficult ${difficult === 0 && 'selected'}`} onClick={() => {(gameState.gameOver || !gameState.gameOn) && setDifficult(0)}}>Easy</p>
                <p className={`difficult ${difficult === 1 && 'selected'}`} onClick={() => {(gameState.gameOver || !gameState.gameOn) && setDifficult(1)}}>Medium</p>
                <p className={`difficult ${difficult === 2 && 'selected'}`} onClick={() => {(gameState.gameOver || !gameState.gameOn) && setDifficult(2)}}>Hard</p>
            </div>

            <div className='container'>
                <div className="score-board">
                    <h3 className='score'><span>{config.mines - config.flags <= 99 ? 0 : ''}</span><span>{config.mines - config.flags <= 9 ? 0 : ''}</span>{config.mines - config.flags}</h3>
                    <div className='tile face' onClick={() => cleanGame()}><i className={`far icon-bg ${getFace()}`}></i></div>
                    <div className='score'><span>{timer <= 99 ? 0 : ''}</span><span>{timer <= 9 ? 0 : ''}</span>{timer}</div>
                </div>
                <div className='board' style={{width: `${30*config.width + 6}px`}}>
                    {renderBoard()}
                </div>
            </div>
            <p className='results'>
                {(gameState.gameOver && gameState.gameOn) && 'Try again!'}
                {(!gameState.gameOver && !gameState.gameOn) && 'You win!'}
            </p>
        </React.Fragment>
        
        
    )
}

export default Board;