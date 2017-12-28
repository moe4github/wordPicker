var passGuard = (function() {

    var node_js =       typeof process === 'object'
                    &&  process.versions 
                    &&  process.versions.node;

    var crypton;
    if ( node_js ) {
        crypton = require( './KryptoHash.js' );
    } else {
        crypton = krypto;
    }

    var generatePassword = function ( param ) {

        if  (
                    ! param.key
                ||  ! param.service
                ||  ! param.password_length
            ) 
        {
            return;
        }

        var saltPhrase  = app_config.salt_phrase || "";
        var saltHash    = CryptoJS.SHA3( saltPhrase );
        var password    = CryptoJS.SHA3( param.key );
        var service     = CryptoJS.SHA3( param.service );

        var rolledPassword = rollTheChars   ( 
                                            saltHash.toString( CryptoJS.enc.Base64 ), 
                                            password.toString( CryptoJS.enc.Base64 ) 
                                        );

        var genPass = rollTheChars  (
                                        rolledPassword,
                                        service.toString( CryptoJS.enc.Base64 ) 
                                    );
        var pass = CryptoJS.PBKDF2  (
                                        genPass,
                                        rolledPassword,
                                        { 
                                            keySize: 512/32, 
                                            iterations: param.password_length
                                        }
                                    );
        
        return pass.toString( CryptoJS.enc.Base64 ).substr( 0, param.password_length );
    }

    
    var generateVpnPassword = function () {

        var key = new Date();
        key.setSeconds( 0 );
        key.setMilliseconds( 0 );

        var counter = 0;
        var iteration_counter = key.getHours();
        var pwd = crypton.shake_256( key.valueOf().toString() , 2048 );
        
        while ( counter < iteration_counter ) {
            pwd = crypton.shake_256( pwd, 2048 );
            counter++;
        }
        
        return pwd;
    }

    function rollTheChars( str1, str2) {

        var longStr;
        var shortStr;
        var rolledStr = "";

        if ( str1.length >= str2.length ) {
            longStr = str1;
            shortStr = str2;
        } else {
            longStr = str2;
            shortStr = str1;
        }

        for ( var i=0; i < shortStr.length; i++) {
            rolledStr += shortStr.charAt(i) + longStr.charAt(i);
        }

        return rolledStr + longStr.substr( shortStr.length );
    }

    var methods = {
        generate_pwd:        generatePassword, 
        generate_vpn_pwd:    generateVpnPassword 
    };

    if ( node_js ){
        module.exports = methods;
    } else {
        return methods;
    }
}() );
