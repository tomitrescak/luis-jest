const { FuseBox,  CSSPlugin, CSSResourcePlugin,  WebIndexPlugin, JSONPlugin } = require('fuse-box');
const { SnapshotPlugin } = require('./node_modules/luis/dist/bridges/jest/snapshot_plugin');
const StubPlugin = require('proxyrequire').FuseBoxStubPlugin(/\.tsx?/);

// setup server

const serverFuse = FuseBox.init({
  homeDir: 'src',
  output: 'public/$name.js'
});

serverFuse
  .bundle('luis-server')
  .instructions(' > [server.ts]')
  .completed(proc => proc.start());

// init fusebox and plugins

const luisFuse = FuseBox.init({
  homeDir: 'src',
  emitHMRDependencies: true,
  output: 'public/$name.js',
  plugins: [
    JSONPlugin(),
    SnapshotPlugin(),
    [
      CSSResourcePlugin(),
      CSSPlugin({
        group: 'luis.css',
        outFile: `public/luis.css`,
        inject: false
      })
    ],
    WebIndexPlugin({ template: 'src/index.html', target: 'luis.html' })
  ],
  // this is needed for enzyme execution in browser
  shim: {
    stream: {
      exports: '{ Writable: function() {}, Readable: function() {}, Transform: function() {} }'
    }
  }
});

// init dev server (CLIENT ONLY)

// const historyAPIFallback = require('connect-history-api-fallback');
// luisFuse.dev({ port: 3000 }, server => {
//   const app = server.httpServer.app;
//   app.use(historyAPIFallback());
// });

// init dev server (WITH SERVER)

luisFuse.dev({
  port: 4445,
  httpServer: false
});

// split bundle between vendor and client

luisFuse
  .bundle('luis-vendor')
  .target('browser')
  .instructions(' ~ index.tsx'); // nothing has changed here

let running = false;
luisFuse
  .bundle('luis-client')
  .watch() // watch only client related code
  .hmr()
  .plugin([StubPlugin])
  .target('browser@es6')
  .sourceMaps(true)
  .instructions(' !> [index.tsx] +proxyrequire')
  .globals({
    proxyrequire: '*'
  })
  .completed(proc => { 
    if (!running) { 
      running = true;
      serverFuse.run(); 
    } 
  });

luisFuse.run();
