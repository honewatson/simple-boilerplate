db = require "lapis.db"
import Model from require "lapis.db.model"

bcrypt = require "bcrypt"
import slugify from require "lapis.util"

date = require "date"

strip_non_ascii = do
  filter_chars = (c, ...) ->
    return unless c
    if c >= 32 and c <= 126
      c, filter_chars ...
    else
      filter_chars ...

  (str) ->
    string.char filter_chars str\byte 1, -1

-- Generated schema dump: (do not edit)
--
-- CREATE TABLE users (
--   id integer NOT NULL,
--   username character varying(255) NOT NULL,
--   encrypted_password character varying(255) NOT NULL,
--   email character varying(255) NOT NULL,
--   slug character varying(255) NOT NULL,
--   last_active timestamp without time zone,
--   display_name character varying(255),
--   avatar_url character varying(255),
--   created_at timestamp without time zone NOT NULL,
--   updated_at timestamp without time zone NOT NULL,
--   submissions_count integer DEFAULT 0 NOT NULL,
--   following_count integer DEFAULT 0 NOT NULL,
--   followers_count integer DEFAULT 0 NOT NULL,
--   admin boolean DEFAULT false NOT NULL,
--   streaks_count integer DEFAULT 0 NOT NULL,
--   likes_count integer DEFAULT 0 NOT NULL,
--   hidden_submissions_count integer DEFAULT 0 NOT NULL,
--   hidden_streaks_count integer DEFAULT 0 NOT NULL,
--   last_seen_feed_at timestamp without time zone,
--   last_timezone character varying(255)
-- );
-- ALTER TABLE ONLY users
--   ADD CONSTRAINT users_pkey PRIMARY KEY (id);
-- CREATE UNIQUE INDEX users_lower_email_idx ON users USING btree (lower((email)::text));
-- CREATE UNIQUE INDEX users_lower_username_idx ON users USING btree (lower((username)::text));
-- CREATE UNIQUE INDEX users_slug_idx ON users USING btree (slug);
-- CREATE INDEX users_username_idx ON users USING gin (username gin_trgm_ops);
--
class Users extends Model
  @timestamp: true

  @constraints: {
    slug: (value) =>
      if @check_unique_constraint "slug", value
        return "Username already taken"

    username: (value) =>
      if @check_unique_constraint { [db.raw"lower(username)"]: value }
        "Username already taken"

    email: (value) =>
      if @check_unique_constraint "email", value
        "Email already taken"
  }

  @login: (username, password) =>
    username = username\lower!

    user = Users\find { [db.raw("lower(username)")]: username }
    if user and user\check_password password
      user
    else
      nil, "Incorrect username or password"

  @create: (opts={}) =>
    assert opts.password, "missing password for user"

    opts.encrypted_password = bcrypt.digest opts.password, 5
    opts.password = nil
    stripped = strip_non_ascii(opts.username)
    return nil, "username must be ASCII only" unless stripped == opts.username

    opts.slug = slugify opts.username
    assert opts.slug != "", "slug is empty"

    Model.create @, opts

  @read_session: (r) =>
    if user_session = r.session.user
      if user_session.id
        user = @find user_session.id
        if user and user\salt! == user_session.key
          user

  get_user_profile: =>
    unless @user_profile
      import UserProfiles from require "models"
      @user_profile = UserProfiles\find(@id) or UserProfiles\create user_id: @id

    @user_profile
    
  set_password: (new_pass) =>
    @update encrypted_password: bcrypt.digest new_pass, 5

  write_session: (r) =>
    r.session.user = {
      id: @id
      key: @salt!
    }

  allowed_to_edit: (user) =>
    return false unless user
    return true if user\is_admin!
    return true if user.id == @id
    false

  generate_password_reset: =>
    profile = @get_user_profile!
    import generate_key from require "helpers.keys"

    token = generate_key 30
    profile\update password_reset_token: token

    "#{@id}-#{token}"

  check_password: (pass) =>
    bcrypt.verify pass, @encrypted_password

  salt: =>
    @encrypted_password\sub 1, 29

  name_for_display: =>
    @display_name or @username

  update_last_active: =>
    span = if @last_active
      date.diff(date(true), date(@last_active))\spandays!

    if not span or span > 1
      @update { last_active: db.format_date! }, timestamp: false

  url_params: =>
    "user_profile", slug: @slug

  admin_url_params: (r, ...) =>
    "admin.user", { id: @id }, ...

  is_admin: =>
    @admin

  gravatar: (size) =>
    url = "https://www.gravatar.com/avatar/#{ngx.md5 @email\lower!}?d=identicon"
    url = url .. "&s=#{size}" if size
    url
