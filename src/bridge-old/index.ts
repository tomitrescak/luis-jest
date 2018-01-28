import { Bridge, setupBridge } from 'luis';
import { createBridge, Snapshots } from './bridge';

export const bridge: Bridge = {
  onReconciled(state) { },
  updateSnapshots(state, story) {
    throw new Error('Not implemented')
  },
  hmr(path, content, dependants) { }
}

export function setupJestBridge(testData: jest.AggregatedResult, snapshots: Snapshots) {
  setupBridge((state) => {
    
    // create new brifdge
    createBridge(state, testData, snapshots);

    // return the new bridge
    return bridge;
  });
}