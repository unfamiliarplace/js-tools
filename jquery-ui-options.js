class Option {
    el;
    defaultValue;

    constructor(el, defaultValue) {
        this.el = el;
        this.defaultValue = defaultValue; // can be undefined
    }
    value = value => {}
    option = (key, value) => {}
    disable = value => {}
    default = value => {
        if (typeof value === "undefined") {
            return this.defaultValue;
        } else {
            this.defaultValue = value;
        }
    }

    setToDefault = value => {
        if (typeof value !== "undefined") {
            this.default(value);
        }
        this.value(this.defaultValue);
    }

    isDisabled = () => {}
  
    on = (triggers, callback) => {
      this.el.on(triggers, callback);
    }
}

class OptionBool extends Option {}

class OptionInt extends Option {
    max = value => {}
    min = value => {}
    share = value => {
        if (typeof value === 'undefined') {
            // get
            let value = this.value();
            let max = this.max();
            return (max === 0) ? 0 : value / max;

        } else {
            // set
            let max = this.max();
            this.value(value * max);
        }
    }
}

class OptionRange extends Option {
    max = value => {}
    min = value => {}
    lower = value => {}
    upper = value => {}
}

class OptionText extends Option {}

class OptionChoice extends Option {}

class OptionSelect extends OptionChoice {
    disable = value => {
        if (value) {

        }
    }
}

class OptionCheckbox extends OptionBool {
    constructor(el) {
       super(el);
       el.checkboxradio();
    }

    value = value => {
        if (typeof value === 'undefined') {
            // get
            return this.el.is(":checked");

        } else {
            // set
            this.el.prop('checked', value);
            this.el.button('refresh');
        }
    }

    disable = value => {
        if (value) {
            this.el.checkboxradio('disable');
        } else {
            this.el.checkboxradio('enable');
        }
    }

    isDisabled = () => {
        return this.el.prop('disabled');
    }

    change = callback => {
        if (typeof callback === 'undefined') {
            return this.el.change;
        } else {
            this.el.change(callback);
        }
    }
}

class OptionRadio extends OptionChoice {
    constructor(el) {
        // el should be the result of a jQuery selection using input[name="..."]
        super(el);
        el.checkboxradio();
    }

    value = value => {
        // value should be the id string of a unique radio button input

        if (typeof value === 'undefined') {
            // get
            return this.el.filter(':checked').prop('id');

        } else {
            // set
            $(`#${value}`).prop('checked', true);
            this.el.button('refresh');
        }
    }

    disable = value => {
        if (value) {
            this.el.checkboxradio('disable');
        } else {
            this.el.checkboxradio('enable');
        }
    }

    isDisabled = () => {
        return this.el.prop('disabled');
    }

    change = callback => {
        if (typeof callback === 'undefined') {
            return this.el.change;
        } else {
            this.el.change(callback);
        }
    }
}

class OptionSpinner extends OptionInt {
    allowedCodes = ["Digit1", "Digit2", "Digit3", "Digit4", "Digit5",
        "Digit6", "Digit7", "Digit8", "Digit9", "Digit0",
        "Numpad1", "Numpad2", "Numpad3", "Numpad4", "Numpad5",
        "Numpad6", "Numpad7", "Numpad8", "Numpad9", "Numpad0",
        "ArrowDown", "ArrowUp", "ArrowLeft", "ArrowRight",
        "Backspace", "Enter", "Shift", "Home", "End", "Minus",
        "NumpadSubtract", "Delete", "Insert", "Tab"
    ];

    constructor(el) {
       super(el);
       el.spinner();
       el.parent().find('.ui-spinner-button').click(() => {
          this.el.change();
      });

       el.parent().find('input').keydown(this.preventNonNumbers);
    }

    preventNonNumbers = e => {
        let allowedCodes = this.allowedCodes;
        if ((this.step() % 1) > 0) {
            allowedCodes.push('Period');
        }

        if (! this.allowedCodes.includes(e.code)) {
            e.preventDefault();
        }
    }

    isEmpty = () => {
        let val = this.el.spinner('value');
        return !val && (val !== 0);
    }

    value = value => {
        if (typeof value === 'undefined') {
            // get

            if (this.isEmpty()) {
                return NaN;
            } else {
                return parseInt(this.el.spinner('value'));
            }

        } else {
            // set
            this.el.spinner('value', value);
        }
    }

    max = value => {
        if (typeof value === 'undefined') {
            // get
            return parseInt(this.el.spinner('option', 'max'));

        } else {
            // set
            this.el.spinner('option', 'max', value);
        }
    }

    min = value => {
        if (typeof value === 'undefined') {
            // get
            return parseInt(this.el.spinner('option', 'min'));

        } else {
            // set
            this.el.spinner('option', 'min', value);
        }
    }

    step = value => {
        if (typeof value === 'undefined') {
            // get
            return parseFloat(this.el.spinner('option', 'step'));

        } else {
            // set
            this.el.spinner('option', 'step', value);
        }
    }

    disable = value => {
        if (value) {
            this.el.spinner('disable');
        } else {
            this.el.spinner('enable');
        }
    }

    change = callback => {
        if (typeof callback === 'undefined') {
            this.el.change();
        } else {
            this.el.change(callback);
        }
    }

