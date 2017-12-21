const getTimezoneOffset = () => {
  const d = new Date();
  return d.getTimezoneOffset();
};

export const request = {
  get: (authToken) => {
    return {
      method: 'GET',
      headers: {
        'x-auth-token': authToken,
        'x-timezone-offset': getTimezoneOffset()
      }
    };
  },
  post: (authToken, body) => {
    return {
      method: 'POST',
      headers: {
        'x-auth-token': authToken,
        'x-timezone-offset': getTimezoneOffset(),
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    };
  },
  put: (authToken, body) => {
    return {
      method: 'PUT',
      headers: {
        'x-auth-token': authToken,
        'x-timezone-offset': getTimezoneOffset(),
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    };
  },
  delete: (authToken) => {
    return {
      method: 'DELETE',
      headers: {
        'x-auth-token': authToken,
        'x-timezone-offset': getTimezoneOffset()
      }
    };
  }
};
