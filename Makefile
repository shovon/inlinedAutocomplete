all:
	mkdir -p bin
	cp src/jquery-ui.triggeredAutocomplete-plus.js bin/jquery-ui.triggeredAutocomplete-plus.js
	lessc src/jquery-ui.triggeredAutocomplete-plus.less bin/jquery-ui.triggeredAutocomplete-plus.css

clean:
	@rm -rfv bin
	@rm -rfv src/jquery-ui.triggeredAutocomplete-plus.css