    getExistingOnChange = () => {
        return this.el.onChange;
    }
}

class OptionSlider extends OptionInt {
    handle;
    suffix;

    _defaultOnChange() {
        this.handle.text(this.value().toString() + this.suffix)
    }

    _defaultOnSlide(event, ui) {
        this.handle.text(ui.value.toString() + this.suffix);
    }

    constructor(el, options) {
        super(el);
        this.suffix = '';
        if (typeof options !== 'undefined' && 'suffix' in options) {
            this.suffix = options['suffix'];
        }
        this.el.append("<div class='ui-slider-handle sliderHandle' />");
        this.handle = this.el.find('.sliderHandle');

        let args = {
            create: () => { this._defaultOnChange(); },
            change: () => { this._defaultOnChange(); },
            slide: (event, ui) => { this._defaultOnSlide(event, ui); }
        };

        el.slider(args);
    }

    value = value => {
        if (typeof value === 'undefined') {
            return this.el.slider('value');
        } else {
            this.el.slider('value', value);
        }
    }

    max = value => {
        if (typeof value === 'undefined') {
            // get
            return this.el.slider('option', 'max');

        } else {
            // set
            this.el.slider('option', 'max', value);
        }
    }

    min = value => {
        if (typeof value === 'undefined') {
            //get
            return this.el.slider('option', 'min');

        } else {
            //set
            this.el.slider('option', 'min', value);
        }
    }

    step = value => {
        if (typeof value === 'undefined') {
            //get
            return this.el.slider('option', 'step');

        } else {
            //set
            this.el.slider('option', 'step', value);
        }
    }

    disable = value => {
        if (value) {
            this.el.slider('disable');
        } else {
            this.el.slider('enable');
        }
    }

    change = callback => {
        if (typeof callback === 'undefined') {
            return this.el.slider('option', 'change');
        } else {
            this.el.slider('option', 'change', (event) => {
                this._defaultOnChange(event);
                callback(event);
            });
        }
    }

    slide = callback => {
        if (typeof callback === 'undefined') {
            this.el.slider.slide();
        } else {
            this.el.slider('option', 'slide', (event, ui) => {
                this._defaultOnSlide(event, ui);
                callback(event, ui);
            });
        }
    }
}

class OptionRangeSlider extends OptionRange {
    handleLower;
    handleUpper;
    suffix;

    _defaultOnChange = e => {
        this.handleLower.text(this.lower().toString() + this.suffix);
        this.handleUpper.text(this.upper().toString() + this.suffix);
    }

    _defaultOnSlide = (e, ui) => {
        this.handleLower.text(ui.values[0].toString() + this.suffix);
        this.handleUpper.text(ui.values[1].toString() + this.suffix);
    }

    constructor(el, options) {
        super(el);
        this.suffix = '';
        if (typeof options !== 'undefined' && 'suffix' in options) {
            this.suffix = options['suffix'];
        }
        this.el.append("<div class='ui-slider-handle sliderHandle sliderHandleLowerBound' />");
        this.el.append("<div class='ui-slider-handle sliderHandle sliderHandleUpperBound' />");
        this.handleLower = this.el.find('.sliderHandleLowerBound');
        this.handleUpper = this.el.find('.sliderHandleUpperBound');

        let args = {
            range: true,
            create: event => { this._defaultOnChange(event); },
            change: event => { this._defaultOnChange(event); },
            slide: (event, ui) => { this._defaultOnSlide(event, ui); }
        };

        el.slider(args);
    }

    value = value => {
        if (typeof value === 'undefined') {
            // get
            return [ this.lower(), this.upper() ];

        } else {
            // set
            this.el.slider('values', value);
        }
    }

    max = value => {
        if (typeof value === 'undefined') {
            // get
            return parseInt(el.slider('option', 'max'));

        } else {
            // set
            this.el.slider('option', 'max', value);
        }
    }

    min = value => {
        if (typeof value === 'undefined') {
            // get
            return parseInt(el.slider('option', 'min'));

        } else {
            // set
            this.el.slider('option', 'min', value);
        }
    }

    lower = value => {
        if (typeof value === 'undefined') {
            // get
            return this.el.slider('values')[0];

        } else {
            // set
            let upper = this.upper();
            this.el.slider('values', [value, upper]);
        }
    }

    upper = value => {
        if (typeof value === 'undefined') {
            // get
            return this.el.slider('values')[1];

        } else {
            // set
            let lower = this.lower();
            this.el.slider('values', [lower, value]);
        }
    }

    disable = value => {
        if (value) {
            this.el.slider('disable');
        } else {
            this.el.slider('enable');
        }
    }

    change = callback => {
        if (typeof callback === 'undefined') {
            return this.el.slider('option', 'change');
        } else {
            this.el.slider('option', 'change', (event) => {
                this._defaultOnChange(event);
                callback(event);
            });
        }
    }

    slide = callback => {
        if (typeof callback === 'undefined') {
            this.el.slider.slide();
        } else {
            this.el.slider('option', 'slide', (event, ui) => {
                this._defaultOnSlide(event, ui);
                callback(event, ui);
            });
        }
    }
}

