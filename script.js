$(function () {
    var data = [
        {
            label: 'Mike Edward',
            value: 'mike',
            //img: 'images/amin.jpg',
            info: 'mike@somewhere.com'
        },

        {
            label: 'Edward King',
            value: 'edward',
            img: 'images/kevin.png',
            info: 'edward@somewhere.com'
        },

        {
            label: 'Alex Jones',
            value: 'alex',
            img: 'images/numan.jpg',
            info: 'alex@somewhere.com'
        },

        {
            label: 'John Michaels',
            value: 'john',
            img: 'images/amin.jpg'
            //info: 'john@somewhere.com'
        },

        {
            label: 'Peter Griffin',
            value: 'peter',
            img: 'images/kevin.png',
            info: 'peter@somewhere.com'
        },

        {
            label: 'Stewart The Third',
            value: 'stewart',
            img: 'images/numan.jpg',
            info: 'stewart@somewhere.com'
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
