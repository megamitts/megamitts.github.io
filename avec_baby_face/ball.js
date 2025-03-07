class Ball {
  
  constructor(x,y){
  this.x = x;
  this.y = y;
  this.xspeed = 4;
  this.yspeed = -3;
  this.radius = random(100);
  }


  bounce(){
  
    
  if (this.x > width-this.radius || this.x < this.radius) {
    this.xspeed = this.xspeed * -1;
    boing.play(); // boing sound effect
  }

  if (this.y > 400 - this.radius || this.y < this.radius) {
    this.yspeed = this.yspeed * -1;
    boing.play();
  }
  
  }

  display(){
    
   
    
  stroke(this.y, this.x, random(128));
  strokeWeight(10);
  fill(200, 0, 200);
  ellipse(this.x, this.y, this.radius*2, this.radius*2);
  
  }    
   
  move(){
  this.x = this.x + this.xspeed;
  this.y = this.y + this.yspeed;
  }
    
}
  
