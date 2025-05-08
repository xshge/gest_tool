let amplitude = 4;   // equivalent to Amp slider
let frequency = 0.04; // equivalent to Freq slider
let speed = 0.1;      // equivalent to Speed slider
let resolution = 10;  // equivalent to Resolution slider
let waveWidth = 1150; // equivalent to Width slider
let offset = 0;
let cn;
function lineSketch(p) {
    p.setup = function () {
        cn = p.createCanvas(p.windowWidth / 2, 400);
        cn.parent("lineContainer")
        p.strokeWeight(10);
        p.stroke(223, 37, 37);
        p.noFill();
    }

    p.draw = function () {
        p.clear() // purple background


        let prevY = p.height / 2 + Math.sin(0 * frequency + offset) * amplitude;
        let prevSlope = 0;
        let segmentPoints = [];

        for (let x = 0; x <= waveWidth; x += resolution) {
            let y = p.height / 2 + Math.sin(x * frequency + offset) * amplitude;

            let slope = y - prevY;

            segmentPoints.push({ x, y, slope });

            prevY = y;
        }

        // Now draw segments based on slope direction
        for (let i = 1; i < segmentPoints.length; i++) {
            let prev = segmentPoints[i - 1];
            let curr = segmentPoints[i];

            // Choose weight based on slope direction
            if (curr.slope < 0) {
                p.strokeWeight(6); // going up
            } else {
                p.strokeWeight(2); // going down
            }

            p.beginShape();
            p.vertex(prev.x, prev.y);
            p.vertex(curr.x, curr.y);
            p.endShape();
        }
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

