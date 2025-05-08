function radial(p) {
    let maxLen, minLen;
    let adjust = 11;
    p.setup = () => {
        let pat = p.createCanvas(p.windowWidth / 2, p.windowHeight);
        pat.parent("pattern");
        maxLen = p.height * 0.2;
        minLen = maxLen * 0.2;
    };

    p.draw = () => {
        p.clear();
        p.frameRate(30);
        let fc = p.frameCount * 0.01;
        p.translate(p.width * 0.5, p.height * 0.5);
        p.rotate(fc);
        for (let i = 0; i < p.TAU; i += p.TAU * 0.05) {
            //the angle inwhich it bends at the end;
            p.push();
            p.translate(0, 0);
            p.rotate(i * fc);
            //can be mod with values;
            let angle = p.cos(i * fc + (adjust / 10));
            //here can be modified
            maxLen = p.height * p.abs(p.sin(i * fc) * (adjust * 0.01));
            minLen = maxLen * 0.2;
            bladeMaker(maxLen, angle)
            bladeMaker(maxLen, -angle);
            p.pop();

        }
    }

    function bladeMaker(len, theta) {
        p.push();
        p.translate(0, 0);
        p.rotate(theta);
        let sw = p.map(len, minLen, maxLen, 10, 1);
        p.strokeWeight(sw);
        p.stroke(255, p.map(len, minLen, maxLen, 0, 255));
        p.line(0, 0, 0, -len);
        p.translate(0, -len);
        if (len > minLen) {
            bladeMaker(len * 0.6, theta * 1.1);
        }
        p.pop();
    }

    p.adjustPattern = (ang) => {
        adjust = p.map(ang, -90, 90, 11, 27);

    }
}

let pattern = new p5(radial);

export function adjust(val) {
    pattern.adjustPattern(val);
}