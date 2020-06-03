/* global importScripts, Strophe */

importScripts('node_modules/strophe.js/dist/strophe.umd.js');

let connection, port;

function setUpXMLLogging () {
    const lmap = {}
    lmap[Strophe.LogLevel.DEBUG] = 'debug';
    lmap[Strophe.LogLevel.INFO] = 'info';
    lmap[Strophe.LogLevel.WARN] = 'warn';
    lmap[Strophe.LogLevel.ERROR] = 'error';
    lmap[Strophe.LogLevel.FATAL] = 'fatal';

    Strophe.log = (level, msg) => {
        console.log(msg);
        port.postMessage(`Strophe.log: ${msg}, ${lmap[level]}`);
    }
    Strophe.error = (level, msg) => {
        console.log(msg);
        port.postMessage(`Strophe.error: ${msg}, ${lmap[level]}`);
    }

    connection.xmlInput = body => {
        console.log(body.toString());
        port.postMessage(`xmlInput: ${body.toString()}`);
    }
    connection.xmlOutput = body => {
        console.log(body.toString());
        port.postMessage(`xmlOutput: ${body.toString()}`);
    }
}

function onConnectStatusChanged (status, message) {
    port.postMessage(status, message);
}

const api = {
    'initConnection': (data) => {
        const url = data[0];
        const connection_options = data[1];
        connection = new Strophe.Connection(url, connection_options);
        setUpXMLLogging();
    },

    'connect': (data) => {
        const options = data[0];
        connection.connect(
            options.jid,
            options.password,
            onConnectStatusChanged,
            options.wait
        );
    },

    'reset': () => connection.reset()
};


onconnect = function(e) {  // eslint-disable-line no-undef
    port = e.ports[0];

    port.addEventListener('message', e => {
        const method = e.data[0];
        api[method](e.data.splice(1))
    });
    port.start();
}
