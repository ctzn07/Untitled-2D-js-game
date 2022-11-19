import {Player} from './player.js';
import {InputHandler} from './input.js';
import {Vec} from './vector.js';
import { gameObject } from './gameObject.js';


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
            this.gameScale = 1; //use to scale all sprites in game
            this.deltaTime = 0;
            this.timeOld = Date.now();
            //since constructor runs on creation, use it to create all the relevant classes as well
            this.player = new Player(this);
            this.input = new InputHandler();
        }
        update(){
            //all updated math goes here

            //update deltaTime
            this.deltaTime = (Date.now() - this.timeOld)/1000;
            this.timeOld = Date.now()
            //relay inputs to Player
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
    const testobject = new gameObject(game, new Vec(250,250), false, player, new Vec(4,2));
    console.log(testobject);


    function animate(){
        ctx.clearRect(0,0,canvas.width, canvas.height);
        //call update on gameobject
        game.update();
        //call game object to run draw, using ctx as context
        game.draw(ctx);
        testobject.draw(ctx, 2);
        requestAnimationFrame(animate);
    }
    animate();
})