function Map(x, y, cols, rows, blocksize, density) {
	this.x = x;
	this.y = y;
	this.width = cols;
	this.height = rows;
	this.blocksize = blocksize;
	this.density = density;
	this.STATES = {EMPTY: 0, WALL: 1};
	this.grid = [];
	this.exist = false;
	this.smoothing = 5;
	this.emptyNodes = [];
	this.entrance = false;
	this.exit = false;
}

Map.prototype.nodeColor = function (x, y) {
	var color = null;
	switch (this.grid[x][y].state) {
		case this.STATES.EMPTY:
			if (this.grid[x][y].regionColor != null) color = this.grid[x][y].regionColor;
			else color = '#fff';
			break;
		case this.STATES.WALL:
			color = '#555';
			break;
	}
	if (this.grid[x][y].activeElement) {
		color = 'green';
	}
	return color;
	
};

Map.prototype.randomElement = function () {
	if (Math.random() * 100 > 100 - this.density) {
		return this.STATES.WALL;
	}
	else {
		return this.STATES.EMPTY;
	}
};

Map.prototype.getCordsFromId = function (id) {
	//x+y*width = id
	return {
		x: (id % this.width),
		y: Math.floor(id / this.width)
	}
};

Map.prototype.getIdFromXY = function (x, y) {
	return (x + y * this.width)
};

Map.prototype.initRandomMap = function () {
	
	var id = 0;
	this.grid = [];
	var state = null;
	for (var x = 0; x < this.width; x++) {
		this.grid.push([]);
		for (var y = 0; y < this.height; y++) {
			if (x == 0 || x == this.width - 1 ||
				y == 0 || y == this.height - 1) {
				state = this.STATES.WALL;
			} else {
				state = this.randomElement();
			}
			// add element to the grid
			this.grid[x][y] = new Node(id, x, y, state, this.blocksize);
			id++;
		}
	}

	//добавить вход и выход
	this.setEntrance();
	this.setExit();
	this.smooth(this.smoothing);
	
	this.exist = true;
};

Map.prototype.getNeighborsCount = function (x, y) {
	var count = 0;
	for (var neighborX = x - 1; neighborX <= x + 1; neighborX++) {
		for (var neighborY = y - 1; neighborY <= y + 1; neighborY++) {
			if (neighborX >= 0 && neighborX < this.width && neighborY >= 0 && neighborY < this.height) {
				if (this.grid[neighborX][neighborY].state == this.STATES.WALL) {
					if (!(neighborX == x && neighborY == y)) {
						if (this.grid[x][y].exit || this.grid[x][y].entrance) return 4;
						count++;
						if (count > 4) {
							return count;
						}
					}
				}
			}
		}
	}
	return count;
};

Map.prototype.setExit = function (y) {
	this.exit_y = 0;
	if (y) this.exit_y = y;
	else this.exit_y = Math.floor(Math.random() * this.height);
	var elem = this.grid[this.width - 1][this.exit_y];
	elem.state = this.STATES.EMPTY;
	elem.exit = true;
	this.emptyNodes.push(elem);
};
Map.prototype.setEntrance = function (y) {
	this.entrance_y = 0;
	if (y) this.entrance_y = y;
	else this.entrance_y = Math.floor(Math.random() * this.height);
	var elem = this.grid[0][this.entrance_y];
	elem.state = this.STATES.EMPTY;
	elem.entrance = true;
	this.emptyNodes.push(elem);
};
Map.prototype.smooth = function (smooth) {
	
	for (var i = 0; i < smooth; i++) {
		for (var x = 1; x < this.width - 1; x++) {
			for (var y = 1; y < this.height - 1; y++) {
				var elem = this.grid[x][y];
				var nCount = this.getNeighborsCount(x, y);
				if (nCount > 4) {
					elem.state = this.STATES.WALL;
				}
				if (nCount < 3) {
					elem.state = this.STATES.EMPTY;
				}
				if (elem.state == this.STATES.EMPTY && i == smooth - 1) {
					this.emptyNodes.push(elem);
				}
			}
		}
	}

	
	this.detectRegions(); //проверяет и соединяет регионы
	if (this.regionList.length > 1) {
		this.connectAllRegions();
	}
};


Map.prototype.detectRegions = function () {
	
	
	if (this.emptyNodes.length > 0) {
		
		var nodes = this.emptyNodes.concat();
		this.regionList = [];
		this.edges = [];
		var id = 0;
		while (nodes.length > 0) {
			
			var openList = [];
			var last = nodes.pop();
			if (last.regionId == null) {
				
				var regionColor = '#9ec5a1';
				this.grid[last.x][last.y].regionColor = regionColor;
				this.regionList.push(new Region(this.grid[last.x][last.y].id));
				openList.push(last);
				
				while (openList.length > 0) {
					var elem = openList.pop();
					for (var x = elem.x - 1; x <= elem.x + 1; x++) {
						for (var y = elem.y - 1; y <= elem.y + 1; y++) {
							if (x == elem.x || y == elem.y) {
								if (x >= 0 && x <= this.width - 1 && y >= 0 && y <= this.height - 1) {
									if (this.grid[x][y].state == this.STATES.WALL && !this.grid[elem.x][elem.y].regionEdge) {
										this.grid[elem.x][elem.y].regionEdge = true;
										this.regionList[id].edges.push({
											id: this.grid[elem.x][elem.y].id,
											x: elem.x,
											y: elem.y
										});
										continue;
									}
									if (this.grid[x][y].state == this.STATES.EMPTY &&
										this.grid[x][y].regionId == null) {
										openList.push(this.grid[x][y]);
										this.grid[x][y].regionColor = regionColor;
										this.grid[x][y].regionId = last.id;

										this.regionList[id].regions.push(this.grid[x][y].id);
									}
								}
							}
						}
					}
				}
				id++;
			}
		}
	}
	
	else console.log('Error: No EMPTY nodes! Try to lower density');
	
	
};

