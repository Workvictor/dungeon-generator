window.onload = main();

function main() {
	
	var game = new Game(800);
	game.initMenu();
	game.initControls();
	
	
	function update() {
		game.update();
	}
	
	function render() {
		game.clearScreen();
		
		game.draw();
		
	}
	
	function mainCycle() {
		update();
		render();
		
		window.requestAnimationFrame(mainCycle);
	}
	
	mainCycle()
	
	
}