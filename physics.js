import{Vec} from './vector.js';

export class Physics{
    constructor(gameObject){
        this.parent = gameObject;
        //bounding box size
        this.bBox = { min: new Vec(0-gameObject.spriteSize.x / 2, 0-gameObject.spriteSize.y / 2),
                            max: new Vec(gameObject.spriteSize.x / 2, gameObject.spriteSize.y / 2)}; 
        this.velocity = new Vec(0,0);

        //add to game instance physics array
        this.worldIndex = [];
        this.updateWorldIndex(this.parent.game, this.parent);
    }
    update(deltaTime){
        {
            this.collisionCheck(this.parent.game, this.parent.worldLocation);
            //apply velocity to world location
            this.parent.worldLocation.Nplus(this.velocity);
            //to prevent absurdly small calculations
            if(this.velocity.length()<0.001){this.velocity.zero()};


            //NOTE: Do collision check before updateWorldIndex()
            this.updateWorldIndex(this.parent.game, this.parent);

        }
    }
    addMovementInput(inputVector, Acceleration, MaxSpeed){
        //converts input to velocity value

        //velocity = (input*maxspeed*acceleration - velocity*acceleration)*deltatime+velocity
        //aint this line a mouthful, and probably causes absurd amount of garbage collection
        this.velocity.Nplus((inputVector.multiplyValue(Acceleration*MaxSpeed).minus(this.velocity.multiplyValue(Acceleration))).multiplyValue(this.parent.game.deltaTime));

    }
    addImpulse(vec){
        this.velocity.Nplus(vec);
    }

    initBoxArray(bBox, game){
        //this generates the necessary size for worldIndex array
        let min = bBox.min.divide(game.cellSize);
        let max = bBox.max.divide(game.cellSize);
        let array = [];
        for(let x = bBox.min.divide(game.cellSize).x; x < bBox.max.divide(game.cellSize).x; x++){
            for(let y = bBox.min.divide(game.cellSize).y; y < bBox.max.divide(game.cellSize).y; y++){
                array.push(game.cellSize.multiply(new Vec(x, y)));
            }
        }
        console.log(array);
        return array;
    }

    updateWorldIndex(game, parent){
        //This updates objects current position to collision check array (game.physicsObjects)
        /*
        let collisionCorners = [
            new Vec(this.bBox.min.x,this.bBox.max.y),
            new Vec(this.bBox.max.x,this.bBox.max.y),
            new Vec(this.bBox.max.x,this.bBox.min.y),
            new Vec(this.bBox.min.x,this.bBox.min.y)
        ];
        */
        //let min = this.bBox.min.divide(game.cellSize.divideValue(2)).floor();
        //let max = this.bBox.max.divide(game.cellSize.divideValue(2)).ceil();
        let testboxValue = 32*5;
        
        let testbBox = { min: new Vec(0-testboxValue / 2, 0-testboxValue / 2),
                                max: new Vec(testboxValue / 2, testboxValue / 2)}; 











        let length = game.cellSize.length()/testbBox.min.length();
        //console.log(length)
        
        //console.log('new loop')
        let collisionCorners = [];
        //console.log('new loop');
        game.drawDebugBox(parent.worldLocation, testbBox.max.multiplyValue(2), 'green');
        for(let x = (testbBox.min.x/game.cellSize.x); x <= (testbBox.max.x/game.cellSize.x); x++){
                for(let y = testbBox.min.y/game.cellSize.y; y <= testbBox.max.x/game.cellSize.x; y++){
                    //code here
                    //console.log(x, y)
                    
                    collisionCorners.push(new Vec(x*length,y*length).multiply(testbBox.max));
                }
            

        }
        //console.log(collisionCorners);





        collisionCorners.forEach((loc,b,c) => {
        //forEach arguments: copy of an array item, current loop index, the array(?reference?)
        if(game.locationToIndex(parent.worldLocation.plus(loc)) != this.worldIndex[b]){
            //remove from old index
            game.removePhysicsObject(parent, this.worldIndex[b]);
            //get new index
            this.worldIndex[b] = game.locationToIndex(parent.worldLocation.plus(loc));
            //set to new index
            game.addPhysicsObject(parent, this.worldIndex[b]);

            }
        })
        //draw temporary debug
        this.worldIndex.forEach((a,b)=>{
            game.drawDebugBox(game.indexToLocation(a), game.cellSize.minusValue(4), 'grey');
        })
        //console.log(game.physicsObjects[this.worldIndex[0]]);
    
    }
    

    collisionCheck(game, location){
        let nearbyObjects = [];
        let directions = [
            game.cellSize.multiply(new Vec(1,0)),
            game.cellSize.multiply(new Vec(-1,0)),
            game.cellSize.multiply(new Vec(0,1)),
            game.cellSize.multiply(new Vec(0,-1)),
            game.cellSize.multiply(new Vec(1,1)),
            game.cellSize.multiply(new Vec(1,-1)),
            game.cellSize.multiply(new Vec(-1,-1)),
            game.cellSize.multiply(new Vec(-1,1)),
            game.cellSize.multiply(new Vec(0,0))
        ];

        directions.forEach(dir=>{
            let newLoc = location.plus(dir);
            //let trace = game.trace(newLoc);
            })
        


        //TraceLocIndex: -1,
        //TraceLoc: new Vec(0,0),
        //Objects: [],
        //HitResult: false,

    }
    


    
    
    
    
    
    
    
    
    
    
    /*AABBCheck(otherobj){
        //AABB collision check against other object
        
        if(!otherobj){return false;}    //no object in location -> no collision

        //first check AABB Collision
        //read more about Separating Axis Theorem (SAT):
        //https://gamedevelopment.tutsplus.com/tutorials/how-to-create-a-custom-2d-physics-engine-the-basics-and-impulse-resolution--gamedev-6331
        
        if(this.bBox.max.x+this.parent.worldLocation.x < otherobj.physics.bBox.min.x+otherobj.worldLocation.x || 
            this.bBox.min.x+this.parent.worldLocation.x > otherobj.physics.bBox.max.x+otherobj.worldLocation.x)
            {return false;}
            
            if(this.bBox.max.y+this.parent.worldLocation.y < otherobj.physics.bBox.min.y + otherobj.worldLocation.y ||
            this.bBox.min.y+this.parent.worldLocation.y > otherobj.physics.bBox.max.y + otherobj.worldLocation.y){return false;}
            
            // No separating axis found, therefor there is at least one overlapping axis
            return true;
    }*/
}