import {Player} from './player.js';
import {InputHandler} from './input.js';


//load event : JavaScript waits for all dependent resources such as stylesheets and images to be fully loaded and available before it runs
window.addEventListener('load', function(){
    const canvas = document.getElementById('canvas1');
    const ctx = canvas.getContext('2d');
    canvas.width = 500;
    canvas.height = 500;

    class Game{
        constructor(width, height){
            this.width = width;
            this.height = height;
            this.deltaTime = 0;
            //since constructor runs on creation, use it to create all the relevant classes as well
            this.player = new Player(this);
            this.input = new InputHandler();
        }
        update(){
            //all updated math goes here

            this.player.update(this.input.keys);
        }
        draw(context){
            //all canvas draws go here
            this.player.draw(context);

        }
    }
    //this triggers the creation of new game class, and run constructor with it
    const game = new Game(canvas.width, canvas.height);
    console.log(game);


    function animate(){
        ctx.clearRect(0,0,canvas.width, canvas.height);
        //call update on gameobject
        game.update();
        //call game object to run draw, using ctx as context
        game.draw(ctx);
        requestAnimationFrame(animate);
    }
    animate();
})