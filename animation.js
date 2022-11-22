import{Vec} from './vector.js';

export class Animation{
    constructor(gameObject){
        this.parent = gameObject;
        this.distance = 0;
        this.time = 0;
    }
    update(){
      if(this.parent.velocity.x < 0){this.parent.animationFrame = Math.round(lerp(4,7, this.time));}
      if(this.parent.velocity.x > 0){this.parent.animationFrame = Math.round(lerp(0,3, this.time));}
      //console.log(this.parent.animationFrame)
      //this.time += this.parent.game.deltaTime - (this.time>1);
      this.time += this.parent.velocity.length()*this.parent.game.deltaTime*4 - (this.time>1);
      //console.log(this.time);
    }

    
}
function lerp (start, end, amt){
  return (1-amt)*start+amt*end
}
