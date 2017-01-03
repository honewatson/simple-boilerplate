
db = require "lapis.db"
import assert_error from require "lapis.application"
import assert_valid from require "lapis.validate"
import build_url from require "lapis.util"

config = require("lapis.config").get!

date = require "date"

not_found = { status: 404, render: "not_found" }

require_login = (fn) ->
  =>
    if @current_user
      fn @
    else
      redirect_to: @url_for"user_login"

require_admin = (fn) ->
  =>
    if @current_user and @current_user\is_admin!
      fn @
    else
      redirect_to: @url_for"index"

assert_timezone = (tz) ->
  assert_error tz, "missing timezone"
  assert_error type(tz) == "string", "missing timezone"
  res = unpack db.select "* from pg_timezone_names where name = ?", tz
  assert_error res, "invalid timezone: #{tz}"

assert_page = =>
  assert_valid @params, {
    {"page", optional: true, is_integer: true}
  }

  @page = math.max 1, tonumber(@params.page) or 1
  @page

login_and_return_url = (url=ngx.var.request_uri) =>
  import encode_query_string from require "lapis.util"
  @url_for("user_login") .. "?" .. encode_query_string {
    return_to: @build_url url
  }


ensure_https = (fn) ->
  =>
    scheme = @req.headers['x-original-scheme']
    if scheme == "http" and config.enable_https
      url_opts = {k,v for k,v in pairs @req.parsed_url}
      url_opts.scheme = "https"
      url_opts.port = nil

      return status: 301, redirect_to: build_url url_opts

    fn @

{ :not_found, :require_login, :require_admin, :assert_timezone,
  :login_and_return_url, :assert_page,
  :ensure_https }
