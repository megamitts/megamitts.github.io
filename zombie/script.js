// --- START OF FILE script.js ---

const world = document.querySelector(".boops");
const { Engine, Render, Runner, World, Bodies } = Matter;

// scale global values
let xs = 0.1;
let ys = 0.1;

// Simplified createBall - it just creates a ball with given scales
function createBall(xs, ys, textureName) {
  const ball = Bodies.circle(Math.round(Math.random() * 1280), -30, 25, {  // x, y, radius
    angle: Math.PI * (Math.random() * 2 - 1), // radians
    friction: 0.001, //0.001,
    frictionAir: 0.001,
    restitution: 0.8, // how high the ball will bounce
    render: {
      sprite: {
        texture: textureName, //"head.png",
        xScale: xs, // Use passed-in scale
        yScale: ys  // Use passed-in scale
      }
    }
  });

  

  return ball;
}

const engine = Engine.create();
const runner = Runner.create();
const render = Render.create({
  canvas: world,
  engine: engine,
  options: {
    width: 1280,
    height: 720,
    background: "transparent",
    wireframes: false
  }
});

const boundaryOptions = {
  isStatic: true,
  render: {
    fillStyle: "transparent",
    strokeStyle: "transparent"
  }
};
const ground = Bodies.rectangle(640, 720, 1300, 4, boundaryOptions);
const leftWall = Bodies.rectangle(0, 360, 4, 740, boundaryOptions);
const rightWall = Bodies.rectangle(1280, 360, 4, 800, boundaryOptions);

Render.run(render);
Runner.run(runner, engine);

World.add(engine.world, [ground, leftWall, rightWall]);

// This function now creates *one* zombie and schedules the *next* one
function sendInTheZombies() {
  //const xs = 0.1; // Define scales locally if they don't change
  //const ys = 0.1;

	
	if (xs >= 0.3){
	xs = 0.1;
	} else {
	xs = xs + 0.1;
	}
	if (ys >= 0.3){
	ys = 0.1;
	} else {
	ys = ys + 0.1;
	}

  const ball2 = createBall(xs, ys, "head.png"); // Create a ball
  const ball3 = createBall(xs, ys, "head2.png");
  const ball4 = createBall(xs, ys, "head3.png");
  World.add(engine.world, [ball2]); // Add it to the world
  World.add(engine.world, [ball3]);
  World.add(engine.world, [ball4]);

  // Schedule the *next* call to this function after a delay
  setTimeout(sendInTheZombies, 500); // Create another zombie in 500ms (adjust as needed)
  setTimeout(() => {
  	
    World.remove(engine.world, ball2);
    World.remove(engine.world, ball3);
    World.remove(engine.world, ball4);
  }, 30000); 
};

// *** Add this line ***
// Start the zombie invasion after the initial setup!
sendInTheZombies();


/*
// Keep handleClick commented out if you don't want the button anymore
const handleClick = () => {
	const xs = 0.1;
	const ys = 0.1;
  const ball2 = createBall(xs, ys);
  World.add(engine.world, [ball2]);
};

const button = document.querySelector("#boop");
button.addEventListener("click", handleClick);
*/

// --- END OF FILE script.js ---




