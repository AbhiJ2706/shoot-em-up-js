/*
Points
*/
let bulletsBought = false;


//creating buttons to be displayed in the bottom right corner
button1 = document.createElement("button"); //creating button as HTML element
button1.innerHTML = "Buy bullets! Depends on how many points you have <br> 30 for 120 points <br> 20 for 75 <br> 10 for 30"; //changing text
body = document.getElementById("rightDown"); //adding to HTML
body.appendChild(button1); //adding button to screen
button1.onclick = function(){ //action: buying bullets
	//only goes through 1 of these options per click
	if (points >= 120 && bulletsBought == false){
		points -= 120; //spending points
		bulletCount += 30; //gaining bullets
		bulletsBought = true; //makes the code skip the other options so bullets are only purchased once
	} else if (points >= 75 && bulletsBought == false){
		points -= 75;
		bulletCount += 20;
		bulletsBought = true;
	} else if (points >= 30 && bulletsBought == false){
		bulletCount += 10;
		points -= 30;
		bulletsBought = true;
	}
	bulletsBought = false;
}
button2 = document.createElement("button"); //creating button as HTML element
button2.innerHTML = "Bullets instantly kill for 5 seconds: 210 points";
button2.onclick = function(){
	if (points >= 210){
		points -= 210;
		damage = 5; //ships have 5 lives: 5 damage = instakill
		window.setTimeout(function(){damage = 1;}, 5000); //resetting to regular damage after 5 seconds
	}
}
body.appendChild(button2);
button3 = document.createElement("button"); //creating button as HTML element
button3.innerHTML = "Get rid of 5 ships for 210 points";
body.appendChild(button3);
button3.onclick = function(){
	if (points >= 210){
		points -= 210;
		// killing 5 ships at the front
		for (let i = 0; i < 5; i++){
			anEnemy[i].lives = 0;
			anEnemy[i].enabled = false;
		}
	}
}
button4 = document.createElement("button"); //creating button as HTML element
button4.innerHTML = "Immobilise enemies for 5 seconds: 210 points";
body.appendChild(button4);
button4.onclick = function(){
	if (points >= 210){
		points -= 210;
		//stops enemies from moving
		attackers = anEnemy.length;
		for (let i = 0; i < attackers; i++){
			anEnemy[i].canMove = false;
		}
		window.setTimeout(function(){
			attackers = anEnemy.length;
			for (let i = 0; i < attackers; i++){
				anEnemy[i].canMove = true;
			}
		}, 5000);
	}
}