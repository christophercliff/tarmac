
tarmac.controllers.Map = Backbone.Controller.extend({
    
    routes: {
        '': 'index'
    },
    
    index: function () {
        
        var self = this,
            features = new tarmac.collections.Feature();
        
        features.fetch();
        
        new tarmac.views.MapIndex({
            features: features
        });
        
        new tarmac.views.TypeIndex({
            features: features
        });
        
        new tarmac.views.FeatureIndex({
            features: features
        });
        
        return;
    }
    
});
