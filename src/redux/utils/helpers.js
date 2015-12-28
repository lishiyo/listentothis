export const addToArray = (array, elem) => {
  if (array.indexOf(elem) !== -1) {
    return array
  }

  return [ ...array, elem ]
}

export default addToArray