Map.prototype.resetRegions = function () {
	this.emptyNodes = [];
	for (var x = 0; x < this.width; x++) {
		for (var y = 0; y < this.height; y++) {
			if (this.grid[x][y].state == this.STATES.EMPTY) {
				this.emptyNodes.push(this.grid[x][y]);
				this.grid[x][y].regionColor = null;
				this.grid[x][y].regionId = null;
				this.grid[x][y].regionEdge = false;
				this.regionList = [];
			}
		}
	}
	
};

Map.prototype.connectAllRegions = function () {
	// var totalProgress = this.regionList.length;
	// var progress;
	while (this.regionList.length > 1) {
		this.getMinDistance();
		// progress = totalProgress - this.regionList.length;
		// var percent = Math.ceil(progress / totalProgress * 100);
		// console.log('Progress: ', percent, '%');
	}
	// this.exist = true;
};

Map.prototype.getMinDistance = function () {
	
	var regionA = this.regionList[0];
	var regionB = this.regionList[1];
	var A_min = regionA.edges[0];
	var B_min = regionB.edges[0];
	var min = Math.abs(regionA.edges[0].x - regionB.edges[0].x) +
		Math.abs(regionA.edges[0].y - regionB.edges[0].y);
	
	for (var a = 0; a < regionA.edges.length; a++) {
		for (var b = 0; b < regionB.edges.length; b++) {
			
			var check = Math.abs(regionA.edges[a].x - regionB.edges[b].x) +
				Math.abs(regionA.edges[a].y - regionB.edges[b].y);
			if (check < min) {
				min = check;
				A_min = regionA.edges[a];
				B_min = regionB.edges[b];
			}
		}
	}
	this.connectAB(A_min, B_min);
};

Map.prototype.connectAB = function (A, B) {
	var elemA = this.grid[A.x][A.y];
	var elemB = this.grid[B.x][B.y];
	var max = null;
	var min = null;
	if (elemA.y != elemB.y && elemA.y > elemB.y) {
		max = elemA;
		min = elemB;
	} else {
		max = elemB;
		min = elemA;
	}
	for (var i = max.y; i > min.y - 1; i--) {
		this.grid[max.x][i].state = this.STATES.EMPTY;
	}
	if (max.x > min.x) {
		for (i = max.x; i > min.x; i--) {
			this.grid[i][min.y].state = this.STATES.EMPTY;
		}
	}
	if (max.x < min.x) {
		for (i = max.x; i < min.x; i++) {
			this.grid[i][min.y].state = this.STATES.EMPTY;
		}
	}
	this.resetRegions();
	this.detectRegions();
};


Map.prototype.drawEmptyTile = function (id, ctx) {
	ctx.fillStyle = '#f1f1f1';
	var pos = this.getCordsFromId(id);
	var blocksize = this.blocksize;
	ctx.fillRect(pos.x * blocksize + this.x, pos.y * blocksize + this.y, blocksize, blocksize);
};

Map.prototype.drawSolidTile = function (id, ctx) {
	ctx.fillStyle = '#696969';
	var pos = this.getCordsFromId(id);
	var blocksize = this.blocksize;
	ctx.fillRect(pos.x * blocksize + this.x, pos.y * blocksize + this.y, blocksize, blocksize);
};


Map.prototype.drawNode = function (node, ctx) {
	ctx.textBaseline = "top";
	ctx.textAlign = "left";
	ctx.font = "8px Arial";
	var fontColor = '#000';
	var drawColor;
	// if (color) var drawColor = color;
	var bs = this.blocksize;
	var x = node.x * bs;
	var y = node.y * bs;
	drawColor = this.nodeColor(x, y);
	ctx.fillStyle = drawColor;
	ctx.strokeStyle = '#656565';
	ctx.fillRect(x, y, bs, bs);
	ctx.strokeRect(x, y, bs, bs);
	// ctx_minimap.fillStyle = drawColor;
	// ctx_minimap.fillRect(node.x, node.y, 1, 1);
};

Map.prototype.draw = function (ctx, view, scale) {
	this.outputText = 'Всего элементов: ';
	this.outputCount = 0;
	for (var x = 0; x < this.width; x++) {
		for (var y = 0; y < this.height; y++) {
			var elem = this.grid[x][y];
			var size = this.blocksize;
			if ((elem.x * size - this.x) > -this.blocksize &&
				(elem.x * size - this.x) < view.width / scale + this.blocksize &&
				(elem.y * size - this.y) > -this.blocksize &&
				(elem.y * size - this.y) < view.height / scale + this.blocksize) {
				this.outputCount++;
				switch (elem.state) {
					case this.STATES.EMPTY:
						// ctx.fillStyle = '#4e4036';
						ctx.fillStyle = '#778a92';
						ctx.strokeStyle = '#686868';
						break;
					case this.STATES.WALL:
						ctx.fillStyle = '#000';
						ctx.strokeStyle = '#686868';
						break;
				}
				if (elem.entrance || elem.exit) {
					ctx.fillStyle = '#a7c2c5';
				}
				
				ctx.fillRect(elem.x * size - this.x, elem.y * size - this.y, size, size);
				// ctx.strokeRect(elem.x * size - this.x, elem.y * size - this.y, size, size);
			}
			
			
		}
	}
};