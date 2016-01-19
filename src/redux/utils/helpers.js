// add element to array only if it doesn't already exist
export const addToArray = (array, elem) => {
  if (array.indexOf(elem) !== -1) {
    return array
  }

  return [ ...array, elem ] // concat
}

// video lists are equal if their ids are equal
export const videoListsEqual = (firstArr, secondArr) => {
  if (firstArr.length !== secondArr.length) {
    return false
  }

  for (let i = 0; i < firstArr.length; i++) {
    let item = firstArr[i]
    if (item.data.id !== secondArr[i].data.id) {
      return false
    }
  }

  return true
}
