
color-aliases.css: .dashdash.css
	cat .dashdash.css | sed 's/dashdash-/--/' > color-aliases.css

.dashdash.css: color-aliases.scss
	node_modules/.bin/sass "$<" > "$@"

clean:
	rm .dashdash.css color-aliases.css

