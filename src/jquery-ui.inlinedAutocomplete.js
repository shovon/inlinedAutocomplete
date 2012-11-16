/********************************************************************************
/*
 * triggeredAutocomplete (jQuery UI autocomplete widget)
 * 2012 by Hawkee.com (hawkee@gmail.com)
 *
 * Version 1.4.3
 * 
 * Requires jQuery 1.7 and jQuery UI 1.8
 *
 * Dual licensed under MIT or GPLv2 licenses
 *   http://en.wikipedia.org/wiki/MIT_License
 *   http://en.wikipedia.org/wiki/GNU_General_Public_License
 *
*/

;(function ( $, window, document, undefined ) {
	$.widget("ui.inlinedAutocomplete", $.extend(true, {}, $.ui.autocomplete.prototype, {
		
		lastPos: null,

		options: {
			trigger: "@",
			allowDuplicates: true,
			width: 300,
			offsetLeft: 0,
			offsetTop: 0,
			autoFocus: true,
			delay: 10,
			helpMessage: "Please type a name."
		},

	    __create: function() {
	        var self = this,
	            doc = this.element[ 0 ].ownerDocument,
	            suppressKeyPress;
	        this.isMultiLine = this.element.is( "textarea" );

	        this.element
	            .addClass( "ui-autocomplete-input" )
	            .attr( "autocomplete", "off" )
	            // TODO verify these actually work as intended
	            .attr({
	                role: "textbox",
	                "aria-autocomplete": "list",
	                "aria-haspopup": "true"
	            })
	            .bind( "keydown.autocomplete", function( event ) {
	                if ( self.options.disabled || self.element.propAttr( "readOnly" ) ) {
	                    return;
	                }

	                suppressKeyPress = false;
	                var keyCode = $.ui.keyCode;
	                switch( event.keyCode ) {
	                case keyCode.PAGE_UP:
	                    self._move( "previousPage", event );
	                    break;
	                case keyCode.PAGE_DOWN:
	                    self._move( "nextPage", event );
	                    break;
	                case keyCode.UP:
	                    self._keyEvent( "previous", event );
	                    break;
	                case keyCode.DOWN:
	                    self._keyEvent( "next", event );
	                    break;
	                case keyCode.ENTER:
	                case keyCode.NUMPAD_ENTER:
	                    // when menu is open and has focus
	                    if ( self.menu.active ) {
	                        // #6055 - Opera still allows the keypress to occur
	                        // which causes forms to submit
	                        suppressKeyPress = true;
	                        event.preventDefault();
	                    }
	                    //passthrough - ENTER and TAB both select the current element
	                case keyCode.TAB:
	                    if ( !self.menu.active ) {
	                        return;
	                    }
	                    self.menu.select( event );
	                    break;
	                case keyCode.ESCAPE:
	                    self.close( event );
	                    break;
	                default:
	                    // keypress is triggered before the input value is changed
	                    clearTimeout( self.searching );
	                    self.searching = setTimeout(function() {
	                        // only search if the value has changed
	                        if ( self.term != self.element.val() ) {
	                            self.selectedItem = null;
	                            self.search( null, event );
	                        }
	                    }, self.options.delay );
	                    break;
	                }
	            })
	            .bind( "keypress.autocomplete", function( event ) {
	                if ( suppressKeyPress ) {
	                    suppressKeyPress = false;
	                    event.preventDefault();
	                }
	            })
	            .bind( "focus.autocomplete", function() {
	                if ( self.options.disabled ) {
	                    return;
	                }

	                self.selectedItem = null;
	                self.previous = self.element.val();
	            })
	            .bind( "blur.autocomplete", function( event ) {
	                if ( self.options.disabled ) {
	                    return;
	                }

	                clearTimeout( self.searching );
	                // clicks on the menu (or a button to trigger a search) will cause a blur event
	                self.closing = setTimeout(function() {
	                    self.close( event );
	                    self._change( event );
	                }, 150 );
	            });
	        this._initSource();
	        this.menu = $( "<ul></ul>" )
	            .addClass( "ui-autocomplete" )
	            .appendTo( $( this.options.appendTo || "body", doc )[0] )
	            // prevent the close-on-blur in case of a "slow" click on the menu (long mousedown)
	            .mousedown(function( event ) {
	                // clicking on the scrollbar causes focus to shift to the body
	                // but we can't detect a mouseup or a click immediately afterward
	                // so we have to track the next mousedown and close the menu if
	                // the user clicks somewhere outside of the autocomplete
	                var menuElement = self.menu.element[ 0 ];
	                if ( !$( event.target ).closest( ".ui-menu-item" ).length ) {
	                    setTimeout(function() {
	                        $( document ).one( 'mousedown', function( event ) {
	                            if ( event.target !== self.element[ 0 ] &&
	                                event.target !== menuElement &&
	                                !$.ui.contains( menuElement, event.target ) ) {
	                                self.close();
	                            }
	                        });
	                    }, 1 );
	                }

	                // use another timeout to make sure the blur-event-handler on the input was already triggered
	                setTimeout(function() {
	                    clearTimeout( self.closing );
	                }, 13);
	            })
	            .menu({
	                focus: function( event, ui ) {
	                    var item = ui.item.data( "item.autocomplete" );
	                    if ( false !== self._trigger( "focus", event, { item: item } ) ) {
	                        // use value to match what will end up in the input, if it was a key event
	                        if ( /^key/.test(event.originalEvent.type) ) {
	                            self.element.val( item.value );
	                        }
	                    }
	                },
	                selected: function( event, ui ) {
	                    var item = ui.item.data( "item.autocomplete" ),
	                        previous = self.previous;

	                    // only trigger when focus was lost (click on menu)
	                    if ( self.element[0] !== doc.activeElement ) {
	                        self.element.focus();
	                        self.previous = previous;
	                        // #6109 - IE triggers two focus events and the second
	                        // is asynchronous, so we need to reset the previous
	                        // term synchronously and asynchronously :-(
	                        setTimeout(function() {
	                            self.previous = previous;
	                            self.selectedItem = item;
	                        }, 1);
	                    }

	                    if ( false !== self._trigger( "select", event, { item: item } ) ) {
	                        self.element.val( item.value );
	                    }
	                    // reset the term after the select event
	                    // this allows custom select handling to work properly
	                    self.term = self.element.val();

	                    self.close( event );
	                    self.selectedItem = item;
	                },
	                blur: function( event, ui ) {
	                    // don't set the value of the text field if it's already correct
	                    // this prevents moving the cursor unnecessarily
	                    if ( self.menu.element.is(":visible") &&
	                        ( self.element.val() !== self.term ) ) {
	                        self.element.val( self.term );
	                    }
	                }
	            })
	            .zIndex( this.element.zIndex() + 1 )
	            // workaround for jQuery bug #5781 http://dev.jquery.com/ticket/5781
	            .css({ top: 0, left: 0 })
	            .hide()
	            .data( "menu" );
	        if ( $.fn.bgiframe ) {
	             this.menu.element.bgiframe();
	        }
	        // turning off autocomplete prevents the browser from remembering the
	        // value when navigating through history, so we re-enable autocomplete
	        // if the page is unloaded before the widget is destroyed. #7790
	        self.beforeunloadHandler = function() {
	            self.element.removeAttr( "autocomplete" );
	        };
	        $( window ).bind( "beforeunload", self.beforeunloadHandler );
	    },

		_create:function() {
			var self = this;
			this.id_map = new Object();
			this.stopIndex = -1;
			this.stopLength = -1;
			this.contents = '';
			this.cursorPos = 0;

			// Check for the id_map as an attribute.  This is for editing.

			var id_map_string = this.element.attr('id_map');
			if(id_map_string) this.id_map = jQuery.parseJSON(id_map_string);

			//this.ac = $.ui.autocomplete.prototype;
			//this.ac._create.apply(this, arguments);

			this.__create();
			
			// Add our custom class here.
			this.menu.element.addClass('inlined-autocomplete');

			this.updateHidden();

			// Select function defined via options.
			this.options.select = function(event, ui) {
				var contents = self.contents;
				var cursorPos = self.cursorPos;

				// Save everything following the cursor (in case they went back to add a mention)
				// Separate everything before the cursor
				// Remove the trigger and search
				// Rebuild: start + result + end

				var end = contents.substring(cursorPos, contents.length);
				var start = contents.substring(0, cursorPos);
				start = start.substring(0, start.lastIndexOf(self.options.trigger));

				this.value = start + self.options.trigger+ui.item.value+' ' + end;

				// Create an id map so we can create a hidden version of this string with id's instead of labels.

				self.id_map[ui.item.label] = ui.item.value;
				self.updateHidden();

				return false;
			};

			// Don't change the input as you browse the results.
			this.options.focus = function(event, ui) { return false; }
			this.menu.options.blur = function(event, ui) { return false; }

			// Any changes made need to update the hidden field.
			this.element.focus(function() { self.updateHidden(); });
			this.element.change(function() { self.updateHidden(); });
		},

		// If there is an 'img' then show it beside the label.

		_renderItem:  function (ul, item) {
			var listItem = '',
			    content  = "<p><strong>" + item.label + "</strong></p>";

			if (typeof item.info != 'undefined' && item.info != '') {
				content += "<p><em>" + item.info + "</em></p>";
			}

			if (typeof item.img != 'undefined' && item.img != '') {
				listItem = 
					"<a>" +
						"<span class='columns'>" +
							"<span class='image'>" +
								"<img alt='Avatar' src='" + item.img + "'>"+
							"</span>" +
							"<span class='content'>" +
								content +
							"</span>" +
							"<span style='clear:both;padding: 0; margin: 0'></span>" +
						"</span>" +
					"</a>";
			} else {
				listItem =
					"<a class='no-image'>" +
						"<span>" +
							"<span class='content'>" +
								content +
							"</span>" +
						"</span>" +
					"</a>"
			}

			return $( "<li></li>" )
				.data( "item.autocomplete", item )
				.append(listItem).appendTo(ul);
		},

		// This stops the input box from being cleared when traversing the menu.

		_move: function( direction, event ) {
			if ( !this.menu.element.is(":visible") ) {
				this.search( null, event );
				return;
			}
			if ( this.menu.first() && /^previous/.test(direction) ||
					this.menu.last() && /^next/.test(direction) ) {
				this.menu.deactivate();
				return;
			}
			this.menu[ direction ]( event );
		},

		// TODO: For both _suggest and _renderHelp, find a function to delegate
		//     the heavy lifting to.

		_showMenu: function (fn) {
			var pos;
	        // This check is to prevent the menu to move as the user types. Just
	        // Looks nicer.
			if (this.menu.element.is(':visible')) {
				pos = {
					left: this.menu.element.css('left'),
					top: this.menu.element.css('top')
				}
			}
			var ul = this.menu.element
				.empty()
				.zIndex( this.element.zIndex() + 1 );
			
			fn.call(this, ul);

			// TODO refresh should check if the active item is still in the dom, removing the need for a manual deactivate
			this.menu.deactivate();
			this.menu.refresh();


			pos = pos || this.element.caretpixelpos();
			var offset = this.element.offset();

			// size and position menu
			ul.show();
			this._resizeMenu();

			ul.css({
				left: pos.left + this.options.offsetLeft,
				top : pos.top + this.options.offsetTop
			});

			if ( this.options.autoFocus ) {
				this.menu.next( new $.Event("mouseover") );
			}
		},

		_renderHelp: function () {
			this._showMenu(function (ul) {
		        $('<li></li>')
					.append(
						$('<span></span>')
							.addClass('help-message')
							.text(this.options.helpMessage)
					).appendTo(ul);
			});
		},

		search: function(value, event) {

			var contents = this.element.val();
			var cursorPos = this.getCursor();
			this.contents = contents;
			this.cursorPos = cursorPos;

			if (contents.indexOf(this.options.trigger) >= 0) {

				// Get the characters following the trigger and before the cursor position.
				// Get the contents up to the cursortPos first then get the lastIndexOf the trigger to find the search term.

				contents = contents.substring(0, cursorPos);
				var term = contents.substring(contents.lastIndexOf(this.options.trigger) + this.options.trigger.length, contents.length);

				// Only query the server if we have a term and we haven't received a null response.
				// First check the current query to see if it already returned a null response.

				if (this.stopIndex == contents.lastIndexOf(this.options.trigger) &&
					term.length > this.stopLength) {
					term = '';
				}

				// TODO: Maybe allow the user to decide whether to ignore
				//     triggers on whitespaces?
				if (contents.lastIndexOf(this.options.trigger) > 0 &&
					!/\s/.test(contents[contents.lastIndexOf(this.options.trigger) - 1])) {
					// If we are here, this means that there was no white space
					// before the trigger.
					this.close();
				} else if (term.length > 0) {
					if (/\s/.test(term)) {
						this.close()
					} else {
						this.updateHidden();
						return this._search(term);
					}
				} else {
					this._renderHelp();
				}
			} else {
				// Call this whenever the user deletes the trigger.
				this.close();
			}	
		},

		close: function( event ) {
	        clearTimeout( this.closing );
	        if ( this.menu.element.is(":visible") ) {
	            this.menu.element.hide();
	            this.menu.deactivate();
	            this._trigger( "close", event );
	        }
	    },

		_suggest: function ( items ) {
			this._showMenu(function (ul) {
				this._renderMenu( ul, items );
			});
		},

		_resizeMenu: function() {
	        var ul = this.menu.element;
	        ul.outerWidth( Math.max(
	            // Firefox wraps long text (possibly a rounding bug)
	            // so we add 1px to avoid the wrapping (#7513)
	            ul.width( "" ).outerWidth() + 1,
	            this.options.width
	        ) );
	    },

		// Slightly altered the default ajax call to stop querying after the search produced no results.
		// This is to prevent unnecessary querying.

		_initSource: function() {
			var self = this, array, url;
			if ( $.isArray(this.options.source) ) {
				array = this.options.source;
				this.source = function( request, response ) {
					response( $.ui.autocomplete.filter(array, request.term) );
				};
			} else if ( typeof this.options.source === "string" ) {
				url = this.options.source;
				this.source = function( request, response ) {
					if ( self.xhr ) {
						self.xhr.abort();
					}
					self.xhr = $.ajax({
						url: url,
						data: request,
						dataType: 'json',
						success: function(data) {
							if(data != null) {
								response($.map(data, function(item) {
									if (typeof item === "string") {
										label = item;
									}
									else {
										label = item.label;
									}
									// If the item has already been selected don't re-include it.
									if(!self.id_map[label] || self.options.allowDuplicates) {
										return item
									}
								}));
								self.stopLength = -1;
								self.stopIndex = -1;
							}
							else {
								// No results, record length of string and stop querying unless the length decreases
								self.stopLength = request.term.length;
								self.stopIndex = self.contents.lastIndexOf(self.options.trigger);
								self.close();
							}
						}
					});
				};
			} else {
				this.source = this.options.source;
			}
		},

		destroy: function() {
			$.Widget.prototype.destroy.call(this);
		},

		// Gets the position of the cursor in the input box.

		getCursor: function() {
			var i = this.element[0];

			if(i.selectionStart) {
				return i.selectionStart;
			}
			else if(i.ownerDocument.selection) {
				var range = i.ownerDocument.selection.createRange();
				if(!range) return 0;
				var textrange = i.createTextRange();
				var textrange2 = textrange.duplicate();

				textrange.moveToBookmark(range.getBookmark());
				textrange2.setEndPoint('EndToStart', textrange);
				return textrange2.text.length;
			}
		},

		// Populates the hidden field with the contents of the entry box but with 
		// ID's instead of usernames.  Better for storage.

		updateHidden: function() {
			var trigger = this.options.trigger;

			var contents = this.element.val();
			for(var key in this.id_map) {
				var find = trigger+key;
				find = find.replace(/[^a-zA-Z 0-9@]+/g,'\\$&');
				var regex = new RegExp(find, "g");
				var old_contents = contents;
				contents = contents.replace(regex, trigger+'['+this.id_map[key]+']');
				if(old_contents == contents) delete this.id_map[key];
			}
			$(this.options.hidden).val(contents);
		}

	}));	
})( jQuery, window , document );
