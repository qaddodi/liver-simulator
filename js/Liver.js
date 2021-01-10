class Liver{
	constructor(x,y){
		this.life = 0; 

		//rendering properties
		this.pos = new Vector(x,y);
		this.cells = [];
		this.border = 0;
		this.safeZone = 0.2;

		//enzymes baselines
		this.alt = 30;
		this.ast = 24;
		this.alp = 40;
		this.ibili = 0.5;
		this.dbili = 0.5;
		this.tbili = 0;

		//enzyme kinetics of ALT and AST
		this.altHL = 47;
		this.astHL = 17;

		this.altProduction = 0.5;
		this.astProduction = 1;

		this.altElimination = Math.log(2)/this.altHL;
		this.astElimination = Math.log(2)/this.astHL;


		addEventListener('mousedown', this.mouseDown);
		addEventListener('mouseup',this.mouseUp);
	}	

	resetEnzymes(){
		this.alt = 0;
		this.ast = 0;
		this.alp = 0;
		this.ibili = 0;
		this.dbili = 0;
	}

	createCells(r,c){
		this.destroyCells();
		for (var i=0;i<r;i++){
			this.cells[i] = [];
			for(var j=0;j<c;j++){
				var cell = new Cell();
				if(i%8==0){
					cell.type = cell.types.vein;
				}
				if(i%8==1){
					cell.type = cell.types.hepatocyte;
				}
				if(i%8==2){
					cell.type = cell.types.hepatocyte;
				}
				if(i%8==3){
					cell.type = cell.types.cholangiocyte;
				}
				if(i%8==4){
					cell.type = cell.types.duct;
				}
				if(i%8==5){
					cell.type = cell.types.cholangiocyte;
				}
				if(i%8==6){
					cell.type = cell.types.hepatocyte;
				}
				if(i%8==7){
					cell.type = cell.types.hepatocyte;
				}

				if(cell.type == cell.types.hepatocyte){
					cell.alt = 1000;
					cell.ast = 1000;
				}
				this.cells[i][j] = cell; 
			}
		}
		this.obtainNeighbors();
	}

	mouseUp(e){
		var liver = this.liver;
		for (var i=0;i<liver.cells.length;i++){
			for(var j=0;j<liver.cells[i].length;j++){
				var cell = liver.cells[i][j];
				if(cell.pos.x < e.layerX && e.layerX < cell.pos.x+cell.width && cell.pos.y < e.layerY && e.layerY < cell.pos.y + cell.height){
					cell.custom = false; 
					if(cell.type == "duct"){
						cell.biliElimination[cell.type] = 0.5;
					}
				}
			}
		}
	}

	mouseDown(e){
		var liver = this.liver;
		for (var i=0;i<liver.cells.length;i++){
			for(var j=0;j<liver.cells[i].length;j++){
				var cell = liver.cells[i][j];
				if(cell.pos.x < e.layerX && e.layerX < cell.pos.x+cell.width && cell.pos.y < e.layerY && e.layerY < cell.pos.y + cell.height){
					cell.custom = true; 
					if(cell.type == "duct"){
						cell.biliElimination[cell.type] = 0;
					}
				}
			}
		}
	}

	obtainNeighbors(){
		for (var i=0;i<this.cells.length;i++){
			for(var j=0;j<this.cells[i].length;j++){
				var cell = this.cells[i][j];
				var neighbors = [];
				if(i<this.cells.length-1){neighbors.push(this.cells[i+1][j])};
				if(i>0){neighbors.push(this.cells[i-1][j])};
				if(j<this.cells[i].length-1){neighbors.push(this.cells[i][j+1])};
				if(j>0){neighbors.push(this.cells[i][j-1])};
				cell.neighbors = neighbors; 
			}
		}
	}

	destroyCells(){
		this.cells = [];
	}

	updateCells(dt){
		for (var i=0;i<this.cells.length;i++){
			for(var j=0;j<this.cells[i].length;j++){
				var cell = this.cells[i][j];
				cell.update(dt);
			}
		}
	}
	calculateChemistries(){
		var tbiliTotal = 0
		var altTotal = 0
		var astTotal = 0
		var veinCells = 0;
		for (var i=0;i<this.cells.length;i++){
			for(var j=0;j<this.cells[i].length;j++){
				var cell = this.cells[i][j];
				if(cell.type == "vein"){
					tbiliTotal += cell.bili;
					altTotal += cell.alt;
					astTotal += cell.ast;
					veinCells++;
				}
			}
		}
		this.Tbili = tbiliTotal;
		this.alt = altTotal/veinCells;
		this.ast = astTotal/veinCells;
	}

	kill(type){
		for (var i=0;i<this.cells.length;i++){
			for(var j=0;j<this.cells[i].length;j++){
				var cell = this.cells[i][j];
				if(cell.type == type){
					cell.kill();
				}
			}
		}
	}

	update(dt){	
		this.updateCells(dt);
		this.calculateChemistries();	
		this.life+= dt;	
	}

	createCellsGrid(){
		var w = context.canvas.width*(1-this.safeZone);
		var h = context.canvas.height*(1-this.safeZone);
		var cellHeight = Math.round(h/this.cells.length);
		var totalHeight = 0;
		for (var i=0;i<this.cells.length;i++){
			var cellWidth = Math.round(w/this.cells[i].length);
			for(var j=0;j<this.cells[i].length;j++){
				var cell = this.cells[i][j];
				var relativeHeight = cell.heights[cell.type];
				cell.width = cellWidth;
				cell.height = cellHeight*relativeHeight;
				cell.border = this.border;
				cell.pos.x = this.pos.x + cell.width*j;
				cell.pos.y = this.pos.y + totalHeight;
				cell.render(context);
			}
			totalHeight+= cell.height;
		}
	}

	renderCells(context){
		for (var i=0;i<this.cells.length;i++){
			for(var j=0;j<this.cells[i].length;j++){
				var cell = this.cells[i][j];
				cell.render(context);
			}
		}
	}

	render(context){
		//position the liver with the safeZone in mind
		//then calculate the placement of the cells
		//then render the cells
		var w = context.canvas.width*(1-this.safeZone);
		var h = context.canvas.height*(1-this.safeZone);

		this.pos.x = Math.round(context.canvas.width*this.safeZone/2);
		this.pos.y = Math.round(context.canvas.height*this.safeZone/2);
		this.createCellsGrid();
		this.renderCells(context);

		//draw a black border around the liver
		context.strokeStyle = "#000000";
		context.lineWidth = 10;
		context.strokeRect(this.pos.x,this.pos.y,w,h);
		context.lineWidth = 0.5;

		//write the ALT AST etc. stats on top of the liver model
		context.fillStyle = "#FFFFFF";
		var stats = {
			alt: "ALT: ".concat(this.alt.toFixed(2).toString()),
			ast: "AST: ".concat(this.ast.toFixed(2).toString()),
			tbili: "Tbili: ".concat(this.tbili.toFixed(2).toString()),
			alp: "ALP: ".concat(this.alp.toFixed(2).toString())
		}
		var textString = stats.alt.concat(", ".concat(stats.ast.concat(", ".concat(stats.tbili.concat(", ".concat(stats.alp))))));
		context.font = "20px Courier";
		context.fillText(textString,this.pos.x-this.safeZone,this.pos.y-this.safeZone-10);
		
	}
}
