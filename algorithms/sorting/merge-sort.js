function mergeSort(arr) {
  if (arr.length === 1) {
    return arr;
  }

  const half = parseInt(arr.length / 2);
  
  const leftHalf = arr.slice(0, half);
  const rightHalf = arr.slice(half, arr.length);
  
  const arr1 = mergeSort(leftHalf);
  const arr2 = mergeSort(rightHalf);
  
  return mergeArrays(arr1, arr2);
}

function mergeArrays(arr1, arr2) {
  const newArr = [];
  
  while ((arr1.length > 0) && (arr2.length > 0)) {
    if (arr1[0] < arr2[0]) {
      const element = arr1.shift();
      newArr.push(element);
    } else {
      const element = arr2.shift();
      newArr.push(element);
    }
  }
  
  while (arr1.length > 0) {
    const element = arr1.shift();
    newArr.push(element);
  }
  
  while (arr2.length > 0) {
    const element = arr2.shift();
    newArr.push(element);
  }
  
  return newArr;
}

const arr = [49, 64, 2, 32, 71, 53, 102, -8, 12, 99, 3];
const sortedArr = mergeSort(arr);
console.log(sortedArr);
