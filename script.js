class Player{
    constructor(game){ 
        this.game = game;
        this.width = 32 / 2;
        this.height = 24;
        this.frame = 0;
        this.counter = 0;
        this.absoluteWidth = this.width * 2;
        this.absoluteHeight = this.height * 2;
        this.x = game.width / 2 - this.absoluteWidth / 2;
        this.y = game.height -50;

        //player sprite sheet
        this.image = document.getElementById('player');
    }

    update(){
        if(this.frame == 0 && this.counter == 5) {
            this.frame = 1;
            this.counter = 0;
        }

        else if(this.frame == 1 && this.counter == 5){
            this.frame = 0;
            this.counter = 0;
        }
        
        this.counter+=1;
    }

    draw(context){
        context.drawImage(this.image, this.frame * this.width, 0, this.width, this.height, this.x, this.y, this.absoluteWidth, this.absoluteHeight);
    }
}

class Enemy{
    constructor(game, bossIteration){
        this.game = game;
        this.width = 15;
        this.x;
        this.speed = 0.8;
        this.alive = false;
        this.enemyTypes = [];
        this.enemyType;
        this.attack = [];
        this.attackSpeed = 120;
        this.counter = 0;
        this.frameCounter = 0;
        this.frameX = 0;
        this.enemySprite;
        this.bossCounter = 0;
        this.enemyCounter = 0;
        this.targetable = true;
        this.spawn = false;
        this.explode = false;
        this.index;
        
        //initializing enemy types;
        this.enemyTypes.push('ship');
        this.enemyTypes.push('monster');
        this.enemyTypes.push('asteroid');
        this.enemyTypes.push('boss');

        //initializing enemy type
        if(bossIteration) this.enemyType = 'boss';
        else this.enemyType = this.enemyTypes[Math.round(Math.random() * (this.enemyTypes.length - 2))];

        do this.x = Math.random() * this.game.width + this.width / 2;
        while(this.x < 50 || this.x > this.game.width - 50  || this.x == undefined); 

        switch(this.enemyType){
            case 'ship': 
                this.ship1 = document.getElementById("ship1");
                this.ship2 = document.getElementById("ship2");
                this.ship3 = document.getElementById("ship3");

                //initializing the type of the ship enemy
                if(this.shipType == undefined) this.shipType = Math.round(Math.random() * 2);

                //initializing the ship sprite
                if(this.shipType == 0) {
                    this.enemySprite = this.ship1; 
                    this.width = 32 / 2; 
                    this.height = 16;
                }
                else if(this.shipType == 1) {
                    this.enemySprite = this.ship2; 
                    this.width = 64 / 2; 
                    this.height = 16;
                }
                else if(this.shipType == 2) {
                    this.enemySprite = this.ship3; 
                    this.width = 64 / 2; 
                    this.height = 32;
                }
                this.absoluteWidth = this.width * 0.7;
                this.absoluteHeight = this.height * 0.7;
                break;

            case 'monster': 
                this.enemySprite = document.getElementById('monster');
                this.width = 480 / 6;
                this.height = 320 / 4;
                this.frameX = 0;
                this.frameY = Math.round(Math.random() * 3);
                this.absoluteWidth = this.width * 0.3;
                this.absoluteHeight = this.height * 0.3;
                break;

            case 'asteroid': 
                this.asteroid = document.getElementById('asteroid');
                this.frameX = 0;
                this.frameY = Math.round(Math.random() * 3);
                this.width = 560 / 7;
                this.height = 320 / 4;
                this.enemySprite = this.asteroid;
                this.absoluteWidth = this.width * 0.4;
                this.absoluteHeight = this.height * 0.4;
                break;

            case 'boss': 
                this.targetable = false;
                this.enemySprite = document.getElementById('boss');
                this.frameX = 0;
                this.frameY = Math.round(Math.random() * 3);
                this.width = 2200 / 11;
                this.height = 800 / 4;
                this.absoluteWidth = this.width;
                this.absoluteHeight = this.height;
        }

        this.y = -this.absoluteHeight;
    }

    update(){
        this.frontSide = this.y + this.absoluteHeight;
        this.leftSide = this.x;
        this.rightSide = this.x + this.absoluteWidth;
        this.backSide = this.y;

        //movement
        switch(this.enemyType){
            //ship movement and attack
            case 'ship':
                //movement of the ship
                this.y += this.speed * 0.8;
             
                //attack
                if(this.counter % this.attackSpeed == 0) {
                    this.game.enemyAttack.push(new EnemyProjectile(this.game, this)); this.counter = 0;
                }

                //frames
                if(this.frameX == 0 && this.frameCounter == 5){
                    this.frameX = 1;
                    this.frameCounter = 0;
                }
                else if(this.frameX == 1 && this.frameCounter == 5){
                    this.frameX = 0;
                    this.frameCounter = 0;
                }

                //counters
                this.frameCounter++;
                this.counter++; break;
            //monster movement
            case 'monster': this.monsterMovement(); break;
            //asteroid movement
            case 'asteroid': 
                this.y += this.speed; 
                break;
            //boss movement
            case 'boss':
                //summon
                if(this.game.wave.enemyLength > this.enemyCounter){
                    if(this.bossCounter == 60){
                        this.summoningTube = new SummoningTube(this.game, this);
                        this.bossCounter = 0;
                        this.enemyCounter++;
                        this.game.wave.spawnedEnemy++;
                    }
                }
                else if(this.game.wave.enemyLength == this.enemyCounter && this.game.wave.enemies.length == 1) 
                    this.game.wave.enemies[0].targetable = true;

                //movement
                if(this.game.wave.enemies[0].targetable == true) this.y += this.speed; 
                else if(this.y < this.height / 5) this.y += this.speed * 0.7;

                if(this.y >= this.game.height) this.game.gameOver = true;

                if(this.frameCounter == 30 && this.frameX == 0) {
                    this.frameX = 1;
                    this.frameCounter = 0;
                }
                if(this.frameCounter == 30 && this.frameX == 1) {
                    this.frameX = 0;
                    this.frameCounter =0;
                }
                this.bossCounter++;
                this.frameCounter++;
                break;
        }
    
        while(this.x > this.game.width - this.width) this.x = Math.random() * this.game.width;
    }

