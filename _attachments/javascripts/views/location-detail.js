
tarmac.views.LocationDetail = Backbone.View.extend({
    
    template: _.template($('#_LocationDetail').html()),
    
    events: {
        'click .location-action-places': 'places',
        'click .location-action-context': 'context',
        'click .remove-location': 'remove'
    },
    
    initialize: function () {
        
        var self = this;
        
        _.bindAll(self, 'remove');
        
        self.render();
        
        return self;
    },
    
    render: function () {
        
        var self = this,
            json = self.model.toJSON();
        
        $(self.el).html(self.template(self.model.toJSON()));
        
        return;
    },
    
    remove: function (e) {
        e.preventDefault();
        
        var self = this;
        
        if (!self.model)
        {
            return;
        }
        
        self.model.destroy();
        
        return;
    },
    
    places: function (e) {
        e.preventDefault();
        
        var self = this,
            coords,
            $m;
        
        if (!self.model)
        {
            return;
        }
        
        coords = self.model.get('coords');
        $m = self.$('.location-modifier');
        
        tarmac.simpleGeo.places.search(coords.lat, coords.lon, {}, function(err, data){
            
            
            
        });
        
        return;
    },
    
    context: function (e) {
        e.preventDefault();
        
        var self = this,
            coords,
            $m;
        
        if (!self.model)
        {
            return;
        }
        
        coords = self.model.get('coords');
        $m = self.$('.location-modifier');
        
        tarmac.simpleGeo.context.getContext(coords.lat, coords.lon, function(err, data){
            
            $m
                .html('<li>' + data.address.properties.address + '</li>')
                ;
            
        });
        
        return;
    }
    
});
