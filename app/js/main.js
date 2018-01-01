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
    }

    var global_vars     =   {
                                default_timer: "01:30",
                            };

    var timer = {
        
        default_timer:  global_vars.default_timer,
        delta_sekunde:  5,
        interval_id:    null,

        set_timer:      function(timer) {
                                            this.default_timer = timer;
                                            return;
                                        },

        get_timer:      function()      {
                                            return this.default_timer;
                                        },

        inc_sekunde:    function()      {
                                            var sekunden = this.default_timer.toSekunden();
                                            sekunden += this.delta_sekunde;
                                            this.default_timer = sekunden.toTimeString();
                                            return;
                                        },
        dec_sekunde:    function()      {
                                            var sekunden = this.default_timer.toSekunden();
                                            if ( sekunden - this.delta_sekunde > 0 ){
                                                sekunden -= this.delta_sekunde;
                                                this.default_timer = sekunden.toTimeString();
                                            }
                                            return;
                                        },
        start:          function(fkt)   {
                                            this.interval_id = window.setInterval(fkt, 1000);
                                            return;
                                        },
        stop:           function()      {
                                            if (typeof global_vars.interval_id !== 'undefined') {
                                                clearInterval(this.interval_id);
                                            }
                                            return;
                                        },

    };

    var char_list       =   [
                                'A', 'B', 'C', 'D',
                                'E', 'F', 'G', 'H',
                                'I', 'J', 'K', 'L',
                                'M', 'N', 'O', 'P',
                                'Q', 'R', 'S', 'T',
                                'U', 'V', 'W', 'X',
                                'Y', 'Z'
                            ];

    /* init function*/
    function init() {

        $( '#btnStart' ).click( get_char );

        $( '#btnDecTimer' ).click( function() { 
            timer.dec_sekunde(); 
            $( '#btnTimer' ).text( timer.default_timer );
            return;
        });
        $( '#btnIncTimer' ).click( function() {
            timer.inc_sekunde(); 
            $( '#btnTimer' ).text( timer.default_timer );
            return;
        });
        $( '#btnTimer' ).text( timer.default_timer );
        
        $( '#btnReset' ).click( init_char_list );
        $( '#btnAbout' ).click( about_word_picker );

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
        timer.start(refresh_counter);
        return;
    }

    function stop_timer () {
        timer.stop();

        $('#btnStart')
            .toggleClass('btn-success btn-danger')
            .prop('disabled', false);
        
        $( '#btnTimer' ).text( timer.default_timer );
        return;
    }

    function refresh_counter () {
        var sekunden = $('#btnTimer').text().toSekunden();

        if (sekunden == 0) {
            stop_timer();
            return;
        }

        sekunden--;

        $('#btnTimer').text( sekunden.toTimeString() );
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

    function about_word_picker () {
        dialog.show(
            {
                type:   'info',
                title:  'About wortPicker',
                text:   'Uses:' +
                        '<ul>' +
                            '<li>jQuery 3.2.1</li>' +
                            '<li>Bootstrap 3.3.7</li>' +
                        '</ul>',
            }
        );
        return;
    }

    // run init
    init();

}() );