    draw(context){
        switch(this.enemyType){
            case 'ship': 
                context.drawImage(this.enemySprite, this.frameX * this.width, 0, this.width, this.height, this.x, this.y, this.absoluteWidth, this.absoluteHeight);
                break;
            case 'monster': 
                context.drawImage(this.enemySprite, this.frameX * this.width, this.frameY * this.height, this.width, this.height, this.x, this.y, this.absoluteWidth, this.absoluteHeight);
                break;
            case 'asteroid':
                context.drawImage(this.enemySprite, this.frameX * this.width, this.frameY * this.height, this.width, this.height, this.x, this.y, this.absoluteWidth, this.absoluteHeight);                
                break;
            case 'boss':
                context.drawImage(this.enemySprite, this.frameX * this.width, this.frameY * this.height, this.width, this.height, this.x, this.y, this.absoluteWidth, this.absoluteHeight);
        }
        
        if(this.summoningTube != undefined) {
            this.summoningTube.energyBall(context);
            if(this.bossCounter <= 40){
                this.summoningTube.draw(context);
            }
        }
    }

    monsterMovement(){
        //vector 
        this.directionX = (this.game.player.x) - this.x;
        this.directionY = this.game.player.y - this.y;

        //normalize the direction vector
        this.magnitude = Math.sqrt(this.directionX*this.directionX + this.directionY*this.directionY);
        this.directionX /= this.magnitude;
        this.directionY /= this.magnitude;

        //position
        this.x += this.directionX * (this.speed / 2);
        this.y += this.directionY * (this.speed / 2);
    }
}

class EnemyProjectile{
    constructor(game, enemy){
        this.game = game;
        this.context = this.game.canvas.getContext('2d');
        this.enemy = enemy;
        this.height = 20;
        this.letter = "(space)";
        this.speed = 1.5;
        this.alive = true;

        this.context.font = 'bold '+JSON.stringify(this.height)+'px Arial';
        this.width = this.context.measureText(this.letter).width;

        this.x = this.enemy.x - this.width / 2 + this.enemy.width / 2;
        this.y = this.enemy.y;

        this.absoluteWidth = this.width;
        this.absoluteHeight = this.height;
    }

    update(context){
        //vector 
        this.directionX = (this.game.player.x) - this.x;
        this.directionY = this.game.player.y - this.y;

        //normalize the direction vector
        this.magnitude = Math.sqrt(this.directionX*this.directionX + this.directionY*this.directionY);
        this.directionX /= this.magnitude;
        this.directionY /= this.magnitude;

        //position
        this.x += this.directionX * this.speed;
        this.y += this.directionY * this.speed;

        this.frontSide = this.y + this.absoluteHeight;
        this.backSide = this.y;
        this.leftSide = this.x;
        this.rightSide = this.x + this.absoluteWidth;
    }

    draw(context){
        context.fillStyle = 'white';
        context.fillText(this.letter, this.x, this.y);
    }
}

class Projectile{
    constructor(game) {
        this.game = game;
        this.player = this.game.player;
        this.width = 32 / 2;
        this.height = 32 / 2;
        this.absoluteWidth = this.width * 0.8;
        this.absoluteHeight = this.height * 0.8;
        this.speed = 10;
        this.enemies = this.game.wave.enemies;
        this.targetWord = '';
        this.fired = true;
        this.exploded = false;

        // Starting position: center of the player sprite
        this.x = this.player.x + (this.player.absoluteWidth / 2) - (this.absoluteWidth / 2);
        this.y = this.player.y;

        this.image = document.getElementById('projectile');
        this.frameX = 0;
        this.frameY = Math.round(Math.random() * 1);
        this.counter = 0;
        this.type = 'projectile';

        // Set target (Enemy or EnemyProjectile)
        if (this.game.targetType == 'enemy') {
            this.targetEnemy = this.enemies[this.game.targetIndex];
        } else if (this.game.targetType == 'projectile') {
            this.targetEnemy = this.game.enemyAttackTarget;
        }

        this.game.player.fired = this.fired;
    }

    update() {
        // Changing frames
        if (this.counter == 30 && this.frameX == 0) {
            this.counter = 0;
            this.frameX = 1;
        } else if (this.counter == 30 && this.frameX == 1) {
            this.counter = 0;
            this.frameX = 0;
        }

        // Target coordinates (center of the enemy)
        const targetX = this.targetEnemy.x + this.targetEnemy.absoluteWidth / 2 - this.absoluteWidth / 4;
        const targetY = this.targetEnemy.y + this.targetEnemy.absoluteHeight / 2 - this.absoluteHeight / 2;

        // Vector to target
        this.directionX = targetX - this.x;
        this.directionY = targetY - this.y;

        // Normalize the direction vector
        this.magnitude = Math.sqrt(this.directionX * this.directionX + this.directionY * this.directionY);
        this.directionX /= this.magnitude;
        this.directionY /= this.magnitude;

        // Update position
        this.x += this.directionX * this.speed;
        this.y += this.directionY * this.speed;

        this.counter++;
    }

    draw(context) {
        context.drawImage(
            this.image, 
            this.frameX * this.width, 
            this.frameY * this.height, 
            this.width, 
            this.height, 
            this.x, 
            this.y, 
            this.absoluteWidth, 
            this.absoluteHeight
        );
    }
}

