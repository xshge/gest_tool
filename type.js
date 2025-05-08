let titles = ["Game Designer", "Web Developer", "type test2", "type test 3", "type 4"];

let waitTime = 100;
let paused = false;
let curIndex = 0;

let type = document.getElementById("ins");

function sleep(ms) {
    return new Promise((resolves) => setTimeout(resolves, ms));

}

async function instructionLoop() {


    if (!paused) {
        console.log("called");
        let curInstruc = titles[curIndex];

        for (let i = 0; i < curInstruc.length; i++) {

            if (paused) {
                break;
            }
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

        await instructionDelete();

        curIndex = selectedNumb;
        await sleep(waitTime);
        instructionLoop();

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