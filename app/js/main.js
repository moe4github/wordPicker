( function() {

    /* init function*/
    function initPageSkript() {

        // init js functions
        $( "#btnTogglePasswordView"     ).click  ( 
                                                    function() {
                                                        toggle_password_view();
                                                        setTimeout( toggle_password_view, 5000 );
                                                        return;
                                                    }
                                                );
            
        $( "#btnIncPasswordLength"      ).click( increasePassLength );
        $( "#btnDecPasswordLength"      ).click( decreasePassLength );
        $( "#btnGeneratePassword"       ).click( pwd );
        $( "#btnGenerateVPNPassword"    ).click( vpn_pwd );
        $( "#clear_password"            ).click( reset_form_input );
        $( "#about_passGuard"           ).click( about_passGuard );
        
        $( "#btnTest" ).click( appDB.open );
        $( "#btnAdd" ).click( appDB.add_item );
        $( "#btnGet" ).click( appDB.get_item );
        
        create_password_category_list();

        $( "#outputPassword" ).focus( function() {
            $( "#outputPassword" ).select().mouseup( function(e) {
                e.preventDefault();
                $( this ).unbind( "mouseup" );
            });
        });

        // init startup properties
        $( "#inputPasswordLength" ).val( app_config.get_default_pwd_length() );
        reset_form_input();
    }

    var toggle_password_view = function() {

        // toggle input elements
        var master_key_input        =   document.getElementById("master_key");
        var master_key_input_new    =   master_key_input.cloneNode(false);

        master_key_input_new.type   =   master_key_input_new.type == "password"
                                        ? "text"
                                        : "password";

        master_key_input.parentNode.replaceChild(
            master_key_input_new,
            master_key_input
        );

        // toggle button icon
        $( "#btnTogglePasswordView > span" ).toggleClass( "glyphicon-asterisk glyphicon-eye-open" );

        return;            
    }

    var create_password_category_list = function() {

        var select = document.createElement('select');
            select.classList.add("selectpicker", "show-tick");

        $("#password_category").append(select);

        for( var i=0; i < app_config.password_category_list.length; i++) {
            var item = app_config.password_category_list[i];
            var option                  = document.createElement('option');

            if ( item.value ) {
                option.text             =   item.text;
                option.value            =   item.value;

                if (item.value == app_config.get_default_pwd_length()) {
                    option.dataset.subtext  = 'default length (' + item.value + ')';
                    option.setAttribute('selected', 'selected');
                } else {
                    option.dataset.subtext  = 'length (' + item.value + ')';
                }

            } else {
                option.dataset.divider  = 'true';
            }

            $("#password_category > select").append(option);

        }

        $("#password_category > select")
            .selectpicker({
                style: "btn-primary",
                width: "100%",
                size: 4
            })
            .change(function() {
               $( "#inputPasswordLength" ).val( this.value ); 
            });

        return;
    }
    
    // Passwortlänge - Plusbutton 
    increasePassLength = function () {
        $( "#inputPasswordLength" ).val( parseInt( $( "#inputPasswordLength" ).val() ) + 1 );
    }

    // Passwortlänge - Minusbutton
    decreasePassLength = function () {

        if  (
                    parseInt( $( "#inputPasswordLength" ).val() ) - 1
                <   app_config.min_password_length 
            ) 
        {
            passGuardInfo.show(
                {
                    type:   'error',
                    title:  'Password is too short',
                    text:   'Please increase password length!',
                }
            );
            return 0;

        } 
        else if (
                        parseInt( $( "#inputPasswordLength" ).val() ) - 1 
                    <   app_config.min_secure_password_length
                )
        {
            passGuardInfo.show(
                {
                    type:   'warning',
                    title:  'Short password!',
                    text:   'Password length is unsecure!',
                }
            );
        }

        $( "#inputPasswordLength" ).val( parseInt( $( "#inputPasswordLength" ).val() ) - 1 );
    }

    // Passwort generieren
    function pwd() {
        $( "#outputPassword" ).val(
            passGuard.generate_pwd(
                {
                    key:                $( "#master_key" ).val(),
                    service:            $( "#inputService" ).val(),
                    password_length:    $( "#inputPasswordLength" ).val()
                }
            )
        );
        return;
    }

    // VPN Passwort generieren
    function vpn_pwd () {
        $( "#outputPassword" ).val( passGuard.generate_vpn_pwd );
        return;
    }

    var reset_form_input = function () {

        $( "#outputPassword").val( null );
        $( "#inputService"  ).val( null );
        $( "#master_key"    ).val( null );
        return;
    }

    var about_passGuard = function () {
        passGuardInfo.show(
            {
                type:   'info',
                title:  'About passGuard',
                text:   'Uses:' +
                        '<ul>' +
                            '<li>cryptoJs</li>' +
                            '<li>jQuery 3.2.1</li>' +
                            '<li>Bootstrap 3.3.7</li>' +
                            '<li>Bootstrap-Select</li>' +
                        '</ul>',
            }
        );
        return;
    }

    // run init
    initPageSkript();

}() );
