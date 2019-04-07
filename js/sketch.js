
let txt;
let txtDict;
let phrases = ['omar', 'biggest']
let txtholder = [['omar is not the biggest', 0], ['cat in the world', 1]]

//scan and create phrases. getPhrases();
//phrase1, color/blank, phrase2,c, phrase3 in array
//

function preload() {
  txt = loadStrings("data/test.txt");
}

//for each: text text textSize 
//split up looped phrases

////for each phrase in phrases. regexp. or for each
///pre-create the animation. <span>blank<span>
//look at how to split up text

function setup() {

  print(txtholder)
  text(txtholder[0], txtholder[1])
  fill(0, 102, 153);
  textSize(20)
  // var splitted = splitString(txt, phrases);
  // print(splitted)

 // createCanvas(windowWidth, windowHeight);
}

function draw() {
}

// function draw() {
//   if (mouseIsPressed) {
//     fill(0);
//   } else {
//     fill(255);
//   }
//   ellipse(mouseX, mouseY, 80, 80);
// }
