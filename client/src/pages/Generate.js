import React, { useState, useRef } from 'react';
import API from '../utils/API';

function Generate(props) {
  const textColourInput = useRef(null);
  const bgColourInput = useRef(null);
  const canvasOutput = useRef(null);
  const quoteInput = useRef(null);
  const [ errorMsg, setErrorMsg ] = useState('');
  const [ successMsg, setSuccessMsg ] = useState(' ');
  const [ genImgSrc, setImgSrc ] = useState('');

  const CANVAS_WIDTH = 300;
  const CANVAS_HEIGHT = 200;

  let textColours = ['black', 'indigo', 'crimson', 'magenta', 'green', 'red', 'orange',
                     'purple', 'blue'];
  let bgColours = ['white', 'turquoise', 'teal', 'silver', 'olive', 'pink', 'grey', 'gold',
                  'salmon'];

  function updateCanvas() {
    clearMessages();
    const ctx=canvasOutput.current.getContext("2d");
    // ctx.font="30px Comic Sans MS";
    ctx.font='30px Consolas'; // use monospace font
    ctx.fillStyle = bgColourInput.current.value;
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    ctx.fillStyle = textColourInput.current.value;
    ctx.textAlign = "center";
    // One line of text:
    // ctx.fillText(quoteInput.current.value, CANVAS_WIDTH/2, CANVAS_HEIGHT/2);
    // Multi-line text:
    const splitArr = splitText(quoteInput.current.value);
    const yOffset = CANVAS_HEIGHT / (splitArr.length + 1);
    const lineOffset = 45;
    for (let idx=0; idx < splitArr.length; idx++) {
      ctx.fillText(splitArr[idx], CANVAS_WIDTH/2, yOffset + (lineOffset * idx));
    }
    setImgSrc(canvasOutput.current.toDataURL());
  }

  function clearMessages() {
    setSuccessMsg(' ');
    setErrorMsg('');
  }

  function handleSubmit(evt) {
    evt.preventDefault();
    clearMessages();
    API.saveImage(genImgSrc, quoteInput.current.value, (res) => {
      if (res.status) {
        setSuccessMsg(res.message);
      } else {
        setErrorMsg(res.message);
      }
    });
  }

  function splitText(text) {
    const MAX_LINE_LEN = 17;
    let textLen = text.length;
    if (textLen === 0) {
      return [''];
    }
    if (textLen > (MAX_LINE_LEN * 4)) {
      setErrorMsg('Quote is too long!');
      return [''];
    }
    let segments = [];
    let prevSp = 0;
    let nextSp = 0;
    let sliceStart = 0;
    let targetLineLen;
    let iterations;
    do {
      if (textLen > (MAX_LINE_LEN * 3)) {
        targetLineLen = Math.floor(textLen/4);
      } else if (textLen > (MAX_LINE_LEN * 2)) {
        targetLineLen = Math.floor(textLen/3);
      } else if (textLen > MAX_LINE_LEN) {
        targetLineLen = Math.floor(textLen/2);
      } else {
        targetLineLen = MAX_LINE_LEN;
      }
      iterations = Math.floor(textLen / MAX_LINE_LEN);
      if (textLen % MAX_LINE_LEN === 0) {
        if (iterations > 0) {
          iterations--;
        }
      }
      if (iterations === 0) break;
      do {
        prevSp = nextSp;
        nextSp = text.indexOf(' ', prevSp+1);
        if (nextSp < 0) break;
      } while((nextSp - sliceStart) < targetLineLen);
      // Did we go too far over targetLineLen?
      if (nextSp < 0 || (nextSp - sliceStart) > MAX_LINE_LEN) {
        if (prevSp === sliceStart) {
          setErrorMsg("Can't split quote. Consider hyphenating.");
          return [''];
        } else {
          nextSp = prevSp;
        }
      }
      segments.push(text.slice(sliceStart, nextSp));
      nextSp++; // +1 to skip space
      sliceStart = nextSp;
      textLen = text.length - nextSp;
    } while (iterations > 0);
    // One segment remains. Push into segments.
    segments.push(text.slice(sliceStart));
    if (segments.length > 4) {
      setErrorMsg("Sorry. Failed to reformat quote. Perhaps it's too long.");
      // console.log('[splitText]', segments);
      return [''];
    }
    // console.log('[splitText]', segments);
    return segments;
  }

  let display;
  if (props.user) {
    display =
      <div>
        <form className='inputForm' onSubmit={handleSubmit}>
          <h3>Create Your Own Quote</h3>
          <p className='successMsg'>{successMsg}</p>
          <label htmlFor='quote'>Quote Text:</label>
          <input type='text' ref={quoteInput} name='quote' id='quote'
                placeholder='Quote' required onChange={updateCanvas} />
          <div className='sideBySide'>
            <label htmlFor='textColour'>Text Colour </label>
            <select name='textColour' id='textColor'
                  ref={textColourInput} onChange={updateCanvas}>
            {textColours.map(colour => <option value={colour} key={colour}>{colour}</option>)}
            </select>
          </div>
          <div className='sideBySide'>
            <label htmlFor='bgColour'>Background Colour </label>
            <select name='bgColour' id='bgColor'
                  ref={bgColourInput} onChange={updateCanvas}>
            {bgColours.map(colour => <option value={colour} key={colour}>{colour}</option>)}
            </select>
          </div>
          <canvas ref={canvasOutput} width={CANVAS_WIDTH} height={CANVAS_HEIGHT}>
            Your browser does not support the canvas element.
          </canvas>
          <button type='submit'>Save Image</button>
          <p className='errorMsg'>{errorMsg}</p>
        </form>
      </div>;
  } else {
    display = <p>You need to login/signup before you can create images.</p>
  }

  return display;
}

export default Generate;
