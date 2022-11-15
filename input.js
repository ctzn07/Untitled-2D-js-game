export class InputHandler{
    constructor(){
        //array of keys being held down
        this.keys = [];

        window.addEventListener('keydown', e =>{
           if((e.key === 'W' || 'S' || 'A' || 'D' || 'Enter') && this.keys.indexOf(e.key)=== -1){
                //listen to all keypresses, checks for specific keys, and adds it to keys[] if it's not there
                this.keys.push(e.key);
                //console.log(this.keys);
           }
        });

        window.addEventListener('keyup', e =>{
            if(e.key === 'W' || 'S' || 'A' || 'D' || 'Enter'){
                //listens for specific keys being released, and removes it it from keys[]
                this.keys.splice(this.keys.indexOf(e.key), 1);
                //console.log(this.keys);
            }
        });
    }
}