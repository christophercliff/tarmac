// Application

window.databases = new Databases();
window.existings = new Existings();

window.Tarmac = Backbone.Router.extend({
     
    routes: {
        '': 'default'
    },
    
    initialize: function () {
        
        var self = this;
        
        self.mapView = new MapView({
            databases: window.databases
        });
        self.trayView = new TrayView({
            databases: window.databases
        });
        self.databaserView = new DatabaserView({
            databases: window.databases,
            existings: window.existings
        });
        
        Backbone.history.start();
        
        return;
    },
    
    default: function () {
        
        var self = this;
        
        document.body.appendChild(self.trayView.render().el);
        document.body.appendChild(self.mapView.render().el);
        document.body.appendChild(self.databaserView.render().el);
        
        window.databases.fetch();
        window.existings.fetch();
        
        return;
    }
    
});

// Initialization

$(function(){
    new Tarmac();
});