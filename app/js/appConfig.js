// this js file creates a global Object,
// which stores the app config data
//

var app_config = {
   
    // select options
    password_category_list:     [
                                    {text: 'short',      value: 12},
                                    {text: 'middle',     value: 25},
                                    {text: 'long',       value: 50},
                                    {                             },
                                    {text: 'wlan psk',   value: 63},
                                ],

    // password properties
    get_default_pwd_length:     function() { return this.password_category_list[1].value; },
    min_password_length:         5,
    min_secure_password_length: 10,

    // krypto properties
    salt_phrase:    'here comes the salt, huhu year',

}
