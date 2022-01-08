var PI_BY_180 = Math.PI / 180,
  halfw = window.innerWidth / 2,
  halfh = window.innerHeight / 2,
  angleTimer = 2,
  l = 500,
  distance = 30,
  rows = window.innerWidth / distance,
  columns = window.innerHeight / distance,
  color = "#111";

var canvas = document.querySelector("#canvas"),
  ctx = canvas.getContext("2d"),
  cw = window.innerWidth,
  ch = window.innerHeight,
  last_time = Date.now(),
  particles = [],
  light;

function _Dot(x, y, radius, opacity) {
  this.x = x;
  this.y = y;
  this.radius = radius;
  this.opacity = opacity;
}

Dot.prototype = {
  draw: function () {
    drawCircle(color, this.x, this.y, this.radius, this.opacity);
  },
  update: function () {
    drawCircle(color, this.x, this.y, this.radius);
  },
};

function drawCircle(fill_color, x, y, radius, opacity) {
  ctx.save();
  ctx.beginPath();
  ctx.strokeStyle = color;
  ctx.globalAlpha = opacity;
  ctx.fillStyle = color;
  ctx.arc(x, y, radius, 0, 2 * Math.PI, false);
  ctx.fill();
  //ctx.stroke();
  ctx.restore();
}

function update(dt) {
  for (var i = particles.length; i--; ) {
    if (!particles[i].dead) {
      particles[i].update(dt);
    }
  }
}

function draw() {
  for (var i = particles.length; i--; ) {
    if (!particles[i].dead) {
      particles[i].draw();
    }
  }
}

function loop() {
  var current_time = Date.now(),
    dt = (current_time - last_time) / 1000;
  last_time = current_time;
  //ctx.globalCompositeOperation = "lighter";
  //ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
  ctx.fillStyle = "rgb(255, 255,255)";
  ctx.fillRect(0, 0, cw, ch);
  //update();
  draw();

  requestAnimationFrame(loop);
}

function init() {
  canvas.width = cw;
  canvas.height = ch;
  for (var k = 1; k <= rows; k++) {
    for (var j = 1; j <= columns; j++) {
      particles.push(new Dot(k * distance, j * distance, 1, 0));
    }
  }

  /*  for (var i = l; i--;) {
    particles.push(new Dot(Math.random()*cw, Math.random()*ch, 5));
  }*/

  loop();
}

init();

canvas.addEventListener("click", function (e) {
  var x = e.x;
  var y = e.y;

  for (var i = particles.length; i--; ) {
    var particle = particles[i];
    var dx = e.x - particle.x;
    var dy = e.y - particle.y;

    var distance = Math.sqrt(dx * dx + dy * dy);
    if (i == 20) {
      console.log(dx);
      console.log(dy);

      console.log(distance);
    }

    TweenMax.to(particles[i], 0.5, {
      opacity: 1,
      delay: distance / 500,
      ease: Power2.easeOut,
    });
    TweenMax.to(particles[i], 0.5, {
      opacity: 0,
      delay: distance / 500 + 0.5,
      ease: Power2.easeIn,
    });
  }
});
