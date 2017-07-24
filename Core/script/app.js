(function($) {

    alert

    if($('.select-v1').length > 0) {
        var select = $('.select-v1');

        select.change(function(){
            var _this = $(this).val();
            alert('select is changed with val of ' + _this );
        });
    }

})(jQuery);