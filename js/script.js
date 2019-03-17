// ---------------- SPRITES ----------------

var objPlayerSprite = document.getElementById("player");
var objEnemy1Sprite = document.getElementById("enemy1");
var objEnemy2Sprite = document.getElementById("enemy2");
var objEnemy3Sprite = document.getElementById("enemy3");
var objDefaultProjectileSprite = document.getElementById("projectile_default");

// ---------------- END SPRITES ----------------

// ---------------- VARIABLES ----------------

//The level's width
var intLevelWidth = 1500;
//The level's height
var intLevelHeight = 500;
//Canvas
var objCanvas = document.getElementById("game");
//Canvas size
objCanvas.setAttribute("width", intLevelWidth);
objCanvas.setAttribute("height", intLevelHeight);
//Canvas border
objCanvas.style.border = "1px solid black";
//Context
var ctx = objCanvas.getContext("2d");
//Array containing the enemies
var arr_enemyObjects = [];
//Array containing the projectiles
var arr_activeProjectiles = [];
//Player's movement speed
var intPlayerMovementSpeed = 6;
//Player coordinates
var intPlayerx = 0;
var intPlayery = objCanvas.height / 2 + objPlayerSprite.height / 2;
//Variable for the player movement
var intPlayerMovementIncrement = 0;
//The number of frames between each shot
var intFireRate = 15;
//Index used for the shots
var intFramesLeftBeforeFiring = intFireRate;

// ---------------- END VARIABLES ----------------

// ---------------- OBJECTS ----------------

//Enemies appearing on the level
function Enemy(objSprite, intBaseYPosition, intHealthPoints, intMovementSpeed)
{
    this.objSprite = objSprite;
    this.x = intLevelWidth;
    this.y = intBaseYPosition;
    this.intHealthPoints = intHealthPoints;
    this.intMovementSpeed = intMovementSpeed;
    
    //Enemy's horizontal movement
    this.HorizontalMovement = function()
    {
        this.x -= this.intMovementSpeed;
    };
}

//Projectiles fired by the player
function Projectile(objSprite, intBaseYPosition, intMovementSpeed, intDamage)
{
    this.objSprite = objSprite;
    //TODO : set x to front of ship
    this.x = 10;
    this.y = intBaseYPosition;
    this.intMovementSpeed = intMovementSpeed;
    this.intDamage = intDamage;
    
    //Projectile's horizontal movement
    this.HorizontalMovement = function()
    {
        this.x += this.intMovementSpeed;
    };
}

// ---------------- END OBJECTS ----------------

// ---------------- FUNCTIONS ----------------

//Sets the player movement when a key is pressed
function PlayerMovement(e)
{				
    var key_code = e.keyCode;
    switch(key_code)
    {
        case 38: //Up
            intPlayerMovementIncrement = -intPlayerMovementSpeed;
            break;
        case 40: //Down
            intPlayerMovementIncrement = intPlayerMovementSpeed;
            break;			
        default:
            intPlayerMovementIncrement = 0;
    }
}

//Moves the player
function PlayerMovementExecute()
{
    intPlayery += intPlayerMovementIncrement;
    //If the player is out of the screen, move it
    if(intPlayery < 0)
    {
        intPlayery = 0;
    }
    if(intPlayery + objPlayerSprite.height > intLevelHeight)
    {
        intPlayery = intLevelHeight - objPlayerSprite.height;
    }
}

//Key release event
function StopPlayerMovement()
{
    intPlayerMovementIncrement = 0;
}

//Draws every element from the array
function Draw()
{
    //Clear everything before drawing
    ctx.clearRect(0, 0, objCanvas.width, objCanvas.height);
    
    //Handle and draw enemies
    arr_enemyObjects.forEach(function(element, index)
    {
        //Collision checking with projectiles
        arr_activeProjectiles.forEach(function(projectile, projectileIndex)
        {
            if (element.x < projectile.x + projectile.objSprite.width && element.x + element.objSprite.width > projectile.x && element.y < projectile.y + projectile.objSprite.height && element.y + element.objSprite.height > projectile.y)
            {
                arr_activeProjectiles.splice(projectileIndex, 1);
                element.intHealthPoints -= projectile.intDamage;
            }
        });
        
        //If the enemy has no health left or went to the end of the level, we remove it
        if(element.intHealthPoints < 1 || element.x < -element.objSprite.width)
        {
            arr_enemyObjects.splice(index, 1);
        }
        
        //Before drawing the object, we move it
        element.HorizontalMovement();
        //Draw the object
        ctx.drawImage(element.objSprite, element.x, element.y);
    });
    
    //Draw projectiles
    arr_activeProjectiles.forEach(function(element, index)
    {
        //Before drawing the object, we move it
        element.HorizontalMovement();
        //Delete the projectile if it reached the end of the level
        if(element.x > element.objSprite.width + intLevelWidth)
        {
            arr_activeProjectiles.splice(index, 1);
        }
        //Draw the object
        ctx.drawImage(element.objSprite, element.x, element.y);
    });
    
    //Moves the player
    PlayerMovementExecute();
    
    //Creates a projectile if the timer is equal to 0
    intFramesLeftBeforeFiring--;
    if(intFramesLeftBeforeFiring == 0)
    {
        CreateNewProjectile(intPlayery + 0.5 * objPlayerSprite.height - 0.5 * objDefaultProjectileSprite.height);
        intFramesLeftBeforeFiring = intFireRate;
    }
    
    //Draw player
    ctx.drawImage(objPlayerSprite, intPlayerx, intPlayery);
}

