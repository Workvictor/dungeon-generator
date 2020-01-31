/**
 * Created by Виктор on 19.07.2016.
 */
function View(width, height, width_max, height_max) {
	this.x = 0;
	this.y = 0;
	this.scrollSpeed = 5;
	this.width = width;
	this.height = height;
	this.mapEndX = width_max;
	this.mapEndY = height_max;
	this.dx = 0;
	this.dy = 0;
}

View.prototype.watchObject = function (object) {
	this.x = object.x;
	this.y = object.y;
};

View.prototype.update = function (vx, vy, map, curentScale, object) {

	// if (vx < 0 && Math.abs(this.dx) < this.scrollSpeed) {
	// 	this.dx-=0.25;
	// }
	// if (vx > 0 && Math.abs(this.dx) < this.scrollSpeed) {
	// 	this.dx+=0.25;
	// }
	// if (vx == 0) {
	// 	if (this.dx < 0) {
	// 		this.dx+=0.25;
	// 	}
	// 	if (this.dx > 0) {
	// 		this.dx-=0.25;
	// 	}
	// 	if (Math.abs(this.dx) > 0.75) {
	// 		this.dx=0;
	// 	}
	// }

	if (object) {
		this.watchObject(object);

	} else {
		this.x += vx;
		this.y += vy;
	}


	//
	// this.scaledWidth = this.mapEndX * curentScale;
	// this.scaledHeiht = this.mapEndY * curentScale;
	//
	// if (this.x < 0) {
	// 	this.x = 0;
	// }
	// if (this.x > this.mapEndX * curentScale - this.width) {
	// 	this.x = this.mapEndX * curentScale - this.width;
	//
	// }
	// if (this.y < 0) {
	// 	this.y = 0;
	// }
	// if (this.y > this.mapEndY * curentScale - this.height) {
	// 	this.y = this.mapEndY * curentScale - this.height;
	//
	// }
	map.x = this.x;
	map.y = this.y;
};