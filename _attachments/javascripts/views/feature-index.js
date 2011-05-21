
tarmac.views.FeatureIndex = Backbone.View.extend({
    
    el: $('.FeatureIndex'),
    
    events: {
        
    },
    
    initialize: function () {
        
        var self = this;
        
        self.features = self.options.features;
        
        _.bindAll(self, 'render', 'add');
        
        self.features.bind('add', self.add);
        self.features.bind('remove', self.render);
        self.features.bind('refresh', self.render);
        
        self.render();
        
        return self;
    },
    
    render: function () {
        
        var self = this;
        
        self.$('.feature-set')
            .empty()
            ;
        
        self.features.each(self.add);
        
        return;
    },
    
    add: function (l) {
        
        var self = this;
        
        self.$('.feature-set')
            .append(new tarmac.views.FeatureDetail({
                model: l
            }).el)
            ;
        
        return;
    }
    
});
