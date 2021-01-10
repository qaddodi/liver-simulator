class KeyboardHandler{
    constructor(object, window){
        this.object = object;
    }
    keyDownHandler(event) {
        if(event.keyCode == 39) {
            this.object.angVel = this.object.speed;
            this.object.move();
        }
        else if(event.keyCode == 37) {
            this.object.angVel = -this.object.speed;
            this.object.move();
        }
        if(event.keyCode == 40) {
            this.object.vel.set(0,this.object.speed);
            this.object.dir = -1;
       }
        else if(event.keyCode == 38) {
            this.object.dir = 1;
            this.object.vel.set(0,this.object.speed);
        }
    }
    keyUpHnadler(event){
        if(event.keyCode == 40 || event.keyCode == 38){
            this.object.vel.set(0,0);
        }
        if(event.keyCode == 39 || event.keyCode == 37){
            this.object.angVel = 0;
        }
    }
}