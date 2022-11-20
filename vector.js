export class Vec{
    constructor(x, y){
        //important to initialize default values to save headache...
        this.x = x;
        this.y = y;
    }
    plus(otherVec) {return new Vec(this.x + otherVec.x || 0, this.y + otherVec.y || 0);}
    plusValue(value){return new Vec(this.x + value || 0, this.y + value || 0);}
    minus(otherVec) {return new Vec(this.x - otherVec.x || 0, this.y - otherVec.y || 0);}
    minusValue(value){return new Vec(this.x - value || 0, this.y - value || 0);}
    multiply(otherVec) {return new Vec(this.x * otherVec.x || 0, this.y * otherVec.y || 0);}
    multiplyValue(value){return new Vec(this.x * value, this.y * value);}
    divide(otherVec){return new Vec(this.x / otherVec.x || 0, this.y / otherVec.y || 0);}
    divideValue(value){return new Vec(this.x / value || 0, this.y / value || 0);}
    length(){return Math.sqrt(this.x * this.x + this.y * this.y || 0);}
    normalize(){return new Vec(this.x/this.length() || 0, this.y/this.length() || 0);}
    zero(){this.x = 0, this.y = 0;}
    toString(){return `Vec{x: ${this.x}, y: ${this.y}}`;}
}