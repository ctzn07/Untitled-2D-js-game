import{Vec} from './vector.js';

export class Physics{
    constructor(parent, bSize){
        this.parent = parent
        this.game = parent.game
        this.level = parent.game.level

        //bounding box size
        this.bBox = { min: new Vec(0 - bSize.x / 2, 0 - bSize.y / 2),
                            max: new Vec(bSize.x / 2, bSize.y / 2),
                            wLoc: this.parent.worldLocation, 
                            getLoc:function(){
                                return [
                                new Vec(this.wLoc.x+this.min.x, this.wLoc.y+this.min.y),
                                new Vec(this.wLoc.x+this.max.x, this.wLoc.y+this.min.y),
                                new Vec(this.wLoc.x+this.min.x, this.wLoc.y+this.max.y),
                                new Vec(this.wLoc.x+this.max.x, this.wLoc.y+this.max.y)
                                ]}} 
        this.velocity = new Vec(0,0)
        this.weight = 1
        //using Set() for worldIndex since duplicates would be just extra luggage
        this.worldIndex = new Set()

        //initialize worldIndex for objects that don't actively run collision check
        this.bBox.getLoc().forEach(loc=>{this.worldIndex.add(this.level.locationToIndex(loc))})
        this.worldIndex.forEach(a=>{this.game.addPhysicsObject(this.parent, a)})
    }
    update(deltaTime){
        {   
             //run collision check
             this.collisionCheck(this.parent.game, this.parent)

            //apply drag
            //this.velocity.Nminus(this.velocity.multiplyValue(this.weight).multiplyValue(deltaTime))
            this.velocity.Nminus(this.getDrag(deltaTime))
            
            //prevent absurdly small calculations
            if(this.velocity.length()<0.001){this.velocity.zero()}

            //apply velocity to world location
            this.parent.worldLocation.Nplus(this.velocity)

            //update orientation
            this.parent.orientation = this.velocity.plus(this.parent.orientation).normalize()

        }
    }
    addMovementInput(inputVector, MaxSpeed){
        //converts input to velocity value

        this.velocity.Nplus(inputVector.multiplyValue(MaxSpeed).multiplyValue(this.parent.game.deltaTime))

    }
    addImpulse(vec){
        this.velocity.Nplus(vec)
    }


    collisionCheck(game, parent){
        //remove all corners from physics object list
        this.worldIndex.forEach(idx =>{game.removePhysicsObject(this.parent, idx)})

        //clear index list
        this.worldIndex.clear()

        //get new index list
        this.bBox.getLoc().forEach((vec, idx, arr) =>
            {this.worldIndex.add(this.level.locationToIndex(vec))})

        //add new indexes to physics object list
        this.worldIndex.forEach(idx =>{game.addPhysicsObject(this.parent, idx)})

        //For each worldIndex value...
        this.worldIndex.forEach(idx =>{
            //...fetch subItems that share the same cell
            game.physicsObjects[idx].subItems.forEach(otherobj => {
                //checks against single subItem
                if(otherobj != parent && this.AABBCheck(otherobj)){
                        //get direction vector to otherobj
                        let vec = parent.worldLocation.plus(this.velocity).minus(otherobj.worldLocation)
                        //.plus(this.velocity) helps with getting stuck on collision box edges
                        //this is inherent issue of this.maxSide() method

                        vec = this.maxSide(vec).normalize()
                        
                        //get force values in wall direction
                        let dot = vec.dot(this.velocity)
                        dot = dot < 0 ? dot : 0
                        
                        if(otherobj.tags.includes('moving')){
                            let ratio = this.weight/(this.weight+otherobj.physics.weight)
                            
                            this.velocity.Nminus(vec.multiplyValue(dot))
                            otherobj.physics.velocity.Nplus(vec.multiplyValue(dot))
                            
                            
                            
                        }

                        if(otherobj.tags.includes('static')){
                            //simply reduce any velocity toward wall
                            this.velocity.Nminus(vec.multiplyValue(dot))
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
    cornerSnap(vec){
        return vec.normalize().round().normalize().multiplyValue(vec.length())
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
    getDrag(deltaTime){
        return this.velocity.multiplyValue(this.weight).multiplyValue(deltaTime)
    }

    
}
