/*
Shoot em up!- Alien Attack!

Oct 25, 2018

Abhi Jain

A shooter game where the user controls a tank which shoots bombs (using projectile motion formulas so the trajectory is parabolic) at alien ships which bob up and down and move from side to side, lowering themselves as their lifetime increases, and periodically dropping bombs. The user must avoid these bombs, and if they are hit, the lose a life and are stunned for 2 seconds. 

Note: this file contains all the classes and objects used, as well as core game logic.
For the shop, see shmupSHOP.js
For the dashboard, see shmupPoints.js 
*/


//Variables__________________________________________________________________________________________________________________________________________________________________________


let canvas = document.getElementById("myCanvas"); //creating the field on which to draw text
let disp = canvas.getContext("2d");
document.addEventListener("mousemove", mouseMoveHandler, false); //adding event listener for mouse
document.addEventListener("keydown", keyDownHandler, false); //adding event listener for keys
let balls = []; //array containing all the bullets the tank fires
let bulletCount = 30; //amount of bullets the user has
let bombs = []; //array containing all the bombs the ships drop
let anEnemy = []; //array containing all the enemy ships
let points = 0; //user score
let assignPoints = 0; //whether to give the player points (timed event)
let damage = 1; //amount of damage each bullet does
let angleDeg = 0; //angle at which to fire projectiles
let youCanMove = false; //allowing players and ships to move
let tutorial = true; //whether to show the controls screen or not
let gameEnd = false; //whether the game has ended or not
let bulletsFired = 0; //amount of bullets fired by user
let time = 0; //seconds user survives
let lives = 5; //amount of user lives
let livesLost = false; //whether a bomb has hit the user tank
let highScore = 0; //user high score


//Game function and classes_________________________________________________________________________________________________________________________________________________________


function keyDownHandler(e){ //handling key events
	if (youCanMove){ //if user can move
		if (e.keyCode == 87 && bulletCount > 0 && anEnemy.length >= 3){ //if key is w and user has bullets and there are at lest 3 ships on screen
			if (character.enabled){ //if character is not stunned by bombs
				bulletCount--; //lose a bullet
				bulletsFired++; //add to bullets fired
				balls.push(new ball()); //create bullet
			}
		} else if (e.keyCode == 65){ //if key is a
			character.moveLeft();
		} else if (e.keyCode == 68){ //if key is d
			character.moveRight();
		}
	} else if (youCanMove == false && gameEnd == true && e.keyCode == 13){ //resetting the game at the end
		highScore = points;
		bulletCount = 30;
		bombs = [];
		balls = [];
		anEnemy = [];
		points = 0;
		assignPoints = 0;
		damage = 1;
		angleDeg = 0;
		youCanMove = true;
		gameEnd = false;
		bulletsFired = 0;
		time = 0;
		percentage1 = 0
		percentage2 = 0;
		percentage3 = 0;
		percentage4 = 0;
		multiplier = 0;
		bulletsBought = false;
		disp.fillStyle = "#D5DEED";
		disp.fillRect(0, 0, 820, 640);
		lives = 5;
	} else if (youCanMove == false && tutorial == true && e.keyCode == 13){ //starting the game after the tutorial
		tutorial = false;
		youCanMove = true;
		disp.fillStyle = "#D5DEED"; //clearing display
		disp.fillRect(0, 0, 820, 640);
	}
}

