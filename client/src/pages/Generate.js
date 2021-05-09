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

  function splitText(quote) {
    const MAX_LINE_LEN = 17;
    const words = quote.split(' ');
    const splitWords = [];
    // Get estimate for number of lines
    const numOfLines = Math.ceil(quote.length / MAX_LINE_LEN);
    if (numOfLines > 4) {
      setErrorMsg('Quote is too long!');
      return [''];
    }
    const targetLen = Math.floor(quote.length / numOfLines);
    let segment = '';
    let flush = 0;
    while(words.length > 0) {
      let lineLen;
      if (segment.length > 0) {
        lineLen = segment.length + words[0].length + 1; // +1 for space btw words
      } else {
        lineLen = words[0].length;
      }
      if (lineLen > MAX_LINE_LEN) {
        // Don't add words[0] to segment
        if (segment === '') {
          // words[0] itself is too long
          setErrorMsg(`${words[0]} is too long. Consider splitting.`);
          return [''];
        }
        flush = 1; // Flush segment
      } else {
        if (lineLen >= targetLen && lineLen <= MAX_LINE_LEN) {
          flush = 1;
        }
        // Continue building up line
        if (segment.length > 0) {
          segment += ` ${words[0]}`;
        } else {
          segment = words[0];
        }
        words.shift();
      }
      if (flush) {
        splitWords.push(segment);
        segment = '';
        flush = 0;
      }
    }
    if (segment.length > 0) {
      splitWords.push(segment);
    }
    if (splitWords.length > 4) {
      setErrorMsg('Quote is too long');
      return [''];
    } else {
      return splitWords;
    }
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
