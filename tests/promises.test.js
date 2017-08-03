
import { handler } from "../src/index"

describe("GPRoutine Promises Handling", () => {
  const error = Error("fail")

  it("should handle a basic promise", (done) => {
    function* test() {
      const promise = yield Promise.resolve(true)
      expect(promise).toEqual(true)
      done()
    }
    handler(test)
  })

  it("should handle rejections", (done) => {
    function* test() {
      let result
      try {
        yield Promise.reject(error)
      } catch (err) {
        result = err
      }
      expect(result).toEqual(error)
      done()
    }
    handler(test)
  })
})
