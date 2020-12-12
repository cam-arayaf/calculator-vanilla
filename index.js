process.env.PORT = process.env.PORT || 8080;
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

const { PORT, NODE_ENV } = process.env;

const http = require('http');
const fs = require('fs');
const path = require('path');

http.createServer(({ url }, response) => {
    NODE_ENV === 'development' && console.log(`URL: ${ url }`);

    const mimeTypes = {
        '.html': 'text/html',
        '.js': 'text/javascript',
        '.css': 'text/css',
        '.json': 'application/json',
        '.png': 'image/png',
        '.jpg': 'image/jpg',
        '.gif': 'image/gif',
        '.svg': 'image/svg+xml',
        '.wav': 'audio/wav',
        '.mp4': 'video/mp4',
        '.woff': 'application/font-woff',
        '.ttf': 'application/font-ttf',
        '.eot': 'application/vnd.ms-fontobject',
        '.otf': 'application/font-otf',
        '.wasm': 'application/wasm'
    };

    const filePath = `.${ url === '/' ? '/index.html' : url }`;
    const extName = path.extname(filePath);
    const contentType = { 'Content-Type': mimeTypes[extName] || 'application/octet-stream' };
    
    fs.readFile(filePath, (error, content) => {
        response.writeHead(error ? (error.code === 'ENOENT' && 404) || 500 : 200, content && contentType);
        response.end(content || `Sorry. Check with the site admin for error: ${ error.code }`, content && 'utf-8');
    });
}).listen(PORT);

NODE_ENV === 'development' && console.log(`Server running at: http://127.0.0.1:${ PORT }/`);