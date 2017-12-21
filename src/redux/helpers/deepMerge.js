/**
 * Simple is object check.
 * @param item
 * @returns {boolean}
 */
export function isObject(item) {
  return (item && typeof item === 'object' && !Array.isArray(item) && item !== null);
}

/**
 * Deep merge two objects.
 * @param target
 * @param source
 */
const mergeDeep = (...objs) => {
  if (objs.length < 2) {
    throw new Error('Need two or more objects to merge');
  }
  const target = objs[0];
  for (let i = 1; i < objs.length; i++) {
    const source = objs[i];
    Object.keys(source).forEach(prop => {
      const value = source[prop];
      if (isObject(value)) {
        if (target.hasOwnProperty(prop) && isObject(target[prop])) {
          target[prop] = mergeDeep(target[prop], value);
        } else {
          target[prop] = value;
        }
      } else if (Array.isArray(value)) {
        if (target.hasOwnProperty(prop) && Array.isArray(target[prop])) {
          const targetArray = target[prop];
          value.forEach((sourceItem, itemIndex) => {
            if (itemIndex < targetArray.length) {
              const targetItem = targetArray[itemIndex];
              if (Object.is(targetItem, sourceItem)) {
                return;
              }
              if (isObject(targetItem) && isObject(sourceItem)) {
                targetArray[itemIndex] = mergeDeep(targetItem, sourceItem);
              } else if (Array.isArray(targetItem) && Array.isArray(sourceItem)) {
                targetArray[itemIndex] = mergeDeep(targetItem, sourceItem);
              } else {
                targetArray[itemIndex] = sourceItem;
              }
            } else {
              targetArray.push(sourceItem);
            }
          });
        } else {
          target[prop] = value;
        }
      } else {
        target[prop] = value;
      }
    });
  }
  return target;
};

export default mergeDeep;
