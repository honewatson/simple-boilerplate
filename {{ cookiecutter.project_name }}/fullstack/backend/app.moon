lapis = require "lapis"
import json_params, capture_errors, capture_errors_json, respond_to from require "lapis.application"
import Model from require "lapis.db.model"
import assert_valid from require "lapis.validate"
import slugify, to_json, from_json from require "lapis.util"
import Widget from require "lapis.html"
csrf = require "lapis.csrf"
import Users from require "models"
user_model = require "applications.user"
config = require("lapis.config").get!
db = require "lapis.db"

class extends lapis.Application
  layout: require "views.layout"
  @before_filter =>
    current_user = Users\read_session @
    if current_user
      current_user.group = user_model.group_map[current_user.group_id]
    else
      current_user = group: 'Public'
    @current_user = current_user
  @include "applications.content"
  @include "applications.users"