class Wave{
    constructor(game){
        this.game = game;
        this.enemyLength = this.game.enemyLength;
        this.enemies = [];
        this.spawnSpeed = 1;
        this.wordWidth = [];
        this.randomIndexes = [];
        this.randomWords = [];
        this.bossIteration = false;
        this.textWidth;
        this.counter = 0;
        this.spawnedEnemy = 1;
        this.bossAlive = false;
        this.targetWord = '';
        this.normalWords = [
            "cat", "dog", "sun", "hat", "bat", "cup", "red", "go", "run", "cow", 
            "fish", "pen", "box", "key", "lip", "car", "fan", "egg", "ice", "map", 
            "owl", "pig", "rat", "toy", "ant", "web", "bee", "hen", "axe", "bus", 
            "nut", "pot", "jam", "pie", "dot", "net", "bed", "top", "kid", "log", 
            "art", "bow", "cap", "fog", "gum", "lid", "man", "van", "pan", "tap",
            "apple", "house", "table", "piano", "grape", "snake", "heart", "bread", 
            "train", "clock", "water", "cloud", "smile", "chair", "plant", "stone", 
            "phone", "green", "drink", "black", "horse", "lemon", "shirt", "pizza", 
            "short", "toast", "beach", "glass", "brain", "earth", "shell", "dance", 
            "movie", "grill", "fruit", "match", "check", "wheat", "prize", "space", 
            "purse", "thumb", "stair", "watch", "storm", "crown", "sound", "light", 
            "speed", "point", "brick", "slide", "lunch", "flame", "sharp", "bread", 
            "toast", "spoon", "place", "drive", "broom", "piano", "angle", "sugar", 
            "plant", "shirt", "drink", "grape", "storm", "grass", "trick", "house", 
            "truck", "snack", "flute", "brick", "plane", "cable", "flame", "crash",
            "planet", "kitten", "butter", "button", "candle", "jacket", "forest", 
            "guitar", "garden", "market", "pencil", "ticket", "ribbon", "basket", 
            "flower", "bottle", "camera", "window", "bucket", "island", "mirror", 
            "puzzle", "pirate", "rocket", "shadow", "tunnel", "velvet", "summer", 
            "winter", "jungle", "sponge", "helmet", "castle", "bubble", "feather", 
            "hammer", "ladder", "packet", "wallet", "action", "button", "bunker", 
            "donkey", "family", "flight", "hanger", "hunter", "jigsaw", "jockey", 
            "kettle", "ladder", "lantern", "marble", "magnet", "museum", "office", 
            "pillow", "pencil", "pirate", "planet", "pocket", "rocket", "shadow", 
            "tunnel", "velvet", "window", "whistle", "zombie", "cookie", "goblin", 
            "market", "animal", "bubble", "velvet", "ribbon", "orange", "castle"
          ];
        this.hardWords = [
            "chicken", "butterfly", "elephant", "television", "dinosaur", "mountain", 
            "adventure", "backpack", "calendar", "internet", "discovery", "generator",
            "multimedia", "psychology", "celebration", "complicated", "application", 
            "development", "communication", "international", "philosophy", "instructor", 
            "restaurant", "mathematics", "enthusiastic", "organization", "destination", 
            "responsible", "architecture", "programming", "environment", "appreciation", 
            "exploration", "revolutionary", "demonstration", "conversation", "entrepreneur", 
            "extraordinary", "professional", "subsequently", "announcement", "significance", 
            "technological", "exaggeration", "characteristic", "philosophical", "congratulations", 
            "opportunity", "determination", "documentation", "exceptionally", "establishment", 
            "imagination", "fundamental", "preparation", "qualification", "representation", 
            "unbelievable", "extraordinary", "understanding", "hospitality", "responsibility", 
            "uncomfortable", "recommendation", "reconstruction", "individuality", "conservation", 
            "distinguished", "comprehension", "administrator", "accommodation", "introduction", 
            "achievement", "accumulation", "significance", "superintendent", "hypothetical", 
            "transformation", "psychological", "interpretation", "simplification", "appreciation", 
            "representation", "implementation", "specification", "manufacturing", "manipulation"
        ];

        if(this.game.waveNumber % 3 == 0) this.bossIteration = true;

        if(this.bossIteration){
            this.enemies.push(new Enemy(this.game, this.bossIteration));
            this.randomWords.push(this.hardWords[Math.round(Math.random() * (this.hardWords.length -1))]);
            this.bossIteration = false;
            this.bossAlive = true;
        }

        else{
            for(let i = 0; i < this.enemyLength; i++){
                this.enemies.push(new Enemy(this.game, this.bossIteration));
                this.randomIndexes.push(Math.round(Math.random() * (this.normalWords.length -1)));
                this.randomWords.push(this.normalWords[this.randomIndexes[i]]);
                this.enemies[i].index = i;
            }
        }
    }

    draw(i, context){
        //drawing enemies
        this.enemies[i].update();
        this.enemies[i].draw(context);
        this.enemies[i].alive = true;
        let x = this.enemies[i].x;
        let y = this.enemies[i].y;
        context.font = 'bold 20px Arial';
        this.textWidth = context.measureText(this.randomWords[i]).width;
        let letterX = x - this.textWidth / 2 + this.enemies[i].absoluteWidth / 2;

        //drawing words
        if(this.game.targetIndex != i){
            context.fillStyle = 'white';
            context.fillText(this.randomWords[i], letterX, y);

            if(!this.enemies[i].targetable){
                context.strokeStyle = 'red';
                context.lineWidth = 5;
                context.beginPath();
                context.moveTo(letterX, y - 6);
                context.lineTo(letterX + this.textWidth, y - 6);
                context.stroke();
            }
        }
        
        else{
            context.fillStyle = 'yellow';
            context.fillText(this.randomWords[i], letterX, y);
            context.fillText(this.randomWords[i], 5, 75);
        }
    }

    collision(i){
        switch(this.enemies[i].enemyType){
            case 'ship': break;
            case 'monster': if(this.enemies[i].y > this.game.player.y - this.game.player.width) this.game.gameOver = true; break;
            case 'asteroid': if(this.enemies[i].y > this.game.height) this.game.gameOver = true; break;
            case 'boss': break;
        }
    }

    run(context){
        
        if(this.bossAlive){    
            for(let i = 0; i < this.spawnedEnemy; i++){
                this.draw(i, context);
                //detecting collision
                this.collision(i);
            }    
        }

        else 
            for(let i = 0; i < this.spawnedEnemy; i++){
                this.draw(i, context);
            //detecting collision
                this.collision(i);
            }

            this.counter++;
            if(this.counter == Math.round(60 / this.spawnSpeed) && this.spawnedEnemy < this.randomWords.length) {
                this.spawnedEnemy++;
                this.counter = 0;
            }
    }
}

