// Add animation when timer stop

( function() {

    Number.prototype.toFormatedString = function () {
        return this < 10 ? "0" + this : this;
    };
    
    Number.prototype.toTimeString = function () {
        return (Math.trunc(this/60)).toFormatedString() + ':' + (this%60).toFormatedString();
    };

    String.prototype.toSekunden = function () {
        var [minuten, sekunden] = this.split(':', 2);
        return parseInt(minuten) * 60 + parseInt(sekunden);
    };

    var timer;
    var global_vars     =   {};
    var char_list       =   [
                                'A', 'B', 'C', 'D',
                                'E', 'F', 'G', 'H',
                                'I', 'J', 'K', 'L',
                                'M', 'N', 'O', 'P',
                                'Q', 'R', 'S', 'T',
                                'U', 'V', 'W', 'X',
                                'Y', 'Z'
                            ];

    // Timer constructor
    var Timer = function (timer_in_sec) {
        var self            = this;

        self.value          = timer_in_sec;
        self.default_value  = null;
        self.bind_node      = null;
        self.interval_id    = null;
        self.stop_fkt       = null;

        // public methods
        self.set_value      = function(sec)
                                {   
                                    self.value = sec;
                                    if( self.bind_node !== null ) {
                                        self.bind_node.innerText = self.value.toTimeString();
                                    }
                                    return;
                                };

        self.set_bind_node  = function(node)
                                {
                                    self.bind_node = node;
                                    self.set_value(self.value);
                                    return;
                                };

        self.start          = function(fkt)
                                {
                                    self.default_value = self.value.valueOf();

                                    if (typeof fkt !== 'undefined') {
                                        self.stop_fkt = fkt;
                                    }
                                    self.interval_id = window.setInterval(timer_trigger, 1000);
                                    return;
                                };

        self.stop           = function()
                                {
                                    if ( self.interval_id !== null ) {
                                        window.clearInterval(self.interval_id);
                                        self.set_value(self.default_value);
                                    }
                                    
                                    if ( self.stop_fkt !== null) {
                                        self.stop_fkt();
                                    }
                                    return;
                                };

        // private method
        timer_trigger       = function()
                                {   
                                    // timer finished?
                                    if (self.value -1 < 0){
                                        self.stop();
                                        return;
                                    }

                                    self.set_value(--self.value);
                                    return;
                                };
    };

    /* init function*/
    function init() {

        timer = new Timer(75);
        timer.set_bind_node( document.getElementById('btnTimer') );

        $( '#btnStart'          ).click( get_char );

        $( '#btnDecTimer'       ).click( function() {timer.set_value(timer.value -= 5);});
        $( '#btnIncTimer'       ).click( function() {timer.set_value(timer.value += 5);});
        
        $( '#btnReset'          ).click( reset );

        $( '.language-option'   ).click( language_switch );
        $( '.sound-off'         ).click( sound_off );

        $( '#btnAbout'          ).click( about_word_picker );

        init_char_list();
        return;
    }

    function get_char() {
        if (typeof global_vars.interval_id !== 'undefined') { clearInterval(global_vars.interval_id); }
        
        start_timer();
        $('#char-select').text( start_word_picker() );
        return;
    }

    function start_word_picker() {
        var chars   = document.getElementsByClassName('char_aktiv');
        var picked_char;

        if ( chars.length > 0 ) {
            var char_id     = getRandomInt(0, chars.length - 1);
            var picked_char = chars[char_id].dataset.buchstabe;
           
            $(chars[char_id]).toggleClass('char_selected char_aktiv');

            return picked_char;
        }
        return;
    }
    
    function getRandomInt(min, max) {
        if (typeof min === 'undefined') {min = 0;}
        if (typeof max === 'undefined') {max = char_list.length - 1;}

        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    function init_char_list() {
        var char_list_elem = document.getElementsByClassName('char_list')[0];

        // Erneuter Aufbau der Buchstabenliste
        while (char_list_elem.firstChild) {
            char_list_elem.removeChild( char_list_elem.firstChild );
        }

        for (var i=0; i<char_list.length; i++) {

            var cell_elem = document.createElement('div');
                cell_elem.classList.add('char_aktiv', 'cursor-pointer');
                cell_elem.id        = i;
                cell_elem.dataset.buchstabe = char_list[i];
                cell_elem.innerHTML = char_list[i];
                cell_elem.onclick   = function(){
                                                    this.classList.toggle('char_aktiv');
                                                    this.classList.toggle('char_inaktiv');
                                                };

            char_list_elem.appendChild(cell_elem);
        }
        
        start_screensaver();
        return;
    }
    
    function start_timer () {
        $('#btnStart')
            .toggleClass('btn-success btn-danger')
            .prop('disabled', true);

        timer.start(stop_timer);
        return;
    }

    function stop_timer () {
        $('#btnStart')
            .toggleClass('btn-success btn-danger')
            .prop('disabled', false);

        // play sound file
        $( '.language-active' ).each( function() {
            var audio = new Audio( $( this ).data( 'soundFile' ) );
            audio.play();
        });
        return;
    }

    function reset () {
        
        if (typeof global_vars.interval_id !== 'undefined') {
            clearInterval(global_vars.interval_id);
        }
        
        timer.stop();
        init_char_list();
        return;
    }

    function start_screensaver () {
        global_vars.interval_id =   window.setInterval(
                                        function(){
                                            $('#char-select').text( char_list[getRandomInt()] );
                                        },
                                        500
                                    );
        return;
    }

    function sound_off () {
        $( '.language-option' ).each( function() {
            $( this ).removeClass('language-active');
        });

        $( '#sound-icon' ).removeClass('glyphicon-volume-up');
        $( '#sound-icon' ).addClass('glyphicon-volume-off');
        return;
    }

    function language_switch () {
        $( '.language-option' ).each( function() {
            $( this ).removeClass('language-active');
        });

        $( this ).addClass('language-active');
        
        $( '#sound-icon' ).removeClass('glyphicon-volume-off');
        $( '#sound-icon' ).addClass('glyphicon-volume-up');
        return;
    }

    function about_word_picker () {
        dialog.show(
            {
                type:   'info',
                title:  'About wortPicker',
                text:   'Uses:' +
                        '<ul>' +
                            '<li>jQuery 3.2.1</li>' +
                            '<li>Bootstrap 3.3.7</li>' +
                            '<li>Icons from <a href="https://icons8.com/" target="_blank">icons8.com</a></li>' +
                        '</ul>',
            }
        );
        return;
    }

    // run init
    init();

}() );
