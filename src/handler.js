
import actions from "./actions"
import {
  isPromise, isGenerator,
  isGeneratorFunction, isEffect,
} from "./helpers"

/**
 * This function handles ES2015 generator functions to work.
 * @param  {Generator} iterator ES2015 Generator to handle
 * @param  {any} old  Result of the previous iteration
 * @return {Promise}      Runtime Promise
 */
export default function handler(iterator, old) {
  if (!isGenerator(iterator) && !isGeneratorFunction(iterator)) {
    throw new Error("the argument isn't a generator")
  }
  const iter = isGenerator(iterator) ? iterator : iterator()

  function callback(gen, i, resolve, reject) {
    if (!i.done) {
      handler(gen, i.value).then(resolve).catch(reject)
    } else {
      resolve(i.value)
    }
  }

  return new Promise((resolve, reject) => {
    const args = [resolve, reject]

    toPromise(old)
      .then((res) => {
        const i = iter.next(res)
        callback(iter, i, ...args)
      })
      .catch((err) => {
        try {
          const i = iter.throw(err)
          callback(iter, i, ...args)
        } catch (error) {
          reject(error)
        }
      })
  })
}

/**
 * Convert anything to a Promise.
 *
 * This function can handle:
 * - Promises
 * - Generator (delegation to **nested**)
 * - Generators Functions (delegation to **handler**)
 * - Arrays of Promises (using **Promise.all**)
 * - Effects (running them)
 * @param  {any} obj Value to convert
 * @return {Promise}     Result
 */
export function toPromise(obj) {
  if (!obj) return Promise.resolve(obj)
  if (isPromise(obj)) return obj
  if (isGenerator(obj) || isGeneratorFunction(obj)) return handler(obj)
  if (Array.isArray(obj)) return Promise.all(obj.map(toPromise, this))

  if (isEffect(obj)) return handleEffect(obj)
  return Promise.resolve(obj)
}

/**
 * Handles an effect
 * @param  {object} effect The effect to handle
 * @return {Promise}        Result
 */
export function handleEffect(effect) {
  const action = actions.get(effect.type)
  if (!action) return Promise.reject("action not defined")

  const result = action(...effect.args)
  return toPromise(result)
}
