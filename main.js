import {Player} from './player.js';
import {Vec} from './vector.js';
import {Level} from './level.js';
import {gameObject} from './gameObject.js';

//load event : JavaScript waits for all dependent resources such as stylesheets and images to be fully loaded and available before it runs
window.addEventListener('load', function(){
    const canvas = document.getElementById('canvas1');
    const ctx = canvas.getContext('2d');
    ctx.imageSmoothingEnabled=true;
    canvas.width = 800;
    canvas.height = 1000;
    const DrawCollisionDebug = true;

    class Game{
        constructor(width, height){
            this.width = width;
            this.height = height;
            
            this.deltaTime = 0;
            this.timeOld = Date.now();
            this.cameraPosition = new Vec(0,0);
            
            this.gameObjects = [];                  //list of all gameobjects
            this.physicsObjects = [];               //list of all physicsobjects
            this.cellSize = new Vec(256,256);  //size of the cell used for physicsObjects array
        }

        update(){
            //all updated math goes here
            //update camera position and speed
            this.cameraPosition = this.cameraPosition.lerp(this.player.worldLocation, 0.05);
            
            //get new deltaTime
            this.deltaTime = (Date.now() - this.timeOld)/1000;
            this.timeOld = Date.now()
            
            //run update() on all gameobjects
            this.gameObjects.forEach(gameObject => {
                gameObject.update(this.deltaTime);
            });
        }

        draw(context){
            //all graphics draws go here

            //draw level as bottom layer
            this.level.draw(context, this.cameraPosition);

            //run draw() on all gameobjects
            this.gameObjects.forEach(gameObject => {
                if(gameObject){gameObject.draw(context, this.cameraPosition);}
            });

            // DRAW DEBUG BOX FOR ALL PHYSICS OBJECTS
            if(true){
            this.physicsObjects.forEach((a, a_idx) =>{
                //Draw existing Physics cells
                this.drawDebugBox(this.level.indexToLocation(a_idx), this.cellSize, 'gray')
                this.drawDebugText(this.level.indexToLocation(a_idx), a_idx, 'blue')
                a.subItems.forEach(b=>{
                    //Draw Physics object bounding boxes
                    this.drawDebugBox(b.physics.parent.worldLocation, b.physics.bBox.max.multiplyValue(2), 'red')
                })
            })
        }

            //DRAW DEBUG FPS COUNTER
            let debugTextLoc = this.cameraPosition.plus(new Vec(this.width*-1/2+5, this.height*-1/2+15))
            this.drawDebugText(debugTextLoc, Math.floor(1/this.deltaTime)+'fps', 'red')
        }

        addPhysicsObject(gameobject, index){
            //add GameObjects to physicsObjects worldindex

            //check if subItem cell already exists in that worldIndex
            if(!this.physicsObjects[index]){
                //add new subItems array to world index
                this.physicsObjects[index] = Object.create({
                    subItems: new Set(), 
                    add: function(obj){
                        if(!this.subItems.has(obj)){
                            this.subItems.add(obj)}
                    }, 
                    remove: function(obj){
                        if(this.subItems.has(obj)){
                            this.subItems.delete(obj)}
                    }
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
    const game = new Game(canvas.width, canvas.height)
    game.level = new Level(game, new Vec(0,0), testlevel)
    game.level.generateBlockVolumes()
    const brl = new gameObject(game, new Vec(100,200), ['moving', 'block'], barrel, new Vec(1,1))
    brl.physics.weight = 30
    
 
    //param list: game, spawn position, spritesheet ref, spritesheet size
    game.player = new Player(game, new Vec(-100,0), player, new Vec(4,2))
    

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