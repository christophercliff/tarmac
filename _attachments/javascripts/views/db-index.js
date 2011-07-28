
tarmac.views.DbIndex = Backbone.View.extend({
    
    el: $('.DbIndex'),
    
    events: {
        'click .show-db': 'show'
    },
    
    initialize: function () {
        
        var self = this;
        
        self.features = self.options.features;
        
        _.bindAll(self, 'show');
        
        self.render();
        
        return self;
    },
    
    render: function () {
        
        var self = this;
        
        
        
        return;
    },
    
    show: function (e) {
        e.preventDefault();
        
        var self = this,
            $db = $(e.currentTarget).closest('.db'),
            name = $db.data('name');
        
        $.ajax({
            url: '/' + name + '/_design/geo/_spatiallist/geojson/pointsFull',
            dataType: 'json',
            data: {
                'bbox': '-180,-90,180,90'
            },
            success: function(response){
                new tarmac.views.FeatureIndex({
                    features: response,
                    $db: $db
                });
            },
            error: function () {
                //// TODO: Handle the error.
            }
        });
        
        return;
    }
    
});
