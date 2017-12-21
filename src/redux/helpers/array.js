export const arrayClone = (arr) => {
  let i, copy;
  if (Array.isArray(arr)) {
    copy = arr.slice(0);
    for (i = 0; i < copy.length; i++) {
        copy[ i ] = arrayClone(copy[ i ]);
    }
    return copy;
  } else if (typeof arr === 'object') {
    return Object.assign({}, arr);
  } else {
    return arr;
  }
};