function mouseMoveHandler(e){ //mouse movement events
	var rect = canvas.getBoundingClientRect(); //making sure coordinate accuracy since mouse can be finicky
	var p1 = { //first point
		x: character.x,
		y: character.y
	};
	var p2 = { //second point
		x: e.clientX - rect.left,
		y: e.clientY - rect.top
	};
	angleDeg = -(Math.atan2(p2.y - p1.y, p2.x - p1.x) * 180 / Math.PI); //finding the angle between the character and the mouse
	if (character.enabled){ //using this angle to draw the character's picture aiming in that direction
		//clearing character
		disp.fillStyle = "#D5DEED";
		disp.fillRect(character.x, character.y, 50, 50);
		//I could only find 9 pictures of the same tank. So there are only 9 possible positions for the tank.
		if (angleDeg <= 180 && angleDeg >= 160){
			character.img = document.getElementById("tank1")
		} else if (angleDeg < 160 && angleDeg >= 140){
			character.img = document.getElementById("tank2")
		} else if (angleDeg < 140 && angleDeg >= 120){
			character.img = document.getElementById("tank3")
		} else if (angleDeg < 120 && angleDeg >= 100){
			character.img = document.getElementById("tank4")
		} else if (angleDeg < 100 && angleDeg >= 80){
			character.img = document.getElementById("tank5")
		} else if (angleDeg < 80 && angleDeg >= 60){
			character.img = document.getElementById("tank6")
		} else if (angleDeg < 60 && angleDeg >= 40){
			character.img = document.getElementById("tank7")
		} else if (angleDeg < 40 && angleDeg >= 20){
			character.img = document.getElementById("tank8")
		} else if (angleDeg < 20 && angleDeg >= 0){
			character.img = document.getElementById("tank9")
		} 
	}
}

//the tank which the user controls
var character = {
	x:400, //character x
	y:390, //character y
	enabled:"true", // if character is disabled or not
	img:document.getElementById("tank1"), //character image
	moveLeft(){ //move left
		if (this.enabled){
			disp.fillStyle = "#D5DEED";
			disp.fillRect(this.x, this.y, 50, 50);
			this.x -= 10;
		}
	},
	moveRight(){ //move right
		if (this.enabled){
			disp.fillStyle = "#D5DEED";
			disp.fillRect(this.x, this.y, 50, 50);
			this.x += 10;
		}
	},
	drawSelf(){ //draw image
		disp.drawImage(this.img, this.x, this.y, 50, 50);
	},
}

//the bullet which the character fires

class ball {
	constructor(){
		this.x = character.x + 25; //initial position
		this.y = character.y + 25; //initial position
		this.radius = 5; //size
		this.img = document.getElementById("bomb"); //image
		this.enabled = true; //to move and collide or not to move and collide
		this.gravity = 9.81; //coefficient of gravity (because this is earth and also because of projectile motion)
		this.velocity = 100; //speed of bullet (any faster and it's too fast)
		this.vx = this.velocity * Math.cos(Math.PI/180 * angleDeg); //velocity in the x direction
		this.vy = this.velocity * Math.sin(Math.PI/180 * angleDeg); //velocity in the y direction
		this.t = 0; //time since being fired, controls speed of bullet
		this.x2 = character.x + 25; // this is constant to allow the bullet to be fired from any x
		this.angle = angleDeg; //angle at which bullet is fired
			
	}
	move(){
		for (let i = 0; i < anEnemy.length; i++){ //checking for collision 
			if (this.x > anEnemy[i].x && this.x < anEnemy[i].x+70 && this.y > anEnemy[i].y && this.y < anEnemy[i].y+70 && this.enabled && anEnemy[i].enabled) { //if collision
				anEnemy[i].lives -= damage;
				if (anEnemy.lives > 1){
					points += multiplier;
				} else {
					points += 2*multiplier; //bonus for killing enemy
				}
				disp.drawImage(document.getElementById("explosion"), anEnemy[i].x, anEnemy[i].y, 60, 40); //drawing explosion to give user indication
				this.enabled = false; //stopping bullet from moving further
				if (anEnemy[i].lives == 0){ //killing enemy
					anEnemy[i].enabled = false;
				}
				balls.splice(balls.indexOf(this), 1); //removing bullet from array to counteract lag
			}
		}
		if (this.enabled){ //if bullet is in motion
			disp.fillStyle = "#D5DEED"; //clearing self
			disp.fillRect(this.x - this.radius - 1, this.y - this.radius - 1, this.radius * 2 + 2, this.radius * 2 + 2); 
			this.t += 0.5; //adding to time fired
			this.x = this.vx*(this.t) + this.x2; //calculating new x position
			this.y = 390 - (this.vy*this.t - (this.gravity/2)*this.t*this.t) //calculating new y position (390 is constant)
			if (this.y < 0){
				balls.splice(balls.indexOf(this), 1); //removing ball from array if it is higher than the display
			}
		}
	}
	draw(){ //drawing
		if (this.enabled){
			disp.drawImage(this.img, this.x - 7, this.y - 7, 13, 13); 
		}
	}
}


