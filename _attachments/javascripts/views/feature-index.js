
tarmac.views.FeatureIndex = Backbone.View.extend({
    
    el: $('.FeatureIndex'),
    
    events: {
        
    },
    
    initialize: function () {
        
        var self = this;
        
        self.features = self.options.features;
        
        _.bindAll(self, 'render', 'add', 'updateHeight');
        
        self.features.bind('add', self.add);
        self.features.bind('remove', self.render);
        self.features.bind('refresh', self.render);
        
        self.render();
        self.events();
        
        return self;
    },
    
    render: function () {
        
        var self = this;
        
        self.updateHeight();
        
        self.$('.feature-set')
            .empty()
            ;
        
        self.features.each(self.add);
        
        return;
    },
    
    add: function (model) {
        
        var self = this;
        
        self.$('.feature-set')
            .append(new tarmac.views.FeatureDetail({
                model: model
            }).el)
            ;
        
        return;
    },
    
    events: function () {
        
        var self = this,
            throttled = _.throttle(self.updateHeight, 100);
        
        $(window)
            .resize(throttled)
            ;
        
        return;
    },
    
    updateHeight: function () {
        
        var self = this,
            h_win = $(window).height(),
            h_types = $('.TypeIndex').outerHeight();
        
        self.el
            .css({
                height: h_win - h_types + 'px'
            })
            ;
        
        return;
    }
    
});
