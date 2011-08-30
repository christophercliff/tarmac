(function(window, undefined){
    
    window.Server = Backbone.Model.extend({
        
    });
    
    window.Servers = Backbone.Collection.extend({
        
        model: Server,
        
        url: '/tarmac/_design/tarmac/_view/by_type?key="server"'
        
    });
    
    window.Detectable = Backbone.Model.extend({
        
    });
    
    window.Detectables = Backbone.Collection.extend({
        
        model: Detectable,
        
    });
    
    window.Database = Backbone.Model.extend({
        
        initialize: function () {
            
            var self = this;
            
            self.features = new Features();
            self.features.url = '/' + self.get('slug') + '/_design/geo/_spatiallist/geojson/pointsFull?bbox=-180%2C-90%2C180%2C90';
            
            return;
        }
        
    });
    
    window.Databases = Backbone.Collection.extend({
        
        model: Database,
        
        url: '/tarmac/_design/tarmac/_view/by_type?key="database"',
        
        parse: function (response) {
            return _.pluck(response.rows, 'value');
        }
        
    });
    
    window.Feature = Backbone.Model.extend({
        
        initialize: function () {
            
            var self = this;
            
            self.id = self.get('properties')._id;
            
            return;
        }
        
    });
    
    window.Features = Backbone.Collection.extend({
        
        model: Feature,
        
        parse: function (response) {
            return response.features[0];
        }
        
    });
    
    window.TrayView = Backbone.View.extend({
        
        className: 'Tray',
        
        initialize: function () {
            
            var self = this;
            
            _.bindAll(self, 'render');
            
            self.template = _.template($('#' + self.className).html());
            self.databases = self.options.databases;
            
            self.databases.bind('reset', self.render)
            
            return;
        },
        
        render: function () {
            
            var self = this,
                $databases;
            
            $(self.el).html(self.template({}));
            
            $databases = self.$('.Database-collection');
            
            self.databases.each(function(model){
                $databases
                    .append(new DatabaseView({
                        model: model
                    }).render().el)
                    ;
            });
            
            return self;
        }
        
    });
    
    window.DatabaseView = Backbone.View.extend({
        
        className: 'Database',
        
        events: {
            'click .fetch-features': 'fetchFeatures',
            'click .clear-features': 'clearFeatures'
        },
        
        initialize: function () {
            
            var self = this;
            
            _.bindAll(self, 'render');
            
            self.template = _.template($('#' + self.className).html());
            self.features = self.model.features;
            
            self.features.bind('reset', self.render);
            
            return;
        },
        
        render: function () {
            
            var self = this,
                $features;
            
            $(self.el).html(self.template(self.model.toJSON()));
            
            $features = self.$('.Feature-collection');
            
            self.features.each(function(model){
                $features
                    .append(new FeatureView({
                        model: model
                    }).render().el)
                    ;
            });
            
            return self;
        },
        
        fetchFeatures: function (e) {
            e.preventDefault();
            
            var self = this;
            
            self.features.fetch();
            
            return;
        },
        
        clearFeatures: function (e) {
            e.preventDefault();
            
            var self = this;
            
            self.features.reset([]);
            
            return;
        }
        
    });
    
    window.FeatureView = Backbone.View.extend({
        
        className: 'Feature',
        
        events: {
            'click.Feature .Feature-id': 'toggle'
        },
        
        initialize: function () {
            
            var self = this;
            
            _.bindAll(self, 'toggle', 'select', 'deselect');
            
            self.template = _.template($('#' + self.className).html());
            self.isSelected = false;
            
            self.model
                .bind('select', self.select)
                .bind('deselect', self.deselect)
                ;
            
            return;
        },
        
        render: function () {
            
            var self = this;
            
            $(self.el).html(self.template(self.model.toJSON()));
            
            return self;
        },
        
        toggle: function () {
            
            var self = this;
            
            if (self.isSelected)
            {
                self.model.trigger('deselect');
                
                return;
            }
            
            self.model.trigger('select');
            
            return;
        },
        
        select: function () {
            
            var self = this;
            
            if (self.isSelected)
            {
                return
            }
            
            self.isSelected = true;
            
            self.$('.' + self.className + '-id')
                .css({
                    fontWeight: 'bold'
                })
                ;
            
            return;
        },
        
        deselect: function () {
            
            var self = this;
            
            if (!self.isSelected)
            {
                return;
            }
            
            self.isSelected = false;
            
            self.$('.' + self.className + '-id')
                .css({
                    fontWeight: 'normal'
                })
                ;
            
            return;
        }
        
    });
    
    window.MapView = Backbone.View.extend({
        
        className: 'Map',
        
        initialize: function () {
            
            var self = this;
            
            _.bindAll(self, 'render', 'renderCollection');
            
            self.template = _.template($('#' + self.className).html());
            self.databases = self.options.databases;
            self.map = org.polymaps.map();
            
            self.databases.bind('reset', self.renderCollection);
            
            return;
        },
        
        render: function () {
            
            var self = this;
            
            $(self.el).html(self.template({}));
            
            return self;
        },
        
        renderCollection: function () {
            
            var self = this,
                $groups = self.$('.Group-collection');
                po = org.polymaps,
                container = self.el.appendChild(po.svg('svg')),
                url = po.url('http://mt0.googleapis.com/vt?lyrs=t@127,r@158&src=apiv3&hl=en-US&x={X}&y={Y}&z={Z}&s=Gali');
                //url = po.url('http://{S}tile.cloudmade.com' + '/854bf27409ba4b129dd49f137020299b' + '/32111/256/{Z}/{X}/{Y}.png').hosts(['a.', 'b.', 'c.', '']);
            
            self.map
                .center({
                    lat: 42.35779636641356,
                    lon: -71.05315709590911
                })
                .zoom(13)
                .container(container)
                .add(po.image().url(url))
                //.add(po.interact())
                ;
            
            $groups = self.$('.Group-collection');
            
            self.databases.each(function(model){
                $groups
                    .append(new GroupView({
                        model: model,
                        map: self.map
                    }).render().el)
                    ;
            });
            
            return;
        }
        
    });
    
    window.GroupView = Backbone.View.extend({
        
        className: 'Group',
        
        initialize: function () {
            
            var self = this,
                po = org.polymaps;
            
            _.bindAll(self, 'render', 'load');
            
            self.template = _.template($('#' + self.className).html());
            self.features = self.model.features;
            self.map = self.options.map;
            self.layer = po.geoJson();
            self.nodes = [];
            
            self.features.bind('reset', self.render);
            
            return;
        },
        
        render: function () {
            
            var self = this,
                $markers;
            
            $(self.el).html(self.template(self.model.toJSON()));
            
            $markers = self.$('.Marker-collection');
            
            self.features.each(function(model){
                $markers
                    .append(new MarkerView({
                        model: model
                    }).render().el)
                    ;
            });
            
            if (!self.map.container())
            {
                return self;
            }
            
            self.map
                .add(self.layer)
                ;
            var test = self.features.toJSON();
            
            self.layer
                .features(self.features.toJSON())
                .on('load', self.load)
                ;
            
            self.force = d3.layout.force()
                .nodes(test)
                .gravity(0)
                .charge(0)
                .size([500, 500])
                .start()
                ;
            
            self.nodes = d3.select(self.layer.container())
                .selectAll('circle')
                .data(test)
                .call(self.force.drag)
                ;
            
            self.force
                .on('tick', function(){
                    
                    self.nodes
                        .attr('transform', function(d, i){
                            console.log(d.x);
                            return 'translate(' + (3880.97 + d.x) + ', ' + (1334.5 + d.y) + ')';
                        })
                        ;

                })
                //.stop()
                ;
            
            return self;
        },
        
        load: function (e) {
            
            var self = this;
            
            _.each(e.features, function(f,i){
                
                self.nodes.push(f.element);
                
                new SvgFeatureView({
                    el: f.element,
                    model: self.features.get(f.data.properties._id),
                    force: self.force
                });
                
            });
            
            return;
        }
        
    });
    
    window.SvgFeatureView = Backbone.View.extend({
        
        events: {
            'click': 'toggle',
            'mouseenter': 'mouseenter',
            'mouseleave': 'mouseleave'
        },
        
        initialize: function () {
            
            var self = this,
                force = 
            
            _.bindAll(self, 'toggle', 'mouseenter', 'mouseleave', 'select', 'deselect');
            
            self.force = self.options.force;
            self.isSelected = false;
            
            self.model
                .bind('select', self.select)
                .bind('deselect', self.deselect)
                ;
            
            return;
        },
        
        toggle: function () {
            
            var self = this;
            
            if (self.isSelected)
            {
                self.model.trigger('deselect');
                
                return;
            }
            
            self.model.trigger('select');
            
            return;
        },
        
        mouseenter: function () {
            
            var self = this;
            
            self.el
                .setAttribute('r', 6.5)
                ;
            
            return;
        },
        
        mouseleave: function () {
            
            var self = this;
            
            self.el
                .setAttribute('r', 4.5)
                ;
            
            return;
        },
        
        select: function () {
            
            var self = this;
            
            if (self.isSelected)
            {
                return;
            }
            
            self.isSelected = true;
            
            return;
        },
        
        deselect: function () {
            
            var self = this;
            
            if (!self.isSelected)
            {
                return;
            }
            
            self.isSelected = false;
            
            return;
        }
        
    });
    
    window.MarkerView = Backbone.View.extend({
        
        className: 'Marker',
        
        events: {
            'click .Marker-id': 'toggle',
            'submit form': 'submit'
        },
        
        initialize: function () {
            
            var self = this;
            
            _.bindAll(self, 'select', 'deselect', 'submit');
            
            self.template = _.template($('#' + self.className).html());
            self.editor = new EditorView({
                model: self.model
            });
            self.isSelected = false;
            
            self.model
                .bind('select', self.select)
                .bind('deselect', self.deselect)
                ;
            
            return;
        },
        
        render: function () {
            
            var self = this;
            
            $(self.el).html(self.template(self.model.toJSON()));
            
            return self;
        },
        
        toggle: function () {
            
            var self = this;
            
            if (self.isSelected)
            {
                self.model.trigger('deselect');
                
                return;
            }
            
            self.model.trigger('select');
            
            return;
        },
        
        select: function (e) {
            
            var self = this;
            
            if (self.isSelected)
            {
                return;
            }
            
            self.isSelected = true;
            
            self.$('.' + self.className + '-id')
                .css({
                    fontWeight: 'bold'
                })
                ;
            
            $(self.el)
                .append(self.editor.render().el)
                ;
            
            return;
        },
        
        deselect: function () {
            
            var self = this;
            
            if (!self.isSelected)
            {
                return;
            }
            
            self.isSelected = false;
            
            self.$('.' + self.className + '-id')
                .css({
                    fontWeight: 'normal'
                })
                ;
            
            self.$('.Editor')
                .remove()
                ;
            
            return;
        },
        
        submit: function (e) {
            e.preventDefault();
            
            var self = this;
            
            self.model.set({
                geometry: self.$('form').serializeObject()
            });
            
            self.model.trigger('deselect');
            
            return;
        }
        
    });
    
    window.EditorView = Backbone.View.extend({
        
        className: 'Editor',
        
        events: {
            'click .Editor-cancel': 'cancel'
        },
        
        initialize: function () {
            
            var self = this;
            
            _.bindAll(self, 'cancel');
            
            self.template = _.template($('#' + self.className).html());
            
            return;
        },
        
        render: function () {
            
            var self = this;
            
            $(self.el).html(self.template(self.model.toJSON()));
            
            return self;
        },
        
        cancel: function (e) {
            e.preventDefault();
            
            var self = this;
            
            self.model.trigger('deselect');
            
            return;
        }
        
    });
    
    window.Tarmac = Backbone.Router.extend({
         
        routes: {
            '': 'default'
        },
        
        initialize: function () {
            
            var self = this;
            
            self.mapView = new MapView({
                databases: window.databases
            });
            self.trayView = new TrayView({
                databases: window.databases
            });
            
            Backbone.history.start();
            
            return;
        },
        
        default: function () {
            
            var self = this;
            
            document.body.appendChild(self.mapView.render().el);
            document.body.appendChild(self.trayView.render().el);
            
            window.databases.fetch();
            
            return;
        }
        
    });
    
    window.databases = new Databases();
    //window.databases.reset([{name:'bicycle_parking'},{name:'bus_stops'}]);
    
    $(function(){
        new Tarmac();
    });
    
    /*Backbone.sync = function (method, model, options) {
        
        if (method === 'create' || method === 'update')
        {
            console.log(1);
            //Backbone.couchConnector.create(model, options.success, options.error);
        }
        else if (method === 'read')
        {
            // Decide whether to read a whole collection or just one specific model
            if (model.collection)
            {
                
            } else {
                
            }
                Backbone.couchConnector.readModel(model, options.success, options.error);
            else
                Backbone.couchConnector.readCollection(model, options.success, options.error);
        }
        else if (method === 'delete')
        {
            Backbone.couchConnector.del(model, options.success, options.error);
        }  
    }*/
    
    $.fn.serializeObject = function()
    {
        var o = {};
        var a = this.serializeArray();
        $.each(a, function() {
            if (o[this.name] !== undefined) {
                if (!o[this.name].push) {
                    o[this.name] = [o[this.name]];
                }
                o[this.name].push(this.value || '');
            } else {
                o[this.name] = this.value || '';
            }
        });
        return o;
    };
    
})(window);