function Menu(screen, ctx) {
	this.screen = screen;
	this.ctx = ctx;
	
	this.width = 100;
	this.height = 30;
	this.x = this.screen.width / 2 - this.width / 2;
	this.y = this.screen.height / 2 - this.height / 2;
	this.items = ['run', 'exit'];
	this.isHover = false;
	this.isActive = true;
	this.clickable = true;
	this.overlay = {
		x: this.screen.x,
		y: this.screen.y,
		width: this.screen.width,
		height: this.screen.height
	};
	this.OPTIONS = {running: 1, pause: 0, exit: -1};
	this.option = this.OPTIONS.pause;
}

Menu.prototype.drawOverlay = function () {
	this.ctx.fillStyle = "rgba(0,0,0,0.5)";
	this.ctx.fillRect(this.overlay.x, this.overlay.y, this.overlay.width, this.overlay.height);
};

Menu.prototype.drawItem = function () {
	this.ctx.textBaseline = "middle";
	this.ctx.textAlign = "center";
	this.ctx.font = "16px Arial";
	// for (var i = 0; i < this.items.length; i++) {
	this.ctx.fillStyle = "#8493ba";
	this.ctx.fillRect(this.x, this.y, this.width, this.height);
	this.ctx.fillStyle = "#000";
	this.ctx.fillText(this.items[0].toString(), this.x + this.width / 2, this.y + this.height / 2);

	// }
};

Menu.prototype.show = function () {
	var interval = setInterval(function () {
		if (this.overlay.y < this.overlay.height) {
			this.overlay.y += 50;
		} else {
			this.isActive = true;
			clearInterval(interval);
		}
	}.bind(this), 1000 / 60);
};

Menu.prototype.hide = function () {
	var interval = setInterval(function () {
		if (this.overlay.y > -this.overlay.height) {
			this.overlay.y -= 50;
		} else {
			this.isHover = false;
			this.isActive = false;
			clearInterval(interval);
		}
	}.bind(this), 1000 / 60);
};

Menu.prototype.onclick = function () {
	//some code
	this.option = this.OPTIONS.running;
	this.hide();
};

Menu.prototype.update = function () {
	
	
};

Menu.prototype.draw = function () {
	
	this.drawOverlay();
	this.drawItem();
};
