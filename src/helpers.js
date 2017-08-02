
export function isPromise(obj) {
  return typeof obj.then === "function"
}

export function isGenerator(obj) {
  return typeof obj.next === "function" && typeof obj.throw === "function"
}

export function isGeneratorFunction(obj) {
  const { name, displayName, prototype } = obj.constructor
  const valid = "GeneratorFunction"

  if (!constructor) return false
  if (name === valid || displayName === valid) return true
  return isGenerator(prototype)
}
