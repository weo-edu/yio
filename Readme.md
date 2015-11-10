
# yio

[![Codeship Status for weo-edu/pit](https://img.shields.io/codeship/49802aa0-3d77-0133-36b2-1ad104cd18d3/master.svg)](https://codeship.com/projects/102515) [![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=flat)](https://github.com/feross/standard)

Yield IO.

Yield makes it easy to write async code in a nice testable way. Yield takes two functions: `io` and `control`. `io` is responsible for performing io. It takes a single value and returns a promise. `control` is responsible for control flow. All values yielded by `control` are passed to `io` and the resolved promise is yielded. A great way to use `yio` is for `control` to yield action creators (ala redux) and for `io` to proces the action creators.

yio is similar to [co](https://github.com/tj/co), except that it promots pushing io to the edges. The advantage of this is that all the complex logic can be done in `control` and `control` can be easily tested without performing io. No need for mocks or DI.


## Installation

    $ npm install yio


## Example

### Basic

```js
import yio from 'yio'

function log (val) {
  console.log('val', val)
}

//output:
//1
//2
//3
yio(log, function * () {
  yield 1
  yield 2
  yield 3
})

```

### Async

```js
import yio from 'yio'
import fetch from 'whatwg-fetch'

function dispatchFetch (options) {
  return fetch(options).then((res) => res.json())
}

//output:
//josh
//tio
//elliot
yio(dispatchFetch, function * () {
  let userIds = yield {url: '/users', method: 'GET'}
  for (let userId in userIds) {
    let user = yield {url: '/user/' + userId, method: 'GET'}
    console.log(user.name)
  }
})

```

### Yields

Use yio with [yields](https://github.com/weo-edu/yields).

```js
import yio from 'yio'
import yields from 'yields'

function log (val) {
  console.log('val', val)
}

//output:
//1
//2
//3
pit(
  log,
  yields(function () {
    return 1
  })
  .yields(function () {
    return 2
  })
  .yields(function () {
    return 3
  })
)
```

### Parallel Async

```js
import yio from 'yio'
import fetch from 'whatwg-fetch'

function dispatchFetch (options) {
  return fetch(options).then(function(res) {
    return res.json()
  })
}

//output:
//josh
//tio
//elliot
yio(dispatchFetch, function * () {
  let userIds = yield {url: '/users', method: 'GET'}
  let users = yield userIds.map(userId => ({url: '/user/' + userId, method: 'GET'}))
  users.forEach(() => {
    console.log(user.name)
  })
})

```

## License

The MIT License

Copyright &copy; 2015, Weo.io &lt;info@weo.io&gt;

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
