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
            
            var self = this,
                features = new Features();
            
            features.url = '/' + self.get('slug') + '/_design/geo/_spatiallist/geojson/full?bbox=-180%2C-90%2C180%2C90';
            
            self.set({
                features: features
            });
            
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
    
    window.Map = Backbone.Model.extend({});
    
    window.Feature = Backbone.Model.extend({
        
        initialize: function () {
            
            var self = this;
            
            self.url ='/bicycle_parking/';
            
            if (!self.has('properties'))
            {
                return;
            }
            
            self.id = self.get('properties')._id;
            self.url ='/bicycle_parking/' + self.id;
            self.set(self.get('properties'));
            self.unset('properties');
            
            return;
        },
        
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
            'click .clear-features': 'clearFeatures',
            'click .add-feature': 'addFeature'
        },
        
        initialize: function () {
            
            var self = this;
            
            _.bindAll(self, 'render');
            
            self.template = _.template($('#' + self.className).html());
            self.features = self.model.get('features');
            
            self.features.bind('reset', self.render);
            
            return;
        },
        
        render: function () {
            
            var self = this,
                $features;
            
            $(self.el).html(self.template(self.model.toJSON()));
            
            $records = self.$('.Record-collection');
            
            self.features.each(function(model){
                $records
                    .append(new RecordView({
                        model: model
                    }).render().el)
                    ;
            });
            
            return self;
        },
        
        fetchFeatures: function (e) {
            e.preventDefault();
            
            var self = this;
            
            self.features
                .fetch()
                ;
            
            return;
        },
        
        clearFeatures: function (e) {
            e.preventDefault();
            
            var self = this;
            
            self.features
                .reset([])
                ;
            
            return;
        },
        
        addFeature: function (e) {
            e.preventDefault();
            
            var self = this;
            
            self.features
                .add({
                    type: 'Feature',
                    geometry: {
                        type: 'Point',
                        coordinates: []
                    }
                })
                ;
            
            return;
        }
        
    });
    
    window.RecordView = Backbone.View.extend({
        
        className: 'Record',
        
        events: {
            'click.Record .Record-id': 'toggle'
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
            
            self.template = _.template($('#' + self.className).html());
            self.databases = self.options.databases;
            self.model = new Map();
            
            self.databases
                .bind('reset', self.layers, self)
                ;
            
            self.model
                .bind('change', self.fit, self)
                ;
            
            return;
        },
        
        render: function () {
            
            var self = this,
                $map;
            
            $(self.el).html(self.template({}));
            
            $map = self.$('.Map-map');
            
            $map
                .css({
                    height: $(window).height() + 'px'
                })
                ;
            
            self.map = new google.maps.Map($map.get(0), {
                zoom: 8,
                center: new google.maps.LatLng(42.37, -71.03),
                mapTypeId: google.maps.MapTypeId.TERRAIN
            });
            
            self.resize();
            
            return self;
        },
        
        layers: function () {
            
            var self = this;
            
            self.databases.each(function(database){
                new LayerView({
                    model: database,
                    map: self.map,
                    mapModel: self.model
                });
            });
            
            return;
        },
        
        fit: function () {
            
            var self = this,
                bounds = new google.maps.LatLngBounds();
            
            self.databases.each(function(database){
                database.get('features').each(function(feature){
                    var coords = feature.get('geometry').coordinates;
                    bounds.extend(new google.maps.LatLng(coords[1], coords[0]));
                });
            });
            
            self.map.fitBounds(bounds);
            
            return;
        },
        
        resize: function () {
            
            var self = this,
                $map = self.$('.Map-map'),
                $window = $(window);
            
            if ($map.length < 1)
            {
                return;
            }
            
            $window
                .bind('resize.' + self.className, _.throttle(function(){
                    
                    $map
                        .css({
                            height: $window.height() + 'px'
                        })
                        ;
                    
                    google.maps.event.trigger(self.map, 'resize');
                    
                }, 100))
                ;
            
            return;
        }
        
    });
    
    window.LayerView = Backbone.View.extend({
        
        className: 'Layer',
        
        initialize: function () {
            
            var self = this;
            
            _.bindAll(self, 'render', 'add');
            
            self.map = self.options.map;
            self.features = self.model.get('features');
            self.mapFeatures = []; // Container for removing batch features
            self.mapModel = self.options.mapModel;
            
            self.features
                .bind('reset', self.render)
                .bind('add', self.add)
                ;
            
            return;
        },
        
        render: function () {
            
            var self = this,
                geo = {
                    type: 'FeatureCollection',
                    features: self.features.toJSON()
                },
                opts = {
                    draggable: true
                };
            
            if (self.features.length < self.mapFeatures.length)
            {
                self.clear();
            }
            
            self.mapFeatures = new GeoJSON(geo, opts);
            
            self.features.each(function(feature, i){
                new FeatureView({
                    model: feature,
                    map: self.map,
                    feature: self.mapFeatures[i]
                }).render();
            });
            
            self.mapModel
                .trigger('change')
                ;
            
            return self;
        },
        
        clear: function () {
            
            var self = this;
            
            for (var i = 0, l = self.mapFeatures.length; i < l; i++)
            {
                self.mapFeatures[i].setMap();
            }
            
            return;
        },
        
        add: function (feature) {
            
            var self = this,
                geo = feature.get('geometry'),
                center = self.map.getCenter();
            
            geo.coordinates = [center.lng(), center.lat()];
            
            feature
                .set({
                    geometry: geo
                })
                ;
            
            feature
                .save(null, {
                    success: function (model, response) {
                        
                        feature.url = feature.url + feature.id;
                        
                        feature
                            .set({
                                _rev: response.rev
                            })
                            .unset('ok')
                            ;
                    }
                })
                ;
            
            new FeatureView({
                model: feature,
                map: self.map,
                feature: new GeoJSON({
                    type: 'FeatureCollection',
                    features: [feature.toJSON()]
                }, {
                    draggable: true
                })[0]
            }).render();
            
            return;
        }
        
    });
    
    window.FeatureView = Backbone.View.extend({
        
        className: 'Feature',
        
        events: {
            
        },
        
        initialize: function () {
            
            var self = this;
            
            _.bindAll(self, 'render', 'update');
            
            self.map = self.options.map;
            self.feature = self.options.feature;
            
            return;
        },
        
        render: function () {
            
            var self = this;
            
            self.feature.setMap(self.map)
            
            google.maps.event.addListener(self.feature, 'dragend', self.update);
            
            return self;
        },
        
        update: function (e) {
            
            var self = this;
            
            var geometry = self.model.get('geometry');
            
            geometry.coordinates = [e.latLng.lng(), e.latLng.lat()];
            
            self.model
                .set({
                    geometry: geometry
                })
                .save(null, {
                    success: function (model, response) {
                        
                        model
                            .set({
                                _rev: response.rev
                            })
                            .unset('ok')
                            ;
                        
                    }
                })
                ;
            
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
