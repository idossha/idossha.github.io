let used_points = [];
let border = 75;
let width, height;

function setup() {
  width = windowWidth;
  height = windowHeight;
  createCanvas(width, height);
  background(250);
  stroke(0);
  strokeWeight(1);

  // Increase the border size by 5% of the smaller dimension of the canvas
  let borderIncrease = min(width, height) * 0.05;
  border += borderIncrease;  // Increase the existing border

  // Define initial corner points with updated border
  let init_points = [
    [border, border],
    [width - border, border],
    [width - border, height - border],
    [border, height - border]
  ];

  // Store initial points in used_points to extend lines from
  used_points = [...init_points];

  // Define initial directions for line growth
  let directions = [[1, 1], [-1, 1], [-1, -1], [1, -1]];

  for (let i = 0; i < init_points.length; i++) {
    let point = init_points[i];
    extendLine(point, directions[i]);
  }
}


function draw() {
  // Keep extending lines from random points
  let index = floor(random(used_points.length));
  let dirIndex = floor(random(4));
  let direction = [[1, 1], [-1, 1], [-1, -1], [1, -1]][dirIndex];
  extendLine(used_points[index], direction);
}

function extendLine(startPoint, direction) {
  let step = 10; // Distance each line extends per frame
  let endX = startPoint[0] + step * direction[0];
  let endY = startPoint[1] + step * direction[1];

  // Check if new point is within the border
  if (endX > border && endX < width - border && endY > border && endY < height - border) {
    line(startPoint[0], startPoint[1], endX, endY);
    used_points.push([endX, endY]); // Add new point to array
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  // Re-run setup to reset the drawing when the window is resized
  setup();
}
