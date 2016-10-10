const fs = require('fs');

let packageJson = JSON.parse(fs.readFileSync('../package.json', 'utf8'));

packageJson.dependencies = {};
packageJson.devDependencies = {};

fs.writeFileSync('../package.json', JSON.stringify(packageJson, null, '  ') + '\n', 'utf8');