class Game{
    constructor(canvas){
        this.canvas = canvas;
        this.width = canvas.width;
        this.height = canvas.height;
        this.key;
        this.projectiles = [];
        this.numberOfEnemies;
        this.wrongInput = 0;
        this.totalInput = 0;
        this.score = 0;
        this.accuracy = 0;
        this.gameOver = false;
        this.targetIndex = undefined;
        this.waveNumber = 1;
        this.startWave = true;
        this.startWaveTime = 0;
        this.enemyLength = 4;
        this.enemyAttack = [];
        this.counter = 0;
        this.targetType;
        this.startGame = false;
        this.explosion = [];
        this.projectileExplosion = [];
        this.timeOutCounter = 0;
        this.seconds = 1.3;
        this.outburst;
        this.outburstCounter = 0;
        this.bossDefeated = false;
        this.ulti = false;
        this.bossExplosion = false;

        //initializing player object
        this.player = new Player(this);
        
        //initializing wave object
        this.wave = new Wave(this);
        
        //initializing keys for every keydown event then firing a projectile
        window.addEventListener('keydown', event => {
            this.key = event.key;

            //checking for total input
            this.totalInput += 1;
           
            //attacking
            if(this.targetIndex == undefined){
                //attacking projectiles
                if(" " == this.key) {
                    if(this.enemyAttack.length != 0) {
                        this.enemyAttackTarget = this.enemyAttack[0];
                        this.targetType = 'projectile';
                        this.projectiles.push(new Projectile(this));
                        this.enemyAttack.splice(0, 1);
                        this.key = '';
                        this.enemyAttackTarget = undefined;
                    }
                }
            
                //attacking enemies
                for(let i = 0; i < this.wave.enemies.length; i++){
                    //checking for correct letters
                    if(this.wave.randomWords[i].charAt(0).toLowerCase() == this.key.toLowerCase()) 
                        if(this.wave.enemies[i].alive && this.wave.enemies[i].targetable){
                            this.targetType = 'enemy';
                            this.targetIndex = i;
                            break;
                        }
                }
            }
                
            //checking for correct letters
            if(this.wave.randomWords[this.targetIndex] != undefined)
            if(this.wave.randomWords[this.targetIndex].charAt(0).toLowerCase() == this.key.toLowerCase()){
                this.projectiles.push(new Projectile(this));
                this.wave.randomWords[this.targetIndex] = this.destroyLetter(this.wave.randomWords[this.targetIndex]);
                this.score += 1;
                        
                if(this.wave.randomWords[this.targetIndex] == ''){
                    if(this.wave.enemies[this.targetIndex].enemyType == 'boss') {
                        this.explosionType = 'boss';
                        this.bossDefeated = true;
                        this.bossExplosion = true;
                        this.outburst = new Outburst(this, this.wave.enemies[this.targetIndex]);
                    }
                    this.explosion.push(new Explosion(this.wave.enemies[this.targetIndex]));
                    this.wave.randomIndexes.splice(this.targetIndex, 1);
                    this.wave.wordWidth.splice(this.targetIndex, 1);
                    this.wave.randomWords.splice(this.targetIndex, 1);
                    this.wave.enemies.splice(this.targetIndex, 1);
                    this.targetIndex = undefined;
                    this.wave.spawnedEnemy--;
                }
            }
        });
    }

    updateInfo(score, accuracy, wave){
        let playerScore = document.getElementById('score');
        let playerAccuracy = document.getElementById('accuracy');
        let playerWave = document.getElementById('wave');

        playerScore.innerText = 'Score: ' + JSON.stringify(score);
        playerAccuracy.innerText = 'Accuracy: ' + JSON.stringify(accuracy) + '%';
        playerWave.innerText = 'Wave: ' + JSON.stringify(wave);
    }

    timeOut(counter, seconds){
        return counter / 60 > seconds;
    }

    destroyLetter(targetWord){
        let newWord = '';
        if(this.targetWord != ''){
            for(let i = 1; i < targetWord.length; i++){
                newWord +=  targetWord.charAt(i);
            }
            return newWord;
        }
    }

    render(context){
        if(this.bossDefeated){
            this.outburstCounter++;
            if(!this.timeOut(this.outburstCounter, 0.5)) this.outburst.draw(context);
            else {
                this.bossDefeated = false; 
                this.outburstCounter = 0;
                this.outburst = undefined;
                this.ulti = false;
            }
        }

        if(this.outburst != undefined)
            if(!this.timeOut(this.timeOutCounter, 0.03))
                this.outburst.draw(context);
        if(this.wave.enemies.length == 0 && this.enemyAttack.length == 0) {
            this.timeOutCounter++;
            //adding a wave if the previous enemies are cleared
            if(this.timeOut(this.timeOutCounter, this.seconds)) {
                this.speedDifficulty += 0.1;
                this.waveNumber++;
                this.enemyLength++;
                this.projectiles = [];
                this.startWave = true;
                this.wave = new Wave(this, this.enemyLength);
                this.timeOutCounter = 0;
            }
        }
        
        if(this.totalInput == 0) this.accuracy = 0;
        else this.accuracy = Math.round((this.score / this.totalInput) * 100);
        this.updateInfo(this.score, this.accuracy, this.waveNumber);
        
        if(this.startWave){
            this.renderWaveNumber(context);
            this.startWaveTime++;
            if(this.waveNumber % 3 == 0){
                if(this.startWaveTime == 180 * 2){
                    this.startWave = false;
                    this.startWaveTime = 0;
                }
            }
            else{
                if(this.startWaveTime == 180){
                    this.startWave = false;
                    this.startWaveTime = 0;
                }
            }
        }

        else{            
            //updating accuracy
            if(this.score >= 1){
                this.accuracy = Math.floor(this.score / this.totalInput * 100);
            }
            //player
            this.player.draw(context);
            this.player.update();

            //Wave
            this.wave.run(context);

            //explosion
            if(this.explosion.length != 0){
                for(let i = 0; i < this.explosion.length; i++){
                    //drawing and updating the frames of the explosion sprite
                    this.explosion[i].draw(context);
                    this.explosion[i].update();

                    //removing the explosion if it reached it last frame
                    switch(this.explosion[i].targetEnemy.enemyType){
                        case 'ship': 
                            if(this.explosion[i].frameX == 4 && this.explosion[i].counter > 10) this.explosion.splice(i, 1);
                            break;
                        case 'asteroid': 
                            if(this.explosion[i].frameX == 7 && this.explosion[i].counter > 10) this.explosion.splice(i, 1);
                            break;
                        case 'monster': 
                            if(this.explosion[i].frameX == 6 && this.explosion[i].counter > 10) this.explosion.splice(i, 1);
                            break;
                        case 'boss': 
                            if(this.explosion[i].frameX == 11 && this.explosion[i].counter > 10) this.explosion.splice(i, 1);
                            break;
                    }
                }
            }
        
            //player projectiles
            for(let i = 0; i < this.projectiles.length; i++){
                if(this.projectiles[i].fired == true){
                    this.projectiles[i].draw(context);
                    this.projectiles[i].update();
                }

                //collision detection
                if(this.projectiles[i].y + this.projectiles[i].absoluteHeight / 2 >= this.projectiles[i].targetEnemy.frontSide ||
                   this.projectiles[i].y + this.projectiles[i].absoluteHeight / 2 <= this.projectiles[i].targetEnemy.backSide ||
                   this.projectiles[i].x + this.projectiles[i].absoluteWidth / 2 <= this.projectiles[i].targetEnemy.leftSide ||
                   this.projectiles[i].x + this.projectiles[i].absoluteWidth / 2 >= this.projectiles[i].targetEnemy.rightSide
                ){}
                else {
                    this.projectileExplosion.push(new ProjectileExplosion(this.projectiles[i]));
                    this.projectiles[i].fired = false;
                    this.projectiles.splice(i, 1);
                }
            }

            for(let i = 0; i < this.projectileExplosion.length; i++){
                this.projectileExplosion[i].update();
                this.projectileExplosion[i].draw(context);

                if(this.projectileExplosion[i].frameX == 20 && this.projectileExplosion[i].counter == 3) 
                    this.projectileExplosion[i].splice(i, 1);
            }

            //updating enemy projectiles
            for(let i = 0; i < this.enemyAttack.length; i++) {
                if(this.enemyAttack[i].y >= this.player.y) 
                    if(this.enemyAttack[i].x + this.enemyAttack[i].width > this.player.x && this.enemyAttack[i].x < this.player.x + this.player.width){
                        this.gameOver = true;
                    }
                       
                if(!this.ulti){
                    this.enemyAttack[i].draw(context);
                    this.enemyAttack[i].update(context);
                }
                else this.enemyAttack[i].draw(context);
            
            }
        }
    }

