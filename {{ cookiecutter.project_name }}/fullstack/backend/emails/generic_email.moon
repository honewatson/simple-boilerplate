config = require("lapis.config").get!

class GenericEmail extends require "emails.email"
  @needs: {"email_subject", "email_body"}

  subject: => "#{assert @email_subject, "missing subject for email"} - #{config.site_name}"

  body: =>
    h1 @email_subject
    p -> raw "Hello %recipient.name_for_display%,"
    div class: "user_formatted", ->
      raw (assert @email_body, "missing body for email")

