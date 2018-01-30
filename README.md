# Introduction

An example application showcasing LUIS in combination with Jest.
Tests are executed using your jest config and automatically picked up and displayed by Luis. This is **the optimal** setup for CI as well.

# How to use Luis catalogue in your app

1. Install dependencies with:

   ```js
   yarn add react react-dom // if you do not have react app add it to dev
   yarn add fuse-box luis --dev

   // we will also use enzyme (you do not have to)
   yarn add enzyme enzyme-adapter-react-16 --dev

   // optional dependencies for typescript
   yarn add ts-jest @types/react @types/jest --dev
   ```
2. Define your jest config
3. Define your entry file where you import all tests
4. Add `fuse.js` to run Luis with fuse-box

# Example Configuration

## Entry File

Here you need to setup Luis to use Jest and link all your tests. To define a new story component, use `storyOf`. Check out the documentation of [Luis](https://github.com/tomitrescak/luis) for full description of API.

```js
// src/index.ts
import * as React from 'react';

import { renderLuis, setupJestBridge } from 'luis';

// setup jest and import the test summary and all snapshots
// pleease run jest at least once (best in watch mode) before running Luis
const summary = require('./summary.json');
const snapshots = require('./snapshots');
setupJestBridge(summary, snapshots);

// import all your test that you want to view in Luis
import './tests/component.test';

renderLuis();
```

## Jest config

We need to add a new script and execute it with each jest run. This can be done in the jest config, where we also set up following functionality:

1. register the missing 'storyOf' function for jest.
2. setup a specific test result processor which will save json processed by luis 
3. then let jest know that it should ignore these files. 

In your jest.config:

```js
module.exports = {
  ...
  "setupTestFrameworkScriptFile": "<rootDir>/jest.run.js",
  "testResultsProcessor": "./node_modules/luis/dist/bridges/jest/reporter",
  "watchPathIgnorePatterns": ['<rootDir>/src/summary.json', '<rootDir>/src/snapshots.js'],
}
```

And create a following `jest.run.js` file in your project root dir:

```js
// register story function
global.storyOf = function(name, props, impl) {
  describe(name, () => impl && impl(props));
}

// register enzyme if you plan to use it
const Enzyme = require('enzyme');
const Adapter = require('enzyme-adapter-react-16');
Enzyme.configure({ adapter: new Adapter() });
```

## Setup Fuse-box

Following is a config file for Fuse-Box.
First, it may seem a bit overwhelming but it is pretty straightforward and well documented. 

```js
const { FuseBox,  CSSPlugin, CSSResourcePlugin,  WebIndexPlugin } = require('fuse-box');

// init fusebox and plugins

const luisFuse = FuseBox.init({
  homeDir: 'src',
  emitHMRDependencies: true,
  output: 'public/$name.js',
  plugins: [
    [
      CSSResourcePlugin(),
      CSSPlugin({
        group: 'luis.css',
        outFile: `public/luis.css`,
        inject: false
      })
    ],
    WebIndexPlugin({ template: 'src/index.html', target: 'index.html' })
  ]
});

// init dev server

const historyAPIFallback = require('connect-history-api-fallback');
luisFuse.dev({ port: 3000 }, server => {
  const app = server.httpServer.app;
  app.use(historyAPIFallback());
});

// split bundle between vendor and client

luisFuse
  .bundle('luis-vendor')
  .target('browser')
  .instructions(' ~ src/index.tsx'); 

luisFuse
  .bundle('luis-client')
  .watch() 
  .hmr()
  .target('browser@es6')
  .sourceMaps(true)
  .instructions(' !> [src/index.tsx]'); 

luisFuse.run();
```

# Snapshots and Server Mode

If you want to be able to update snapshot from Luis UI, you need to run Luis in server mode. To do so, you need to configure Luis server file and change the `fuse.js` to support the server execution.

Following is the example of server file:
        
```ts
import { start } from 'luis/dist/server';
start({ luisPath: 'public' });       
```

And following is added to `fuse.js`:

```js
// change the dev server to execute only as websocket server
luisFuse.dev({
  port: 4445,
  httpServer: false
});

// configure your server instance
const serverFuse = FuseBox.init({
  homeDir: 'src',
  output: 'public/$name.js'
});

serverFuse
  .bundle('luis-server')
  .instructions(' > [server.ts]')
  .completed(proc => proc.start());

// and add following line to your fuseBundle to start server once bundling is completed
let running = false;

luisFuse
...
.completed(proc => { 
  if (!running) { 
    running = true;
    serverFuse.run(); 
  } 
});
```   

# Mocking

Luis uses the `proxyrequire` package to support basic mocking with jest. At this moment only manual, module mocks are supported (e.g. jest.mock('path', mock)).

To enable mocking install the proxyrequire plugin:


```ts
yarn add proxyrequire
```

And modify the fuse config to use it as a plugin and a package:

```js
const StubPlugin = require('proxyrequire').FuseBoxStubPlugin(/\.tsx?/); // or jsx?

luisFuse
  .bundle('luis-client')
  .plugin([StubPlugin]) // add the plugin
  .instructions(' !> [index.tsx] +proxyrequire') // force inclusion of proxyrequire
  .globals({
    proxyrequire: '*' // make available in global space. This is needed as all 'require' statements are replaced by 'proxyrequire'
  })
  ...
```