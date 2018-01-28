import { start } from 'luis/dist/server';
import { setTimeout } from 'timers';

start({
  luisPath: 'public',
  serverConfig: [
    app => {
      
      // var spawn = require('child_process').spawn;
      // var p = spawn('node', ['./node_modules/.bin/jest', '--watch' ], { stdio: 'inherit' });
      // p.stdout.on('data', function(data: any) {
      //   console.log(data.toString());
      // });

      // p.stdin.write('t\n');
      // p.stdin.write(`${snapshotName}\n`);
      // p.stdin.write('u\n');
      // p.stdin.write('a\n');
      

      // configure API
      app.use('/tests', (request: any, response: any) => {
        const snapshotName = request.query.name;

        console.log(`Updating snapshots of "${snapshotName}"`);

        const command = `CI=true ./node_modules/.bin/jest --updateSnapshot --testNamePattern "${snapshotName}"`;
        console.log('Exec: ' + command);

        const execSync = require('child_process').execSync;
        try {
          execSync(command);
        } catch (ex) {
          console.log(ex);
        }

        

        response.end('ok');
      });
    }
  ]
});
