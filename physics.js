import{Vec} from './vector.js';

export class Physics{
    constructor(gameObject){
        this.parent = gameObject
        //bounding box size
        this.bBox = { min: new Vec(0-gameObject.spriteSize.x / 2, 0-gameObject.spriteSize.y / 2),
                            max: new Vec(gameObject.spriteSize.x / 2, gameObject.spriteSize.y / 2)}; 
        this.velocity = new Vec(0,0)
        this.weight = 5

        //add to game instance physics array
        this.worldIndex = []
        this.updateWorldIndex(this.parent.game, this.parent)
    }
    update(deltaTime){
        {
            
             //run collision check
             this.collisionCheck(this.parent.game, this.parent)

            
            //apply velocity to world location
            this.parent.worldLocation.Nplus(this.velocity)
           
            //apply drag
            this.velocity.Nminus(this.velocity.multiplyValue(this.weight).multiplyValue(this.parent.game.deltaTime))
            
            //to prevent absurdly small calculations
            if(this.velocity.length()<0.001){this.velocity.zero()}
            

            //NOTE: Do collision check before updateWorldIndex()
            this.updateWorldIndex(this.parent.game, this.parent)

        }
    }
    addMovementInput(inputVector, MaxSpeed){
        //converts input to velocity value

        this.velocity.Nplus(inputVector.multiplyValue(MaxSpeed).multiplyValue(this.parent.game.deltaTime))

    }
    addImpulse(vec){
        this.velocity.Nplus(vec)
    }

    updateWorldIndex(game, parent){
        //generate locations that bounding box occupies in the world

        let collisionCorners = []
        //determine stepping size for measuring points, one for each corner by default(bbox size)
        //however, there must be one point per world cell, so pick the smallest value
        let stepping = new Vec(Math.min(this.bBox.max.x*2, game.cellSize.x), Math.min(this.bBox.max.y*2, game.cellSize.y))

        for(let x = this.bBox.min.x; x <= this.bBox.max.x; x +=stepping.x){
            //for each X coordinate, do Y loop
                for(let y = this.bBox.min.y; y <= this.bBox.max.x; y+=stepping.y){
                    //loop between min xy and max xy, given stepping size
                    collisionCorners.push(new Vec(x,y))
                    //draw debug for corners
                    //game.drawDebugBox(parent.worldLocation.plus(new Vec(x,y)), new Vec(2,2), 'black')
                }
        }

        collisionCorners.forEach((loc,b,c) => {
        //forEach arguments: copy of an array item, current loop index, the array(?reference?)
        if(game.locationToIndex(parent.worldLocation.plus(loc)) != this.worldIndex[b]){
            //remove from old index
            game.removePhysicsObject(parent, this.worldIndex[b])
            //get new index
            this.worldIndex[b] = game.locationToIndex(parent.worldLocation.plus(loc))
            //set to new index
            game.addPhysicsObject(parent, this.worldIndex[b])

            }
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
                    loc : parent.worldLocation
                }
                let g2 = {
                    box: otherobj.physics.bBox,
                    min: otherobj.physics.bBox.min,
                    max: otherobj.physics.bBox.max,
                    loc: otherobj.worldLocation
                }
                if(otherobj != parent && this.AABBCheck(otherobj)){
                    //if AABB check returns true and the object isn't itself, calculate penetration
                        let vec = otherobj.worldLocation.minus(parent.worldLocation)
                        
                        
                        //let depenX = vec.x - g1.box.max.x*Math.sign(vec.x) - g2.box.max.x*Math.sign(vec.x)
                        //let depenY = vec.y - g1.box.max.y*Math.sign(vec.y) - g2.box.max.y*Math.sign(vec.y)
                        
                        let depenX = vec.x - g1.box.max.x*Math.sign(vec.x) - g2.box.max.x*Math.sign(vec.x)
                        let depenY = vec.y - g1.box.max.y*Math.sign(vec.y) - g2.box.max.y*Math.sign(vec.y)
                        let penVec = new Vec(depenX, depenY)

                        //get the collision side of g2 where the penetration is measured
                        penVec = this.sideClamp(penVec)

                        //dot value vec is incorrect, it should be perpendicular to the collision side
                        //or pointing to neares g2 corner so that player would attempt to slide past it
                        let dot = vec.normalize().dot(this.velocity.normalize())

                        //only accept above 0 dot values(but not abs)
                        dot =  dot > 0 ? dot : 0 

                        //do de-pentration
                        parent.worldLocation.Nplus(penVec)

                        if(otherobj.tags.includes('moving')){
                            //calculate force ratios by dividing object weights against each other
                            //add opposite velocity impulses accordingly
                        }
                        
                        if(otherobj.tags.includes('static')){
                            //reduce any velocity towards the blocking object
                            this.velocity = this.velocity.minus(this.velocity.multiplyValue(dot))
                        }
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
    sideClamp(vec){
        //am I dumb or is this reversed? it works tho...
        if(Math.abs(vec.x)>Math.abs(vec.y))return new Vec(0, vec.y)
        return new Vec(vec.x, 0)
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