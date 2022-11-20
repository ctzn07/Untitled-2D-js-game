import{Vec} from './vector.js';

export class Physics{
    constructor(gameObject){
        this.parent = gameObject;
        this.velocity = new Vec(0,0);
        this.forceVec = new Vec(0,0);
    }
    update(deltaTime){
        {
            this.parent.worldLocation.x += this.velocity.x;
            this.parent.worldLocation.y += this.velocity.y;
            //console.log('location', this.parent.worldLocation.toString());
            //console.log('velocity', this.velocity.toString());
        }
    }
    addMovementInput(inputVector, Acceleration, MaxSpeed){
        //velocity = (input*maxspeed*acceleration - velocity*weight)*deltatime+velocity
        this.velocity.x = this.forceVec.x;
        this.velocity.y = this.forceVec.y;

        this.forceVec.x = (inputVector.x*Acceleration*MaxSpeed) - (this.velocity.x*Acceleration);
        this.forceVec.y = (inputVector.y*Acceleration*MaxSpeed) - (this.velocity.y*Acceleration);
        this.forceVec.x *= this.parent.game.deltaTime;
        this.forceVec.y *= this.parent.game.deltaTime;
        this.forceVec.x += this.velocity.x;
        this.forceVec.y += this.velocity.y;
        //console.log(this.forceVec.x);
    }
}