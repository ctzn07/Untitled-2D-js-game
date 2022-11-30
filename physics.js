import { gameObject } from './gameObject.js';
import{Vec} from './vector.js';

export class Physics{
    constructor(gameObject){
        this.parent = gameObject;
        //bounding box size AABB
        this.bBox = { min: new Vec(0-gameObject.spriteSize.x / 2, 0-gameObject.spriteSize.y / 2),
                            max: new Vec(gameObject.spriteSize.x / 2, gameObject.spriteSize.y / 2)}; 
        //console.log(this.bBox.min.x, this.bBox.min.y, this.bBox.max.x, this.bBox.max.y);
        this.velocity = new Vec(0,0);
    }
    update(deltaTime){
        {
            this.collisionCheck(this.parent.game, this.parent.worldLocation);
            //apply velocity to world location
            this.parent.worldLocation.Nplus(this.velocity);
            //to prevent absurdly small calculations
            if(this.velocity.length()<0.001){this.velocity.zero()};

        }
    }
    addMovementInput(inputVector, Acceleration, MaxSpeed){
        //velocity = (input*maxspeed*acceleration - velocity*acceleration)*deltatime+velocity
        //aint this line a mouthful, and probably causes absurd amount of garbage collection
        this.velocity.Nplus((inputVector.multiplyValue(Acceleration*MaxSpeed).minus(this.velocity.multiplyValue(Acceleration))).multiplyValue(this.parent.game.deltaTime));

    }
    addImpulse(vec){
        this.velocity.Nplus(vec);
    }

    collisionCheck(game, location){
        let nearbyObjects = [];
        let directions = [
            this.parent.game.worldTileSize.multiply(new Vec(1,0)),
            this.parent.game.worldTileSize.multiply(new Vec(-1,0)),
            this.parent.game.worldTileSize.multiply(new Vec(0,1)),
            this.parent.game.worldTileSize.multiply(new Vec(0,-1)),
            this.parent.game.worldTileSize.multiply(new Vec(1,1)),
            this.parent.game.worldTileSize.multiply(new Vec(1,-1)),
            this.parent.game.worldTileSize.multiply(new Vec(-1,-1)),
            this.parent.game.worldTileSize.multiply(new Vec(-1,1))
        ];

        directions.forEach(dir=>{
            let newLoc = location.plus(dir);
            let trace = game.trace(newLoc);
            })
        


        //TraceLocIndex: -1,
        //TraceLoc: new Vec(0,0),
        //Objects: [],
        //HitResult: false,

    }


    AABBCheck(){
        let otherobj = this.parent.game.physicsObjects[this.parent.game.locationToIndex(location)];
        
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
    }
}