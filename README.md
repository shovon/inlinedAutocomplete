jQuery UI Inlined Autocomplete
====================

This widget lets you search for users to @mention in your posts.  It works very much like Facebook and Google+ in that it supports users with spaces in their name.  It writes to a hidden field with the user ID's formatted in this way: @[12345] while showing @username in the input box.  You can save the encoded string for easier parsing at display time.

This is a fork of [@**Hawkers**](https://github.com/Hawkers), [Triggered Autocomplete](https://github.com/Hawkers/triggeredAutocomplete) plugin.

Only difference is, the autocomplete is inlined with text, instead of at the bottom of the text container.

## How to Use

```
$('#inputbox').inlinedAutocomplete({
	hidden: '#hidden_inputbox,
	source: "/search.php",
	trigger: "@" 
});
```

You can use a predefined array or json as a source.  Example json result:

```
[{"value":"1234","label":"Beef"},{"value":"98765","label":"Chicken"}]
```

To use the hidden field without an ajax call you need to pass an associative array:

```
$('#inputbox').inlinedAutocomplete({
	hidden: '#hidden_inputbox,
	source: new Array({ "value": "1234", "label": 'Geech'}, {"value": "5312", "label": "Marf"})
});
```

If you want editable posts, you need to pass an id_map as an attr tag of the input box.  This is also json encoded and is simply an associative array of the included user_id => username pairs in the existing post. This is so when you change the post the original @mentions are preserved in their @[12345] format.

## Developing/Testing

Be sure that you have [node.js](http://nodejs.org/) installed. 

And then, you'd also need a copy of CoffeeScript running. Just install it like so.

    # May require `sudo`
    $ npm install -g coffee-script

After that, be sure to call the following command to install the dependencies that will allow you to test the plugin.

    $ ./dependencies

And then, to run the test server, call the following command*.

    $ coffee server.coffee

You should now be able to navigate to `http://localhost:3000/test`* to see the plugin in action.

*If you have port 3000 occupied, you can also run the server on another port, by passing in your alternate port number like so `coffee server.coffee 4000`.