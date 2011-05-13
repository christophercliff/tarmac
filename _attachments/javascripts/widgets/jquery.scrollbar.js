
(function($, undefined){
    
    $.widget('tarmac.scrollbar', {
        
        options: {
            
        },
        
        _create: function () {
            
            var self = this,
                $el = self.element;
            
            self.$wrapper = $('<div class="scrollbar"/>');
            alert(1);
            $el
                .wrap(self.$wrapper)
                ;
            
            // Trigger the `create` event.
            self._trigger('create');
            
            return;
        },
        
        _init: function () {
            
            var self = this;
            
            // Trigger the `init` event.
            self._trigger('init');
            
            return;
        }
        
    });
    
})(jQuery);

console.log(1, $.scrollbar);