
import { isPromise } from "./helpers"

export default function handler(iterator) {
  const iter = iterator.next()
  return nested(iterator, iter.value)
}

export function nested(iter, old) {
  function callback(gen, i, resolve) {
    if (!i.done) {
      nested(gen, i.value).then(resolve)
    } else {
      resolve("generator iteration finished")
    }
  }

  return new Promise((resolve) => {
    toPromise(old)
      .then((res) => {
        const i = iter.next(res)
        callback(iter, i, resolve)
      })
      .catch((err) => {
        const i = iter.throw(err)
        callback(iter, i, resolve)
      })
  })
}

export function toPromise(obj) {
  if (isPromise(obj)) return obj
  return Promise.resolve(obj)
}
