// prizes

function rainbow(){
  


  
  noFill();
  strokeWeight(10);
  
 
  
  let colours = ["red", "orange", "yellow", "green", "blue", "indigo", "violet"];
  let x = 115;
  let y = 550;
  let w = 200; 
  let h = 200;
  
  /* iterate through the colours array changing the length of the arc and the color each time */
  
  for (let i = 0; i < colours.length; i++) {
    stroke(colours[i]);
    arc(x, y, w, h, -PI, 0);
    w -= 20;
    h -= 20;
  } 
  
  
}

function makeCloud(NewCloudX, NewCloudY) {
  
  // make a cloud 
  
  fill(250)
  noStroke();
  ellipse(NewCloudX, NewCloudY, 70, 50);
  ellipse(NewCloudX + 10, NewCloudY + 10, 70, 50);
  ellipse(NewCloudX - 20, NewCloudY + 10, 70, 50);
}

function baby(){
  
  
  
  image(img, 460, 435);
  
    giggle.playMode('untilDone');
    giggle.play();
    
    if (timer > 60){
    
    
    giggle.stop();
  
  }
   
    
  
}