
tarmac.controllers.Map = Backbone.Controller.extend({
    
    routes: {
        '': 'index'
    },
    
    index: function () {
        
        var self = this,
            locations = new tarmac.collections.Location();
        
        locations.fetch();
        
        new tarmac.views.MapIndex({
            locations: locations
        });
        
        new tarmac.views.LocationIndex({
            locations: locations
        });
        
        return;
    }
    
});
