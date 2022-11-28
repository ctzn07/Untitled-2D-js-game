import {Player} from './player.js';
import {MapTile} from './mapTile.js';
import {Vec} from './vector.js';
import {Level} from './level.js';
import {gameObject} from './gameObject.js';


//load event : JavaScript waits for all dependent resources such as stylesheets and images to be fully loaded and available before it runs
window.addEventListener('load', function(){
    const canvas = document.getElementById('canvas1');
    const ctx = canvas.getContext('2d');
    ctx.imageSmoothingEnabled=false;
    canvas.width = 500;
    canvas.height = 500;
    const DrawCollisionDebug = true;

    class Game{
        constructor(width, height){
            this.width = width;
            this.height = height;
            this.level = new Level(this, testlevel, testlevel_collision);
            this.deltaTime = 0;
            this.timeOld = Date.now();
            this.cameraPosition = new Vec(250,250);
            this.worldTileSize = new Vec(32, 32); //should this be square root of 1024(map size)?
            this.worldSize = new Vec(this.level.mapSprite.width, this.level.mapSprite.height);

            //since constructor runs on creation, use it to create all the relevant classes as well
            this.gameObjects = [];  //list of all gameobjects
            this.physicsObjects = []; //list of all objects with collision


            //param list: game, spawn position, spritesheet ref, spritesheet size
            this.player = new Player(this, new Vec(100,100), player, new Vec(4,2));
            //add to gameObjects list
            this.gameObjects.push(this.player);
            
            
            
            //COLLISION DEBUG BOX
            
            
            //JavaScript automatically creates references to all elements with IDs into the global namespace, using it's ID as a variable name, see index.html to see where the player variable comes from
            
        }
        update(deltaTime){
            //all updated math goes here
            //console.log(this.player.physics.penetrationCheck(this.blocker));
            this.cameraPosition = this.cameraPosition.lerp(this.player.worldLocation, 0.05);
            //update deltaTime
            this.deltaTime = (Date.now() - this.timeOld)/1000;
            this.timeOld = Date.now()
            
            //run update() on all gameobjects
            this.gameObjects.forEach(gameObject => {
                gameObject.update(this.deltaTime);
            });

            /*this.gameObjects.forEach(a => {
                this.gameObjects.forEach(b =>{
                    if(a && b)console.log(a.physics.collisionCheck(b));
                })
            });*/

            

        }
        draw(context, cameraPosition){
            this.level.draw(context);
            //run draw() on all gameobjects
            this.gameObjects.forEach(gameObject => {
                if(gameObject){
                    gameObject.draw(context, this.cameraPosition);

                }
            });
        }

        //Converting 2D co-ordinates into 1D index
        //y * width + x

        //Converting 1D index into 2D co-ordinates
        //y = index / width;
        //x = index % width;

        locToIndex(loc){
            //returns 1D index value of world location with accuracy of worldTileSize
            let arrWidth = Math.floor((this.worldSize.x-this.level.topleft.x)/this.worldTileSize.x);
            let thisY = Math.round((loc.y-this.level.topleft.y)/this.worldTileSize.y);
            let thisX = Math.round((loc.x-this.level.topleft.x)/this.worldTileSize.x);
            
            return thisY * arrWidth + thisX;
        }
        indexToLocation(index){
            //returns 2D world coordinate from 1D index value with accuracy of worldTileSize
            let arrWidth = Math.round((this.worldSize.x-this.level.topleft.x)/this.worldTileSize.x);
            
            return new Vec(index%arrWidth, Math.floor(index/arrWidth)).multiply(this.worldTileSize).plus(this.level.topleft);
        }
        getContext(){
            //returns canvas context
            return ctx;
        }
        drawDebug(){
            return DrawCollisionDebug;
        }
        
    }
    //this triggers the creation of new game class, and run constructor with it
    const game = new Game(canvas.width, canvas.height);
    console.log(game);


    function animate(){
        ctx.clearRect(0,0,canvas.width, canvas.height);
        //call update on gameobject
        game.update();
        //call game object to run draw, using ctx as context
        game.draw(ctx);

        requestAnimationFrame(animate);
    }
    animate();
})