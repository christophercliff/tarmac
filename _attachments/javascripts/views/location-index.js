
tarmac.views.LocationIndex = Backbone.View.extend({
    
    el: $('.LocationIndex'),
    
    events: {
        
    },
    
    initialize: function () {
        
        var self = this;
        
        self.locations = self.options.locations;
        
        _.bindAll(self, 'render', 'add');
        
        self.locations.bind('add', self.add);
        self.locations.bind('remove', self.render);
        self.locations.bind('refresh', self.render);
        
        self.render();
        
        $.ajax({
            url: '/_all_dbs/',
            success: function (response) {
                console.log(response);
            }
        });
        
        return self;
    },
    
    render: function () {
        
        var self = this;
        
        self.$('.location-set')
            .empty()
            ;
        
        self.locations.each(self.add);
        
        return;
    },
    
    add: function (l) {
        
        var self = this;
        
        self.$('.location-set')
            .append(new tarmac.views.LocationDetail({
                model: l
            }).el)
            ;
        
        return;
    }
    
});
