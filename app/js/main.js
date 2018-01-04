// Add animation when timer stop
// Add sound when timer stop

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

    var Timer = function (timer_in_sec) {
        
        this.value          = timer_in_sec;
        this.bind_node      = null;
        this.interval_id    = null;
        this.stop_fkt       = null;

    };

    Timer.prototype = {

        set_value:      function(sec)   {   
                                            this.value = sec;
                                            if( typeof this.bind_node !== null ) {
                                                this.bind_node.innerText = this.value.toTimeString();
                                            }
                                            return;
                                        },

        set_bind_node:  function(node)  {
                                            this.bind_node = node;
                                            this.set_value(this.value);
                                            return;
                                        },

        start:          function(fkt)   {
                                            if (typeof fkt !== 'undefined') {
                                                this.stop_fkt = fkt;
                                            }
                                            this.interval_id = window.setInterval(this.timer_trigger, 1000);
                                            return;
                                        },

        stop:           function()      {
                                            if (typeof this.interval_id !== null) {
                                                clearInterval(this.interval_id);
                                            }
                                            
                                            if (typeof this.stop_fkt !== null) {
                                                this.stop_fkt();
                                            }
                                            return;
                                        },

        timer_trigger:  function()      {
                                            // timer finished?
                                            if (this.value -1 < 0){
                                                this.stop();
                                            }

                                            this.set_value(this.value--);
                                            return;
                                        },
    };


    /* init function*/
    function init() {

        timer = new Timer(75);
        timer.set_bind_node( document.getElementById('btnTimer') );

        $( '#btnStart' ).click( get_char );

        $( '#btnDecTimer' ).click( function() {timer.set_value(timer.value -= 5);});
        $( '#btnIncTimer' ).click( function() {timer.set_value(timer.value += 5);});
        
        $( '#btnReset' ).click( init_char_list );
        $( '#btnSound' ).click( toggle_sound );

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

        timer.start(stop_timer);
        return;
    }

    function stop_timer () {
        $('#btnStart')
            .toggleClass('btn-success btn-danger')
            .prop('disabled', false);
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

    function toggle_sound () {
        $( '#btnSound > span' ).toggleClass('glyphicon-volume-up glyphicon-volume-off');
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
