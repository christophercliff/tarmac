function(head, req) {
    var row, out, sep = '\n';

    // Send the same Content-Type as CouchDB would
    if (req.headers.Accept.indexOf('application/json')!=-1)
      start({"headers":{"Content-Type" : "application/json"}});
    else
      start({"headers":{"Content-Type" : "text/plain"}});

    if ('callback' in req.query) send(req.query['callback'] + "(");

    send('{"datasets": [');
    while (row = getRow()) {
        out = JSON.stringify(row.value);
        send(sep + out);
        sep = ',\n';
    }
    send("]}");
    if ('callback' in req.query) send(")");
    
};
