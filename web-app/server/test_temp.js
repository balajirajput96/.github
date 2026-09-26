const { execSync } = require('child_process');
const output = execSync('npm run test:jest', {cwd: 'web-app/server', stdio: 'pipe'}).toString();
console.log(output);
