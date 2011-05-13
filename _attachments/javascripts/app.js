(function(){
    
    Backbone.couchConnector.databaseName = 'tarmac_dev';
    Backbone.couchConnector.ddocName = 'tarmac';
    Backbone.couchConnector.viewName = 'byCollection';
    Backbone.couchConnector.enableChanges = false;
    
    window.ski = {};
    tarmac.controllers = {};
    tarmac.models = {};
    tarmac.collections = {};
    tarmac.views = {};
    tarmac.simpleGeo = {};
    tarmac.simpleGeo.token = 'JKLAJ78up23sBaM8w5V8rMHn6rq4AqUn';
    tarmac.instagram = {};
    tarmac.instagram.token = '538ac8d66254428eb4c014653cacf9b4';
    
    tarmac.initialize = function () {
        
        tarmac.simpleGeo.places = new simplegeo.PlacesClient(tarmac.simpleGeo.token);
        tarmac.simpleGeo.context = new simplegeo.ContextClient(tarmac.simpleGeo.token);;
        
        //new tarmac.controllers.Location();
        new tarmac.controllers.Map();
        
        Backbone.history.start();
        
        return;
    };
    
})();