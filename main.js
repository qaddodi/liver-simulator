const canvas = document.getElementById("canvas");
const context = canvas.getContext("2d");

const stats = document.getElementById("textArea");

const graphArea = document.getElementById("graph");
const graphContext = graphArea.getContext("2d");
graphArea.width = 800;
graphArea.height = 200;
canvas.width = 800;
canvas.height = 800;

var chart;
var bgColor = '#000000';
var fps = 30;
var simulationSpeed = 1;
var fpsInterval, startTime, now, then, elapsed;
var t = 0;
var frame = 0;
var stop = false;
var altArray = [];
var astArray = [];

var graphUpdateFrequency = 1; //per time unit (usually hr here)

var liver = new Liver(0,0);

renderGraph();
start(fps);
updateGraph();


function createBackgroundLayer(){
	context.fillStyle=bgColor;
	context.fillRect(0,0,canvas.width,canvas.height);
}

function renderGraph(){
	chart = new Chart(graphContext, {
		type: 'line',
		data: {
			datasets: [
			{
				label: 'ALT',
				data: altArray,
				pointRadius: 0,
				fill: false,
				borderColor: "rgb(0,0,0)",
				borderWidth: 2
			},
			{
				label: 'AST',
				data: astArray,
				pointRadius: 0,
				fill: false,
				borderColor: "rgb(0,200,0)",
				borderWidth: 2
			}]
		},
		options: {
			responsive: false,
			animation:false,
			scales:{
				yAxes:[{
					ticks: {
						suggestedMin: 20,
						suggestedMax: 60,
						fontSize: 10
					 }
				}],
				xAxes:[{
					display: true,
					type: "linear",
					beginAtZero: false,
					ticks: {
						fontSize: 10,
						// suggestedMin: 0,
						suggestedMax: 500
					 }
				}]
			},
			legend:{
				labels:{
					fontSize:10
				}
			}
		}
	});
}

function updateGraph(){
	var x = t;
	var alt = liver.alt;
	var ast = liver.ast;
	altArray.push({x,y: alt});
	astArray.push({x,y: ast});
	if(altArray.length>500){altArray.shift()};
	if(astArray.length>500){astArray.shift()};

	chart.update();
}

function updateStats(){
	stats.innerHTML = "";
	stats.innerHTML+="ALT: "
	stats.innerHTML += liver.alt.toFixed(2).toString();
	stats.innerHTML+= "\n"
	stats.innerHTML += "AST: "
	stats.innerHTML += liver.ast.toFixed(2).toString();
	stats.innerHTML+= "\n"
	stats.innerHTML += "ALP: "
	stats.innerHTML += liver.alp.toFixed(2).toString();
	stats.innerHTML+= "\n"
	stats.innerHTML += "Direct Bili: "
	stats.innerHTML += liver.dbili.toFixed(2).toString();
	stats.innerHTML+= "\n"
	stats.innerHTML += "Total Bili: "
	var totalBili = liver.dbili + liver.ibili;
	stats.innerHTML += totalBili.toFixed(2).toString();
	stats.innerHTML+= "\n"
	stats.innerHTML+= "Time: "
	stats.innerHTML+= t.toFixed(2).toString();
	stats.innerHTML+= " hrs";
	stats.innerHTML+= "\n";
	stats.innerHTML+= "Frame: "
	stats.innerHTML+= frame.toString();
}
function update(dt){
	liver.update(dt);
	// updateStats();

}

function render(){
	createBackgroundLayer();
	liver.render(context);	
}


function start(fps){
	fpsInterval = 1000/fps;
	then = Date.now();
	startTime = then;
	loop();
}

function loop(){
	if(stop){
		return;
	}
	requestAnimationFrame(loop);
	now = Date.now();
	elapsed = now-then;
	
	if(elapsed>fpsInterval){
		for(var i =0; i<simulationSpeed;i++){
			then = now - (elapsed%fpsInterval);
			frame++;
			t+=(fpsInterval/1000);
			// t = t%24; //if need the t by days, use this
			var dt = elapsed/1000;
			update(dt);
			if(frame%(fps*graphUpdateFrequency)==0){
				updateGraph();
			}
		}
		render();
		
	}
}
