$(function () {
    $(document).ready(function() {
        setTimeout(function(){
            conf = {
                hidden: '#hidden_inputbox',
                source: [{
                        label: 'Lisa Stewart',
                        value: 'lisa',
                        //img: 'http://www.gravatar.com/avatar/',
                        info: 'lisa@somewhere.com'
                    },

                    {
                        label: 'Mike Johnson',
                        value: 'mike',
                        img: 'http://www.gravatar.com/avatar/',
                        info: 'mike@somewhere.com'
                    },

                    {
                        label: 'Steve Friedman',
                        value: 'steve',
                        img: 'http://www.gravatar.com/avatar/',
                        info: 'steve@somewhere.com'
                    }],
                trigger: "@",
                minLength: 2,
                maxLength: 25,
                width: 300
            }
            $('#inputbox').inlinedAutocomplete(conf);
            $('#editable').inlinedAutocomplete(conf);
            $('#myiframe').contents().find('body#content').inlinedAutocomplete(conf);
            // we don't want the menu be inside the iframe
            $('#myiframe').contents().find('body#content').inlinedAutocomplete('option', 'appendTo', '#iframecontainer');
            // we need to set the the window object of the window object of the iframe
            // otherwise we could not detect the cursor position
            $('#myiframe').contents().find('body#content').inlinedAutocomplete('option', 'window', $('#myiframe')[0].contentWindow);
            // TODO: put this inside inlinedAutocomplete
            $('#myiframe').contents().find('body#content').inlinedAutocomplete('option', 'offsetLeft', $('#myiframe').offset().left);
            $('#myiframe').contents().find('body#content').inlinedAutocomplete('option', 'offsetTop', $('#myiframe').offset().top);
        }, 1000);
    });
});
