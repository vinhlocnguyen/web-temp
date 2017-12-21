var isPrivateMode = false;
const isBrowser = typeof window !== 'undefined';

// Check localStorage
if (typeof localStorage === 'object') {
  try {
    localStorage.setItem('localStorage', 1);
    localStorage.removeItem('localStorage');
  } catch (err) {
    isPrivateMode = true;
  }
}

const _setItem = (key, value) => {
  window[key] = value;
};

const _getItem = (key) => {
  return window[key] ? window[key] : undefined;
};

const _removeItem = (key) => {
  delete window[key];
};

const clientStorage = {
  setItem: (key, value) => {
    if (isPrivateMode) {
      _setItem(key, value);
    } else {
      (isBrowser && localStorage.setItem(key, value));
    }
  },

  getItem: (key) => {
    if (isPrivateMode) {
      return _getItem(key);
    } else {
      return (isBrowser && localStorage.getItem(key));
    }
  },

  removeItem: (key) => {
    if (isPrivateMode) {
      _removeItem(key);
    } else {
      (isBrowser && localStorage.removeItem(key));
    }
  },

  getObject: (key) => {
    if (isPrivateMode) {
      let value = _getItem(key);
      return (value && JSON.parse(value));
    } else {
      let value = (isBrowser && localStorage.getItem(key));
      return (value && JSON.parse(value));
    }
  },

  setObject: (key, value) => {
    if (isPrivateMode) {
      _setItem(key, JSON.stringify(value));
    } else {
      (isBrowser && localStorage.setItem(key, JSON.stringify(value)));
    }
  }
};

export default clientStorage;
