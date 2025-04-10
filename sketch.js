let input, button;
let numSlices = 0;

function setup() {
  createCanvas(700, 700);
  background(255);
  textSize(14);
  textAlign(CENTER);

  input = createInput();
  input.position(20, 20);
  input.size(50);

  button = createButton('Dividir Pizzas');
  button.position(input.x + input.width + 10, 20);
  button.mousePressed(drawPizzas);

  fill(0);
  text("Ingresa cantidad de trozos:", 170, 35);
}

function drawPizzas() {
  background(255);
  numSlices = int(input.value());
  if (numSlices <= 0) return;
  drawPizzaMidpoint(150, 200, 100, numSlices, 'red', "Punto Medio");
  drawPizzaMidpoint(370, 200, 100, numSlices, 'blue', "DDA");
  drawPizzaMidpoint(590, 200, 100, numSlices, 'green', "Bresenham");


  //drawPizza(370, 200, 100, numSlices, drawLineDDA, 'blue', "DDA");
  //drawPizza(590, 200, 100, numSlices, drawLineBresenham, 'green', "Bresenham");
}

function drawPizzaMidpoint(cx, cy, r, slices, color, label) {
  stroke(color);
  fill(255);


  drawCircleMidpoint(cx, cy, r);

  for (let i = 0; i < slices; i++) {
    let angle = TWO_PI * i / slices;
    let x2 = cx + r * cos(angle);
    let y2 = cy + r * sin(angle);
    drawLinePointSlope(cx, cy, x2, y2);
  }

  fill(0);
  noStroke();
  text(label, cx, cy + r + 20);
}

function drawCircleMidpoint(cx, cy, r) {
  strokeWeight(1);

  let x = 0;
  let y = r;

  let p = 1 - r;

  plotCirclePoints(cx, cy, x, y);

  while (x < y) {
    x++;
    if (p < 0) {
      p += 2 * x + 1;
    } else {
      y--;
      p += 2 * (x - y) + 1;
    }
    plotCirclePoints(cx, cy, x, y);
  }
}

function plotCirclePoints(cx, cy, x, y) {
  point(cx + x, cy + y);
  point(cx - x, cy + y);
  point(cx + x, cy - y);
  point(cx - x, cy - y);

  point(cx + y, cy + x);
  point(cx - y, cy + x);
  point(cx + y, cy - x);
  point(cx - y, cy - x);
}


function drawPizza(cx, cy, radius, slices, drawFn, color, label) {
  stroke(color);
  fill(255);

  //ellipse(cx, cy, radius * 2, radius * 2);

  for (let i = 0; i < slices; i++) {
    let angle = TWO_PI * i / slices;
    let x2 = cx + radius * cos(angle);
    let y2 = cy + radius * sin(angle);
    drawFn(cx, cy, x2, y2);
  }

  fill(0);
  noStroke();
  text(label, cx, cy + radius + 20);
}


function drawLinePointSlope(x1, y1, x2, y2) {
  strokeWeight(1);

  let dx = x2 - x1;
  let dy = y2 - y1;

  if (abs(dx) > abs(dy)) {
    let m = dy / dx;
    let b = y1 - m * x1;
    let startX = min(x1, x2);
    let endX = max(x1, x2);
    for (let x = startX; x <= endX; x++) {
      let y = m * x + b;
      point(x, y);
    }
  } else {

    let m_inv = dx / dy;
    let b = x1 - m_inv * y1;
    let startY = min(y1, y2);
    let endY = max(y1, y2);

    for (let y = startY; y <= endY; y++) {
      let x = m_inv * y + b;
      point(x, y);
    }
  }
}

function drawLineDDA(x1, y1, x2, y2) {
  strokeWeight(1);

  let dx = x2 - x1;
  let dy = y2 - y1;
  let steps = max(abs(dx), abs(dy));
  let xIncrement = dx / steps;
  let yIncrement = dy / steps;
  let x = x1;
  let y = y1;

  for (let i = 0; i <= steps; i++) {
    point(round(x), round(y));
    x += xIncrement;
    y += yIncrement;
  }
}

function drawLineBresenham(x1, y1, x2, y2) {
  strokeWeight(1);

  x1 = int(x1); 
  y1 = int(y1); 
  x2 = int(x2); 
  y2 = int(y2);

  let dx = abs(x2 - x1);
  let dy = abs(y2 - y1);
  let sx = (x1 < x2) ? 1 : -1;
  let sy = (y1 < y2) ? 1 : -1;
  let err = dx - dy;

  while (true) {
    point(x1, y1);
    if (x1 === x2 && y1 === y2) break;
    let e2 = 2 * err;
    if (e2 > -dy) {
      err -= dy;
      x1 += sx;
    }
    if (e2 < dx) {
      err += dx;
      y1 += sy;
    }
  }
}
