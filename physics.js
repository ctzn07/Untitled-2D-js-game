import{Vec} from './vector.js';

export class Physics{
    constructor(gameObject){
        this.parent = gameObject
        //bounding box size
        this.bBox = { min: new Vec(0-gameObject.spriteSize.x / 2, 0-gameObject.spriteSize.y / 2),
                            max: new Vec(gameObject.spriteSize.x / 2, gameObject.spriteSize.y / 2)}; 
        this.velocity = new Vec(0,0)

        //add to game instance physics array
        this.worldIndex = []
        this.updateWorldIndex(this.parent.game, this.parent)
    }
    update(deltaTime){
        {
            
            this.collisionCheck(this.parent.game, this.parent)
            //apply velocity to world location
            this.parent.worldLocation.Nplus(this.velocity)
            //to prevent absurdly small calculations
            if(this.velocity.length()<0.001){this.velocity.zero()}
            

            //NOTE: Do collision check before updateWorldIndex()
            this.updateWorldIndex(this.parent.game, this.parent)

        }
    }
    addMovementInput(inputVector, Acceleration, MaxSpeed){
        //converts input to velocity value

        //velocity = (input*maxspeed*acceleration - velocity*acceleration)*deltatime+velocity
        //aint this line a mouthful, and probably causes absurd amount of garbage collection
        this.velocity.Nplus((inputVector.multiplyValue(Acceleration*MaxSpeed).minus(this.velocity.multiplyValue(Acceleration))).multiplyValue(this.parent.game.deltaTime))

    }
    addImpulse(vec){
        this.velocity.Nplus(vec)
    }

    updateWorldIndex(game, parent){
        //generate locations that bounding box occupies in the world

        let collisionCorners = [];
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
                if(otherobj != parent && this.AABBCheck(otherobj)){
                    //if AABB check returns true and the object isn't itself, calculate penetration
                    let g1 = {
                        box: parent.physics.bBox,
                        min: parent.physics.bBox.min,
                        max: parent.physics.bBox.max,
                        loc : parent.worldLocation
                    }
                    let g2 ={
                        box: otherobj.physics.bBox,
                        min: otherobj.physics.bBox.min,
                        max: otherobj.physics.bBox.max,
                        loc: otherobj.worldLocation
                    }
                    let vec = g2.loc.minus(g1.loc)
                    vec.Nminus(this.boxClamp(g2.box, vec))
                    //vec.Nplus(this.boxClamp(g1.box, vec))
                    
                    if(vec.length()<g1.box.max.length()){
                        let dot = this.velocity.dot(vec.normalize()) 
                        //reduce any velocity towards the blocking object, but only if dot value is above 0(no negative reduction)
                        this.velocity.Nminus(vec.normalize().multiplyValue((dot > 0 ? dot : 0)))
                        //draw debug line for collision vector
                        //game.drawDebugLine(g1.loc, g1.loc.plus(vec), 'black')

                        //backup incase there is need for manual de-penetration
                        //parent.worldLocation.Nplus(vec.normalize().negate().multiplyValue(game.deltaTime))

                        //NOTE: Need to add Impulse resolution when colliding with movable objects
                        //(transferring own velocity to collided object)
                        
                    }
                    

                    
                    
                }
            });

            
        })
    }
    getDominantAxis(vec){
        if(Math.abs(vec.x)>Math.abs(vec.y))return vec.multiply(new Vec(1,0))
        return vec.multiply(new Vec(0,1))
    }
    boxClamp(box, vector){
        //let x = (vector.x < bbox.min.x) ? bbox.min.x : (vector.x > bbox.max.x) ? bbox.max.x : vector.x
        //let y = (vector.y < bbox.min.y) ? bbox.min.y : (vector.y > bbox.max.y) ? bbox.max.y : vector.y
        return new Vec((vector.x < box.min.x) ? box.min.x : (vector.x > box.max.x) ? box.max.x : vector.x, (vector.y < box.min.y) ? box.min.y : (vector.y > box.max.y) ? box.max.y : vector.y)
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