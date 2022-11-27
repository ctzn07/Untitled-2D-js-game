import {Player} from './player.js';
import {MapTile} from './mapTile.js';
import {Vec} from './vector.js';
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
            this.deltaTime = 0;
            this.timeOld = Date.now();
            this.cameraPosition = new Vec(250,250);
            this.worldTileSize = new Vec(500, 500); //addGameObject() adjusts this
            this.worldSize = new Vec(1, 1);     //INSERT MAP IMAGE SIZE TO THIS LATER

            //since constructor runs on creation, use it to create all the relevant classes as well
            this.gameObjects = [];  //list of all gameobjects


            //param list: game, spawn position, spritesheet ref, spritesheet size
            this.player = new Player(this, new Vec(100,100), player, new Vec(4,2));
            //add to gameobject list
            this.addGameObject(this.player);
            
            
            //COLLISION DEBUG BOX
            this.blocker = new MapTile(this, new Vec(250, 250), testblock, new Vec(1,1));
            this.addGameObject(this.blocker);

            console.log(this.gameObjects);
            
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
            //run draw() on all gameobjects
            this.gameObjects.forEach(gameObject => {
                if(gameObject){
                    gameObject.draw(context, this.cameraPosition);
                    //debug drawings
                    if(DrawCollisionDebug && gameObject.physics)
                    {gameObject.physics.drawCollision(context, this.cameraPosition)};
                }
            });
        }
        addGameObject(gameObject){

            //this.gameObjects[i] = gameObject;
            this.gameObjects.push(gameObject);

            //adjust gameObjects array object size to smallest used one
            if(gameObject.spriteSize.x < this.worldTileSize.x)this.worldTileSize.x = gameObject.spriteSize.x;
            if(gameObject.spriteSize.y < this.worldTileSize.y)this.worldTileSize.y = gameObject.spriteSize.y;

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
        //testobject.draw(ctx, 0);
        requestAnimationFrame(animate);
    }
    animate();
})