import{Vec} from './vector.js';

export class Physics{
    constructor(gameobject){
        this.parent = gameobject
        this.game = this.parent.game
        //bounding box size
        this.bBox = { min: new Vec(0-gameobject.spriteSize.x / 2, 0-gameobject.spriteSize.y / 2),
                            max: new Vec(gameobject.spriteSize.x / 2, gameobject.spriteSize.y / 2)}; 
        this.velocity = new Vec(0,0)
        this.weight = 1

        //add to game instance physics array
        this.worldIndex = []
        this.updateWorldIndex(this.parent.worldLocation)
    }
    update(deltaTime){
        {   
             //run collision check
             this.collisionCheck(this.parent.game, this.parent)

            //apply drag
            this.velocity.Nminus(this.velocity.multiplyValue(this.weight).multiplyValue(this.parent.game.deltaTime))
            
            //to prevent absurdly small calculations
            if(this.velocity.length()<0.001){this.velocity.zero()}
            

            //NOTE: Do collision check before updateWorldIndex()
            this.updateWorldIndex(this.parent.worldLocation)

            //apply velocity to world location
            this.parent.worldLocation.Nplus(this.velocity)
        }
    }
    addMovementInput(inputVector, MaxSpeed){
        //converts input to velocity value

        this.velocity.Nplus(inputVector.multiplyValue(MaxSpeed).multiplyValue(this.parent.game.deltaTime))

    }
    addImpulse(vec){
        this.velocity.Nplus(vec)
    }

    updateWorldIndex(location){
        //generate locations that bounding box occupies in the world
        let collisionCorners = []

        let stepping = new Vec(this.bBox.max.x, this.bBox.max.y)

        for(let x = this.bBox.min.x; x <= this.bBox.max.x; x +=stepping.x){
            //for each X coordinate, do Y loop
                for(let y = this.bBox.min.y; y <= this.bBox.max.x; y+=stepping.y){

                    //loop between min xy and max xy, given stepping size
                    collisionCorners.push(new Vec(x,y))

                    //draw debug for corners
                    //this.parent.game.drawDebugBox(this.parent.worldLocation.plus(new Vec(x,y)), new Vec(2,2), 'black')
                }
        }

        collisionCorners.forEach((loc,b,c) => {
        //forEach arguments: copy of an array item, current loop index, the array(?reference?)
        if(this.locationToIndex(location.plus(loc)) != this.worldIndex[b]){

            //if corner location doesn't match the indexed location, remove object from physics array
            this.parent.game.removePhysicsObject(this.parent, this.worldIndex[b])
            }
        })
        collisionCorners.forEach((loc,b,c) => {
            //get new index
            this.worldIndex[b] = this.locationToIndex(location.plus(loc))
            //set to new index
            this.parent.game.addPhysicsObject(this.parent, this.worldIndex[b])
            
            
            //BUG: later loop points are removing the object from indexes it still occupies
            //TEMP FIX: split the loop into 2 separate ones, but it is now spamming game.addPhysicsObject
            //NOTE: Find condition when to add, probably organize what is stored in this.worldIndex array
        })
    }

