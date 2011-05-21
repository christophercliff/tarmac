
## Immediate goals

- Automatically fit map bounds to current dataset
- Usable CRUD UI for point data, incl. geometry and custom properties
- Group and filter datasets by type
- Push button import, export and install (CouchDB!)
- Support all modern browsers

## Long term goals

- Support complex geometry (e.g. lines and polygons)
- Integration with third party APIs for data cleanup (e.g. SimpleGeo places)
- Performance optimizations
- Build optimizations
- Support some mobile browsers
- Improved UI design and identity
- Project homepage with documentation and examples

## Example application

http://christophercliff.iriscouch.com/tarmac/_design/tarmac/index.html

## Quick start for users

### Pull a local instance from a remote server

First create a local target:

    curl -X PUT http://127.0.0.1:5984/tarmac

Then pull the database from the remote server:

    curl -v -H "Content-Type: application/json" -X POST http://127.0.0.1:5984/_replicate -d '{"source":"http://christophercliff.iriscouch.com/tarmac","target":"tarmac"}'

View the app at http://127.0.0.1:5984/tarmac/_design/tarmac/index.html.

### Push a local instance to a remote server

First create a remote target:

    curl -X PUT http://{YOUR_USERNAME}.iriscouch.com/tarmac

Then push your database to the remote server:

    curl -v -H "Content-Type: application/json" -X POST http://127.0.0.1:5984/_replicate -d '{"source":"tarmac","target":"http://{YOUR_USERNAME}.iriscouch.com/tarmac"}'
    
View the app at [http://{YOUR_USERNAME}.iriscouch.com/tarmac/_design/tarmac/index.html](http://{YOUR_USERNAME}.iriscouch.com/tarmac/_design/tarmac/index.html).

## Quick start for developers

### Install couchapp