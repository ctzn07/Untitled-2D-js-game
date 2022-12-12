export class Animation{
    constructor(gameObject){
        this.parent = gameObject;
        this.distance = 0;
        this.time = 0;
        this.currentAnimation = '';
        this.animations = [];
        //this counter is required because named arrays cant return length
        this.animcount = 0;
    }
    
    update(){
      //run update logic on current animation
      this.parent.animationFrame = this.animations[this.currentAnimation].update();

      //check if animation should switch to
      if(this.animations[this.currentAnimation].exitcondition()){
        this.currentAnimation = this.animations[this.currentAnimation].exitAnimation;
      }
    }
}  