    collisionCheck(game, parent){
        //Fetch objects from game.physicsObjects using this.worldIndex indexes
        this.worldIndex.forEach(index =>{
            //cycle through all nearby worldIndexes
            game.physicsObjects[index].subItems.forEach(otherobj => {
                //fetch subItems from worldIndex
                let g1 = {
                    box: parent.physics.bBox,
                    min: parent.physics.bBox.min,
                    max: parent.physics.bBox.max,
                    loc : parent.worldLocation,
                    weight: parent.physics.weight
                }
                let g2 = {
                    box: otherobj.physics.bBox,
                    min: otherobj.physics.bBox.min,
                    max: otherobj.physics.bBox.max,
                    loc: otherobj.worldLocation,
                    weight: otherobj.physics.weight
                }
                if(otherobj != parent && this.AABBCheck(otherobj)){
                    //if AABB check returns true and the object isn't itself, calculate penetration

                        //localspace vector of the collision
                        let vec = otherobj.worldLocation.minus(parent.worldLocation)
                        
                        let penVec = new Vec
                        (vec.x - g1.box.max.x*Math.sign(vec.x) - g2.box.max.x*Math.sign(vec.x),
                         vec.y - g1.box.max.y*Math.sign(vec.y) - g2.box.max.y*Math.sign(vec.y))

                        //get the collision side of g2 where the penetration is measured
                        penVec = this.minSide(penVec)
                        vec = this.maxSide(vec)

                        //dot values to make sure depen and velocity reduction point away from the wall
                        let dot = this.velocity.dot(vec.normalize())
                        let pendot = this.velocity.normalize().dot(penVec.normalize())
                        
                        
                        //only accept above 0 dot values(but not abs)
                        dot =  dot >= 0 ? dot : 0
                        pendot = pendot < 0 ? 1 : 0

                        
                        
                        if(otherobj.tags.includes('moving')){
                            //calculate force ratios by dividing object weights against each other
                            let pratio = g1.weight/(g1.weight+g2.weight)
                            let oratio = 1-pratio
                            let force = vec.normalize().multiplyValue(dot)
                            this.velocity.Nminus(force.multiplyValue(oratio))
                            otherobj.physics.velocity.Nplus(force.multiplyValue(pratio))
                            
                            //math seems ok but it stutters...
                        }
                        
                        if(otherobj.tags.includes('static')){
                            //reduce any velocity towards the blocking object
                            this.velocity.Nminus(vec.normalize().multiplyValue(dot))
                        }
                        //do de-pentration
                        parent.worldLocation.Nplus(penVec.multiplyValue(pendot))
                        
                }
            });

            
        })
    }

    boxClamp(box, vec){
        //really neat way to clamp localspace vector inside a rectange
        
        //let x = (vector.x < bbox.min.x) ? bbox.min.x : (vector.x > bbox.max.x) ? bbox.max.x : vector.x
        //let y = (vector.y < bbox.min.y) ? bbox.min.y : (vector.y > bbox.max.y) ? bbox.max.y : vector.y
        return new Vec((vec.x < box.min.x) ? box.min.x : (vec.x > box.max.x) ? box.max.x : vec.x, (vec.y < box.min.y) ? box.min.y : (vec.y > box.max.y) ? box.max.y : vec.y)
    }
    minSide(vec){
        //returns smallest axis only
        if(Math.abs(vec.x)>Math.abs(vec.y))return new Vec(0, vec.y)
        return new Vec(vec.x, 0)
    }
    maxSide(vec){
        //returns larger axis only
        if(Math.abs(vec.x)>Math.abs(vec.y))return new Vec(vec.x, 0)
        return new Vec(0, vec.y)
    }

    



    AABBCheck(otherobj){
        //check if any corner coordinate overlap
        if(this.bBox.max.x+this.parent.worldLocation.x < otherobj.physics.bBox.min.x+otherobj.worldLocation.x || 
            this.bBox.min.x+this.parent.worldLocation.x > otherobj.physics.bBox.max.x+otherobj.worldLocation.x)
            {return false;}
            
            if(this.bBox.max.y+this.parent.worldLocation.y < otherobj.physics.bBox.min.y + otherobj.worldLocation.y ||
            this.bBox.min.y+this.parent.worldLocation.y > otherobj.physics.bBox.max.y + otherobj.worldLocation.y){return false;}
            return true;
    }

            //Converting 2D co-ordinates into 1D index
        //y * width + x

        //Converting 1D index into 2D co-ordinates
        //y = index / width;
        //x = index % width;

    locationToIndex(location){
            //returns 1D index value of world location with accuracy of cellSize
            
        let arrWidth = Math.floor((this.game.worldSize.x-this.game.level.topleft.x)/this.game.cellSize.x);
        let thisY = Math.round((location.y-this.game.level.topleft.y)/this.game.cellSize.y);
        let thisX = Math.round((location.x-this.game.level.topleft.x)/this.game.cellSize.x);

        return thisY * arrWidth + thisX;
    }

    indexToLocation(index){
        //returns 2D world coordinate from 1D index value with accuracy of cellSize
        let arrWidth = Math.round((this.worldSize.x-this.level.topleft.x)/this.cellSize.x);
        
        return new Vec(index%arrWidth, Math.floor(index/arrWidth)).multiply(this.cellSize).plus(this.level.topleft);
    }

        //game.Trace()  return template

        //TraceLocIndex: -1,
        //TraceLoc: new Vec(0,0),
        //Objects: [],
        //HitResult: false,
    
    
    
    
    
    
    
    
    
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
            
    }*/
}