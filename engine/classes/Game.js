function Game(width) {
	this.initScreen(width);
	this.STATES = {menu: 0, gameLoop: 1};
	this.state = this.STATES.menu;
	this.keyState = {};
	this.keyCode = {LEFT: 37, UP: 38, RIGHT: 39, DOWN: 40};
	this.vx = 0;
	this.vy = 0;
	this.scrollSpeed = 5;

	this.clearScreen = function () {
		this.ctx.clearRect(0, 0, this.screen.width, this.screen.height);
	}
}

Game.prototype.initScreen = function (width) {
	this.screen = document.createElement("canvas");
	document.body.appendChild(this.screen);
	this.screen.width = width;
	this.screen.height = this.screen.width / 16 * 9;
	this.screen.x = 0;
	this.screen.y = 0;
	this.ctx = this.screen.getContext('2d');
	this.curentScale = 1;
	this.scaleMax = 1;
	this.scaleMin = 0.25;
	this.zoomOut = false;
	this.zoomIn = false;

};

Game.prototype.initMenu = function () {
	this.menu = new Menu(this.screen, this.ctx);
};

Game.prototype.initPlayer = function (x, y, blocksize) {
	this.player = new Player(x, y, blocksize);
};

Game.prototype.initControls = function () {

	this.mouse = new Mouse();

	this.screen.addEventListener('mousemove', function (event) {
		this.mouse.move(this.screen, event);
		this.mouse.x /= this.curentScale;
		this.mouse.y /= this.curentScale;
	}.bind(this));

	this.screen.addEventListener('mousedown', function () {

	});

	this.screen.addEventListener('mouseup', function () {

	});

	this.screen.addEventListener('contextmenu', function () {

	});
	this.screen.addEventListener('click', function (event) {
		this.clickEvent(event);
	}.bind(this));
	this.screen.addEventListener('wheel', function (event) {
		// this.mouse.onwheel(this.curentScale, event);


		this.scaleOnWheel(event);
		this.mouse.x /= this.curentScale;
		this.mouse.y /= this.curentScale;


	}.bind(this));
	window.addEventListener('keydown', function (event) {
		// this.keyState[event.keyCode] = true;
		this.keyDown(event);
	}.bind(this));
	window.addEventListener('keyup', function (event) {
		// delete this.keyState[event.keyCode];
		this.keyUp(event);
	}.bind(this));
};

Game.prototype.keyUp = function (event) {
	switch (event.keyCode) {
		case this.keyCode.LEFT:
		case this.keyCode.RIGHT:
			this.vx = 0;
			break;
		case this.keyCode.UP:
		case this.keyCode.DOWN:
			this.vy = 0;
			break;
	}
};
Game.prototype.keyDown = function (event) {
	switch (event.keyCode) {
		case this.keyCode.LEFT:
			this.vx = -this.scrollSpeed;
			break;
		case this.keyCode.UP:
			this.vy = -this.scrollSpeed;
			break;
		case this.keyCode.RIGHT:
			this.vx = +this.scrollSpeed;
			break;
		case this.keyCode.DOWN:
			this.vy = +this.scrollSpeed;
			break;
	}
};

Game.prototype.scaleOnWheel = function (event) {
	event.preventDefault();
	if (!this.zoomIn && !this.zoomOut) {
		if (event.deltaY < 0) {
			if (this.map) {
				if (this.curentScale < this.scaleMax) {
					// this.curentScale += 0.05;
					this.zoomIn = true;
				}
			}
		}
		if (event.deltaY > 0) {
			if (this.map) {
				if (this.view.mapEndX * this.curentScale > this.view.width) {
					// this.curentScale -= 0.05;
					this.zoomOut = true;
				}
			}
		}
	}

};

Game.prototype.generateMap = function (x, y, cols, rows, blocksize, density) {
	this.map = new Map(x, y, cols, rows, blocksize, density);
	this.map.initRandomMap();
};

Game.prototype.clickEvent = function (event) {

	this.mouse.click(this.menu, event);
	if (this.menu.option == this.menu.OPTIONS.running) {
		if (!this.map) {
			setTimeout(function () {
				console.time('generating time: ');
				this.generateMap(0, 0, 80, 45, 64, 40);
				this.view = new View(this.screen.width, this.screen.height, this.map.width * this.map.blocksize, this.map.height * this.map.blocksize)
				console.timeEnd('generating time: ');
				this.initPlayer(0, this.map.entrance_y, this.map.blocksize);
				console.log(this.player);
			}.bind(this), 1000);
			this.state = this.STATES.gameLoop;
		}

	}
};

Game.prototype.setState = function (state) {
	this.state = state;
};


Game.prototype.update = function () {

	if (this.map) {
		if (this.view.mapEndX * this.curentScale > this.view.width && this.zoomOut) {
			this.curentScale -= 0.025;
			if (this.view.mapEndX * this.curentScale < this.view.width)
				this.curentScale = this.view.width / this.view.mapEndX;
			
		} else {
			this.zoomOut = false;
		}

		if (this.curentScale < this.scaleMax && this.zoomIn) {
			this.curentScale += 0.025;
			if (this.curentScale > 0.975 && this.curentScale < 1.025) {
				this.curentScale = 1;
			}
			// if (this.map.y <0) {
			// 	this.map.y = 0;
			// }
		} else {
			this.zoomIn = false;
		}

		this.player.update(this.vx, this.vy);
		this.view.update(this.vx, this.vy, this.map, this.curentScale, this.player);

	}

	this.menu.isHover = (
	this.mouse.x > this.menu.x && this.mouse.x < this.menu.x + this.menu.width &&
	this.mouse.y > this.menu.y && this.mouse.y < this.menu.y + this.menu.height &&
	this.menu.isActive);


};

Game.prototype.draw = function () {
	this.ctx.save();
	this.ctx.scale(this.curentScale, this.curentScale);

	document.body.style.cursor = 'default';

	if (this.state == this.STATES.menu) {
		if (this.menu.isActive) {
			if (this.menu.isHover) {
				document.body.style.cursor = 'pointer';
			}
			this.menu.draw(this.screen, this.ctx);
		}

	}
	if (this.state == this.STATES.gameLoop) {
		if (!this.menu.isActive && this.map) {

			this.map.draw(this.ctx, this.view, this.curentScale);
			this.player.draw(this.ctx);
		}
	}


	this.ctx.restore();
	if (this.map) {
		this.ctx.textBaseline = "top";
		this.ctx.textAlign = "left";
		this.ctx.font = "14px Arial";
		this.map.outputText = this.map.outputText + this.map.outputCount;
		this.ctx.fillStyle = '#fff';
		this.ctx.fillText(this.map.outputText, 10, 10);

	}
};


