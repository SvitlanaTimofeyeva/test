describe('Input validation, ', function () {
    
    var wraps = $('.input-wrap');
    var inputhandlers = handlers; 

    for (var i = 0; i < wraps.length; i++) {

        input_test(i);
    }


    function input_test(index) {
        
        var inputhandler = inputhandlers[index];

        if (inputhandler.inputs.length == 0) {
            console.log('No inputs to validate. Test failed.');
            return false;
        }

        for (var i = 0; i < inputhandler.inputs.length; i++) {
            test_field_category(i)
        }

        function test_field_category(i) {
            it('should return true if validation works on input ' + (parseInt(inputhandler.inputs.eq(i).attr('data-q')) - 1) + ' in field ' + inputhandler.inputs.eq(i).attr('data-sub'), function () {
                var test = test_field(inputhandler.inputs.eq(i), inputhandler);

                expect(test).toBe(true);
            });
        }

        function test_field(field, handler) {
            for (var j = 0; j < handler.test_vals.length; j++) {

                if (field.hasClass('addmask')) {

                    if (typeof field.attr('data-maskval') == 'undefined') {
                        console.log('Invalid mask on input element ' + (parseInt(field.attr('data-q')) - 1) + ' in field ' + field.attr('data-sub'));
                        return false; 
                    }

                    field.trigger('input');
                    field.val(inputhandler.test_vals[j]);
                    field.trigger('input');


                    var inner_validation_flag = false;

                    // console.log('inputmask validity on input ' + i + ' ' + mask_test + ' with value ' + field.val() + ' and compared value ' + this.test_vals[j]);

                    if (typeof field.attr('data-maskval') != 'undefined' && field.hasClass('invalid')) {
                        var mask_test = Inputmask.isValid(field.val(), { alias: field.attr('data-maskval') });
                        if (mask_test) {
                            console.log('validation error on input ' + i + ' with value ' + field.inputmask('unmaskedvalue') + ', compared value ' + handler.test_vals[j] + ' and mask ' + field.attr('data-maskval'));
                            inner_validation_flag = true;

                        }
                    }


                    if (typeof field.attr('data-maskval') != 'undefined' && !field.hasClass('invalid')) {
                        var mask_test = Inputmask.isValid(field.val(), { alias: field.attr('data-maskval') });
                        if (!mask_test) {
                            console.log('validation error on input ' + i + ' with value ' + field.inputmask('unmaskedvalue') + ', compared value ' + handler.test_vals[j] + ' and mask ' + field.attr('data-maskval'));
                            inner_validation_flag = true;
                        }
                    }

                    if (typeof field.attr('data-maskval') != 'undefined') {
                        var mask_test = Inputmask.isValid(field.val(), { alias: field.attr('data-maskval') });
                        if (mask_test && !inner_validation_flag) {
                            console.log('input ' + i + ' in subcategory ' + field.attr('data-sub') + ' is valid with unmasked value ' + field.inputmask('unmaskedvalue') + ', compared value ' + handler.test_vals[j] + ' and mask ' + field.attr('data-maskval'));
                        }

                    }

    

                }
            }

            if (inner_validation_flag) {
                return false;
            } else {
                return true;
            }
        }

    }
})