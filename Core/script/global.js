(function($) {
    
    var myLazyLoad = new LazyLoad();

    new WOW().init();

    if ($('[placeholder]').length > 0) {
        $('input, textarea').placeholder();
    }

    if($('.tslider').length > 0 ) {
        var slider1 = $('.tslider');

        slider1.slick({
            lazyLoad: 'ondemand',
            slidesToShow: 2,
            slidesToScroll: 1
        });
	
    }

    console.log("Slick = " + typeof(slick));

    //if(typeof(jcf)!=="undefined") {
    jcf.replaceAll();
    //}

})(jQuery);