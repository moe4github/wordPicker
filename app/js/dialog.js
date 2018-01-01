var dialog = (function () {
    'use strict';

    var icon_map =  {
                        info:       'glyphicon glyphicon-lg glyphicon-info-sign primary',
                        warning:    'glyphicon glyphicon-warning-sign',
                        error:      'glyphicon glyphicon-remove-sign',
                    }

    var show_info = function ( param ) {
        
        var div_element = document.createElement('div');

        div_element.id = "infoDialog";
        div_element.classList.add("modal", "fade");
        div_element.setAttribute("tabindex", "-1");
        div_element.setAttribute("role", "dialog");

        div_element.innerHTML
            =   '<div class="modal-dialog" role="document">' +
                    '<div class="modal-content">' +
                        '<div class="modal-header">' +
                            '<button type="button" class="close" data-dismiss="modal" aria-label="Close">' +
                                '<span aria-hidden="true">&times;</span>' +
                            '</button>' +
                            '<h4 class="modal-title">' + 
                                param.title + 
                            '</h4>' +
                        '</div>' +
                        '<div class="modal-body">' +
                            '<p>' + param.text + '</p>' +
                        '</div>' +
                        '<div class="modal-footer">' +
                            '<button type="button" class="btn btn-default" data-dismiss="modal">Close</button>' +
                        '</div>' +
                    '</div>' +
                '</div>';
        
        document.body.appendChild( div_element );

        $('#infoDialog').modal('show');
        $('#infoDialog').on('hidden.bs.modal', function (e) {
                document.body.removeChild( document.getElementById('infoDialog') );
            }
        );

        return;
    };

    return  {
                show: show_info
            };
}());
