function Player(x, y, blocksize) {
	this.x = x;
	this.y = y;
	this.blocksize = blocksize;
	this.width = 32;
	this.height = 32;
	
}

Player.prototype.update = function (vx, vy) {
	this.x += vx/this.blocksize;
	this.y += vy/this.blocksize;
};

Player.prototype.draw = function (ctx) {
	ctx.fillStyle = 'blue';
	ctx.fillRect(this.x * this.blocksize, this.y * this.blocksize, this.width, this.height);
};
