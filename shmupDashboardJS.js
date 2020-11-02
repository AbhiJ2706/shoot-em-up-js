let canvas1 = document.getElementById("canvas2"); //creating the field on which to draw text
let disp1 = canvas1.getContext("2d");
let percentage1 = 0; //percentage used for calculating multiplier
let percentage2 = 0; //percentage used for calculating multiplier
let percentage3 = 0; //percentage used for calculating multiplier
let percentage4 = 0; //percentage used for calculating multiplier
let multiplier = 0; //multiplier

//from the internets- used to make a smooth color gradient for the multiplier bar
function getColor(value){
    var hue=((1-value)*120).toString(10);
    return ["hsl(",hue,",100%,50%)"].join("");
}

//calculating the multiplier and filling the dashboard
function multiBar(){
	percentage1 = (100-(3*anEnemy.length)); //converting the amount of ships on the screen into an average-able number where more = bad
	percentage2 = 0;
	percentage3 = 0;
	let coefficient = 0;
	for (let i = 0; i < anEnemy.length; i++){ //using a loop to record the amount of lives each ship has and its elevation and convert it to an average-able number
		coefficient = 0;
		coefficient = anEnemy[i].level;
		percentage2 += coefficient;
		percentage3 += anEnemy[i].lives;
	}
	percentage2 = 100 - percentage2;
	percentage3 = 100 - percentage3;
	percentage4 = (5*percentage1 + 3*percentage2 + 2*percentage3)/1000; //using a weighted average
	multiplier = Math.ceil(percentage4 * 5); //rounding up
	if (multiplier < 0){
		multiplier = 0; //making sure user doesn't lose points
	}
	disp1.fillStyle = "#D5DEED";
	disp1.fillRect(0, 0, canvas1.width, canvas1.height); //clearing dashboard
	//printing stats
	disp1.fillStyle = "#000000";
	disp1.font = "20px Arial"; 
	disp1.fillText("Points: " + points, 40, 60);
	disp1.fillText("Multiplier: " + multiplier, 40, 82);
	disp1.fillText("Bullets left: " + (bulletCount), 40, 104);
	disp1.fillText("Lives: " + lives, 40, 126);
	//making multiplier bar
	for (let i = 0; i < Math.ceil(percentage4 * 100); i++){
		disp1.fillStyle = getColor(1 - (i / 100));
		disp1.fillRect(40 + 3*i, 135, 3, 40);
	}
	//adding additional text
	disp1.fillStyle = "#000000";
	disp1.rect(40, 135, 300, 40);
	disp1.stroke();
	disp1.font = "12px Arial";
	disp1.fillText("1", 40, 190);
	disp1.fillText("2", 100, 190);
	disp1.fillText("3", 160, 190);
	disp1.fillText("4", 220, 190);
	disp1.fillText("5", 280, 190);
	//creating console
	disp1.fillStyle = "#FFFFFF";
	disp1.fillRect(40, 1, 345, 30);
	//printing some messages for the user
	if (bulletCount==0){
		disp1.fillStyle = "#000000";
		disp1.font = "16px Arial";
		disp1.fillText("NO BULLETS LEFT! BUY SOME MORE!", 42, 21);
	} else if (multiplier == 0){
		disp1.fillStyle = "#000000";
		disp1.font = "16px Arial";
		disp1.fillText("LAST STAND!", 42, 21);
	}
	disp1.rect(40, 1, 345, 30);
	disp1.stroke();
}
