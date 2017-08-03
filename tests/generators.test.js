
import { handler } from "../src/index"

/* eslint-disable require-yield */
describe("GPRoutine Generators Handling", () => {
  const value = 100
  const error = Error("fail")
  function* good() { return value }
  function* bad() { throw error }

  describe("Generator Functions", () => {
    it("should handle it", (done) => {
      function* test() {
        const result = yield good
        expect(result).toEqual(value)
        done()
      }
      handler(test)
    })

    it("should handle throws", (done) => {
      function* test() {
        let result
        try {
          yield bad
        } catch (err) {
          result = err
        }
        expect(result).toEqual(error)
        done()
      }
      handler(test)
    })
  })

  describe("Generators", () => {
    it("should handle it", (done) => {
      function* test() {
        const result = yield good()
        expect(result).toEqual(value)
        done()
      }
      handler(test)
    })

    it("should handle throws", (done) => {
      function* test() {
        let result
        try {
          yield bad()
        } catch (err) {
          result = err
        }
        expect(result).toEqual(error)
        done()
      }
      handler(test)
    })
  })
})
