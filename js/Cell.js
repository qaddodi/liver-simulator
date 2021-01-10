class Cell{
	constructor(){

		this.types = 
		{
			hepatocyte: "hepatocyte",
			cholangiocyte: "cholangiocyte",
			duct: "duct",
			vein: "vein",
			dead: "dead"
		}

		this.heights = 
		{
			hepatocyte: 1,
			cholangiocyte: 1,
			duct: 1,
			vein: 1,
			dead: 1
		}
	

		this.colors = 
		{
			hepatocyte: "#4F4229",
			cholangiocyte: "#599F56",
			duct: "#7d802d",
			vein: "#0000ff",
			dead: "#000000"
		}

		this.borderColors = 
		{
			hepatocyte: "#000000",
			cholangiocyte: "#000000",
			duct: this.colors.duct,
			vein: this.colors.vein,
			dead: "#000000"
		}

		this.biliProduction = 
		{
			hepatocyte: 0,
			cholangiocyte: 0,
			duct: 0,
			vein: 0.5,
			dead: 0
		}

		this.biliElimination = 
		{
			hepatocyte: 0,
			cholangiocyte: 0,
			duct: 0.5,
			vein: 0,
			dead: 0
		}

		this.biliPermeability = 
		{
			hepatocyte: {
				hepatocyte: 1,
				cholangiocyte: 1,
				duct: 0,
				vein: 0.1,
				dead: 0
			},
			cholangiocyte: {
				hepatocyte: 0.5,
				cholangiocyte: 1,
				duct: 1,
				vein: 0,
				dead: 0
			},
			duct: {
				hepatocyte: 0,
				cholangiocyte: 0.5,
				duct: 1,
				vein: 0,
				dead: 0
			},
			vein: {
				hepatocyte: 0.5,
				cholangiocyte: 0,
				duct: 0,
				vein: 1,
				dead: 0
			},
			dead: 
			{
				hepatocyte: 1,
				cholangiocyte: 0,
				duct: 0,
				vein: 0,
				dead: 0
			}
		}

		this.enzymePermeability = 
		{
			hepatocyte: {
				hepatocyte: 1,
				cholangiocyte: 0,
				duct: 0,
				vein: 0.0001,
				dead: 0
			},
			cholangiocyte: {
				hepatocyte: 0,
				cholangiocyte: 0,
				duct: 0,
				vein: 0,
				dead: 0
			},
			duct: {
				hepatocyte: 0,
				cholangiocyte: 0,
				duct: 0,
				vein: 0,
				dead: 0
			},
			vein: {
				hepatocyte: 0,
				cholangiocyte: 0,
				duct: 0,
				vein: 1,
				dead: 0
			},
			dead: 
			{
				hepatocyte: 1,
				cholangiocyte: 0,
				duct: 0,
				vein: 1,
				dead: 0
			}
		}

		//vein elemation of ALT and AST
		this.altHL = 47;
		this.astHL = 17;
		this.altElimination = Math.log(2)/this.altHL;
		this.astElimination = Math.log(2)/this.astHL;

		// hepatocyte production of ALT and AST
		this.altProduction = 0.1;
		this.astProduction = 0.5;
		
		this.active = false;
		this.lagTime = 0; 
		this.activeTime = 0; 
		this.activeColor = "rgb(255,255,255)";

		this.customColor = "rgb(255,0,0)";
		this.custom = false; 

		this.type;
		this.color;
		this.borderColor;

		this.pos = new Vector(0,0);
		this.width = 0;
		this.height = 0;
		this.border = 0;

		this.life = 0;
		this.neighbors = [];

		this.ast = 0;
		this.alt = 0;
		this.alp = 0;
		this.ibili = 0;
		this.dbili = 0;
		this.bili = 0;
	}	

	kill(){
		this.type = this.types.dead;
	}

	neighborEffect(){
		for(var i = 0; i<this.neighbors.length; i++){
			var neighbor = this.neighbors[i];
			this.transportBili(neighbor);
			this.transportEnzymes(neighbor);
		}
	}

	transportBili(neighbor){
		var biliConstant = (1/this.neighbors.length)* this.biliPermeability[this.type][neighbor.type];
		var biliTransport = this.bili * biliConstant; 
		this.bili -= biliTransport;
		neighbor.bili += biliTransport;

		this.bili -= (this.bili*this.biliElimination[this.type]);
		this.bili += this.biliProduction[this.type];
	}
	transportEnzymes(neighbor){
		var diffusionConstant = this.enzymePermeability[this.type][neighbor.type];//*(1/this.neighbors.length);
		var altTransport = this.alt * diffusionConstant/2; 
		var astTransport = this.ast * diffusionConstant/2; 
		this.alt -= altTransport;
		neighbor.alt += altTransport;
		this.ast -= astTransport;
		neighbor.ast += astTransport;
	}
	updateEnzymes(dt){
		if(this.type == "hepatocyte"){
			this.alt += this.altProduction*dt;
			this.ast += this.astProduction*dt;
	
		}
		if(this.type == "vein"){
			this.alt = this.alt - this.alt*this.altElimination*dt;
			this.ast = this.ast - this.ast*this.astElimination*dt;
		}
	}


	update(dt){
		this.color = this.colors[this.type];
		this.borderColor = this.borderColors[this.type];
		if(this.custom){this.color = this.customColor};
		if(this.active){this.color = this.activeColor};

		this.neighborEffect();
		this.updateEnzymes(dt);

		if(this.type!="dead"){this.life+=dt;};
	}

	render(context){
		context.fillStyle = this.color;
		context.strokeStyle = this.borderColor;
		context.lineWidth = 0;
		context.fillRect(this.pos.x+this.border/2,this.pos.y+this.border/2,this.width-this.border/2,this.height-this.border/2);
		context.strokeRect(this.pos.x+this.border/2,this.pos.y+this.border/2,this.width,this.height);	
		context.fillStyle = "#ffffff";
		context.font = "16px Courier";
		// context.fillText(this.type.toString(),this.pos.x,this.pos.y+this.height/1.25);
		// context.fillText(this.alt.toFixed(1).toString(),this.pos.x+this.width/2,this.pos.y+this.height/1.75);
	}
}