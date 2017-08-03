
import actions from "./actions"
import {
  isPromise, isGenerator,
  isGeneratorFunction, isEffect,
} from "./helpers"

export default function handler(iterator) {
  const i = isGenerator(iterator) ? iterator : iterator()
  const iter = i.next()
  return nested(i, iter.value)
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
  if (!obj) return Promise.resolve(obj)
  if (isPromise(obj)) return obj
  if (isGenerator(obj)) return nested(obj)
  if (isGeneratorFunction(obj)) return handler(obj)
  if (Array.isArray(obj)) return Promise.all(obj.map(toPromise, this))

  if (isEffect(obj)) return handleEffect(obj)
  return Promise.resolve(obj)
}

export function handleEffect(effect) {
  const action = actions.get(effect.type)
  if (!action) return Promise.reject("action not defined")

  const result = action(...effect.args)
  return toPromise(result)
}
