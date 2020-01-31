function Node(id, x, y, state, blocksize) {
	this.id = id;
	this.x = x;
	this.y = y;
	this.state = state;
	this.width = blocksize;
	this.height = blocksize;
	this.regionId = null;
	this.regionColor = null;
	this.regionEdge = false;
	this.activeElement = false;
}

