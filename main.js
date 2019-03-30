/*jshint esversion: 6 */
let canvas = document.querySelector('canvas');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
let ctx = canvas.getContext('2d');
ctx.translate(canvas.width / 2, canvas.height / 2);

window.addEventListener('resize', function () {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    ctx.translate(canvas.width / 2, canvas.height / 2);
    big_Rad_Max = canvas.width > canvas.height ? canvas.height / 2 - 24 : canvas.width / 2 - 24;
    clearCanvas();
    init();
});

let big_Rad_Max = canvas.width > canvas.height ? canvas.height / 2 - 24 : canvas.width / 2 - 24;
let big_Rad_Slider = document.getElementById('big_Rad_Id');
let big_Rad = big_Rad_Slider.value / 100 * big_Rad_Max;

let rad_Slider = document.getElementById('small_Rad_Id');
let small_Radius = rad_Slider.value / 100 * big_Rad;
small_Radius = big_Rad - big_Rad / 12 * 7;

let angle_Slider = document.getElementById('angle_Id');
let small_Circle_Angle = -angle_Slider.value / 100 * Math.PI * 2;

let color_Id = document.getElementById('color_Id');
let color_Input = color_Id.value;

let rho_Slider = document.getElementById('rho_Id');
let rho = rho_Slider.value / 100 * small_Radius;

let go_Input = document.getElementById('go');
let show_Input = document.getElementById('show_Id')
let speed_Slider = document.getElementById('speed_Id');
let speed = speed_Slider.value;
let go = false;
let show = true;
let tmp_Canvas = ctx.createImageData(canvas.width, canvas.height);

big_Rad_Slider.oninput = function () {
    clearCanvas();
};
rad_Slider.oninput = function () {
    clearCanvas();
};
angle_Slider.oninput = function () {
    clearCanvas();
};
rho_Slider.oninput = function () {
    rho = rho_Slider.value / 100 * small_Radius;
    clearCanvas();
};
speed_Slider.onchange = function () {
    speed = speed_Slider.value;
};
go_Input.onchange = function () {
    go = go_Input.checked;
    if (go) {
        ctx.putImageData(tmp_Canvas, 0, 0);
        animate();
    }
    if (!go) {
        tmp_Canvas = ctx.getImageData(0, 0, canvas.width, canvas.height);
        init();
    }
};
color_Id.addEventListener('change', function () {
    color_Input = color_Id.value;
});
show_Input.onchange = function () {
    show = show_Input.checked;
    clearCanvas();
};

ctx.strokeStyle = '#fff';
ctx.lineWidth = 3;
// this is where we draw the points, and the circles.
function init() {

    //draw big circle
    if (!go && show) draw_Big();

    //draw small circle
    if (!go && show) draw_Small();

    //draw point
    let small_Circle_Rotation = -((big_Rad - small_Radius) / small_Radius) * small_Circle_Angle;
    let point_A = {
        x: (big_Rad - small_Radius) * Math.cos(small_Circle_Angle) + rho * Math.cos(small_Circle_Rotation),
        y: (big_Rad - small_Radius) * Math.sin(small_Circle_Angle) + rho * Math.sin(small_Circle_Rotation),
        // color: 'hsl(' + h + ', 100%, 50%)',
        color: color_Input,
    };
    // h += 0.01;
    ctx.beginPath();
    ctx.fillStyle = point_A.color;
    ctx.arc(point_A.x, point_A.y, 2, 0, Math.PI * 2, false);
    ctx.fill();
    ctx.closePath();
}

function draw_Big() {
    ctx.beginPath();
    ctx.arc(0, 0, big_Rad, 0, Math.PI * 2, false);
    ctx.stroke();
    ctx.closePath();
}

function draw_Small() {
    let xc = (big_Rad - small_Radius) * Math.cos(small_Circle_Angle);
    let yc = (big_Rad - small_Radius) * Math.sin(small_Circle_Angle);
    ctx.beginPath();
    ctx.arc(xc, yc, small_Radius, 0, Math.PI * 2, false);
    ctx.stroke();
    ctx.closePath();
}

function animate() {
    if (go) {
        requestAnimationFrame(animate);
        for (let i = 0; i < speed; i++) {
            small_Circle_Angle -= 0.01;
            init();
        }
    }
}

function clearCanvas() {
    go_Input.checked = false;
    small_Circle_Angle = -angle_Slider.value / 100 * Math.PI * 2;
    go = false;
    small_Radius = rad_Slider.value / 100 * big_Rad;
    big_Rad = big_Rad_Slider.value / 100 * big_Rad_Max;
    rho = rho_Slider.value / 100 * small_Radius;
    h = 1;
    ctx.clearRect(-canvas.width / 2, -canvas.height / 2, canvas.width, canvas.height);
    ctx.putImageData(tmp_Canvas, 0, 0);
    init();
}

init();