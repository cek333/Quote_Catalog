const noop = function(val){}; // do nothing.

function fetchJSON(url, cb=noop, method='get', data={}) {
  let settings = {
    method,
    headers: { 'Content-Type': 'application/json' }
  };
  if (method === 'post' || method === 'put') {
    settings.body = JSON.stringify(data);
  }
  fetch(url, settings)
  .then(res => res.json())
  .then(res => cb(res))
  .catch(err => {
    console.log(`[fetchJSON] url=${url} err=`, err);
    cb({ status: false, message: 'Unexpected Error' });
  })
}

export default class API {
  // action: login, signup, logout
  static updateUser(action, email='', password='', cb=noop) {
    const url = `/api/user/${action}`;
    fetchJSON(url, cb, 'post', { email, password });
  }

  static getCurUser(cb) {
    fetchJSON('/api/user/fetch', cb);
  }

  static saveImage(src, quote, cb=noop) {
    fetchJSON('/api/image', cb, 'post', { src, quote });
  }

  static getImages(cb) {
    fetchJSON('/api/image', cb);
  }

  static searchImages(query, cb) {
    const url = `/api/image?search=${query}`;
    fetchJSON(url, cb);
  }

  static deleteImage(id, cb=noop) {
    const url = `/api/image/${id}`;
    fetchJSON(url, cb, 'delete');
  }
}