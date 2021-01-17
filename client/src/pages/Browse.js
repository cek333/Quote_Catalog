import React, { useEffect, useState } from 'react';
import API from '../utils/API';
import downloadIcon from '../assets/download_icon.svg';
import deleteIcon from '../assets/delete_icon.svg';

function Browse(props) {
  const [ imageList, setImageList ] = useState([]);

  useEffect(function() {
    API.getImages((res) => setImageList(res));
  }, [])

  function handleSearch() {
  }

  function handleDelete(evt) {
    evt.preventDefault();
    console.log('[handleDelete]', evt.target);
    API.deleteImage(evt.target.value, (resDel) => {
      // Get updated image list 
      API.getImages((resGet) => setImageList(resGet));
    });
  }

  return (
    <div>
      <form className='searchForm'>
        <label htmlFor='search'>Search Images</label>
        <input type='text' name='search' id='search'
                 placeholder='Search Images' onChange={handleSearch} />
      </form>
      <div className='imageList'>
        {imageList.map(imgItem =>
            <div key={imgItem._id} className='imageItem'>
              <img src={imgItem.src} alt={imgItem.quote} />
              {imgItem.enDel &&
              <button type='button' onClick={handleDelete} value={imgItem._id}>
                <img className='icons' src={deleteIcon} alt='delete' />
              </button>}
            </div>)
        }
      </div>
    </div>
  )
}

export default Browse;