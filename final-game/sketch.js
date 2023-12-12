//may not work on safari
// Declare a "SerialPort" object
let serial;

// fill in the name of your serial port here:
//copy this from the serial control app
let portName = "/dev/tty.usbmodem146101";

let inMessage;

let bgRcannel = 30;
let bgGchannel = 200;
let bgFcannel = 500;
let bullets = [];
let enemies = [];
let score = 0;
let bulletSpeed = 25; // Adjust the speed of bullets
let bulletInterval = 5; // Adjust the interval between bullet shots

function setup() {
  createCanvas(400, 400);
  
    // make an instance of the SerialPort object
  serial = new p5.SerialPort();

  // Get a list the ports available
  // You should have a callback defined to see the results. See gotList, below:
  serial.list();

  // Assuming our Arduino is connected,  open the connection to it
  serial.open(portName);

  // When you get a list of serial ports that are available
  serial.on('list', gotList);
  
    // When you some data from the serial port
  serial.on('data', gotData);

  // When you some data from the serial port

  // spawn enemies
  for (let i = 0; i < 10; i++) {
    let enemy = {
      x: random(0, width),
      y: random(-800, 0),
    };
    enemies.push(enemy);
  }
}

// Got the list of ports
function gotList(thelist) {
  // theList is an array of their names
  for (var i = 0; i < thelist.length; i++) {
    // Display in the console
    console.log(i + " " + thelist[i]);
  }
}

// Called when there is data available from the serial port
function gotData() {
  var currentString = serial.readLine();  // read the incoming data
  trim(currentString);                    // trim off trailing whitespace
  if (!currentString) return;             // if the incoming string is empty, do no more
  console.log(currentString);
      inMessage = currentString;   // save the currentString to use for the text
}

function draw() {
  background(bgRcannel, bgGchannel, bgFcannel);
  rectMode(CENTER);
  // draw the player
  // circle(inMessage, height - 20, 100);
  // Draw airplane body
      fill(150);
      rect(inMessage, height-35/2, 15, 35);

      // Draw airplane wings
      fill(100);
      triangle(inMessage+15/2, height-10, inMessage + 20, height-35/2,             inMessage+15/2, height - 30);
      triangle(inMessage-15/2, height-10, inMessage - 20, height-35/2,             inMessage-15/2, height - 30);

  // Automatically shoot bullets at regular intervals
  if (frameCount % bulletInterval === 0) {
    let bullet = {
      x: inMessage,
      y: height - 50,
    };
    bullets.push(bullet);
  }

  // Update and draw the bullets
  for (let bullet of bullets) {
    bullet.y -= bulletSpeed;
    circle(bullet.x, bullet.y, 10);
  }
  // update and draw enemies
  for (let enemy of enemies) {
    enemy.y += 2;
    rect(enemy.x, enemy.y, 10);
    if (enemy.y > height){
      text("You Lose!", width/2, height/2)
      noLoop()
    }
  }
  // DEAL WITH COLLISIONS
  for (let enemy of enemies) {
    for (let bullet of bullets) {
      if (dist(enemy.x, enemy.y, bullet.x, bullet.y) < 10) {
        enemies.splice(enemies.indexOf(enemy), 1);
        bullets.splice(bullets.indexOf(bullet), 1);
        let newEnemy = {
          x: random(0, width),
          y: random(-800, 0),
        };
        enemies.push(newEnemy);
        score += 1
      }
    }
  }
  
  text(score, 15, 25)
}

function mousePressed() {
  // spaw a bullet when a user clicks
  let bullet = {
    x: mouseX,
    y: height - 50,
  };
  bullets.push(bullet);
}
