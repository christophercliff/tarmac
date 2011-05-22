
tarmac.views.TypeIndex = Backbone.View.extend({
    
    el: $('.TypeIndex'),
    
    events: {
        'click .type-a': 'toggle'
    },
    
    initialize: function () {
        
        var self = this;
        
        self.types = self.options.types;
        
        _.bindAll(self, 'render', 'add');
        
        self.render();
        
        return self;
    },
    
    render: function () {
        
        var self = this;
        
        self.$('.type-set')
            .empty()
            ;
        
        self.types.each(self.add);
        
        return;
    },
    
    add: function (model) {
        
        var self = this;
        
        self.$('.type-set')
            .append('<li class="type"><a class="type-a" href="#' + encodeURIComponent(model.get('name')) + '" title="' + model.get('name') + '">' + model.get('name') + '</a></li>')
            ;
        
        return;
    },
    
    toggle: function (e, b) {
        e.preventDefault();
        
        var $type = $(e.currentTarget).closest('.type'),
            C_SELECTED = 'type-selected';
        
        if ($type.hasClass(C_SELECTED))
        {
            $type
                .removeClass(C_SELECTED)
                ;
            
            return;
        }
        
        $type
            .addClass(C_SELECTED)
            ;
        
        return;
    }
    
});
