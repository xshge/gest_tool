let titles = ["Welcome to gesture tool, an interactive experience where you can navigate around the website in real life. This interaction will require the use of your webcam. Use your index finger to look through rest of the instruction.",
    "Please use one hand at the time.",
    "Using left hand, pinch with your thumb and index finger. Adjust slowly to see the changes on the website.",
    "Using right hand, turn your wrist while holding the preferred gesture to see the changes on the website."];

let waitTime = 100;
let paused = false;
let curIndex = 0;
let prevIndex = 10;

let type = document.getElementById("ins");

function sleep(ms) {
    return new Promise((resolves) => setTimeout(resolves, ms));

}

async function instructionLoop() {


    if (prevIndex != curIndex) {
        console.log("called");
        let curInstruc = titles[curIndex];

        for (let i = 0; i < curInstruc.length; i++) {

            type.innerText = curInstruc.substring(0, i + 1);
            await sleep(waitTime);

            if (i == curInstruc.length - 1) {
                paused = true;
            }

        }

        // await sleep(waitTime * 10);

        // for (let i = curInstruc.length; i > 0; i--) {
        //     if (paused) {
        //         break;
        //     }
        //     type.innerText = curInstruc.substring(0, i - 1);
        //     await sleep(waitTime);

        // }

        // await sleep(waitTime * 5);



    }



}
export async function change(selectedNumb) {

    if (curIndex != selectedNumb) {

        prevIndex = curIndex;
        await instructionDelete();

        curIndex = selectedNumb;
        await sleep(waitTime);

        if (!paused) {
            instructionLoop();

        }

    }




}
async function instructionDelete() {

    let curInstruc = titles[curIndex];

    for (let i = curInstruc.length; i > 0; i--) {

        type.innerText = curInstruc.substring(0, i - 1);
        await sleep(waitTime);
        console.log("currin" + i);
        if (i == 1) {
            paused = false;
        }
    }
}

document.addEventListener("DOMContentLoaded", function () {

    instructionLoop();
});