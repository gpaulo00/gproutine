
import { handler } from "../src/index"

/* eslint-disable require-yield */
describe("GPRoutine Arrays Handling", () => {
  const error = Error("fail")
  const value = 100

  it("should handle a basic array", (done) => {
    const arr = [4, 10, 20]
    function* test() {
      const result = yield arr.map(i => Promise.resolve(i))
      expect(result).toEqual(arr)
      done()
    }
    handler(test)
  })

  it("should handle rejections", (done) => {
    function* test() {
      let result
      try {
        yield [
          Promise.resolve(2),
          Promise.reject(error),
        ]
      } catch (err) {
        result = err
      }
      expect(result).toEqual(error)
      done()
    }
    handler(test)
  })

  it("should noop with empty array", (done) => {
    function* test() {
      const result = yield []
      expect(result.length).toEqual(0)
      done()
    }
    handler(test)
  })

  it("should support nested arrays", (done) => {
    function* test() {
      const result = yield [
        Promise.resolve(10),
        [Promise.resolve(value)],
      ]
      expect(result).toContainEqual([value])
      done()
    }
    handler(test)
  })

  it("should support generators", (done) => {
    function* test() {
      const result = yield [function* gen() { return value }]
      expect(result).toContain(value)
      done()
    }
    handler(test)
  })
})