    renderWaveNumber(context){
        this.startWaveTime++;
        if(this.waveNumber % 3 != 0){
            let waveText = 'Wave '+JSON.stringify(this.waveNumber);
            context.fillStyle = 'white';
            context.font = '50px pixel';
            var textMetrics = context.measureText(waveText).width;
            context.fillText(waveText, this.width / 2 - textMetrics / 2, this.height / 2);
        }
        else{
            let waveText = 'Wave '+JSON.stringify(this.waveNumber);
            context.fillStyle = 'white';
            context.font = '50px pixel';
            var textMetrics = context.measureText(waveText).width;
            context.fillText(waveText, this.width / 2 - textMetrics / 2, this.height / 2 - 70);

            let text1 = 'DANGER!!!';
            context.fillStyle = 'red';
            context.font = '50px pixel';
            textMetrics = context.measureText(text1).width;
            context.fillText(text1, this.width / 2 - textMetrics / 2, this.height / 2);

            let text2 = 'BOSS WAVE';
            context.fillStyle = 'red';
            context.font = '50px pixel';
            textMetrics = context.measureText(text2).width;
            context.fillText(text2, this.width / 2 - textMetrics / 2, this.height / 2 + 50);
        }
    }
}

class GameOverScreen{
    constructor(canvas, game, leaderboards){
        this.game = game;
        this.width = canvas.width;
        this.height = canvas.height;
        this.gameOverText = 'GAME OVER!';
        this.playerScore = JSON.stringify(this.game.score);
        this.playerAccuracy = JSON.stringify(this.game.accuracy);
        this.playerName = undefined;
        this.playerInfo = undefined;
        this.front = true;

        this.input = document.getElementById('textInput');
        this.enterButton = document.getElementById('enterButton');
        this.playAgainButton = document.getElementById('playAgainButton');

        this.enterButton.addEventListener('click', event => {
            this.playerName = this.input.value;

            if(this.playerInfo == undefined){
                this.playerInfo = 'Name:'+this.playerName+' Score:'+this.playerScore+'\n';
                localStorage.setItem(this.playerName, JSON.stringify(this.playerInfo));
                
                //displaying to the leaderboards
                if(leaderboards.text != undefined) leaderboards.display();
            }
        });
    }
    
    render(context){
        this.input.style.visibility = 'visible';
        this.enterButton.style.visibility = 'visible';
        this.playAgainButton.style.visibility = 'visible';
        this.wordWidth = context.measureText(this.gameOverText).width;

        //player score
        context.fillStyle = 'white';
        context.font = '20px pixel';
        context.fillText('SCORE: ' + this.playerScore, this.width * .35, this.height * .25);

        //player accuracy
        context.fillText('ACCURACY: ' + this.playerAccuracy + '%', this.width * .35, this.height * .25 + 30);

        //wave number
        context.fillText('WAVE: ' + this.game.waveNumber, this.width * 0.35, this.height * 0.25 + 60);

        //player name
        context.fillText('NAME: ' + this.playerName, this.width * 0.35, this.height * 0.25 + 90);
        
        //game over text
        context.font = '80px pixel';
        context.fillText(this.gameOverText, this.width/2 - this.wordWidth/2, this.height/2);
    }
}

class Leaderboards{
    constructor(){
        this.width = window.innerWidth / 5;
        this.height = window.innerHeight;
        this.leaderboards = document.getElementById('leaderboards');
        this.list = document.getElementById('list');
        this.clearButton = document.getElementById('clearButton');
        this.enterButton = document.getElementById('enterButton');
        this.title = document.getElementById('toptitle');
        this.header = document.getElementById('topcon');
        this.library = [];
        this.text;

        //setting the dimensions of leaderboards element
        this.leaderboards.style.width = JSON.stringify(this.width)+'px';
        this.leaderboards.style.height = JSON.stringify(this.height)+'px';

        //getting the height of title
        let stringHeight= '';
        let counter = 0;
        while(window.getComputedStyle(this.title).height.charAt(counter) != 'p'){
            stringHeight += window.getComputedStyle(this.title).height.charAt(counter);
            counter++;
        }
        let titleHeight = Number(stringHeight);

        //getting header height
        stringHeight = '';
        counter = 0;
        while(window.getComputedStyle(this.header).height.charAt(counter) != 'p'){
            stringHeight += window.getComputedStyle(this.header).height.charAt(counter);
            counter++;
        }
        let headerHeight = Number(stringHeight);

        //getting leaderboard height
        counter = 0;
        stringHeight = '';
        while(this.leaderboards.style.height.charAt(counter) != 'p'){
            stringHeight += this.leaderboards.style.height.charAt(counter);
            counter++; 
        }
        let leaderboardHeight = Number(stringHeight);

        this.list.style.height = JSON.stringify(leaderboardHeight - titleHeight - headerHeight - 23)+'px';
    }

    display(){
        this.list.innerText = '';    
        this.text = '';
        for(let i = 0; i < localStorage.length; i++) {
            this.text += JSON.parse(localStorage.getItem(localStorage.key(i)));
        }
        this.sort();
    }

    sort(){
        if(this.text != '') this.arrayText = this.text.split('\n');
        var score = [];

        //getting the score for each player
        if(this.arrayText != undefined)
        for(let i = 0; i < this.arrayText.length; i++){
        let stringScore = '';
        var checkpoint = 0;
            for(let j = 0; j < this.arrayText[i].length; j++){
                if(this.arrayText[i].charAt(j) == ':'){
                    if(checkpoint == 1 && this.arrayText[i].charAt(j) == ':'){
                        for(let k = j+1; k < this.arrayText[i].length; k++) 
                            stringScore += this.arrayText[i].charAt(k);
                        
                        score.push(Number(stringScore));
                        continue;
                    }
                    checkpoint++;
                }
            }
        }

        //sorting arrayText
        if(score != undefined){
            for(let i = 0; i < score.length; i++){
                for(let j = 0; j < score.length; j++){
                    if(score[j] < score[j+1]){
                        const temp1 = score[j+1];
                        score[j+1] = score[j];
                        score[j] = temp1;

                        const temp2 = this.arrayText[j+1];
                        this.arrayText[j+1] = this.arrayText[j];
                        this.arrayText[j] = temp2;
                    }
                }
            }
        }
        
        if(this.arrayText != undefined){
            //reassigning arrayText to the text
            this.text = '';
            for(let i = 0; i < this.arrayText.length - 1; i++) this.text += String(i+1)+". "+this.arrayText[i]+'\n\n';
            if(this.text != '') this.list.innerText = this.text;
        }
    }
}

