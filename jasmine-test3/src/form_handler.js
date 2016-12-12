function InputHandler(fieldwrap, r, w) {
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
                        if (!$(this).hasClass('addmask')) {
                            self.show(self.r)
                        }
                           
                        

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
                self.removeClass('invalid');
            }
        });

    }

    this.test_vals = ['099786653', '54645675', '45654654455', 'some text', 'some@mail'];

}

var handlers = []; 
function add_handlers() {
    var wraps = $('.input-wrap');

    for (var i = 0; i < wraps.length; i++) {
        handlers.push(new InputHandler(wraps.eq(i), wraps.eq(i).find('.right'), wraps.eq(i).find('.wrong')));

        handlers[i].set_forms();
        handlers[i].set_inputs();
        handlers[i].add_mask();
        handlers[i].focus_handler();
        handlers[i].animate_q_change();


    }
}

add_handlers();


$('#continue-btn').on('click', function () {

    $('.form-wrap').fadeOut(500, function () {
        $('.thank-you-screen').css({
            'display': 'table'
        })
        $('.thank-you-screen').animate({
            opacity: 1
        }, 500);
    })
})