//spaceships drop these
class bomb {
	constructor(x, y){
		this.x = x; //x position
		this.y = y; //y position
		this.enabled = true; //to drop or not to drop
		this.img = document.getElementById("bomb"); //image
		this.collided = false; //if it hit the user (protection to prevent the removal of multiple lives at once)
	}
	drop(){ //bomb falling
		if(this.x >= character.x && this.x <= character.x+50 && this.y >= character.y && this.y <= character.y+50 && this.enabled == true) { //if collision with character
			character.enabled = false; //disabling character
			this.collided = true; //bomb has collided
			character.img = document.getElementById("tank10"); //drawing image of tank disabled
			if (!(livesLost)){ //subtracting from lives
				livesLost = true;
				lives --;
			}
			window.setTimeout(function(){character.enabled = true; //resetting character in 2 seconds
				character.img = document.getElementById("tank1");
				disp.fillStyle = "#D5DEED";
				disp.fillRect(character.x, character.y, 50, 50);
			}, 2000); 
			if (lives == 0){ //ending game
				youCanMove = false;
				window.setTimeout(function(){gameEnd = true;}, 2000);
			}
		}
		//dropping action
		if (this.enabled && this.y < 420){
			disp.fillStyle = "#D5DEED";
			disp.fillRect(this.x, this.y, 20, 20);
			this.y += 6;
		} else if (this.y >= 420){ //if bomb has finished falling (reached ground)
			this.enabled = false;
			if (this.collided){
				livesLost = false; //allowing the user to lose lives again
			}
			disp.fillStyle = "#D5DEED"; //clearing self
			disp.fillRect(this.x - 20, this.y - 20, 50, 50);
			bombs.splice(bombs.indexOf(this), 1); //removing self from array
		}
	}
	draw(){ //drawing self
		if (this.y >= 420 && this.enabled){ //explosion
			disp.drawImage(document.getElementById("explosion"), this.x - 20, this.y - 20, 50, 50);
		} else if (this.enabled) { //bomb
			disp.drawImage(this.img, this.x, this.y, 20, 20);
		}
	}
}

