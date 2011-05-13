
tarmac.controllers.Location = Backbone.Controller.extend({
    
    routes: {
        '': 'index'
    },
    
    index: function () {
        
        var self = this;
        
        new tarmac.views.LocationIndex();
        
        return;
    }
    
});