class StartGameScreen{
    constructor(game){
        this.width = game.width;
        this.height = game.height;
        this.text = "EARTH DEFENSE";
    }
    
    render(context){
        context.fillStyle = 'white';
        context.font = '70px pixel';
        let textWidth = context.measureText(this.text).width;
        context.fillText(this.text, this.width/2 - textWidth/2, this.height/2 - 50);
    }
}

class Explosion{
    constructor(targetEnemy){
        this.width = 80 / 5;
        this.height = 16;
        this.targetEnemy = targetEnemy;
        this.absoluteWidth = this.targetEnemy.absoluteWidth;
        this.absoluteHeight = this.targetEnemy.absoluteWidth;
        this.x = this.targetEnemy.x - this.absoluteWidth / 2 + this.targetEnemy.absoluteWidth / 2;
        this.y = this.targetEnemy.y - this.absoluteHeight / 2 + this.targetEnemy.absoluteHeight / 2;
        this.counter = 0;
        this.enemyType = this.targetEnemy.enemyType;
        this.frameX = 0;

        switch(this.targetEnemy.enemyType){
            case 'ship': 
                this.explosion = document.getElementById('explosion'); 
                break;
            case 'asteroid': 
                this.explosion = document.getElementById('asteroid'); 
                this.frameY = this.targetEnemy.frameY;
                break;
            case 'monster': 
                this.explosion = document.getElementById('monster'); 
                this.frameY = this.targetEnemy.frameY;
                break;
            case 'boss': 
                this.explosion = document.getElementById('boss'); 
                this.frameY = this.targetEnemy.frameY;
                break;
        }
    }

    update(){
        switch(this.targetEnemy.enemyType){
            case 'ship': 
                if(this.frameX == 0 && this.counter == 7) {this.frameX = 1; this.counter = 0;} 
                else if(this.frameX == 1 && this.counter == 7) {this.frameX = 2; this.counter = 0;} 
                else if(this.frameX == 2 && this.counter == 7) {this.frameX = 3; this.counter = 0;} 
                else if(this.frameX == 3 && this.counter == 7) {this.frameX = 4; this.counter = 0;}  
                break;

            case 'asteroid': 
                if(this.frameX == 0 && this.counter == 7) {this.frameX = 1; this.counter = 0;} 
                else if(this.frameX == 1 && this.counter == 7) {this.frameX = 2; this.counter = 0;} 
                else if(this.frameX == 2 && this.counter == 7) {this.frameX = 3; this.counter = 0;} 
                else if(this.frameX == 3 && this.counter == 7) {this.frameX = 4; this.counter = 0;}  
                else if(this.frameX == 4 && this.counter == 7) {this.frameX = 5; this.counter = 0;}  
                else if(this.frameX == 5 && this.counter == 7) {this.frameX = 6; this.counter = 0;}  
                else if(this.frameX == 6 && this.counter == 7) {this.frameX = 7; this.counter = 0;}  
                break;

            case 'monster': 
                if(this.frameX == 0 && this.counter == 7) {this.frameX = 1; this.counter = 0;} 
                else if(this.frameX == 1 && this.counter == 7) {this.frameX = 2; this.counter = 0;} 
                else if(this.frameX == 2 && this.counter == 7) {this.frameX = 3; this.counter = 0;} 
                else if(this.frameX == 3 && this.counter == 7) {this.frameX = 4; this.counter = 0;}  
                else if(this.frameX == 4 && this.counter == 7) {this.frameX = 5; this.counter = 0;}  
                else if(this.frameX == 5 && this.counter == 7) {this.frameX = 6; this.counter = 0;}  
                break;

            case 'boss': 
                if(this.frameX == 0 && this.counter == 7) {this.frameX = 1; this.counter = 0;} 
                else if(this.frameX == 1 && this.counter == 7) {this.frameX = 2; this.counter = 0;} 
                else if(this.frameX == 2 && this.counter == 7) {this.frameX = 3; this.counter = 0;} 
                else if(this.frameX == 3 && this.counter == 7) {this.frameX = 4; this.counter = 0;}  
                else if(this.frameX == 4 && this.counter == 7) {this.frameX = 5; this.counter = 0;}  
                else if(this.frameX == 5 && this.counter == 7) {this.frameX = 6; this.counter = 0;}  
                else if(this.frameX == 6 && this.counter == 7) {this.frameX = 7; this.counter = 0;}  
                else if(this.frameX == 7 && this.counter == 7) {this.frameX = 8; this.counter = 0;}  
                else if(this.frameX == 8 && this.counter == 7) {this.frameX = 9; this.counter = 0;}  
                else if(this.frameX == 9 && this.counter == 7) {this.frameX = 10; this.counter = 0;}  
                else if(this.frameX == 10 && this.counter == 7) {this.frameX = 11; this.counter = 0;}  
                break;

        }
        this.counter++;
    }
 
    draw(context){
        switch(this.targetEnemy.enemyType){
            case 'ship':
                context.drawImage(this.explosion, this.frameX * this.width, 0, this.width, this.height, this.x, this.y, this.absoluteWidth, this.absoluteHeight);
                break;
            case 'monster': 
                context.drawImage(this.explosion, this.frameX * this.targetEnemy.width, this.targetEnemy.frameY * this.targetEnemy.height, this.targetEnemy.width, this.targetEnemy.height, this.targetEnemy.x, this.targetEnemy.y, this.targetEnemy.absoluteWidth, this.targetEnemy.absoluteHeight); 
                break;
            case 'asteroid': 
                context.drawImage(this.explosion, this.frameX * this.targetEnemy.width, this.targetEnemy.frameY * this.targetEnemy.height, this.targetEnemy.width, this.targetEnemy.height, this.targetEnemy.x, this.targetEnemy.y, this.targetEnemy.absoluteWidth, this.targetEnemy.absoluteHeight); 
                break;
            case 'boss':
                context.drawImage(this.explosion, this.frameX * this.targetEnemy.width, this.targetEnemy.frameY * this.targetEnemy.height, this.targetEnemy.width, this.targetEnemy.height, this.targetEnemy.x, this.targetEnemy.y, this.targetEnemy.absoluteWidth, this.targetEnemy.absoluteHeight); 
                break;
        }
    }
}

