const fs = require('fs');
let code = fs.readFileSync('web-app/server/index.test.js', 'utf8');

const search = `}, 10);`;
const replace = `mockData.emit('end');
      }, 10);`;

code = code.replace(search, replace);

fs.writeFileSync('web-app/server/index.test.js', code);
