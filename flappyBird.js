document.body.innerHTML = `
  <canvas id="myCanvas" width="600" height="300"></canvas>
  <img style='display:none;' src='https://img.poki-cdn.com/cdn-cgi/image/quality=78,width=1200,height=1200,fit=cover,f=png/5e0df231478aa0a331a4718d09dd91a2.png' id='bird'>
  <img style='display:none;' src='https://scuba.cs.uchicago.edu/summer2023/flappybird/bottom.png' id='pipe'>
  <img style='display:none;' src='https://img.itch.zone/aW1nLzcwODc5NDEucG5n/315x250%23c/YFBcnY.png' id='background'>
  <img style='display:none;' src='https://ai.thestempedia.com/wp-content/uploads/2023/05/floor-sprite.png' id='floor'>
`;

const canvas = document.getElementById("myCanvas");
canvas.style.position = "fixed";
canvas.style.top = "5px";
canvas.style.left = "5px";
canvas.style.outlineWidth = "5px";
canvas.style.outlineColor = "black";
canvas.style.outlineStyle = "solid";
const ctx = canvas.getContext("2d");

let bird, pipe, background, floor;
let y = 10;
let Speedy = 0;
let x = 0;
let pipes = [];
let playing = true;
let score = 0;
let Speedx = 5;
pipes.push({
  x:550,
  height:50,
  y: 210
});

// Wait until the images are loaded
function loadImages() {
  return new Promise((resolve, reject) => {
    bird = document.getElementById("bird");
    pipe = document.getElementById("pipe");
    background = document.getElementById("background");
    floor = document.getElementById("floor");

    if (bird.complete && pipe.complete && background.complete && floor.complete) {
      resolve(); // Both images are loaded
    } else {
      bird.onload = pipe.onload = floor.onload = background.onload = resolve;
      bird.onerror = pipe.onerror = floor.onerror = background.onerror = reject;
    };
  });
};

// Handle keypress for bird movement
document.body.onkeydown = function (e) {
  if (e.key == "ArrowUp"){
    Speedy = -3;
  }else if (e.key == "ArrowDown"){
    Speedy = 3;
  }else if (e.key == "o") {
    Speedx = -5
  };
  
  if (!playing) {
    x = 0;
    y = 150;
    playing = true;
    pipes = [];
    pipes.push({
      x:550,
      height:50,
      y: 210
    });
    
  };
};

function Lose() {
  score = 0;
  playing = false;
};

function draw() {
  requestAnimationFrame(draw);
  if(playing) {
    ctx.setTransform(1, 0, 0, 1, 0, 0); // Reset transformation matrix
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas
    
    ctx.drawImage(background, -canvas.width-(x%canvas.width), 0, canvas.width, canvas.height);
    ctx.drawImage(background, 0-(x%canvas.width), 0, canvas.width, canvas.height);
    ctx.drawImage(background, canvas.width-(x%canvas.width), 0, canvas.width, canvas.height);
    
    ctx.fillStyle = "balck";
    ctx.font = "20px Arial";
    ctx.fillText("Score:"+score,520,20);

    ctx.translate(180, y);
    ctx.rotate(Speedy * 5 * Math.PI / 180);
    ctx.drawImage(bird, -20, -20, 40, 40); // Draw bird
    ctx.rotate(Speedy * -5 * Math.PI / 180);
    ctx.translate(-180, -y);

    // Draw pipe
    let i = 0;
    ctx.drawImage(pipe, pipes[i].x-x, pipes[i].y, 49, 250);
    ctx.translate(pipes[i].x-x, pipes[i].y-pipes[i].height);
    ctx.rotate(180 * Math.PI / 180);
    ctx.drawImage(pipe,-49,0, 49, 250);
    ctx.rotate(-180 * Math.PI / 180);
    ctx.translate(-pipes[i].x-x, -pipes[i].y+pipes[i].height);

    if (pipes[i].x-x<-49) {
      pipes[i].x+=660;
      pipes[i].y = Math.floor(Math.random() * (210 - 70 + 1)) + 70;
      score += 1;
    };
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    
    ctx.drawImage(floor,0-(x%canvas.width),canvas.height-40,canvas.width,50);
    ctx.drawImage(floor,canvas.width-(x%canvas.width),canvas.height-40,canvas.width,50);


    Speedy += 0.1; // Gravity
    y += Speedy;
    x += Speedx;

    // Check if the bird hits the ground
    if (y > canvas.height - 50) {
      Lose();
    }
    if (pipes[0].x-x < 190 && pipes[0].x-x > 170) if (y > pipes[0].y || pipes[0].y-pipes[0].height > y) Lose();                                           
  }else {
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.fillStyle = "red";
    ctx.font = "100px Arial";
    ctx.fillText("YOU LOSE",50,200); 
    Speedx = 5
  }
}

loadImages().then(() => {
  console.log('Images loaded!');
  draw(); // Start the game once the images are ready
}).catch(err => {
  console.error('Error loading images:', err);
});