class attacker { //alien ship!!
	constructor(x){
		this.x = x; //takes an x parameter to begin with
		this.y = 0; //y position
		this.direction = "left"; //direction in which ship is headed
		this.enabled = true; //ship is alive or dead
		this.lives = 5; //amount of lives ship has
		this.img = document.getElementById("attacker"); //image
		this.rounds = 0; //amount of times ship has gone back and forth
		this.prevY = 0; //previous y for moving down (for when to stop)
		this.moveDown = false; //move down or not
		this.gravity = 2; //gravity for when dying
		this.gravitySpeed = 3; //acceleration towards ground
		this.count = 0; //controlling sine animation
		this.level = 0; //elevation above ground
		this.canMove = true; //for if it's stunned or not
	}
	moveLeft(){ //moving left
		var increase = Math.PI * 2 / 100; //for controlling sine animation
		disp.fillStyle = "#D5DEED"; //clearing self
		disp.fillRect(this.x, this.y, 70, 70);
		if (this.moveDown){ //if th ship must move down to next level
			this.y+=4; //adding to y
			if (this.y >= this.prevY+60){ //if ship has moved 60 or more pixels
				this.moveDown = false; //stop moving down
				this.level++; //elevation change
				if (anEnemy.length < 22){ //adding new ship (cap to prevent lag and extreme difficulty)
					anEnemy.push(new attacker(400)); //adding new attacker
				}
			}
		} else if (this.canMove && !(this.moveDown)){ //if ship can move
			// speed modulation depending on how close to extremities the ship is
			if (this.x >= 100){ 
				this.x -= 7;
			} else if (this.x <= 100 && this.x >= 50){
				this.x -= 6;
			} else if (this.x >= 0 && this.x <= 50) {
				this.x -= 4;
			} else if (this.x <= 5){ //changing direction
				this.direction = "right";
				this.rounds ++; //adding to how many back and forth circuits ship has made
				if (this.level == 6 && this.rounds % 2 == 0){ //if ship reaches certain elevation, game is lost automatically
					youCanMove = false;
					window.setTimeout(function(){gameEnd = true;}, 2000);
				} else if (this.rounds % 2 == 0 && this.level < 6){ //moving downwards
					this.prevY = this.y;
					this.moveDown = true;
				}
			}
			//sine animation up and down while ship is moving sideways
			this.y = Math.sin( 4*this.count ) * 10 + 60*this.level;
			this.count += increase;
		}
	}
	moveRight(){
		//not documenting this since it is the same logic as moveleft() with different limits
		var increase = Math.PI * 2 / 100;
		disp.fillStyle = "#D5DEED";
		disp.fillRect(this.x, this.y, 70, 70);
		if (this.moveDown){
			this.y+=4;
			if (this.y >= this.prevY+60){
				this.level++;
				this.moveDown = false;
				if (anEnemy.length < 22){
					anEnemy.push(new attacker(400));
				}
			}
		} else if (this.canMove && !(this.moveDown)){
			if (this.x <= 650){
				this.x += 7;
			} else if (this.x >= 650 && this.x <= 700){
				this.x += 6;
			} else if (this.x >= 700 && this.x <= 750) {
				this.x += 4;
			} else if (this.x >= 745){
				this.direction = "left";
				this.rounds ++;
				if (this.level == 6 && this.rounds % 2 == 0){
					youCanMove = false;
					window.setTimeout(function(){gameEnd = true;}, 2000);
				} else if (this.rounds % 2 == 0 && this.level < 6){
					this.prevY = this.y;
					this.moveDown = true;
				}
			}
			this.y = Math.sin( 4*this.count ) * 10 + 60*this.level;
			this.count += increase;
		}
	}
	die(){ //if ship is dead, it falls
		disp.fillStyle = "#D5DEED"; //clearing
		disp.fillRect(this.x, this.y, 70, 70);
		this.gravitySpeed += this.gravity; //accelerating
		if (this.direction == "right"){ //goign left or right depending on direction it was going when shot down
			this.x += 5;
		} else {
			this.x -= 5;
		}
		this.y += this.gravitySpeed; //adding to y position
		if (this.y > 375){ //ending the cycle of falling
			disp.fillStyle = "#D5DEED";
			disp.fillRect(this.x, this.y, 70, 70);
			anEnemy.splice(anEnemy.indexOf(this), 1); //removing from array
		}
	}
	sine(){ //moving up and down before and after game
		disp.fillStyle = "#D5DEED"; //clearing
		disp.fillRect(this.x, this.y, 70, 70);
		var increase = Math.PI * 2 / 100;
		this.y = Math.sin( 4*this.count ) * 10 + 60*this.level;
		this.count += increase;
	}
	drawSelf(){ //drawing self
		disp.drawImage(this.img, this.x, this.y, 70, 70);
	}
	dropBomb(bombs){ //dropping bomb
		if (Math.floor(Math.random()*200) == 99){ //1 in 100 chance (happens often enough)
			bombs.push(new bomb(this.x, this.y));
		}
		return bombs;
	}
}

anEnemy.push(new attacker(400)); //starting with a single alien ship

