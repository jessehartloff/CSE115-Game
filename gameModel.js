
var gameState;

var tiles = {
    FLOOR: 0,
    WALL: 1,
    CRYSTAL: 2,
    DOOR: 3,
    KEY: 4,
    LAVA: 5,
    BOOTS: 6,
    EXIT: 7,
    PLAYER: 8
};


function initializeLevel(response){
    var newLevel = JSON.parse(response);
    gameState = {
        map: newLevel.map,
        playerLocation: newLevel.start,
        totalCrystals: countCrystals(newLevel.map),
        crystals: 0,
        keys: 0,
        boots: false,
        victory: false,
        gameOver: false
    };
}
    
    
function countCrystals(grid){
    var count = 0;
    for(var i of grid){
        for(var j of i){
            if(j === 2){
                count++;
            }
        }
    }
    return count;
}


function movePlayer(move){
    updateLocation(move);
    updateGameStateAfterMove();
}


function updateLocation(move){

    var grid = gameState.map;
    
    var new_spot = [0, 0];
    new_spot[0] = gameState.playerLocation[0];
    new_spot[1] = gameState.playerLocation[1];
    
    if(move === "w"){
        new_spot[1] -= 1;
    }else if(move === "a"){
        new_spot[0] -= 1;
    }else if(move === "s"){
        new_spot[1] += 1;
    }else if(move === "d"){
        new_spot[0] += 1;
    }
    
    if(new_spot[0] === -1 || new_spot[0] === grid[0].length){
        return;
    }
    if(new_spot[1] === -1 || new_spot[1] === grid.length){
        return;
    }
    
    var tile = grid[new_spot[1]][new_spot[0]];
    if(tile === tiles.WALL){
        return;
    }
    if(tile === tiles.DOOR && gameState.keys === 0){
        return;
    }
    if(tile === tiles.EXIT && gameState.crystals !== gameState.totalCrystals){
        return;
    }

    gameState.playerLocation = new_spot;
}


function updateGameStateAfterMove(){
    
    var location = gameState.playerLocation;
    var grid = gameState.map;
    
    if(grid[location[1]][location[0]] === tiles.CRYSTAL){
        grid[location[1]][location[0]] = 0;
        gameState.crystals++;
    }
    if(grid[location[1]][location[0]] === tiles.KEY){
        grid[location[1]][location[0]] = 0;
        gameState.keys++;
    }
    if(grid[location[1]][location[0]] === tiles.BOOTS){
        grid[location[1]][location[0]] = 0;
        gameState.boots = true;
    }
    if(grid[location[1]][location[0]] === tiles.EXIT){
        gameState.victory = true;
    }
    if(grid[location[1]][location[0]] === tiles.LAVA && !gameState.boots){
        gameState.gameOver = true;
    }
    if(grid[location[1]][location[0]] === tiles.DOOR){
        grid[location[1]][location[0]] = 0;
        gameState.keys--;
    }
}


