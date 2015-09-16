
# pit

[![Codeship Status for weo-edu/pit](https://img.shields.io/codeship/49802aa0-3d77-0133-36b2-1ad104cd18d3/master.svg)](https://codeship.com/projects/102515) [![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=flat)](https://github.com/feross/standard)

Get pitted. Iterate into the pit.

[![Get pitted](http://img.youtube.com/vi/Y5ckCAUVOn0/0.jpg)](http://www.youtube.com/watch?v=Y5ckCAUVOn0)

## Installation

    $ npm install @weo-edu/pit


## Example

### Basic

```js
var pit = require('@woe-edu/pit')

function log (val) {
  console.log('val', val)
}

//output:
//1
//2
//3
pit(log, function *() {
  yield 1
  yield 2
  yield 3
})

```

### Async

```js
var pit = require('@woe-edu/pit')
var fetch = require('whatwg-fetch')

function dispatchFetch (options) {
  return fetch(options).then(function(res) {
    return res.json()
  })
}

//output:
//josh
//tio
//elliot
pit(dispatchFetch, function *() {
  var userIds = yield {url: '/users', method: 'GET'}
  for (var userId in userIds) {
    var user = yield {url: '/user/' + userId, method: 'GET'}
    console.log(user.name)
  }
})

```

### Yields

Use pit with [yields](https://github.com/weo-edu/yields).

```js
var pit = require('@woe-edu/pit')
var yields = require('@weo-edu/yields')

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
var pit = require('@woe-edu/pit')
var fetch = require('whatwg-fetch')

function dispatchFetch (options) {
  return fetch(options).then(function(res) {
    return res.json()
  })
}

//output:
//josh
//tio
//elliot
pit(dispatchFetch, function *() {
  var userIds = yield {url: '/users', method: 'GET'}
  var users = yield userIds.map(function (id) {
    return {url: '/user/' + userId, method: 'GET'}
  })
  users.forEach(function () {
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
