import { modLine } from "./lineWave.js";
import { change } from "./type.js";
import { adjust } from "./pattern.js";

const handSketch = (p) => {
    let video, guis, cGuis, button, btn2;
    let handPose;
    let hands = [];
    let colours = [];
    let cols = [
        [102, 16, 242],
        [209, 17, 73],
        [230, 194, 41],
        [241, 113, 5],
    ];
    let painting;
    let symmetry = 6;

    let currStrokeW = 3;
    let colorVal = [255, 255, 255];
    let winWidth;
    let winHeight;
    let scale;
    let lastPtPos = null;
    let currentPos = { x: 0, y: 0 };
    let smoothedAngle = 0;
    let img;
    class colorSelector {
        constructor(r, g, b, size, x, y, lineInd) {
            this.r = r;
            this.g = g;
            this.b = b;
            this.size = size;
            this.x = x;
            this.y = y;
            this.actualy = 0;
            this.selected = false;
            this.line = lineInd;
        }

        show(offset) {
            let n = this.line + 1;
            const midX = (this.x + this.size);
            this.actualy = this.y * offset;
            p.rectMode(p.CENTER);
            cGuis.strokeWeight(this.selected ? 4 : 1);
            cGuis.stroke(this.selected ? 255 : 150);
            // cGuis.fill(this.r, this.g, this.b);
            cGuis.noFill();
            cGuis.text(`${n}`, this.x, this.actualy + this.size);
            cGuis.textSize(50);
            cGuis.rect(this.x, this.y * offset, this.size, this.size);

        }

        selectColor() {
            colorVal[0] = this.r;
            colorVal[1] = this.g;
            colorVal[2] = this.b;
        }

        setLine() {
            return this.line;
        }
    }

    p.preload = function () {
        handPose = ml5.handPose({ flipped: true });
        winWidth = p.windowWidth / 2;
        winHeight = p.windowHeight / 2;
        img = p.loadImage('assets/Eye.png');
    };

    p.setup = function () {
        let cnv = p.createCanvas(winWidth, winHeight);
        cnv.style("display", "block");
        cnv.parent("cnv-container");
        p.angleMode(p.DEGREES);

        guis = p.createGraphics(winWidth, winHeight);
        cGuis = p.createGraphics(winWidth, winHeight);
        painting = p.createGraphics(winWidth, winHeight);
        painting.clear();
        cGuis.clear();

        video = p.createCapture(p.VIDEO, { flipped: true });
        video.hide();
        scale = video.width / winWidth;
        let squareSize = 100 * scale;
        let spacing = 20 * scale;
        let margin = 20 * scale;
        for (let i = 0; i < cols.length; i++) {
            // let _y = i * (50 + 20);
            let y = margin + i * (squareSize + spacing); // vertical stacking
            let x = p.width - squareSize - margin; // aligned to right with some margin
            let colour = new colorSelector(
                cols[i][0],
                cols[i][1],
                cols[i][2],
                squareSize,
                x,
                y,
                i
            );
            colours.push(colour);
        }

        handPose.detectStart(video, (results) => (hands = results));
    };

    p.draw = function () {
        //p.image(video, 0, 0, p.width, p.height);
        p.clear();
        guis.clear();
        p.filter(p.GRAY);
        if (hands.length > 0) {
            let hand = hands[0];
            let index = hand.index_finger_tip;
            let thumb = hand.thumb_tip;
            let x = (index.x + thumb.x) * 0.5;
            let y = (index.y + thumb.y) * 0.5;
            let d = p.dist(index.x, index.y, thumb.x, thumb.y);
            let wrist = hand.wrist;

            p.push();
            p.translate(wrist.x, wrist.y);   // move origin to wrist
            p.rotate(p.radians(smoothedAngle));  // optional rotation
            p.imageMode(p.CENTER);
            p.image(img, 0, 0, 100, 100);   // draw at new origin
            p.pop();


            if (hand.handedness == "Right") {

                if (d > 20) {
                    console.log(index.x);

                    p.frameRate(5);

                    if (p.frameCount % 2 == 0) {

                        lastPtPos = { x: index.x, y: index.y };

                    } else {

                        currentPos.x = index.x;
                        currentPos.y = index.y;
                        if (lastPtPos != null && currentPos.x != lastPtPos.x) {
                            console.log("last" + lastPtPos.x);

                            let dx = index.x - wrist.x;
                            let dy = index.y - wrist.y;
                            let targetAngle = Math.atan2(dy, dx); // radians
                            let centralAngle = p.degrees(targetAngle);
                            smoothedAngle = p.lerp(smoothedAngle, centralAngle, 0.1);
                            console.log("diff" + centralAngle);
                            adjust(smoothedAngle);
                        }

                    }
                }
            } else if (hand.handedness == "Left") {
                if (d >= 5 && d < 90 && thumb.z3D < 0) {
                    currStrokeW = d;
                    modLine(currStrokeW);
                    guis.ellipse(x, y, d);
                }

                for (let i = 0; i < colours.length; i++) {
                    let changedCol = determineColor(colours[i], index);
                    if (changedCol) {
                        colours[i].selectColor();
                        console.log(colours[i].setLine());
                        change(colours[i].setLine());
                        break;
                    } else {
                        colours[i].selected = false;
                    }
                }
            }

            p.push();
            let thumbs = [{ tCX: hand.thumb_cmc.x, tcY: hand.thumb_cmc.y }, { tmX: hand.thumb_ip.x, tmY: hand.thumb_ip.y }];
            let indexPts = [{ idX: hand.index_finger_dip.x, idY: hand.index_finger_dip.y }, { imX: hand.index_finger_mcp.x, imY: hand.index_finger_mcp.y }];
            p.fill(255);
            p.stroke(255);
            p.strokeWeight(5);
            //index connections
            p.circle(index.x, index.y, 20);
            p.line(index.x, index.y, indexPts[0].idX, indexPts[0].idY);
            p.circle(indexPts[0].idX, indexPts[0].idY, 20);
            p.line(indexPts[0].idX, indexPts[0].idY, indexPts[1].imX, indexPts[1].imY);
            p.circle(indexPts[1].imX, indexPts[1].imY, 20);

            //thumbs key points

            p.circle(thumb.x, thumb.y, 20);
            p.line(thumb.x, thumb.y, thumbs[0].tCX, thumbs[0].tcY);
            p.circle(thumbs[0].tCX, thumbs[0].tcY, 20);
            p.line(thumbs[0].tCX, thumbs[0].tcY, thumbs[1].tmX, thumbs[1].tmY);
            p.circle(thumbs[1].tmX, thumbs[1].tmY, 20);
            p.pop();
        }

        for (let i = 0; i < colours.length; i++) {
            colours[i].show(1);
        }

        p.image(painting, 0, 0, p.width, p.height);
        p.image(guis, 0, 0, p.width, p.height);
        p.image(cGuis, 0, 0, p.width, p.height);
    };

    function determineColor(col, indexTip) {
        let offset = col.size / 2;
        let x_center = col.x;
        let y_center = col.actualy;

        // Proper boundary check: indexTip must be within the square
        if (
            indexTip.x > x_center - offset &&
            indexTip.x < x_center + offset &&
            indexTip.y > y_center - offset &&
            indexTip.y < y_center + offset
        ) {
            col.selected = true;
            return true;
        }

        return false;
    }
};

new p5(handSketch);
