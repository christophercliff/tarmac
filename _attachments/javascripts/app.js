(function(window, undefined){
    
    window.Database = Backbone.Model.extend({
        
        initialize: function () {
            
            var self = this;
            
            self.features = new Features();
            self.features.url = '/' + self.get('name') + '/_design/geo/_spatiallist/geojson/pointsFull?bbox=-180%2C-90%2C180%2C90';
            
            return;
        }
        
    });
    
    window.Databases = Backbone.Collection.extend({
        
        model: Database
        
    });
    
    window.Feature = Backbone.Model.extend({
        
    });
    
    window.Features = Backbone.Collection.extend({
        
        model: Feature,
        
        parse: function (response) {
            return response.features;
        }
        
    });
    
    window.TrayView = Backbone.View.extend({
        
        className: 'Tray',
        
        initialize: function () {
            
            var self = this;
            
            self.template = _.template($('#' + self.className).html());
            self.databases = self.options.databases;
            
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
        
        fetchFeatures: function () {
            
            var self = this;
            
            self.features.fetch();
            
            return;
        },
        
        clearFeatures: function () {
            
            var self = this;
            
            self.features.reset([]);
            
            return;
        }
        
    });
    
    window.FeatureView = Backbone.View.extend({
        
        className: 'Feature',
        
        events: {
            'click.Feature .Feature-id': 'show',
            'hover.Feature .Feature-id': 'hover'
        },
        
        initialize: function () {
            
            var self = this;
            
            _.bindAll(self, 'hover', 'show');
            
            self.template = _.template($('#' + self.className).html());
            
            return;
        },
        
        render: function () {
            
            var self = this;
            
            $(self.el).html(self.template(self.model.toJSON()));
            
            return self;
        },
        
        hover: function () {
            
            var self = this;
            
            
            
            return;
        },
        
        show: function () {
            
            var self = this;
            
            
            
            return;
        }
        
    });
    
    window.MapView = Backbone.View.extend({
        
        className: 'Map',
        
        initialize: function () {
            
            var self = this;
            
            self.template = _.template($('#' + self.className).html());
            self.databases = self.options.databases;
            self.map = null;
            
            return;
        },
        
        render: function () {
            
            var self = this,
                $groups;
            
            self.renderMap();
            
            $(self.el).html(self.template({}));
            
            $groups = self.$('.Group-collection');
            
            self.databases.each(function(model){
                $groups
                    .append(new GroupView({
                        model: model,
                        map: self.map
                    }).render().el)
                    ;
            });
            
            return self;
        },
        
        renderMapPolymaps: function () {
            
            var self = this,
                po = org.polymaps,
                container = self.el.appendChild(po.svg('svg')),
                url = po.url('http://{S}tile.cloudmade.com' + '/854bf27409ba4b129dd49f137020299b' + '/32111/256/{Z}/{X}/{Y}.png').hosts(['a.', 'b.', 'c.', '']);
            
            self.map
                .center({
                    lat: 42.35779636641356,
                    lon: -71.05315709590911
                })
                .container(container)
                .add(po.image().url(url))
                ;
            
            return;
        },
        
        renderMap: function () {
            
            var self = this,
                layer = new OpenLayers.Layer.WMS('OpenLayers WMS', 'http://vmap0.tiles.osgeo.org/wms/vmap0', {layers: 'basic'} );
            
            self.map = new OpenLayers.Map(self.$('.' + self.className + '-map').get(0), {
                controls: []
            });
            console.log(self.map);
            self.map.addLayer(layer);
            self.map.setCenter(new OpenLayers.LonLat(-71.05315709590911, 42.35779636641356), 12);
            
            return;
        }
        
    });
    
    window.GroupViewPolymaps = Backbone.View.extend({
        
        className: 'Group',
        
        initialize: function () {
            
            var self = this,
                po = org.polymaps;
            
            _.bindAll(self, 'render');
            
            self.template = _.template($('#' + self.className).html());
            self.features = self.model.features;
            self.map = self.options.map;
            self.layer = po.geoJson();
            
            self.features.bind('reset', self.render);
            
            return;
        },
        
        render: function () {
            
            var self = this,
                $markers;
            
            $(self.el).html(self.template(self.model.toJSON()));
            
            $markers = self.$('.Marker-collection');
            
            if (!self.map.container())
            {
                return self;
            }
            
            self.map
                .add(self.layer)
                ;
            
            self.layer
                .features(self.features.toJSON())
                ;
            
            return self;
        }
        
    });
    
    window.GroupView = Backbone.View.extend({
        
        className: 'Group',
        
        initialize: function () {
            
            var self = this;
            
            _.bindAll(self, 'render');
            
            self.template = _.template($('#' + self.className).html());
            self.features = self.model.features;
            self.map = self.options.map;
            self.layer = new OpenLayers.Layer.Vector();
            
            self.map
                .addLayer(self.layer)
                ;
            
            self.features.bind('reset', self.render);
            
            return;
        },
        
        render: function () {
            
            var self = this,
                $markers;
            
            $(self.el).html(self.template(self.model.toJSON()));
            
            $markers = self.$('.Marker-collection');
            
            
            
            return self;
        }
        
    });
    
    window.MarkerView = Backbone.View.extend({
        
        className: 'Marker',
        
        initialize: function () {
            
            var self = this;
            
            self.template = _.template($('#' + self.className).html());
            
            return;
        },
        
        render: function () {
            
            var self = this;
            
            $(self.el).html(self.template());
            
            return self;
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
            
            //self.mapView.renderMap();
            
            return;
        }
        
    });
    
    window.databases = new Databases();
    window.databases.reset([{name:'bicycle_parking'},{name:'bus_stops'}]);
    
    $(function(){
        new Tarmac();
    });
    
})(window);