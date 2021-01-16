const noop = function(val){}; // do nothing.

export default class API {
  // action: login, signup, logout
  static updateUser(action, email='', password='', cb=noop) {
    let settings = {
      method: 'post',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    }
    fetch(`/api/user/${action}`, settings)
    .then(res => {
      // console.log('[updateUser]', res);
      if (res.status === 401) {
        // Authentication failed.
        // Create and send json message
        return Promise.resolve({ 
          status: false, 
          message: 'Authentication Failed! Either the email or password is incorrect!'
        });
      } else {
        return res.json();
      }
    })
    .then(res => cb(res))
    .catch(err => {
      console.log('[updateUser] err=', err);
      cb({ });
    })
  }

  static saveImage(email, image, cb=noop) {
    let settings = {
      method: 'post',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, image })
    }
    fetch(`/api/image`, settings)
    .then(res => res.json())
    .then(res => cb(res))
    .catch(err => {
      console.log('[saveImage] err=', err);
      cb([]);
    });
  }

  static getImages(cb) {
    fetch('/api/image')
    .then(res => res.json())
    .then(res => cb(res))
    .catch(err => {
      console.log('[getImages] err=', err);
      cb([]);
    });
  }
}