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
            // ISSUE: level does not center to itself around 0,0 coordinates, change canvas size to check
            this.deltaTime = 0;
            this.timeOld = Date.now();
            this.cameraPosition = new Vec(0,0);
            this.cellSize = new Vec(128, 128); //size of the cell used for physicsObjects array

            this.worldSize = new Vec(this.level.mapSprite.width, this.level.mapSprite.height);

            //since constructor runs on creation, use it to create all the relevant classes as well
            this.gameObjects = [];  //list of all gameobjects
            this.physicsObjects = [];  //list of all physicsobjects
             /*
            physicsObjects object template
            Object.create({
                subItems: [], 
                add: function(obj){this.subItems.push(obj);}, 
                remove: function(obj){this.subItems.splice(this.subItems.indexOf(obj), 1);}
            });
            */

            //param list: game, spawn position, spritesheet ref, spritesheet size
            this.player = new Player(this, new Vec(-100,0), player, new Vec(4,2));
            //this.blocker = new MapTile(this, new Vec(100,200), testblock, new Vec(1,1));
            this.blocker = new MapTile(this, new Vec(0,0), testblock3, new Vec(1,1));
            //this.blocker = new MapTile(this, new Vec(300,-50), testblock2, new Vec(1,1));
            
        }
        update(deltaTime){
            //all updated math goes here

            //update camera position and speed
            this.cameraPosition = this.cameraPosition.lerp(this.player.worldLocation, 0.05);
            
            //update deltaTime
            this.deltaTime = (Date.now() - this.timeOld)/1000;
            this.timeOld = Date.now()
            
            //run update() on all gameobjects
            this.gameObjects.forEach(gameObject => {
                gameObject.update(this.deltaTime);
            });

            //DRAW PHYSICS OBJECT CELL DEBUG
            this.physicsObjects.forEach((a,b,c) =>{
                this.drawDebugBox(this.indexToLocation(b), this.cellSize, 'gray')
            })

        }
        draw(context, cameraPosition){
            //all graphics draws go here

            //draw level as bottom layer
            this.level.draw(context);

            //run draw() on all gameobjects
            this.gameObjects.forEach(gameObject => {
                if(gameObject){gameObject.draw(context, this.cameraPosition);}
            });
        }

        //Converting 2D co-ordinates into 1D index
        //y * width + x

        //Converting 1D index into 2D co-ordinates
        //y = index / width;
        //x = index % width;

        locationToIndex(location){
            //returns 1D index value of world location with accuracy of cellSize
            
            let arrWidth = Math.floor((this.worldSize.x-this.level.topleft.x)/this.cellSize.x);
            let thisY = Math.round((location.y-this.level.topleft.y)/this.cellSize.y);
            let thisX = Math.round((location.x-this.level.topleft.x)/this.cellSize.x);

            return thisY * arrWidth + thisX;
        }
        indexToLocation(index){
            //returns 2D world coordinate from 1D index value with accuracy of cellSize
            let arrWidth = Math.round((this.worldSize.x-this.level.topleft.x)/this.cellSize.x);
            
            return new Vec(index%arrWidth, Math.floor(index/arrWidth)).multiply(this.cellSize).plus(this.level.topleft);
        }

        trace(location){
            //checks if there are objects in particular location
            let result = {
                TraceLocIndex: -1,
                TraceLoc: new Vec(0,0),
                Objects: [],
                HitResult: false,
            }

            //populate values
            result.TraceLocIndex = this.locationToIndex(location);
            result.TraceLoc = this.indexToLocation(result.TraceLocIndex);
            result.Objects = this.physicsObjects[result.TraceLocIndex,[]];
            result.HitResult = Boolean(result.Objects);
            
            if(this.drawDebug()){
                //draw rectangle at location, gray for HitResult false, orange for true
                this.drawDebugBox(result.TraceLoc, this.cellSize.minusValue(4), (result.HitResult ? '#ff7700' : '#3b3b3b'));
                //bool ? output false : output true
            }
    
            return result;
        }

        addPhysicsObject(gameobject, index){
            //add GameObjects to physicsObjects worldindex

            //see if world index already has object to hold all the objects
            if(!this.physicsObjects[index]){
                //add new subItems array to world index
                this.physicsObjects[index] = Object.create({
                    subItems: [], 
                    add: function(obj){
                        if(!this.subItems.includes(obj)){this.subItems.push(obj);}}, 
                    remove: function(obj){if(this.subItems.includes(obj)){this.subItems.splice(this.subItems.indexOf(obj), 1);}}
            });}

            //add gameobject to subItems array
            this.physicsObjects[index].add(gameobject);
        }

        removePhysicsObject(gameobject, index){
            //remove GameObjects from physicsObjects at worldindex

            //check is index above within reading range
            if(index+1)this.physicsObjects[index].remove(gameobject);
        }

        drawDebugBox(location, size, color = 'red'){
            //draw debug box at given location and size

            ctx.beginPath();
            ctx.lineWidth = '2';
            ctx.strokeStyle = color;
            let gameSizeHalf = new Vec(this.width/2, this.height/2);
            ctx.rect((location.x-size.x/2)-(this.cameraPosition.x-gameSizeHalf.x), (location.y-size.y/2)-(this.cameraPosition.y-gameSizeHalf.y), size.x, size.y);
            ctx.stroke(); 
        }

        drawDebugText(location, message, color = 'black'){
            //draw debug text at location

            ctx.font = '12px Verdana';
            ctx.fillStyle = color;
            ctx.fillText(message, location.x-(this.cameraPosition.x-this.width/2), location.y-(this.cameraPosition.y-this.height/2));
        }
        drawDebugLine(from, to, color = 'blue'){
            ctx.beginPath();
            ctx.strokeStyle = color;
            ctx.moveTo(from.x-(this.cameraPosition.x-this.width/2), from.y-(this.cameraPosition.y-this.height/2));
            ctx.lineTo(to.x-(this.cameraPosition.x-this.width/2), to.y-(this.cameraPosition.y-this.height/2));
            ctx.stroke();
        }

        drawDebug(){
            return DrawCollisionDebug;
        }
        
    }
    //--END OF GAME CLASS--

    //this triggers the creation of new game class, and run constructor with it
    const game = new Game(canvas.width, canvas.height);
    console.log(game);


    function animate(){
        ctx.clearRect(0,0,canvas.width, canvas.height);
        
        
        //call game object to run draw, using ctx as context
        game.draw(ctx);
        //call update on gameobject
        game.update();
        //understandably this draws "previous" frame, but debug draws require draw before update
        requestAnimationFrame(animate);
    }
    animate();
})