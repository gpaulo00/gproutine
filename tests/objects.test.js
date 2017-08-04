
import { handler } from "../src/index"

describe("GPRoutine Object Handling", () => {
  const error = Error("fail")

  it("should handle an object", (done) => {
    const value = "TEST"

    function* test() {
      const result = yield { value: Promise.resolve(value) }
      expect(result.value).toEqual(value)
      done()
    }
    handler(test)
  })

  it("should handle rejections", (done) => {
    function* test() {
      let result
      try {
        yield { fail: Promise.reject(error) }
      } catch (err) {
        result = err
      }
      expect(result).toEqual(error)
      done()
    }
    handler(test)
  })
})
