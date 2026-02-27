import React from "react";
import { ReactP5Wrapper, Sketch } from "react-p5-wrapper";
import p5 from "p5";
import { useEffect, useState, useRef } from "react";

let all_dgts: number[] = [
  0x3f, // 0 -> 0b0111111
  0x06, // 1 -> 0b0000110
  0x5b, // 2 -> 0b1011011
  0x4f, // 3 -> 0b1001111
  0x66, // 4 -> 0b1100110
  0x6d, // 5 -> 0b1101101
  0x7d, // 6 -> 0b1111101
  0x07, // 7 -> 0b0000111
  0x7f, // 8 -> 0b1111111
  0x4f, // 9 -> 0b1001111
];

let elBuf1 = { elDoorWidth: 0 };
let elBuf2 = { elDoorWidth: 0 };

const sketch: Sketch = (p5: p5) => {
  let number = 0;

  let size = {
    w: 100,
    h: 100,
  };

  let img: p5.Image;

  // Load the image and create a p5.Image object.
  p5.preload = () => {
    img = p5.loadImage("/segmentPic.PNG");
  };
  //updateWithProps?: (props: any) => void;
  p5.updateWithProps = (props) => {
    if (props.value !== undefined) {
      number = props.value;
      size = props.size;
      p5.resizeCanvas(size.w, size.h);
      console.log(number);
    }
  };

  p5.setup = () => {
    p5.createCanvas(size.w, size.h);
    p5.frameRate(30);
  };

  p5.draw = () => {
    p5.background(0);

    //

    p5.push();
    p5.scale(size.h / 800);
    p5.translate(20, 0);
    sevenSegment(p5, all_dgts[number], img);
    p5.pop();

    //-------------------
    /*p5.push();
    p5.translate(100, 50);
    p5.scale(0.3);
    Elevator(p5, number % 3 == 0, elBuf1);
    p5.pop();

    //-------------------

    p5.push();
    p5.translate(300, 50);
    p5.scale(0.3);
    Elevator(p5, number % 2 == 0, elBuf2);
    p5.pop();*/
  };
};

export function P5Segment() {
  const [time, setTime] = useState(0);
  const [size, setSize] = useState({ w: 300, h: 150 });
  const containerRef = useRef(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setTime((t) => (t + 1) % 10);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const updateSize = () => {
      if (containerRef.current) {
        const { clientWidth, clientHeight } = containerRef.current;
        setSize({ w: clientWidth, h: clientHeight });
      }
    };

    updateSize();
    window.addEventListener("resize", updateSize);

    return () => window.removeEventListener("resize", updateSize);
  }, []);

  return (
    <div ref={containerRef} style={{ width: "100%", height: "100%" }}>
      <ReactP5Wrapper sketch={sketch} value={time} size={size} />
    </div>
  );
}

//change color from here
/*function getColor(p, val, shift) {
  let r = 0;
  let g = 100;
  let b = 255;
  let a = 40 + 255 * ((val >> shift) & 1);
  return p.color(r, g, b, a);
}*/
//configuration
function sevenSegment(p: p5, val: number, img: p5.Image) {
  const bodyW = 250;
  const bodyH = 400;
  p.rectMode(p.CENTER);

  p.fill(255);
  p.noFill();
  p.angleMode(p.DEGREES);

  //p.image(img, 0, 0, bodyW, bodyH);
  p.rect(bodyW / 2, bodyH / 2, bodyW, bodyH, 10, 10);

  const segment = (x: number, y: number, rotation: number, color: p5.Color) => {
    p.push();

    p.translate(x, y);
    p.rotate(rotation);

    p.fill(color);
    p.noStroke();

    p.rectMode(p.CENTER);
    if (rotation == 0) p.rect(0, 0, 165, 30, 40, 40);
    else p.rect(0, 0, 165, 30, 40, 40);
    p.pop();
  };

  const startY = 30;
  const x = [30, bodyW / 2, bodyW - 30];
  const y = [
    startY,
    bodyH / 4 + startY / 2,
    bodyH / 2,
    (3 * bodyH) / 4 - startY / 2,
    bodyH - startY,
  ];

  const mapArr = [
    // x , y , r,bite
    [1, 0, 0, 0], // A
    [2, 1, 90, 1], // B
    [2, 3, 90, 2], // C
    [1, 4, 0, 3], // D
    [0, 3, 90, 4], // E
    [0, 1, 90, 5], // F
    [1, 2, 0, 6], // center
  ];

  mapArr.forEach((v) => {
    const isBitSet = (val & (0x01 << v[3])) !== 0;
    //const isBitSet = true;
    const r = 0;
    const g = 100;
    const b = 255;
    const a = isBitSet ? 255 : 40;

    segment(x[v[0]], y[v[1]], v[2], p.color(r, g, b, a));
  });
}

/*
function Elevator(p, doorOpen, buff) {
  p.fill(255);
  p.stroke(0);

  //p.background(r, g, b);
  //Outer box of elevator
  p.fill(0);
  p.stroke(255);
  p.rect(190, 40, 220, 320);
  p.stroke(0);

  p.noFill();
  p.stroke(255);
  p.line(0, 360, 600, 360);
  //Elevator controls
  p.fill(0);
  p.rect(430, 190, 20, 40);
  p.fill(255);
  p.ellipse(440, 200, 10, 10);
  p.ellipse(440, 220, 10, 10);
  //Bar on elevator
  p.rect(260, 20, 80, 10);
  p.fill(0);
  p.rect(280, 20, 40, 10);
  p.stroke(0);

  p.fill(200);
  p.rect(200, 50, 200, 300);
  p.line(200, 50, 240, 80);
  p.line(240, 80, 240, 300);
  p.line(240, 300, 200, 350);
  p.line(240, 80, 360, 80);
  p.line(360, 80, 400, 50);
  p.line(360, 80, 360, 300);
  p.line(240, 300, 360, 300);
  p.line(360, 300, 400, 350);

  if (!doorOpen) {
    p.fill("rgb(21, 175, 236)");
    p.rect(400 - buff.elDoorWidth, 50, buff.elDoorWidth, 300);
    p.rect(200, 50, buff.elDoorWidth, 300);
    if (buff.elDoorWidth < 100) buff.elDoorWidth++;
  } else {
    p.fill("rgb(21, 175, 236)");
    p.rect(400 - buff.elDoorWidth, 50, buff.elDoorWidth, 300);
    p.rect(200, 50, buff.elDoorWidth, 300);

    if (buff.elDoorWidth > 0) buff.elDoorWidth -= 1;
  }
}
*/
