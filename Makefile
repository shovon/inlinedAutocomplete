all:
	mkdir -p bin
	cp src/jquery-ui.inlinedAutocomplete.js bin/jquery-ui.inlinedAutocomplete.js
	lessc src/jquery-ui.inlinedAutocomplete.less bin/jquery-ui.inlineAutocomplete.css

demo:
	rm -rf bin/demo
	mkdir -p bin
	cp -r test bin/demo
	cp -a src/. bin/demo
	rm -f bin/demo/jquery-ui.inlinedAutocomplete.css
	lessc bin/demo/jquery-ui.inlinedAutocomplete.less > bin/demo/jquery-ui.inlinedAutocomplete.css
	cake compile-ejs
	rm bin/demo/index.ejs

clean:
	@rm -rfv bin
	@rm -rfv src/jquery-ui.inlinedAutocomplete.css