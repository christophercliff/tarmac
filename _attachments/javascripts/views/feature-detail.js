
tarmac.views.FeatureDetail = Backbone.View.extend({
    
    template: _.template($('#_FeatureDetail').html()),
    
    events: {
        'click .feature-action-places': 'places',
        'click .feature-action-context': 'context',
        'click .remove-feature': 'remove'
    },
    
    initialize: function () {
        
        var self = this;
        
        _.bindAll(self, 'remove');
        
        self.render();
        
        return self;
    },
    
    render: function () {
        
        var self = this,
            json = self.model.toJSON(),
            id = self.model.get('id'),
            C_HOVER = 'feature-hover';
            
        self.el = $(self.template(json));
        
        self.el
            .bind('hover.on.feature.' + id, function(){
                
                self.el
                    .addClass(C_HOVER)
                    ;
                
            })
            .bind('hover.off.feature.' + id, function(){
                
                self.el
                    .removeClass(C_HOVER)
                    ;
                
            })
            .hover(function(){
                
                $('*')
                    .trigger('hover.on.feature.' + id)
                    ;
                
            },function(){
                
                $('*')
                    .trigger('hover.off.feature.' + id)
                    ;
                
            })
            ;
        
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
        $m = self.$('.feature-modifier');
        
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
        $m = self.$('.feature-modifier');
        
        tarmac.simpleGeo.context.getContext(coords.lat, coords.lon, function(err, data){
            
            $m
                .html('<li>' + data.address.properties.address + '</li>')
                ;
            
        });
        
        return;
    }
    
});
