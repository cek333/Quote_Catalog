import React, { useEffect, useState, useRef } from 'react';
import API from '../utils/API';

function Generate(props) {
  const textColourInput = useRef(null);
  const bgColourInput = useRef(null);
  const canvasOutput = useRef(null);
  const quoteInput = useRef(null);
  const [ errorMsg, setErrorMsg ] = useState('');
  const [ successMsg, setSuccessMsg ] = useState(' ');
  const [ genImgSrc, setImgSrc ] = useState('');

  let textColours = ['black', 'indigo', 'crimson', 'magenta', 'green', 'red', 'orange',
                     'purple', 'blue'];
  let bgColours = ['white', 'turquoise', 'teal', 'silver', 'olive', 'pink', 'grey', 'gold',
                  'salmon'];

  function updateCanvas() {
    clearMessages();
    let ctx=canvasOutput.current.getContext("2d");
    let width = canvasOutput.current.width;
    let height = canvasOutput.current.height;
    // console.log('[updateCanvas]', width, height, bgColourInput.current.value,
    //   textColourInput.current.value, quoteInput.current.value);
    ctx.font="30px Comic Sans MS";
    ctx.fillStyle = bgColourInput.current.value;
    ctx.fillRect(0, 0, width, height);
    ctx.fillStyle = textColourInput.current.value;
    ctx.textAlign = "center";
    ctx.fillText(quoteInput.current.value, width/2, height/2);
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

  let display;
  if (props.user) {
    display =
      <div>
        <h2>Create Your Own Quote</h2>
        <form className='inputForm' onSubmit={handleSubmit}>
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
          <canvas ref={canvasOutput} width='300' height='200'>
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
