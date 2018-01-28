// const transform = require("fuse-test-runner").wallabyFuseTestLoader;
const path = require('path');
// const jsxtransform = require('jsx-controls-loader').loader;

module.exports = function(wallaby) {
  // var load = require;

  return {
    files: [
      'tsconfig.json',
      'src/**/*.ts*',
      'src/**/*.snap',
      '!**/luis.ts',
      '!src/**/*.test.tsx',
      '!src/**/*.test.ts',
      '!src/**/*.d.ts*'
    ],
    tests: [
      'src/**/*.test.ts*'
    ],
    filesWithNoCoverageCalculated: [
      'src/**/mocha_*.ts',
      'src/**/wallaby_*.ts',
      'src/**/test_*.ts',
    ],
    compilers: {
      '**/*.ts?(x)': wallaby.compilers.typeScript({ jsx: 'react', module: 'commonjs' })
    },
    // preprocessors: {
    //   '**/*.tsx': file => jsxtransform(file.content)
    // },
    hints: {
      ignoreCoverage: /ignore coverage/ // or /istanbul ignore next/, or any RegExp
    },
    env: {
      type: 'node'
    },
    testFramework: 'jest',
    setup: function(wallaby) {
      console.log("Configuring ...");

      

      // const path = require('path');
      // const snapshotDir = path.join(wallaby.localProjectDir, 'src', 'tests', 'snapshots');

      // require('wafl').setup({
      //   wallaby,
      //   snapshotDir,
      //   snapshotMode: 'tcp'
      // });

      // // setup server tests
      // require('./src/tests/client_start');

      // require('typestyle').reinit();
      
      // // if (process.env.MOCHA_SELECT) {
      // //   if (process.env.MOCHA_INVERT) {
      // //     wallaby.testFramework.grep(process.env.MOCHA_SELECT).invert();
      // //   } else {
      // //     wallaby.testFramework.grep(process.env.MOCHA_SELECT).invert();
      // //   }
      // // }

      // // wallaby.testFramework.grep('@server').invert();
      // wallaby.testFramework.grep('@story|@viewModel');
    }
  };
};