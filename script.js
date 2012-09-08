$(function () {
    var data = [
        {
            label: 'Lisa Stewart',
            value: 'lisa',
            //img: 'images/lisa.jpg',
            info: 'lisa@somewhere.com'
        },

        {
            label: 'Mike Johnson',
            value: 'mike',
            img: 'images/mike.jpg',
            info: 'mike@somewhere.com'
        },

        {
            label: 'Steve Friedman',
            value: 'steve',
            img: 'images/steve.jpg',
            info: 'steve@somewhere.com'
        },

        {
            label: 'Tamara Lu',
            value: 'tamara',
            img: 'images/lisa.jpg'
            //info: 'tamara@somewhere.com'
        },

        {
            label: 'Peter McMahon',
            value: 'peter',
            img: 'images/mike.jpg',
            info: 'mike@somewhere.com'
        },
        
        {
            label: 'Suzanne Karter',
            value: 'jeneva',
            img: 'images/lisa.jpg',
            info: 'suzanne@somewhere.com'
        }
    ];

    var autoComplete = $('#auto-complete');
    autoComplete.autosize();
    autoComplete.inlinedAutocomplete({
        hidden : '#hidden_auto-complete',
        source : data,
        trigger: '@',
        width: 240,
        offsetLeft: 6,
        offsetTop: 10
    });
});