//Sleep function
function sleep(ms)
{
    return new Promise(resolve => setTimeout(resolve, ms));
}

//Sends a random wave of enemies
async function CreateEnemyWave()
{
    //Generate a random number
    let intRandomWave = Math.floor(Math.random() * 5);
    
    //Generates a wave depending on the result
    if(document.hasFocus())
    {
        switch(intRandomWave)
        {
            case 0: //Three basic enemies in a vertical line
                CreateNewBasicEnemy(0);
                CreateNewBasicEnemy((intLevelHeight - objEnemy1Sprite.height) / 2);
                CreateNewBasicEnemy(intLevelHeight - objEnemy1Sprite.height);
                await sleep(500);
                break;
            case 1: //Three basic enemies in a \ line
                CreateNewBasicEnemy(0);
                await sleep(900);
                CreateNewBasicEnemy((intLevelHeight - objEnemy1Sprite.height) / 2);
                await sleep(900);
                CreateNewBasicEnemy(intLevelHeight - objEnemy1Sprite.height);
                await sleep(1000);
                break;
            case 2: //Three basic enemies in a / line
                CreateNewBasicEnemy(intLevelHeight - objEnemy1Sprite.height);
                await sleep(900);
                CreateNewBasicEnemy((intLevelHeight - objEnemy1Sprite.height) / 2);
                await sleep(900);
                CreateNewBasicEnemy(0);
                await sleep(1000);
                break;
            case 3: //Two basic enemies and one tough enemy in a vertical line
                CreateNewBasicEnemy(0);
                CreateNewToughEnemy((intLevelHeight - objEnemy3Sprite.height) / 2);
                CreateNewBasicEnemy(intLevelHeight - objEnemy1Sprite.height);
                await sleep(1200);
                break;
            case 4: //Five fast enemies in a < position
                CreateNewFastEnemy((intLevelHeight - objEnemy2Sprite.height) / 2);
                await sleep(200);
                CreateNewFastEnemy(intLevelHeight / 4 - objEnemy2Sprite.height / 2);
                CreateNewFastEnemy(intLevelHeight * 0.75 - objEnemy2Sprite.height / 2);
                await sleep(200);
                CreateNewFastEnemy(0);
                CreateNewFastEnemy(intLevelHeight - objEnemy2Sprite.height);
                await sleep(700);
                break;
        }
    }
    //Wait and call the function again
    await sleep(1000);
    CreateEnemyWave();
}

//Creates a default enemy
function CreateNewBasicEnemy(intBaseYPosition)
{
    let enemy = new Enemy(objEnemy1Sprite, intBaseYPosition, 2, 3);
    //Add it to the game objects array
    arr_enemyObjects.push(enemy);
}

//Creates an enemy that moves faster
function CreateNewFastEnemy(intBaseYPosition)
{
    let enemy = new Enemy(objEnemy2Sprite, intBaseYPosition, 1, 5);
    //Add it to the game objects array
    arr_enemyObjects.push(enemy);
}

//Creates a slower enemy that is much harder to kill
function CreateNewToughEnemy(intBaseYPosition)
{
    let enemy = new Enemy(objEnemy3Sprite, intBaseYPosition, 8, 2);
    //Add it to the game objects array
    arr_enemyObjects.push(enemy);
}

//Creates a default projectile
function CreateNewProjectile(intBaseYPosition)
{
    let projectile = new Projectile(objDefaultProjectileSprite, intBaseYPosition, 12, 1);
    //Add it to the game objects array
    arr_activeProjectiles.push(projectile);
}

// ---------------- END FUNCTIONS ----------------

// ---------------- PROGRAM RUN ----------------

//Call Draw function
var timerDraw = setInterval(Draw, 17);

//Send the first wave
CreateEnemyWave();