class ProjectileExplosion{
    constructor(projectile){
        this.projectile = projectile;
        this.width = 6302 / 21;
        this.height = 906 / 3;
        this.absoluteWidth = this.width / 10;
        this.absoluteHeight = this.height / 10;
        this.x = this.projectile.x - this.absoluteWidth / 2;
        this.y = this.projectile.y - this.absoluteHeight / 2;
        this.projectile = undefined;
        this.frameX = 0;
        this.frameY = Math.round(Math.random() * 2);
        this.counter = 0;
        this.counterX = 0;
        this.image = document.getElementById('projectile-explosion');
    }

    update(){
        //this will animate the explosion, 1 frame per 2 iteration of the animation function
        if(this.frameX == this.counterX && this.counter == 1){
            this.frameX++;
            this.counterX++;
            this.counter = 0;
        }

        this.counter++;
    }

    draw(context){
        context.drawImage(this.image, this.frameX * this.width, this.frameY * this.height, 
                          this.width, this.height, this.x, this.y, this.absoluteHeight, this.absoluteWidth
        );

        
    }
}

class PauseScreen{
    constructor(canvas){
        this.canvas = canvas;
        this.canvasWidth = this.canvas.width;
        this.canvasHeight = this.canvas.height;
        this.text = 'Paused';
    }

    render(context){
        context.font = '80px pixel';
        const textWidth = context.measureText(this.text).width;
        context.fillText(this.text, this.canvasWidth / 2 - textWidth / 2, this.canvasHeight / 2);
    }
}

class SummoningTube{
    constructor(game, boss){
        this.game = game;
        this.y = Math.random() * (this.game.height / 2);
        this.boss = boss;
        this.radius = 20;
        this.width;
        do this.x = Math.random() * this.game.width;
        while(this.x < 50 || this.x > this.game.width - 50  || this.x == undefined); 

        this.enemy = new Enemy(this.game, this.game.wave.bossIteration);
        this.width = this.enemy.absoluteWidth;
        this.enemy.x = this.x - this.enemy.absoluteWidth / 2;
        this.enemy.y = this.y - this.enemy.absoluteHeight / 2;
        this.enemy.spawn = true;
        this.index = Math.round(Math.random() * (this.game.wave.normalWords.length - 1));
        this.game.wave.enemies.push(this.enemy);
        this.game.wave.randomWords.push(this.game.wave.normalWords[this.index]);
    }
    
    energyBall(context){
        this.orb(context, 'blue', this.boss.x + this.boss.width / 2, this.boss.y + this.boss.height, 25, 0, Math.PI * 2);
        this.orb(context, 'skyblue', this.boss.x + this.boss.width / 2, this.boss.y + this.boss.height, 25 * 0.9, 0, Math.PI * 2);
        this.orb(context, 'white', this.boss.x + this.boss.width / 2, this.boss.y + this.boss.height, 25 * 0.7, 0, Math.PI * 2);
    }

    draw(context){
        this.laser(context, 'skyblue', 20, this.x, this.y, this.boss.x + this.boss.width / 2, this.boss.y + this.boss.height);
        this.orb(context, 'blue', this.x, this.y, this.width * 1.3, 0, Math.PI * 2);
        this.orb(context, 'skyblue', this.x, this.y, this.width * 1.2, 0, Math.PI * 2);
        this.orb(context, 'white', this.x, this.y, this.width, 0, Math.PI * 2);
        this.laser(context, 'white', 13, this.x, this.y, this.boss.x + this.boss.width / 2, this.boss.y + this.boss.height);
    }

    laser(context, color, width, startX, startY, endX, endY){
        context.beginPath();
        context.strokeStyle = color;
        context.lineWidth = width;
        context.moveTo(startX, startY);
        context.lineTo(endX, endY);
        context.stroke();
    }

    orb(context, color, x, y, radius, start, end){
        context.beginPath();
        context.fillStyle = color;
        context.arc(x, y, radius, start, end);
        context.fill();
    }
}

class Outburst{
    constructor(game, boss){
        this.game = game;
        this.boss = boss;
        this.x = this.boss.x + this.boss.width / 2;
        this.y = this.boss.y + this.boss.height;
        this.radius = 25;
        this.summonLength = Math.round(this.game.enemyLength);
        this.summons = [];
        this.summonX = [];
        this.summonY = [];
        this.game.ulti = true;

        //creating summon and creating coordinates
        for(let i = 0; i < this.summonLength; i++){
            this.summons.push(new EnemyProjectile(this.game, boss));
            this.summonX.push(Math.random() * this.game.width);
            this.summonY.push(Math.random() * this.game.height / 2);
        }

        //assigning the coordinates for each summon
        for(let i = 0; i < this.summonLength; i++){
            this.summons[i].x = this.summonX[i];
            this.summons[i].y = this.summonY[i];
        }

        //assigning the summon to the game
        for(let i = 0; i < this.summonLength; i++){
            this.summons[i].x -= this.summons[i].absoluteWidth / 2;
            this.summons[i].y -= this.summons[i].height / 2;
            this.game.enemyAttack.push(this.summons[i]);
        }
    }
    
    draw(context){        
        this.energyBall(context);

        for(let i = 0; i < this.summonLength; i++){
            this.laser(context, this.x, this.y, this.summonX[i], this.summonY[i]);
            this.summonBall(context, this.summonX[i], this.summonY[i]);
        }
    }

    summonBall(context, x, y){
        this.orb(context, 'blue', x, y, 15, 0, Math.PI * 2);
        this.orb(context, 'skyblue', x, y, 15 * 0.9, 0, Math.PI * 2);
        this.orb(context, 'white', x, y, 15 * 0.7, 0, Math.PI * 2);
    }

    energyBall(context){
        this.orb(context, 'blue', this.x, this.y, 25, 0, Math.PI * 2);
        this.orb(context, 'skyblue', this.x, this.y, 25 * 0.9, 0, Math.PI * 2);
        this.orb(context, 'white', this.x, this.y, 25 * 0.7, 0, Math.PI * 2);
    }

    laser(context, startX, startY, endX, endY){
        this.line(context, 'blue', 12, startX, startY, endX, endY);
        this.line(context, 'skyblue', 10, startX, startY, endX, endY);
        this.line(context, 'white', 8,  startX, startY, endX, endY);
    }

    line(context, color, width, startX, startY, endX, endY){
        context.beginPath();
        context.strokeStyle = color;
        context.lineWidth = width;
        context.moveTo(startX, startY);
        context.lineTo(endX, endY);
        context.stroke();
    }

    orb(context, color, x, y, radius, start, end){
        context.beginPath();
        context.fillStyle = color;
        context.arc(x, y, radius, start, end);
        context.fill();
    }
}

