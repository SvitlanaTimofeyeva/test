function AnimationHandler(fieldwrap, r, w) {
    this.wrap = fieldwrap;

    this.active_form = '',

    this.forms = ''; 
    this.inputs = '';

    this.r = r;
    this.w = w;

    this.set_forms = function () {
        this.forms = this.wrap.find('form');
    }
    this.set_inputs = function () {
        this.inputs = this.wrap.find('.map-input');
    }
    this.set_active_form = function () {
        
        this.active_form = this.wrap.find('.active-wrap').find('form');

    }

    this.animate_q_change = function () {

        var self = this; 
        this.r.on('click', function () {

            self.w.css({
                'display': 'none',
                'width': '0px'
            });


            $(this).animate({
                marginRight: '200px',
                opacity: '0'
            }, {
                duration: 500,
                complete: field_transition
                })

            function field_transition() {
                self.r.css({
                    'margin-right': '0px',
                    'width': '0px'
                });

                var curr = self.wrap.find('.active-wrap'); 
                var next = self.wrap.find('.active-wrap').next('.hidden-wrap');

                var q = parseInt(curr.attr('data-q')); 
                var max = parseInt(self.r.attr('data-max'));

                self.animate_input_bar(q, max);

                if (q < max) {
                    handle_transition_end(); 
                } else {
                    handle_transition_end_max(); 
                }

                function handle_transition_end() {

                    curr.fadeOut(200, function () {

                        curr.removeClass('active-wrap');
                        next.fadeIn(200, function () {
                            next.removeClass('hidden-wrap');
                            next.addClass('active-wrap');
                            w.css({
                                'display': 'block'
                            });
                            r.css({
                                'opacity': '1',
                            });
                            self.isAnimating = false;
                        })

                    })
                }
                
                function handle_transition_end_max() {

                    curr.find('input').css({
                        'color': '#c3cbe1'
                    });

                    self.show_thank_you_screen(); 
                }
                
            }
        })
    }

    this.animate_input_bar = function (q, max) {

        var s = this.wrap.find('.small-stats');
        var bar = this.wrap.find('.input-meter .meter-span'); 

            var step = 100 / max;
            var width = step * q + '%';

            bar.animate({
                width: width
            }, {
                duration: 400,
            });

            s.html(q + '/' + max);

        
    }


    this.show_thank_you_screen = function () {

        var self = this; 
        var thanx = this.wrap.find('.thanx');

        thanx.css({
            'display': 'block'
        });
        
        this.wrap.find('.big-input-meter').animate({
            width: '100%'
        }, {
            duration: 500,
            complete: function () {


                    var id = thanx.find('svg').attr('id'); 
                    var check = new Vivus(id, {

                        duration: 50,
                        type: 'async',
                        start: 'autostart',
                        onReady: function () {
                            thanx.find('svg').fadeIn(100);
                        }
                    });

                    thanx.find('.thanx-p').fadeIn(200);
            
            }
        })

    }
     
    this.focus_handler = function () {

        var self = this;
        this.wrap.find('.map-input').on('input', function (e) { 
            $(this).css({
                'color': '#1f467d'
            })
            if ($(this).hasClass('invalid')) {
                if (!self.isAnimating) {

                    if (self.r.width() > 0) {
                        self.hide(self.r, self.show(self.w));
                    } else {
                        self.show(self.w)
                    }

                } else {
                  
                    setTimeout(function () {
                        self.show(self.w)
                    })
                }
            } else {
                if (!self.isAnimating) {

                    if (self.w.width() > 0) {
                        self.hide(self.w, self.show(self.r));
                    } else {
                        self.show(self.r)
                    }

                } else {
                    
                    setTimeout(function () {
                        self.show(self.r)
                    })
                }
            }
        })
    }

    this.isAnimating = false; 
    this.show = function (el, cb) {
       
        var self = this; 
        el.animate({
            width: '100px'
        }, {
            duration: 200,
            complete: function () {
                
                $(this).find('.icon').fadeIn(100, function () {
                    self.isAnimating = false;
                    if (cb) cb(); 
                })


            }
        })
    }

    this.hide = function (el, cb) {
        var self = this;
        el.find('.icon').fadeOut(100, function () {
            el.animate({
                width: '0px'
            }, {
                duration: 100,
                complete: function () {
                    self.isAnimating = false;
                    if (cb) cb();
                }
            })
        })
    }

    this.add_mask = function () {

        this.wrap.find('.addmask').on('input', function (e) {


            if ($(this).attr('data-masked') == '1') {
                if ($(this).inputmask("isComplete")) {
                    $(this).removeClass('invalid')
                } else {

                    if (!$(this).hasClass('invalid')) {

                        $(this).addClass('invalid')
                    }
                }
                return false;
            }

            var self = $(this);
            e.preventDefault();

            if (self.val != '' && !self.hasClass('mask2')) {
                self.addClass('invalid');
            }

            var maskval = $(this).attr('data-maskval');
            var ct = $(this).parent('.form-input2').attr('data-category');

            $(this).attr('data-masked', '1');

            $(this).inputmask({
                mask: maskval,
                showMaskOnHover: false,
                showMaskOnFocus: false,
                greedy: false,
                onincomplete: invalidMask,
                oncomplete: validMask
            });
     
            function invalidMask() {
                self.addClass('invalid')
            }
            function validMask() {

                if (!self.hasClass('multi-zip')) {
                    self.removeClass('invalid');
                    if (typeof ct != 'undefined') {
                        var err_p = $('.error[data-ct="' + ct + '"]');
                        err_p.html('');
                    }
                }
            }
        });

    }

    this.test_vals = ['099786653', '54645675', '45654654455', 'some text', 'some@mail']
    this.test_validation = function () {
        if (this.inputs.length == 0) {
            console.log('No inputs to validate. Test failed.');
            return false; 
        }

        var isValid = true; 

        for (var i = 0; i < this.inputs.length; i++) {
            for (var j = 0; j < this.test_vals.length; j++) {

                
                this.inputs.eq(i).trigger('input');
                this.inputs.eq(i).val(this.test_vals[j]);
                this.inputs.eq(i).trigger('input');

                if (this.inputs.eq(i).hasClass('addmask')) {
                    if (typeof this.inputs.eq(i).attr('data-maskval') == 'undefined') {
                        console.log('Invalid mask on input ' + (parseInt(this.inputs.eq(i).attr('data-q')) - 1) + ' in form subcategory ' + this.inputs.eq(i).attr('data-sub'));
                        isValid = false; 
                    }

                    

                   // console.log('inputmask validity on input ' + i + ' ' + mask_test + ' with value ' + this.inputs.eq(i).val() + ' and compared value ' + this.test_vals[j]);

                    if (typeof this.inputs.eq(i).attr('data-maskval') != 'undefined' && this.inputs.eq(i).hasClass('invalid')) {
                        var mask_test = Inputmask.isValid(this.inputs.eq(i).val(), { alias: this.inputs.eq(i).attr('data-maskval') });
                        if (mask_test) {
                            console.log('validation error on input ' + i + ' with value ' + this.inputs.eq(i).inputmask('unmaskedvalue') + ', compared value ' + this.test_vals[j] + ' and mask ' + this.inputs.eq(i).attr('data-maskval'));
                        } 
                    }


                    if (typeof this.inputs.eq(i).attr('data-maskval') != 'undefined' && !this.inputs.eq(i).hasClass('invalid')) {
                        var mask_test = Inputmask.isValid(this.inputs.eq(i).val(), { alias: this.inputs.eq(i).attr('data-maskval') });
                        if (!mask_test) {
                            console.log('validation error on input ' + i + ' with value ' + this.inputs.eq(i).inputmask('unmaskedvalue') + ', compared value ' + this.test_vals[j] + ' and mask ' + this.inputs.eq(i).attr('data-maskval'));
                        }
                    }
                }
            }

            if (!isValid) {
                return false; 
            }

 
        }
    }
}



var formhandler1 = new AnimationHandler($('.input-wrap[data-sub="0"]'), $('.input-wrap[data-sub="0"]').find('.right'), $('.input-wrap[data-sub="0"]').find('.wrong'));
formhandler1.set_forms();
formhandler1.set_inputs(); 
formhandler1.add_mask();
formhandler1.focus_handler();
formhandler1.animate_q_change();
formhandler1.test_validation(); 

var formhandler2 = new AnimationHandler($('.input-wrap[data-sub="1"]'), $('.input-wrap[data-sub="1"]').find('.right'), $('.input-wrap[data-sub="1"]').find('.wrong'));
formhandler2.set_forms();
formhandler2.set_inputs();
formhandler2.add_mask();
formhandler2.focus_handler();
formhandler2.animate_q_change();

$('#continue-btn').on('click', function () {
    $('.form-wrap').fadeOut(500, function () {
        $('.thank-you-screen').animate({
            opacity: 1
        }, 500);
    })
})