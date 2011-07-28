
tarmac.views.FeatureIndex = Backbone.View.extend({
    
    template: _.template($('#FeatureIndex').html()),
    
    events: {
        
    },
    
    initialize: function () {
        
        var self = this;
        
        self.features = self.options.features;
        
        self.render();
        
        return self;
    },
    
    render: function () {
        
        var self = this,
            opts = self.options;
        
        self.el = $(self.template(self.features));
        
        self.el
            .appendTo(opts.$db)
            ;
        
        return;
    }
    
});
