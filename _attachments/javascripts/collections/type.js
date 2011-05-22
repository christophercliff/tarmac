
tarmac.collections.Type = Backbone.Collection.extend({
    
    model: tarmac.models.Type,
    
    url: '/tarmac/_design/tarmac/_view/types?group=true'
    
});
