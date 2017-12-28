// indexedDB - locale Web DB

var appDB = function() {
    "use strict";

    const db_name = "passGuardDB";

    var db;

    if (!window.indexedDB){
        window.alert("Your browser doesn't support a stable version of IndexedDB!");
        return;
    }

    var create_db = function() {
        var db_request = indexedDB.open(db_name, 4);
        
        db_request.onsuccess = function(event) {
            db = this.result;
            console.log('open DB done');
        }

        db_request.onerror = function(event) {
            // prevent InvalidStateError in FF
            if (db_request.error && db_request.error.name === 'InvalidStateError') {
                event.preventDefault();
            } else {
                alert("You didn't allow the passGuard web app to use IndexedDB!");
            }
        };

        db_request.onupgradeneeded = function(event) {

            db.onerror = function(event) {
                alert("Database error: " + event.target.errorCode);
            }
            
            var objectStore = db.createObjectStore("service", { autoIncrement: true });
            objectStore.createIndex("name", "name", { unique: true });

            objectStore.transaction.oncomplete = function(event) {

                // init Database
                var dataStore = db.transaction( "service", "readwrite" ).objectStore("service" );
                dataStore.add({ name: "Car-Net",        pwd_length: 25 });
                dataStore.add({ name: "openvpn-ipp",    pwd_length: 25 });
                dataStore.add({ name: "Apple-ID",       pwd_length: 25 });
                dataStore.add({ name: "Debeka",         pwd_length: 25 });
                dataStore.add({ name: "hacking-lab",    pwd_length: 25 });
            };
        };

        return;
    }

    var add_rs = function( recordset ) {
        var transaction = db.transaction(["service"], "readwrite");

        transaction.oncomplete = function(event) {
            //
        };

        transaction.onerror = function(event) {
            //
        };
        
        // Testdata
        var objectStore = transaction.objectStore("service");
        objectStore.add({ name: "Test", pwd_length: 25});

        return;
    }

    var get_rs = function( service_substring ) {
        var transaction = db.transaction(["service"], "readonly");
        var objectStore = transaction("service").objectStore("service");

        objectStore.openCursor().onsuccess = function(event) {
            var cursor = event.target.result;
            if ( 
                        cursor
                    &&  /^Car/.test(cursor.name)
                )
            {
                alert('gefunden!');
                cursor.continue();
            }
        }

        transaction.oncomplete = function(event) {
            //
        };

        transaction.onerror = function(event) {
            //
        };
        return;
    }
    
    var delete_rs = function( recordset ) {
        
        return;
    }

    return  {
                open:           create_db,
                add_item:       add_rs,
                get_item:       get_rs,
                delete_item:    delete_rs,
            }

}();
