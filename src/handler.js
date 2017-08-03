
import actions from "./actions"
import yields from "./yieldhandlers"
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
  // only accept generators and generator functions
  if (!isGenerator(iterator) && !isGeneratorFunction(iterator)) {
    throw new Error("the argument isn't a generator")
  }
  // is a function or an iterator?
  const iter = isGenerator(iterator) ? iterator : iterator()

  return new Promise((resolve, reject) => {
    /**
     * Call recursively to iterate the generator
     * @param  {object}   i The iteration object
     * @return {Function}   This function
     */
    function callback(i) {
      if (!i.done) {
        handler(iter, i.value).then(resolve).catch(reject)
      } else {
        resolve(i.value)
      }
    }

    toPromise(old)
      .then(res => callback(iter.next(res)))
      .catch((err) => {
        try {
          callback(iter.throw(err))
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

  // eslint-disable-next-line no-restricted-syntax
  for (const f of yields) {
    try {
      const result = f(obj)
      if (result && isPromise(result)) return result
    } catch (err) {
      // yield handler throwed an error
      return Promise.reject(err)
    }
  }

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
