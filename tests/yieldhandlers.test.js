
import { handler, yieldHandlers } from "../src/index"

describe("GPRoutine Yield Handlers", () => {
  const value = "TEST"
  const result = "RESOLVED"
  const error = Error("fail")

  function testHelper(input) {
    expect(input).toEqual(value)
    return Promise.resolve(result)
  }
  function thrower() { throw error }

  it("should add and run yield handlers", (done) => {
    yieldHandlers.add(testHelper)
    function* test() {
      expect(yield value).toEqual(result)
    }

    handler(test).then(() => {
      yieldHandlers.delete(testHelper)
      done()
    })
  })

  it("should ignore throws in yield handler", (done) => {
    yieldHandlers.add(thrower)
    function* test() {
      let temporal
      try {
        yield value
      } catch (err) {
        temporal = err
      }
      expect(temporal).toEqual(error)
    }

    handler(test).then(() => {
      yieldHandlers.delete(thrower)
      done()
    })
  })
})
