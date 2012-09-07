all:
	mkdir -p bin
	cp src/jquery-ui.inlinedAutocomplete.js bin/jquery-ui.inlinedAutocomplete.js
	lessc src/jquery-ui.inlinedAutocomplete.less bin/jquery-ui.inlineAutocomplete.css

clean:
	@rm -rfv bin
	@rm -rfv src/jquery-ui.inlinedAutocomplete.css