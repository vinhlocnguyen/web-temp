// Input: url query.
// Output: Object contains params
// Example: 
// Input - '?code=abc' or 'code='abc'&name='name'
// Output - { code: 'abc' } or { code: 'abc', name: 'name' }
const parseQueryStringToObject = queryString => {
  if (!queryString) {
    return { };
  }
  let query = queryString;
  return (/^[?#]/.test(query) ? query.slice(1) : query)
    .split('&')
    .reduce((params, param) => {
      let [ key, value ] = param.split('=');
      params[key] = value ? decodeURIComponent(value.replace(/\+/g, ' ')) : '';
      return params;
    }, { });
};

export {
  parseQueryStringToObject
};