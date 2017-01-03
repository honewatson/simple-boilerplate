config = require "lapis.config"

config "development", ->
  session_name "content_app"
  port "8181"
  secret "Zippety Doo Daa"
  domain "http://localhost/"
  site_name "Content App"
  postgres ->
    host "127.0.0.1"
    user ""
    password ""
    database "content_app"
    port "5435"
  mailgun ->
    api_url ""
    domain ""
    api_key ""
    default_sender ""