class colorAlternate{
    constructor(canvas){
        const width = window.innerWidth;
        const height = window.innerHeight;
        this.hd1 = document.getElementById('Hd');
        this.hd2 = document.getElementById('Hd2');
        this.lowerTitle = document.getElementById('lowerTitle');
        this.topTitle = document.getElementById('toptitle');
        this.counter = 0;
        this.duration = 60;

        //font size
        this.hd1.style.fontSize = String(width * 0.04)+'px';
        this.hd2.style.fontSize = String(width * 0.04)+'px';
        this.lowerTitle.style.fontSize = String(width * 0.01225)+'px';

        //coordinates
        this.hd1.style.top = String(height * 0.02)+'px';
        this.hd2.style.top = String(height * 0.10)+'px';
        this.lowerTitle.style.top = String(height * 0.185)+'px';
        this.hd1.style.left = String(width * 0.045)+'px';
        this.hd2.style.left = String(width * 0.015)+'px';
    }

    alternate(context){
        if(this.counter == this.duration){
            let r = String(Math.round(Math.random() * 360));
            let g = String(Math.round(Math.random() * 360));
            let b = String(Math.round(Math.random() * 360));
            this.hd1.style.color = 'rgb('+r+', '+g+', '+b+')';
            this.hd2.style.color = 'rgb('+r+', '+g+', '+b+')';

            r = String(Math.round(Math.random() * 240));
            g = String(Math.round(Math.random() * 240));
            b = String(Math.round(Math.random() * 240));
            this.lowerTitle.style.color = 'rgb('+r+', '+g+', '+b+')';

            r = String(Math.round(Math.random() * 240));
            g = String(Math.round(Math.random() * 240));
            b = String(Math.round(Math.random() * 240));
            this.topTitle.style.color = 'rgb('+r+', '+g+', '+b+')';

            this.counter = 0;        
        }

        this.counter++;
    }
}

class Particle{
    constructor(x, y){
        this.radius = 5;
        this.x = x;
        this.y = y;
        this.display = true;
        this.color = String(Math.round(Math.random() * 360));
        this.speedX = Math.random() * 1 - 0.5;
        this.speedY = Math.random() * 1 - 0.5;
    }
    
    update(){
        this.x += this.speedX;
        this.y += this.speedY;
        this.radius -= 0.05;

        if(this.radius < 1) this.display = false;
    }

    draw(context){
        context.fillStyle = "hsl("+this.color+", 100%, 50%)";
        context.beginPath();
        context.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        context.fill();
    }
}

window.addEventListener('load', function(event){
    const canvas = document.getElementById('canvas1');
    const context = canvas.getContext('2d');
    const startGameButton = document.getElementById('startGameButton');
    
    canvas.width = window.innerWidth * 0.6;
    canvas.height = window.innerHeight;
    canvas.style.left = JSON.stringify(window.innerWidth / 2 - canvas.width / 2)+'px';

    var shakeDuration = 70;
    var counter = 0;
    var magnitude = 5;

    var mainGame = new Game(canvas);
    var gameOverScreen;

    const alternate = new colorAlternate(canvas);
    var particles = [];
    var particleCounter = 0;
    
    var startGameScreen = new StartGameScreen(mainGame);

    //leaderboards
    const leaderboards = new Leaderboards(canvas);
    leaderboards.display();
    
    //pause button state
    var pauseButton = document.getElementById('pauseButton');
    var resumeButton = document.getElementById('resumeButton');
    var paused = false;

    //instantiating pause object
    var pause = new PauseScreen(canvas);

    function shakeScreen() {
        if(counter % 10) magnitude += 1;

        if (counter < shakeDuration) {
            const offsetX = Math.random() * magnitude - magnitude / 2;
            const offsetY = Math.random() * magnitude - magnitude / 2;

            // Save the context state
            context.save();

            // Translate the context to create a shake effect
            context.translate(offsetX, offsetY);
            
            // Redraw your game elements here
            mainGame.render(context);
            
            // Restore the context state
            context.restore();

            counter++; // Increment counter
        } else {
            magnitude = 5;
            isShaking = false; // Reset shaking state
            counter = 0; // Reset counter
            mainGame.bossExplosion = false; // Reset explosion state
        }
    }

    function animate(){
        alternate.alternate(context);
        particleCounter++;

        context.clearRect(0, 0, canvas.width, canvas.height);

        window.addEventListener('mousemove', function(e){
            if(particleCounter >= 1){
                particles.push(new Particle(e.x - canvas.width * 0.33, e.y));
                particleCounter = 0;
            }
        });

        for(let i = 0; i < particles.length; i++){
            if(particles[i].display){
                particles[i].draw(context);
                particles[i].update();
            }
            else particles.splice(i, 1);
        }

        if(mainGame.gameOver != true && mainGame.startGame == true) {
            pauseButton.addEventListener("click", function(){
                paused = true;
                pauseButton.style.visibility = "hidden";
                resumeButton.style.visibility = "visible";
            });
            resumeButton.addEventListener('click', function(){
                paused = false;
                
                resumeButton.style.visibility = "hidden";
                pauseButton.style.visibility = "visible";
            });

            if(paused) pause.render(context);
            else {
                if (mainGame.bossExplosion) {
                    isShaking = true; // Start shaking
                    shakeScreen(); // Call shakeScreen
                }

                else mainGame.render(context);
            }
        }

        else if(mainGame.startGame == false){
            startGameButton.style.visibility = "visible";
            startGameScreen.render(context);
            resumeButton.style.visibility = "hidden";
                pauseButton.style.visibility = "hidden";

            startGameButton.addEventListener('click', function(){
                startGameButton.style.visibility = "hidden";
                mainGame.startGame = true;
                resumeButton.style.visibility = "hidden";
                pauseButton.style.visibility = "visible";
            });
        }

        else {
            if(gameOverScreen == undefined) gameOverScreen = new GameOverScreen(canvas, mainGame, leaderboards);
            if(gameOverScreen.front == true) gameOverScreen.render(context);

            gameOverScreen.playAgainButton.addEventListener('click', function() {
                if(gameOverScreen != undefined){
                    gameOverScreen.input.style.visibility = 'hidden';
                    gameOverScreen.enterButton.style.visibility = 'hidden';
                    gameOverScreen.playAgainButton.style.visibility = 'hidden';
                    gameOverScreen.input.value = "";
                    gameOverScreen.front = false;
                    gameOverScreen = undefined;
                }
                mainGame = new Game(canvas);
                mainGame.startGame = true;
            });
        }
        requestAnimationFrame(animate);
    }
    animate();
});