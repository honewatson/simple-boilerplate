config = require("lapis.config").get!

class PasswordReset extends require "emails.email"
  @needs: {"reset_url"}

  subject: =>
    "Reset #{config.site_name} password"

  body: =>
    h1 "Reset your password"
    p ->
      text "Someone attempted to reset the password for your account "
      strong @user.username
      text " on #{config.site_name}. If that person was you click the link below to
      update your password. If it wasn't you then you don't have to do
      anything."

    p ->
      a href: @reset_url, @reset_url


