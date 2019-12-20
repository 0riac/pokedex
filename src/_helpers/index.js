export const asyncForEachAll = async (array, callback) => {
  const promiseArr = []
  for (let index = 0; index < array.length; index++) {
    promiseArr.push(callback(array[index], index, array))
  }

  return await Promise.allSettled(promiseArr)
}
