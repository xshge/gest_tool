let amplitude = 1;   // equivalent to Amp slider
let frequency = 0.04; // equivalent to Freq slider
let speed = 0.1;      // equivalent to Speed slider
let resolution = 10;  // equivalent to Resolution slider
let waveWidth = 1150; // equivalent to Width slider
let offset = 0;
let cn;
function lineSketch(p) {
    p.setup = function () {
        cn = p.createCanvas(1200, 400);
        cn.parent("lineContainer")
        p.strokeWeight(10);
        p.stroke(223, 37, 37);
        p.noFill();
    }

    p.draw = function () {
        p.clear() // purple background

        p.beginShape();
        for (let x = 0; x < waveWidth; x += resolution) {
            let y = cn.height / 2 + Math.sin(x * frequency + offset) * amplitude;
            p.vertex(x, y);
        }
        p.endShape();

        offset += speed;
    }

    p.modWave = function (newVal) {
        amplitude = newVal;
    }

}

let sketchInstance = new p5(lineSketch);

export function modLine(val) {
    sketchInstance.modWave(val);
}

