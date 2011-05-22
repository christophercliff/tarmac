
tarmac.controllers.Feature = Backbone.Controller.extend({
    
    routes: {
        '': 'index'
    },
    
    index: function () {
        
        var self = this,
            features = new tarmac.collections.Feature(),
            types = new tarmac.collections.Type();
        
        //features.fetch();
        
        $.ajax({
            url: '/tarmac/_design/tarmac/_view/types',
            dataType: 'json',
            data: {
                group: true
            },
            success: function(response){
                
                for (var i = 0, l = response.rows.length; i < l; i++)
                {
                    types.add({
                        name: response.rows[i].key
                    });
                }
                
                new tarmac.views.TypeIndex({
                    types: types
                });
            },
        });
        
        new tarmac.views.MapIndex({
            features: features
        });
        
        new tarmac.views.FeatureIndex({
            features: features
        });
        
        return;
    }
    
});
