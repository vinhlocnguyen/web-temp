const allowEmptyReg = /^$/;
const urlReg = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;
const validation = {
  email: (text, isAllowEmpty) => {
    const emailReg = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    const reg = isAllowEmpty ? new RegExp(allowEmptyReg.source + '|' + emailReg.source) : emailReg;
    const valid = reg.test(text);
    return {
      valid: valid,
      error: !valid ? 'Please enter a valid email.' : ''
    };
  },
  name: (text) => {
    const reg = /^[a-z0-9_ ]+$/i;
    const valid = reg.test(text);
    return {
      valid: valid,
      error: !valid ? 'Must contain only a-z, A-Z, 0-9, _ and space.' : ''
    };
  },
  phone: (text) => {
    const reg = /^\+?([0-9]{2})\)?([-. 0-9]{4,16})$/;
    const valid = reg.test(text);
    return {
      valid: valid,
      error: !valid ? 'Phone invalid.' : ''
    };
  },
  isRequired: (text) => {
    const valid = !!text && text.length > 0;
    return {
      valid: valid,
      error: !valid ? 'This field is required.' : ''
    };
  },
  comparePassword: (text1, text2) => {
    const valid = text1 ? text1.localeCompare(text2) === 0 : false;
    return {
      valid: valid,
      error: !valid ? 'Repeat new-password must equal new-password.' : ''
    };
  },
  passwordLength: (password) => {
    const valid = password && password.length > 5;
    return {
      valid: valid,
      error: !valid ? 'it is too short' : ''
    };
  },
  latitude: (lat) => {
    const reg = /^[-+]?([1-8]?\d(\.\d+)?|90(\.0+)?)$/;
    const valid = reg.test(lat);
    return {
      valid,
      error: !valid ? 'The valid range of latitude is -90 and +90' : ''
    };
  },
  longitude: (lng) => {
    const reg = /^[-+]?(180(\.0+)?|((1[0-7]\d)|([1-9]?\d))(\.\d+)?)$/;
    const valid = reg.test(lng);
    return {
      valid,
      error: !valid ? 'The valid range of longitude is -180 and +180' : ''
    };
  },
  openingTime: (time) => {
    const reg = /^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/;
    const valid = reg.test(time);
    return {
      valid,
      error: !valid ? 'The time is not right format (HH:mm)' : ''
    };
  },
  bond: (value1, value2) => {
    const valid = Boolean((!value1 && !value2) || (value1 && value2));
    return {
      valid,
      error: !valid ? 'Both of fields must have values or both are empty' : ''
    };
  },
  url: (url) => {
    const reg = new RegExp(allowEmptyReg.source + '|' + urlReg.source);
    const valid = reg.test(url);
    return {
      valid,
      error: !valid ? 'Url wrong format' : ''
    };
  }
};

export default validation;
