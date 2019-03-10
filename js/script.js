// CONSTANTS

//The level's width
var intLevelWidth = 800;
//Canvas
var objCanvas = document.getElementById("game");
//Canvas size
objCanvas.setAttribute("width", intLevelWidth);
objCanvas.setAttribute("height", 500);
//Canvas border
objCanvas.style.border = "1px solid black";
//Context
var ctx = objCanvas.getContext("2d");
//Array containing the enemies
var arr_enemyObjects = [];
//Array containing the projectiles
var arr_activeProjectiles = [];

// END CONSTANTS

// SPRITES

var objEnemy1Sprite = document.getElementById("enemy1");
var objDefaultProjectileSprite = document.getElementById("projectile_default");

// END SPRITES

// OBJECTS

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

// END OBJECTS

// FUNCTIONS

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
        
        //If the enemy has no health left, we remove it
        if(element.intHealthPoints < 1)
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
        //Draw the object
        ctx.drawImage(element.objSprite, element.x, element.y);
    });
}

//Creates a default enemy
function CreateNewBasicEnemy(intBaseYPosition)
{
    let enemy = new Enemy(objEnemy1Sprite, intBaseYPosition, 1, 2);
    //Add it to the game objects array
    arr_enemyObjects.push(enemy);
}

//Creates a default projectile
function CreateNewProjectile(intBaseYPosition)
{
    let projectile = new Projectile(objDefaultProjectileSprite, intBaseYPosition, 3, 1);
    //Add it to the game objects array
    arr_activeProjectiles.push(projectile);
}

// END FUNCTIONS

// PROGRAM RUN

//Call Draw function
var timerDraw = setInterval(Draw, 17);

//TEST : Creates enemies and projectiles
CreateNewBasicEnemy(50);
CreateNewBasicEnemy(250);
CreateNewBasicEnemy(450);

CreateNewProjectile(260);