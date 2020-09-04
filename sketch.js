var AudioContext = window.AudioContext || window.webkitAudioContext;

const width = window.innerWidth
const height = window.innerHeight

const velocity = 1

const red = [255, 0, 40]
const letters = ["a", "↓", "•", "e", "x", "!", "—", ":"]
const ornamentString = "DONT LOOK HERE YOU FUCKING BUSTARD"

let mic
let fft
let amp

const donutPoints = []

let lineCount = 10
const pointInbetween = 5
const soundAreas = Math.floor(pointInbetween) / 5
let innerRadius = .1 * width
let middleRadius = (.1 * width) * 2
let outerRadius = middleRadius * 2

const polygonRadius = 128

let spinBonus = 2
// let spinFactor = 1.0
let rndmBase = 0.02
let shiftPos = {
  x: width / 2,
  y: height / 2
}
let rndmIndex = 20
let displacement = 0

function preload () {}

function setup () {
  frameRate(60)
  smooth(1)
  const cnv = createCanvas(window.innerWidth, window.innerHeight)
  background(0)

  mic = new p5.AudioIn();
  mic.start();

  fft = new p5.FFT()
  fft.setInput(mic)

  // noiseSeed(1240)
  // randomSeed(1240)
}

function triggerPeak () {
  background(255)
}

let kickPeakAllowed = true
let kickPeakCounter = 0

function draw () {

  let kickLevel = Math.pow(fft.getEnergy(3, 50), 1) * velocity
  let bassLevel = Math.pow(fft.getEnergy(10, 75), 2.1) * velocity
  let midLevel = Math.pow(fft.getEnergy(1000, 3000), 1) * velocity
  let midHighLevel = Math.pow(fft.getEnergy(5000, 8000), 1) * velocity
  let highLevel = Math.pow(fft.getEnergy(9600, 14000), 1) * velocity

  let string = "N O I S E   F O R   Y O U"
  if (highLevel >= 70) {
    if (highLevel >= 130) {
      string = `N ${Math.floor(random(0, 9))} I ${letters[Math.floor(random(0, letters.length-1))]} E   F O R   ${letters[Math.floor(random(0, letters.length-1))]} ${letters[Math.floor(random(0, letters.length-1))]} U`
    }
    noStroke()
    fill(255)
    textStyle(ITALIC)
    textAlign(RIGHT, CENTER)
    textSize(24)
    text(string, 0.18 * width, .1 * height)
    textSize(height)
    fill(255, 255/10)
    textAlign(LEFT, CENTER)
    text(string, -0.25 * width, 1 * height)
    // text(Math.round(volumeToColor), 0, 0)
    // text((frameCount / 60).toFixed(2), 0, 0)
    // textSize(80)

    rndmIndex = Math.floor(random(0, lineCount+2))
  }
  // let lineCountBonus = Math.floor(map(Math.pow(fft.getEnergy(1, 20), 2), 0, 110000, 0, 12))
  // console.log(bassLevel)

  noStroke()
  fill(255)
  textStyle(NORMAL)
  textSize(24)
  textAlign(RIGHT, CENTER)
  text(Math.floor(highLevel), .045 * width, .045 * height)
  // text(Math.floor(kickLevel), .045 * width, 120*3)
  // text(Math.round(volumeToColor), 0, 0)
  // text((frameCount / 60).toFixed(2), 0, 0)

  let rw = 1
  rect(.05 * width, .05 * height, 16 + map(kickLevel, 0, 255, 0, 320), rw)
  rect(.05 * width, .05 * height, rw, 16 + map(highLevel, 0, 255, 0, 320))

  let volumeToColor = map(bassLevel, 0, 110000, 0, 255)

  const METAL = 160 * velocity
  const METALCORE = 190 * velocity
  const LIQUIDDNB = 200 * velocity
  const DNB = 220 * velocity
  const NOISIA = 240 * velocity

  if (volumeToColor > METALCORE) {
    background(frameCount % Math.floor(random(0, 4)) === 0 ? 250 : 210)
    innerRadius = 0
    spinBonus = 8
    lineCount = 20
    rndmBase = 0.08
    shiftPos.x = width / 2 + random(-.4 * width, .4 * width)
    shiftPos.y = height / 2 + random(-.4 * height, .4 * height)
    rndmIndex = Math.floor(random(0, lineCount+2))
    stroke(10)
  } else {
    if (frameCount % 1 === 0) { 
      // DEFAULT WAS 128
      background(volumeToColor / 5, 128) 
    }
    spinBonus = 0
    setTimeout(() => {
      shiftPos.x = width / 2
      shiftPos.y = height / 2
      rndmBase = 0.02
      donutPoints.splice(lineCount / 2 - 1, lineCount / 2)
      innerRadius = .1 * width
      // rndmIndex = 20
    }, 300);
    lineCount = 10
    stroke(255)
  }

  // POLY
  let baseX = .1 * width
  let baseY = .8 * height
  noFill()
  strokeWeight(2)
  beginShape(TRIANGLE_STRIP)
    // KICK
    vertex(baseX + sin(PI/2 * 1) * (map(kickLevel, 0, 255, .1, 1) * polygonRadius), baseY + cos(PI/2 * 1) * (map(kickLevel, 0, 255, .1, 1) * polygonRadius))
    curveVertex(baseX + sin(PI/2 * 2) * (map(highLevel, 0, 255, .1, 1) * polygonRadius), baseY + cos(PI/2 * 2) * (map(highLevel, 0, 255, .1, 1) * polygonRadius))
    curveVertex(baseX + sin(PI/2 * 3) * (map(midHighLevel, 0, 255, .1, 1) * polygonRadius), baseY + cos(PI/2 * 3) * (map(midHighLevel, 0, 255, .1, 1) * polygonRadius))
    vertex(baseX + sin(PI/2 * 4) * (map(midLevel, 0, 255, .1, 1) * polygonRadius), baseY + cos(PI/2 * 4) * (map(midLevel, 0, 255, .1, 1) * polygonRadius))
  endShape()

  translate(shiftPos.x, shiftPos.y)

  ornamentText(ornamentString, 24)

  if (kickPeakAllowed) {
    if (kickLevel >= 240) {

      for (let cs = 0; cs < 9; cs++) {
        setTimeout(() => {
          Cross(48, [
            random(-width * .4, width * .4), 
            random(-height * .4, height * .4)
          ])
        }, 300);
      }

      kickPeakAllowed = false
        
    }
  } else {
    // console.log("Hello", kickPeakCounter)
    if (kickPeakCounter <= 10) {
      kickPeakCounter++
      kickPeakAllowed = false
    } else {
      kickPeakAllowed = true
      kickPeakCounter = 0
    }
  }
  
  noFill()
  strokeWeight(2 * Math.exp(map(bassLevel, 0, 100000, 1, Math.round(height * 0.0025))))
  strokeCap(PROJECT)
  // strokeWeight(2)

  makeCoordinates(frameCount, bassLevel)

  // rotate(mouseX / width * 1)
  donutPoints.map(([r1, r2, ms], i) => {

    if (i-1 === rndmIndex) stroke(40, 240, 255)
    if (i === rndmIndex) stroke(255, 0, 40)

    beginShape()
      vertex(r1[0], r1[1])
      ms.map(([mx, my], j) => {
        curveVertex(mx, my)
      })
      // vertex(r2[0], r2[1])
    endShape()
  })
}

