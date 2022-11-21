import{Vec} from './vector.js';

export class Physics{
    constructor(gameObject){
        this.parent = gameObject;
    }
    update(deltaTime){
        {
            //apply velocity to world location
            this.parent.worldLocation.Nplus(this.parent.velocity);
            //console.log(this.parent.velocity);
        }
    }
    addMovementInput(inputVector, Acceleration, MaxSpeed){
        //velocity = (input*maxspeed*acceleration - velocity*acceleration)*deltatime+velocity

        //aint this line a mouthful, and probably causes absurd amount of garbage collection
        this.parent.velocity.Nplus((inputVector.multiplyValue(Acceleration*MaxSpeed).minus(this.parent.velocity.multiplyValue(Acceleration))).multiplyValue(this.parent.game.deltaTime));

    }
}