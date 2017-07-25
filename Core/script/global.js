(function($) {
    
    var myLazyLoad = new LazyLoad();

    new WOW().init();

    if ($('[placeholder]').length > 0) {
        $('input, textarea').placeholder();
    }

    console.log("Slick = " + typeof(slick));

    //if(typeof(jcf)!=="undefined") {
    jcf.replaceAll();
    //}

})(jQuery);