import Widget from require "lapis.html"

class Layout extends Widget
	head: =>
		meta charset: "UTF-8"
		meta name: "robots", content: "noindex" if @noindex

		link rel: "stylesheet", href: "https://cdnjs.cloudflare.com/ajax/libs/foundation/6.2.4/foundation.min.css"
		link rel: "stylesheet", href: "/static/main.css"
		title ->
		  if @title
			text "#{@title}"

	header: =>
		element "header"
	main: =>
		element "main"
	scripts: =>
		script src: "/static/index.js"
	content: =>
	  html_5 ->
		head ->
			@head!
		body ->
			@header!
			@main!
			@scripts!
