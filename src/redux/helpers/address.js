export const styleAddress = (addressObj) => {
  const result = [];
  for (const key in addressObj) {
    if (addressObj[key]) {
      result.push(addressObj[key]);
    }
  }
  return result.join(', ');
};
