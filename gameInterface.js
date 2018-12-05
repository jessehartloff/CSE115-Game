var game;
var maxLevelSize = [14, 12];

var config = {
    type: Phaser.AUTO,
    width: 32 * maxLevelSize[0],
    height: 32 * maxLevelSize[1],
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

function startGame() {
    new Phaser.Game(config);
}

function preload() {
    game = this;
    this.load.image('0', 'floor.png');
    this.load.image('1', 'wall.png');
    this.load.image('2', 'crystal.png');
    this.load.image('3', 'door.png');
    this.load.image('4', 'key.png');
    this.load.image('5', 'lava.png');
    this.load.image('6', 'boots.png');
    this.load.image('7', 'exit.png');
    this.load.image('8', 'player.png');
}


function create() {
    this.images = [];
    this.levelNumber = 1;
    startLevel(this.levelNumber);

    this.W = this.input.keyboard.addKey('W');
    this.A = this.input.keyboard.addKey('A');
    this.S = this.input.keyboard.addKey('S');
    this.D = this.input.keyboard.addKey('D');
    
    this.R = this.input.keyboard.addKey('R');
}


function update() {
    
    if(!this.frameNumber){
        this.frameNumber=0;
        this.start = new Date();
    }

    this.frameNumber++;
    
    // wait for the level AJAX call to return before rendering frames
    if(this.stopped){
        return;
    }
    
    if (Phaser.Input.Keyboard.JustDown(this.W)) {
        movePlayer("w");
        updateDisplay();
    }
    if (Phaser.Input.Keyboard.JustDown(this.A)) {
        movePlayer("a");
        updateDisplay();
    }
    if (Phaser.Input.Keyboard.JustDown(this.S)) {
        movePlayer("s");
        updateDisplay();
    }
    if (Phaser.Input.Keyboard.JustDown(this.D)) {
        movePlayer("d");
        updateDisplay();
    }
    if (Phaser.Input.Keyboard.JustDown(this.R)) {
        startLevel(this.levelNumber);
        updateDisplay();
    }

    if(gameState.gameOver){
        startLevel(this.levelNumber);
        updateDisplay();
    }
    
    if(gameState.victory){
        gameState.victory = false;
        startLevel(++this.levelNumber);
        updateDisplay();
    }

    updateDisplay();
    var fps = this.frameNumber / ((new Date()-this.start) / 1000);
        
    if(this.frameNumber % 60 === 0){
        console.log("frame rate: " + fps);
    }
    
//    for(var i=0; i<100; i++){
//        console.log("frame rate: " + fps);
//    }

}


function gridToPixel(index) {
    return index * 32 + 16;
}

function updateDisplay(){
    for(var image of game.images){
        image.destroy();
    }
    game.images = [];
    for (var x = 0; x < maxLevelSize[0]; x++) {
        for (var y = 0; y < maxLevelSize[1]; y++) {
            if(gameState.map[y] && (gameState.map[y][x] || gameState.map[y][x] === 0)){
                game.images.push(game.add.image(gridToPixel(x), gridToPixel(y), gameState.map[y][x].toString()));
            }else{
                game.images.push(game.add.image(gridToPixel(x), gridToPixel(y), '1'));
            }
        }
    }
    game.images.push(game.add.image(gridToPixel(gameState.playerLocation[0]), gridToPixel(gameState.playerLocation[1]), '8'));
}


function startLevel(level){
    game.stopped = true;
    ajaxGetRequest('level/' + level, function(response){
        initializeLevel(response);
        game.stopped = false;
        updateDisplay();
    });
}




function ajaxGetRequest(path, callback){
    var request = new XMLHttpRequest();
    request.onreadystatechange = function(){
        if (this.readyState === 4 && this.status === 200){
            callback(this.response);
        }
    };
    request.open("GET", path);
    request.send();
}