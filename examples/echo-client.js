// Sample TCP echo client.
//

import { addr, logError } from './utils.js';

(async () => {
    const t = new uv.TCP();
    
    await t.connect({ip: global.scriptArgs[2] || '127.0.0.1', port: global.scriptArgs[3] || 1234});
    
    console.log(`Connected to ${addr(t.getpeername())}`);
    var stdin = new uv.TTY(uv.STDIN_FILENO, true);

    const buf = new ArrayBuffer(4096);
    let nread;
    while (true) {
        nread = await stdin.read(buf);
        //console.log(String.fromCharCode.apply(null, new Uint8Array(buf, 0, nread)));
        if (!nread) {
            console.log('connection closed!');
            break;
        }
        t.write(buf.slice(0, nread));
        nread = await t.read(buf);
        console.log(String.fromCharCode.apply(null, new Uint8Array(buf, 0, nread)));
    }

})().catch(logError);
