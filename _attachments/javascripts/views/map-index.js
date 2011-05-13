
tarmac.views.MapIndex = Backbone.View.extend({
    
    el: $('.MapIndex'),
    
    events: {
        'click circle': 'renderTip',
        'click': 'create'
    },
    
    initialize: function () {
        
        var self = this;
        
        self.locations = self.options.locations;
        
        _.bindAll(self, 'refresh', 'renderMarker');
        
        self.locations.bind('refresh', self.refresh);
        self.locations.bind('add', self.refresh);
        self.locations.bind('remove', self.refresh);
        
        self.render();
        
        return self;
    },
    
    render: function () {
        
        var self = this;
        
        navigator.geolocation.getCurrentPosition(function(p){
            
            self.renderMap(p);
            
        });
        
        return;
    },
    
    renderMap: function (p) {
        
        var self = this,
            $el = self.el,
            po = org.polymaps,
            container = $el.get(0).appendChild(po.svg('svg')),
            url = po.url('http://{S}tile.cloudmade.com' + '/854bf27409ba4b129dd49f137020299b' + '/32111/256/{Z}/{X}/{Y}.png').hosts(['a.', 'b.', 'c.', '']);
            //url = po.url('http://mt0.google.com/vt/lyrs=m@152000000&hl=en&x={X}&y={Y}&z={Z}&s=G').hosts(['a.', 'b.', 'c.', '']);
        
        self.map = po.map();
        self.locationsLayer = po.geoJson();
        self.imagesLayer = po.geoJson();
        
        self.locationsLayer
            .on('load', self.renderMarker)
            ;
        
        self.imagesLayer
            .on('load', self.renderImage)
            ;
        
        self.map
            .center({
                lat: p.coords.latitude,
                lon: p.coords.longitude
            })
            .container(container)
            .add(po.interact())
            .add(po.image().url(url))
            .add(po.compass().pan('none'))
            .add(self.locationsLayer)
            .add(self.imagesLayer)
            ;
        
        self.refresh();
        
        return;
    },
    
    create: function (e) {
        
        var self = this,
            p = self.map.mouse(e),
            coords = self.map.pointLocation(p);
        
        self.locations.create({
            type: 'Feature',
            geometry: {
                coordinates: [coords.lon, coords.lat],
                type: 'Point'
            },
            properties: {}
        });
        
        return;
    },
    
    renderMarker: function (e) {
        
        var self = this;
        
        
        
        return;
    },
    
    renderImage: function (e) {
        
        var self = this;
        
        
        
        return;
    },
    
    renderTip: function (e) {
        e.stopImmediatePropagation();
        
        var self = this;
        
        
        
        return;
    },
    
    refresh: function () {
        
        var self = this,
            features = self.locations.toJSON();
        
        if (!self.locationsLayer)
        {
            return;
        }
        
        self.locationsLayer.features(features);
        self.fit();
        
        return;
    },
    
    fit: function () {
        
        var self = this,
            features,
            lon_max,
            lon_min,
            lon_mid,
            lat_max,
            lat_min,
            lat_mid;
        
        if (!self.locations)
        {
            return;
        }
        
        features = self.locations.toJSON();
        
        //// HACK: shitty algorithm, gonna bottleneck at some point
        
        lon_max = _.max(features, function(f){return f.geometry.coordinates[0]}).geometry.coordinates[0];
        lon_min = _.min(features, function(f){return f.geometry.coordinates[0]}).geometry.coordinates[0];
        //lon_mid = (lon_max.geometry.coordinates[0] + lon_min.geometry.coordinates[0])/2;
        lat_max = _.max(features, function(f){return f.geometry.coordinates[1]}).geometry.coordinates[1];
        lat_min = _.min(features, function(f){return f.geometry.coordinates[1]}).geometry.coordinates[1];
        //lat_mid = (lat_max.geometry.coordinates[1] + lat_min.geometry.coordinates[1])/2;
        //console.log(lon_max);
        var test = gju.rectangleCentroid({coordinates:[[lon_max,lat_max],[lon_max,lat_min],[lon_min,lat_max],[lon_min,lat_min]]});
        
        //console.log(test.coordinates);
        
        //return;
        //console.log(self.map.extent());
        
        return;
    }
    
});
