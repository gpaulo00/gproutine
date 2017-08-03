
# GPRoutine
A small flow-control library based on ***ES2015 Generators***.

This project is strongly inspired by the [co](https://github.com/tj/co)
library and the [redux-saga](https://github.com/redux-saga/redux-saga) effects.

## Installation
**GPRoutine** is very small yet (less than 0.6KB gzipped), it also hasn't any dependency.
You can install it with:
```sh
yarn add gproutine

# or with npm
npm i -S gproutine
```

## Features
It has most of [co](https://github.com/tj/co)/[bluebird](https://github.com/petkaantonov/bluebird) features, like:
- [x] Await for array of promises
- [x] Yielding another generators
- [ ] Resolve object properties
- [x] Add yield handlers (like Bluebird.coroutine)

It also adds some own features, like:
- [x] Smaller (0.5KB vs 0.9KB of **co**, minified and gzipped)
- [x] Custom actions and effects
- [ ] Use ES2015 Generators as actions

**NOTE**: GPRoutine will not have support for thunk actions (I think)

### Non-blocking Code
This library allows to write **non-blocking code** in a
more readable synchronous-like way (like [co](https://github.com/tj/co)).

These functions are equivalents:
```js
// using promises
function asyncFunc() {
  Promise.resolve(true)
    .then((result) => {
      console.log(result) // shows "true"
    })
}
asyncFunc() // call the function

// using ES7 async/await
async function asyncFunc() {
  const result = await Promise.resolve(true)
  console.log(result)
}
asyncFunc() // call the async function

// using gproutine or co
import { handler } from "gproutine"
import co from "co"

function* asyncFunc() {
  const result = yield Promise.resolve(true)
  console.log(result) // shows "true"
}

handler(asyncFunc) // call the function with gproutine
co(asyncFunc) // it can also be called with co
```

The most readable function is the ES7 syntax, but it's
a [proposal](https://github.com/lukehoban/ecmascript-asyncawait) right now

### Yield Handlers
You can add more handlers for your ***yields*** (like **Bluebird** does).

For example, if you want to yield a number to known if it's a ***even number***,
you can write a new **Yield Handler**.
```js
import { handler, yieldHandlers } from "gproutine"

yieldHandlers.add((input) => {
  // must return a promise
  if (typeof input === "number") return Promise.resolve(input % 2 === 0)
})

function* asyncFunc() {
  console.log(yield 2) // show "true"
  console.log(yield 5) // show "false"
}

handler(asyncFunc)
```

### Actions and Effects
It's not just another coroutines library, as I already said, this is inspired
by the ***redux-saga pattern***, that also uses generators. This feature lets
you write easily testable code.

Example:
```js
/* asyncFunc.js */
import { handler, actions, effect } from "gproutine"

// add the "say" action to the actions Map
actions.set("say", (str) => console.log(str))

export function* asyncFunc() {
  // call the "say" action (see above)
  // this will await if a Promise is returned
  yield effect("say", "hello world")
}

handler(asyncFunc) // run the code
```

As an effect is just a plain object, you can test this code
very easily (using mocha and chai):
```js
/* asyncFunc.spec.js */
import { expect } from "chai"
import { effect } from "gproutine"
import { asyncFunc } from "./asyncFunc"

describe("asyncFunc", () => {
  it("should say hello world", (done) => {
    const iterator = asyncFunc()
    const expected = effect("say", "hello world")
    expect(iterator.next()).to.be.equal(expected)
    done()
  })
})
```

So basically, an **action** is the function that is called. And the **effect**
is a ***request to call*** an action.

## Author
**Gustavo Paulo** - ***[gpaulo00](https://github.com/gpaulo00)***

## License
**MIT**