function doAMove(){ //timing and controlling movement of ships and bombs and bullets and drawing the all
	let attackers = anEnemy.length; //usign local var to store array length to prevent lag
	if (youCanMove){
		assignPoints++; //timing score addition and adding to seconds
		if (assignPoints % 60 == 0){
			points += multiplier;
		} else if (assignPoints % 20 == 0){
			time++;
		}
		for (let i = 0; i < attackers; i++){ //moving enemies
			if (anEnemy[i].enabled){
				bombs = anEnemy[i].dropBomb(bombs); //dropping bombs
				if (anEnemy[i].direction == "left"){ //moving left
					anEnemy[i].moveLeft();
				} else if (anEnemy[i].direction == "right"){ //moving right
				anEnemy[i].moveRight();
				}
			} else { //falling
				anEnemy[i].die();
			}
		}
	} else { //moving up and down before or after game
		for (let i = 0; i < attackers; i++){
			anEnemy[i].sine();
		}
	}
	if (!(gameEnd)){ //drawing and moving bullets, bombs, aliens
		let ballsLength = balls.length; //local variable trick to prevent lag
		let bombsLength = bombs.length;
		for (let i = 0; i < ballsLength; i++){
			balls[i].move();
			balls[i].draw();
		}
		for (let i = 0; i < bombsLength; i++){
			if (bombs[i].enabled){
				bombs[i].drop();
				bombs[i].draw();
			}
		}	
		multiBar(); //calculating multiplier (see shmupPoints.js)
		for (let i = 0; i < 26; i++){ //drawing grass at bottom of screen
			disp.drawImage(document.getElementById("grass"), 80*i, 440, 80, 80);
		}
		if (anEnemy.length == 0){ //adding new alien if all of the are gone to keep the game spicy
			anEnemy.push(new attacker(400));
		}
	}
}

window.setInterval(doAMove, 50); //running the function every 50ms

function draw() { //drawing
	if (youCanMove){
		character.drawSelf(); //drawing character (must be constant since the angle of the mouse to it is not time-dependant)
	} 
	if (!(gameEnd)){
		for (let i = 0; i < anEnemy.length; i++){ //drawing enemies
			anEnemy[i].drawSelf();
		}
	}  
	if (youCanMove == false && gameEnd == true){
		//drawing end screen
		disp.fillStyle = "#FFFFFF";
		disp.fillRect(60, 60, 820-120, 400);
		disp.fillStyle = "#000000";
		disp.rect(60, 60, 820-120, 400);
		disp.stroke();
		if (points > highScore){
			disp.fillStyle = "#00FF00";
			disp.font = "36px Arial"
			disp.fillText("New high score! " + points + " points" , 70, 171);
		}
		disp.fillStyle = "#FF0000";
		disp.font = "72px Arial";
		disp.fillText("Game over!", 70, 130);
		disp.font = "36px Arial";
		disp.fillText("Your score was: " + points, 70, 220);
		disp.fillText("Bullets fired: " + bulletsFired, 70, 270);
		disp.fillText("Time surviving: " + time + " seconds", 70, 320);
		disp.font = "72px Arial";
		disp.fillText("Play again: hit enter", 70, 430);
	} else if (youCanMove == false && tutorial == true){
		//drawing tutorial
		disp.fillStyle = "#D5DEED";
		disp.fillRect(0, 74, 820, 360);
		disp.fillStyle = "#FF0000";
		disp.font = "36px Arial";
		disp.fillText("Use A and D to move side to side!", 10, 110);
		disp.fillText("Use W to shoot bullets and aim with the mouse!", 10, 160);
		disp.fillText("You can only shoot if there's 3 ships or more!", 10, 210);
		disp.fillText("Keep your multipler high to get more points!", 10, 260);
		disp.fillText("Don't let your lives reach 0!", 10, 310);
		disp.fillText("Ready? Press enter!", 10, 360);
		disp.strokeStyle = "#FF0000";
		disp.beginPath();
		disp.moveTo(715, 245);
		disp.lineTo(820, 160);
		disp.stroke();
		disp.strokeStyle = "#000000";
		disp.restore();
		character.drawSelf();
		anEnemy[0].drawSelf();
	}
	requestAnimationFrame(draw);
}

draw(); //running game

//that's a lotta comments! (165)