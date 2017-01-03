
lapis = require "lapis"
db = require "lapis.db"

import
  respond_to, capture_errors, assert_error, capture_errors_json, json_params
  from require "lapis.application"

import assert_valid from require "lapis.validate"
import trim_filter, slugify from require "lapis.util"
import Users from require "models"
import not_found, require_login, assert_page, ensure_https from require "helpers.app"
import assert_csrf, generate_csrf from require "helpers.csrf"
csrf = require "lapis.csrf"
import Model from require "lapis.db.model"
session = require "lapis.session"

token_request = capture_errors_json json_params =>
  generate_csrf @
  if @current_user.username
    return json: {
        message: "User already logged in.", 
        user: @current_user.username,
        csrf_token: @csrf_token,
        group: @current_user.group
    }
  else
    return json: { csrf_token:@csrf_token, message: "success", group: 'Public' }


find_user = =>
  @user = if @params.id
    assert_valid @params, {
      {"id", is_integer: true}
    }
    Users\find @params.id
  elseif @params.slug
    Users\find slug: slugify @params.slug

  assert_error @user, "invalid user"

class UsersApplication extends lapis.Application
  [user_profile: "/api/profile/:slug"]: capture_errors_json json_params {
    on_error: => not_found
    =>
      find_user @
      assert_page @
      @user_profile = @user\get_user_profile!
      json: user: @user, user_profile: @user_profile
  }

  [user_register: "/api/user/register.json"]: respond_to {
    GET: token_request

    POST: capture_errors_json json_params =>
      assert_csrf @
      trim_filter @params

      assert_valid @params, {
        { "username", exists: true, min_length: 2, max_length: 25 }
        { "password", exists: true, min_length: 2 }
        { "password_repeat", equals: @params.password }
        { "email", exists: true, min_length: 3 }
        { "accept_terms", equals: "yes", "You must accept the Terms of Service" }
      }

      assert_error @params.email\match(".@."), "invalid email address"

      group_id = 1
      count = Users\count!
      if count == 0
        group_id = 3

      user = assert_error Users\create {
        username: @params.username,
        group_id: group_id,
        email: @params.email
        password: @params.password
      }

      user\write_session @

      json: {message: "success"}
  }

  [user_login: "/api/user/login.json"]: respond_to {

    GET: token_request
    POST: capture_errors_json json_params =>
      assert_csrf @
      assert_valid @params, {
        { "username", exists: true }
        { "password", exists: true }
      }

      user = assert_error Users\login @params.username, @params.password
      user\write_session @

      json: {message: "success"}
  }

  [user_logout: "/api/user/logout.json"]: =>
    @session.user = false
    session.write_session @
    @session.flash = "You are logged out"
    json: {message: "success"}

  [user_settings: "/api/user/settings"]: require_login respond_to {
    before: =>
      @user = @current_user
      @user_profile = @user\get_user_profile!

    GET: token_request

    POST: capture_errors_json =>
      assert_csrf @
      assert_valid @params, {
        {"user", type: "table"}
        {"user_profile", type: "table"}
      }

      user_update = @params.user
      trim_filter user_update, {"display_name"}

      assert_valid user_update, {
        {"display_name", optional: true, max_length: 120}
      }

      user_update.display_name or= db.NULL
      @user\update user_update

      profile_update = @params.user_profile
      trim_filter profile_update, {"website", "twitter", "bio"}, db.NULL

      assert_valid profile_update, {
        {"bio", optional: true, max_length: 1024*1024}
      }

      @user\get_user_profile!\update profile_update

      redirect_to: @url_for "user_settings"
  }

  [user_forgot_password: "/api/user/forgot-password.json"]: respond_to {

    GET: token_request

    POST: capture_errors_json json_params =>
      assert_csrf @
      
      if @params.token and "string" == type @params.token
        id, token = @params.token\match "^(%d+)-(.*)"
        if id
          import UserProfiles from require "models"
          @profile = UserProfiles\find {
            user_id: id
            password_reset_token: token
          }

      if @profile
        @user = @profile\get_user!

      if @profile
        assert_valid @params, {
          { "password", exists: true, min_length: 2 }
          { "password_repeat", equals: @params.password }
        }
        @user\set_password @params.password, @
        @profile\update { password_reset_token: db.NULL }
        @session.flash = "Your password has been updated"
        @user\write_session @
        json: {message: "success"}
      else
        assert_valid @params, {
          { "email", exists: true, min_length: 3 }
        }

        user = assert_error Users\find({
          [db.raw("lower(email)")]: @params.email\lower!
        }), "don't know anyone with that email"

        token = user\generate_password_reset!

        reset_url = @build_url @url_for "user_forgot_password", nil, { :token }
        mailer = require "emails.password_reset"
        mailer\send @, user.email, { :reset_url, :user }
        @session.flash = "Password reset email has been sent"
        json: {message: "success"}
  }