function makeCoordinates (time, bassLevel) {
  rotate(time / 60 + map(bassLevel, 0, 100000, 0, 1) + spinBonus)
  for (let index = 0; index < lineCount; index++) {
    // if (time % 60 === 0) {
      const x1 = sin(PI + index) * innerRadius
      const y1 = cos(PI + index) * innerRadius

  
      const middleOrOuter = index % 2 === 1 ? outerRadius : middleRadius
  
      let ms = []
      for (let m = 1; m < pointInbetween; m++) {

        let micFactor = map(analyzing()[m-1], 0, 30000, 0, 3)

        let rndmX = rndmBase * micFactor
        let rndmY = -rndmBase * micFactor

        if (m < 2) {
          // rndmX = Math.abs(Math.exp(rndmX))
          // rndmY = Math.abs(Math.exp(rndmY)) * -1
          rndmX = rndmX * 2
          rndmY = rndmY * 2
        }

        // const mx = sin(PI + index + (randomGaussian(rndmX, rndmY))) * (middleOrOuter / (pointInbetween-1) * m) + volumeFactor
        // const my = cos(PI + index + (randomGaussian(rndmX, rndmY))) * (middleOrOuter / (pointInbetween-1) * m) + volumeFactor

        const mx = sin(PI + index + displacement + (random(rndmX, rndmY))) * (middleOrOuter / (pointInbetween-1) * m) * map(bassLevel, 0, 100000, 1, 2.235) 
        const my = cos(PI + index + displacement + (random(rndmX, rndmY))) * (middleOrOuter / (pointInbetween-1) * m) * map(bassLevel, 0, 100000, 1, 2.235) 
        ms.push([mx, my])
      }
  
      const x2 = sin(PI + index) * middleOrOuter
      const y2 = cos(PI + index) * middleOrOuter
  
      donutPoints[index] = [[
        x1, 
        y1
        ], [
        x2, 
        y2
      ], ms]
    // }
  }
}

function analyzing () {
  let spectrum = fft.analyze()

  // noStroke();
  // fill(255, 0, 255);
  // for (let i = 0; i< spectrum.length; i++){
  //   let x = map(i, 0, spectrum.length, 0, width);
  //   let h = -height + map(spectrum[i], 0, 255, height, 0);
  //   rect(x, height, width / spectrum.length, h )
  // }

  const spectrumBarrels = Math.floor(spectrum.length / pointInbetween)

  const spectrumData = []
  for (let i = 1; i < spectrumBarrels; i++) {

    // try to summarize score
    let spectrumBarrelScore = 0

    for (let j = spectrumBarrels * i - spectrumBarrels; j < spectrumBarrels * i; j++) {
      spectrumBarrelScore += spectrum[j]
    }

    spectrumData.push(spectrumBarrelScore)
  }

  return spectrumData
}

function Cross (length, pos) {
  [x, y] = pos

  let w = 4
  let l = length / 2

  noStroke()
  fill(255)
  rect(x-l, y+l, length, w)
  rect(x, y, w, length)
  rotate(0)
}

function ornamentText(string, letterSpacing) {
  const oa = ornamentString.split("")
  const radius = outerRadius * 1.2
  function timing (seconds) {
    return 60 * seconds
  }
  oa.forEach((letter, i) => {
    let x = sin(1 + i + (frameCount / timing(0.67))) * radius
    let y = cos(1 + i + (frameCount / timing(0.67))) * radius
    textSize(16)
    fill(255, 33)
    // noStroke()
    text(letter, x, y)
  })
}