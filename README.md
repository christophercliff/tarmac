
Work in progress...

## Quick start

### Create a local target

    curl -X PUT http://127.0.0.1:5984/tarmac2

### Pull a local instance from a remote server

    curl -v -H "Content-Type: application/json" -X POST http://127.0.0.1:5984/_replicate -d '{"source":"http://christophercliff.iriscouch.com/tarmac","target":"tarmac"}'

### Push a local instance to a remote server

    curl -v -H "Content-Type: application/json" -X POST http://127.0.0.1:5984/_replicate -d '{"source":"tarmac","target":"http://{YOUR_USERNAME}.iriscouch.com/tarmac"}'