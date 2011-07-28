
tarmac.views.MapIndex = Backbone.View.extend({
    
    el: $('.MapIndex'),
    
    events: {
        'click circle': 'renderTip',
        'click': 'create'
    },
    
    initialize: function () {
        
        var self = this;
        
        self.render();
        
        return self;
    },
    
    render: function () {
        
        var self = this;
        
        self.renderMap();
        
        return;
    },
    
    renderMap: function () {
        
        var self = this,
            $el = self.el,
            po = org.polymaps,
            container = $el.get(0).appendChild(po.svg('svg')),
            url = po.url('http://{S}tile.cloudmade.com' + '/854bf27409ba4b129dd49f137020299b' + '/32111/256/{Z}/{X}/{Y}.png').hosts(['a.', 'b.', 'c.', '']);
            //url = po.url('http://mt0.google.com/vt/lyrs=m@152000000&hl=en&x={X}&y={Y}&z={Z}&s=G').hosts(['a.', 'b.', 'c.', '']);
        
        self.map = po.map();
        self.featuresLayer = po.geoJson();
        self.imagesLayer = po.geoJson();
        
        /*self.featuresLayer
            .on('load', self.renderMarker)
            ;
        
        self.imagesLayer
            .on('load', self.renderImage)
            ;*/
        
        self.map
            .center({
                lat: 39.9522783,
                lon: -75.1636505
            })
            .container(container)
            .add(po.interact())
            .add(po.image().url(url))
            //.add(po.compass().pan('none'))
            .add(self.featuresLayer)
            .add(self.imagesLayer)
            ;
        
        //self.refresh();
        
        return;
    },
    
    create: function (e) {
        
        var self = this,
            p = self.map.mouse(e),
            coords = self.map.pointLocation(p);
        
        self.features.create({
            type: 'Feature',
            geometry: {
                coordinates: [coords.lon, coords.lat],
                type: 'Point'
            },
            properties: {
                type: 'Location'
            }
        });
        
        return;
    },
    
    renderMarker: function (e) {
        
        var self = this,
            f;
        
        _.each(e.features, function(f){
            
            var $el = $(f.element),
                id = f.data.id;
            
            $el
                .bind('hover.on.feature.' + id, function(){
                    
                    f.element
                        .setAttribute('r', 6.5)
                        ;
                    
                })
                .bind('hover.off.feature.' + id, function(){
                    
                    f.element
                        .setAttribute('r', 4.5)
                        ;
                    
                })
                .hover(function(){
                    
                    $('*')
                        .trigger('hover.on.feature.' + id)
                        ;
                    
                    f.element
                        .setAttribute('r', 6.5)
                        ;
                    
                },function(){
                    
                    $('*')
                        .trigger('hover.off.feature.' + id)
                        ;
                    
                    f.element
                        .setAttribute('r', 4.5)
                        ;
                    
                })
                ;
            
        });
        
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
            features = self.features.toJSON();
        
        if (!self.featuresLayer)
        {
            return;
        }
        
        self.featuresLayer.features(features);
        self.fit();
        
        return;
    },
    
    fit: function () {
        return;
        var self = this,
            features,
            lon_max,
            lon_min,
            lon_mid,
            lat_max,
            lat_min,
            lat_mid;
        
        if (!self.features)
        {
            return;
        }
        
        features = self.features.toJSON();
        
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
