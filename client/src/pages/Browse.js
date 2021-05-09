import React, { useEffect, useState, useRef } from 'react';
import API from '../utils/API';
import deleteIcon from '../assets/delete_icon.svg';

function Browse(props) {
  const [ imageList, setImageList ] = useState([]);
  const searchInput = useRef(null);

  useEffect(function() {
    API.getImages((res) => setImageList(res));
  }, []);

  function updateImageList() {
    const query = searchInput.current.value;
    if (query) {
      API.searchImages(query, res => setImageList(res));
    } else {
      API.getImages(res => setImageList(res));
    }
  }

  function handleSearch(evt) {
    evt.preventDefault();
    // console.log('[handleSearch]', evt.target.value);
    if (evt.target.value === 'search' || evt.target.value === 'clear') {
      if (evt.target.value === 'clear') {
        searchInput.current.value = '';
      }
      updateImageList();
    }
  }

  function handleDelete(evt) {
    evt.preventDefault();
    // console.log('[handleDelete]', evt, evt.target, evt.currentTarget);
    API.deleteImage(evt.currentTarget.value, (resDel) => {
      // Get updated image list 
      updateImageList();
    });
  }

  return (
    <div>
      <p>Note, to save an image, right-click, then select 'Save Image As ...'</p>
      <form className='searchForm' onSubmit={handleSearch}>
        <label htmlFor='search'>Search Images</label>
        <input type='text' name='search' id='search'
                 placeholder='Search Images' ref={searchInput} />
        <div className='sameRow'>
          <button type='button' value='search' onClick={handleSearch}>Search</button>
          <button type='button' value='clear' onClick={handleSearch}>Clear</button>
        </div>
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