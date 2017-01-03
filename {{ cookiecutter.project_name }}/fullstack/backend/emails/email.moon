import Widget from require "lapis.html"
config = require("lapis.config").get!

class Email extends Widget
  @render: (r, params) =>
    i = @(params)
    i\include_helper r
    i\subject!, i\render_to_string!, html: true

  @send: (r, recipient, widget_opts, email_opts) =>
    import send_email from require "helpers.email"
    email_opts or= html: true
    subject, body = @render r, widget_opts
    send_email recipient, subject, body, email_opts

  url_for: (...) =>
    url_for = @_find_helper "url_for"
    assert url_for, "failed to find url_for helper, did you pass in req?"
    @build_url url_for nil, ...

  subject: => config.site_name

  content: =>
    bg_color = "#e8e8e8"
    body style: "background-color: #{bg_color}", ->
      element "table", style: "background-color: #{bg_color}; width: 100%", cellspacing: "0", cellpadding: "0", ->
        tr ->
          td style:"text-align: center; padding-top: 30px;", ->
            a href: config.domain, ->
              img src: "#{config.domain}/static/images/favicon.png", border: "0"
        tr ->
          td ->
            element "table", style: @container_style!, ->
              tr ->
                td style: "padding: 20px;", ->
                  div -> @body!
                  @hr!
                  @footer!

  body: => error "fill me out"

  container_style: =>
    "background-color: white; max-width: 600px; margin: 10px auto 40px auto;border-radius: 2px; border: 1px solid #dadada;"

  footer: =>
    h4 style: "margin-bottom: 0px", ->
      text "powered by "
      a href: config.domain, config.site_name

    if @show_tag_unsubscribe
      div style: "color: #666666; font-size: smaller; margin-top: 15px;", ->
        text "Don't want to receive emails like this? "
        a href: "%tag_unsubscribe_url%", style: "color: #666", "Unsubscribe"

  hr: =>
    hr style: "border: 0; height: 1px; background: #dadada"

  big_button: (text, url) =>
    p style: "text-align: center;", ->
      a {
        href: url
        style: "background-color: #34a0f2; border-radius: 8px; font-size: larger; color: white; text-decoration: none; font-weight: bold; padding: 8px 20px; display: inline-block;"
        text
      }


