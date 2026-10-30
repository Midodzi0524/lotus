import fs from 'fs';
import path from 'path';
// Workers rejects the Pages-style "/* /index.html 200" rule, so make sure no _redirects ships.
const walk = d => fs.readdirSync(d, { withFileTypes: true }).flatMap(e => e.isDirectory() ? walk(path.join(d, e.name)) : [path.join(d, e.name)]);
for (const f of walk('dist')) if (/(^|[\\/])_redirects$/.test(f)) { fs.rmSync(f); console.log('[clean-dist] removed', f); }
console.log('[clean-dist] dist files:\n' + walk('dist').join('\n'));
