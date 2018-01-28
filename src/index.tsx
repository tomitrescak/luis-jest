// src/index.ts
import * as React from 'react';

import { renderLuis, setupJestBridge } from 'luis';

const summary = require('./summary.json');
const snapshots = require('./snapshots');

// setup browser bridge, which will allow to execute simple tests and stories in browser
setupJestBridge(summary, snapshots);

import './tests/component.test';

// you can either write your tests here or import them from other test files
// e.g. import 'path/to/my/test'

renderLuis();