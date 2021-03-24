import { useState, useEffect } from 'react';

const Tile = ({config, setConfig, id, setGameState, gameState, ...props}) => {
    const [tile, setTile] = useState({boundaries: [], surroundingMines: null});
    const [active, setActive] = useState(false);
    const [flag, setFlag] = useState(0);

    useEffect(() => {
        const boundaries = getBoundaries();
        const surroundingMines = checkAdjacentTiles(config.minesArray);

        setTile({...tile, boundaries, surroundingMines});
        // eslint-disable-next-line react-hooks/exhaustive-deps
    },[config.minesArray]);

    useEffect(() => {
        if (!gameState.gameOver) {
            clickAdjacentTiles();
            // setConfig({...config, activeTiles: config.activeTiles + 1})
            setConfig(prevConfig => ({...prevConfig, activeTiles: prevConfig.activeTiles +1 }));
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    },[active])

    useEffect(() => {
        if(gameState.gameOver && gameState.gameOn) setActive(true);
        if(gameState.gameOver && !gameState.gameOn) setActive(false);
        if(gameState.gameOver && !gameState.gameOn) setFlag(0);
    }, [gameState])

    // useEffect(() => {
        
    // },[flag])

    const getBoundaries = () => {
        let boundaries = {
            top: id >= config.width ?  id - config.width: null,
            left: id % config.width !== 1 ? id - 1: null,
            right: id % config.width !== 0 ? id + 1: null,
            bot: id < config.width * (config.height - 1) ? id + config.width : null,
        };

        boundaries.topLeft = boundaries.top === null || boundaries.left === null ? null : id - config.width - 1;
        boundaries.topRight = boundaries.top === null || boundaries.right === null ? null : id - config.width + 1;
        boundaries.botLeft = boundaries.bot === null || boundaries.left === null ? null : id + config.width - 1;
        boundaries.botRigth = boundaries.bot === null || boundaries.right === null ? null : id + config.width + 1;

        const boundariesArray = Object.keys(boundaries)
            .map(key => boundaries[key]);
        
            return boundariesArray
    }

    const checkAdjacentTiles = (minesArray) =>{
        const surroundingMines = tile.boundaries.reduce((total, current) => 
            {return !current ? total : 
                minesArray.includes(current) ? total + 1: total},0);
        return surroundingMines;
    }

    const clickAdjacentTiles = (dbClick = false) => {
        if (tile.surroundingMines === 0 || dbClick){
            if(tile.boundaries !== null)
            {tile.boundaries.forEach(tile => {
                if (tile){
                    const element = document.querySelectorAll(`[data-id='${tile}']`)[0];
                    // element && setTimeout(() => element.click(),10);
                    element && element.click();
                }
            });}
        }
    }

    const generateMines = (tileId) => {
        let tileArray = [ ...Array(config.width * config.height).keys() ].map( i => i+1);
        tileArray.sort(() => Math.random() - 0.5);
        let minesArray = tileArray.slice(0,config.mines);
        if (minesArray.includes(parseInt(tileId))){
            minesArray = generateMines(tileId);
        }
        else {
            return minesArray;
        }
        return minesArray;
    }
    
    const handleTileClick = (e) => {
        const tileId = e.target.dataset.id;
        let minesArray = null;

        if(gameState.gameOver && !gameState.gameOn){
            minesArray = generateMines(tileId);
            props.startGame(minesArray);
            setTimeout(() => {setActive(true)}, 20);
        } else 
        if(!active && flag !== 1){
            if(config.minesArray.includes(parseInt(id)))  setGameState({gameOver: true, gameOn: true});
            setActive(true);
        }
    }

    const handleRightClick = (e) => {
        e.preventDefault();
        if(!gameState.gameOver && !active){
            flag === 0 && setConfig({...config, flags: config.flags + 1});
            flag === 1 && setConfig({...config, flags: config.flags - 1});
            setFlag(flag === 2 ? 0 : flag + 1);
        }
        
    }

    const handleDoubleClick = (e) => {
        e.preventDefault();
        if(!gameState.gameOver && gameState.gameOn){
            clickAdjacentTiles(true);
        }
        
    }

    const getFlag = () => {
        switch (flag) {
            case 1:
                return <i className="icon fas fa-map-marker-alt"></i>
            case 2: 
                return <i className="icon fas fa-question"></i>
            default:
                return ''
        }
    }

    const getColor = () =>{
        if (flag === 1){
            return 'red'
        }
        if (active && !config.minesArray.includes(parseInt(id)) && flag !== 1){
            switch (tile.surroundingMines){
            case 1:
                return 'blue'
            case 2: 
                return 'green'
            case 3:
                return 'red'
            case 4:
                return 'purple'
            case 5:
                return 'brown'
            case 6: 
                return 'teal'
            case 7:
                return 'orange'
            default:
                return 'black'
            }
        }
        else return 'black'
    }

    return(
        <div 
            className={`tile ${active ? 'active' : ''}`} 
            data-id={id} 
            onClick={(e) => handleTileClick(e)}
            style={{color: getColor()}}
            onContextMenu={(e) => handleRightClick(e)}
            onDoubleClick={(e) => handleDoubleClick(e)}
            >
                {active && !config.minesArray.includes(parseInt(id)) ?
                 flag === 1 ? <i className="far fa-times-circle wrong-bomb"></i> :
                 tile.surroundingMines !== 0 && 
                 tile.surroundingMines : ''}

                {!active ? getFlag() : ''}

                {
                ((gameState.gameOver && gameState.gameOn) && config.minesArray.includes(parseInt(id))) ?
                (flag !== 1) ? <i className="fas fa-bomb"></i> : getFlag()  : ''
                }
        </div>
    )
}

export default Tile;
//${config.minesArray.includes(parseInt(id)) ? 'mine' : ''}