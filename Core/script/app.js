(function($) {

    

    if($('.select-v1').length > 0) {
        var select = $('.select-v1');

        select.change(function(){
            var _this = $(this).val();
            alert('select is changed with val of ' + _this );
        });
    }

    if($('.tslider').length > 0 ) {
        var slider1 = $('.tslider');

        slider1.slick({
            lazyLoad: 'ondemand',
            slidesToShow: 3,
            slidesToScroll: 1
        });
	
    }
})(jQuery);