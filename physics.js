import{Vec} from './vector.js';

export class Physics{
    constructor(parent, bSize){
        this.parent = parent
        this.game = parent.game
        this.level = parent.game.level

        //bounding box size
        this.bBox = { min: new Vec(0 - bSize.x / 2, 0 - bSize.y / 2),
                            max: new Vec(bSize.x / 2, bSize.y / 2)}; 
        this.velocity = new Vec(0,0)
        this.weight = 1

        this.worldIndex = []
        this.updateWorldIndex()
    }
    update(deltaTime){
        {   
             //run collision check
             this.collisionCheck(this.parent.game, this.parent)

            //apply drag
            this.velocity.Nminus(this.velocity.multiplyValue(this.weight).multiplyValue(deltaTime))
            
            //prevent absurdly small calculations
            if(this.velocity.length()<0.001){this.velocity.zero()}
            

            //NOTE: Do collision check before updateWorldIndex()
            this.updateWorldIndex()

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

    updateWorldIndex(){
        //generate locations that bounding box occupies in the world
        let collisionCorners = []

        let stepping = new Vec(this.bBox.max.x, this.bBox.max.y)

        //populate collisionCorners array
        for(let x = this.bBox.min.x; x <= this.bBox.max.x; x +=stepping.x){
            //for each X coordinate, do Y loop
                for(let y = this.bBox.min.y; y <= this.bBox.max.x; y+=stepping.y){

                    //loop between min xy and max xy, given stepping size
                    collisionCorners.push(new Vec(x,y))

                    //draw debug for corners
                    //this.parent.game.drawDebugBox(this.parent.worldLocation.plus(new Vec(x,y)), new Vec(2,2), 'black')
                }
        }

        //clear all old indexes
        this.worldIndex.forEach((idx)=>{this.game.removePhysicsObject(this.parent, idx)})

        collisionCorners.forEach((vec, index, arrayRef) => {
            //forEach arguments: copy of an array item, current loop index, the array
            let corner = this.parent.worldLocation.plus(vec)

            //get new index
            this.worldIndex[index] = this.level.locationToIndex(corner)

            //update parent to physicsObjects array
            this.game.addPhysicsObject(this.parent, this.worldIndex[index])
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
                            let g1ratio = g1.weight/(g1.weight+g2.weight)
                            let g2ratio = 1-pratio
                            let force = vec.normalize().multiplyValue(dot)
                            this.velocity.Nminus(force.multiplyValue(g2ratio))
                            otherobj.physics.velocity.Nplus(force.multiplyValue(g1ratio))
                            
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
    
}
