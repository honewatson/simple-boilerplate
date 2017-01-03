import create_index, create_table, types from require "lapis.db.schema"
db = require "lapis.db"

{
  [1]: =>
    create_table "content", {
      { "id", types.serial }
      { "title", types.varchar }
      { "content", types.varchar }
      "PRIMARY KEY (id)"
    }
    create_index "content", "title"

  [2]: =>
    create_table "users", {
      {"id", types.serial}
      {"group_id", types.integer}
      {"username", types.varchar}
      {"encrypted_password", types.varchar}
      {"email", types.varchar}
      {"slug", types.varchar}

      {"last_active", types.time null: true}
      {"display_name", types.varchar null: true}
      {"avatar_url", types.varchar null: true}

      {"created_at", types.time}
      {"updated_at", types.time}

      "PRIMARY KEY (id)"
    }
    create_index "users", "slug", unique: true
    create_index "users", db.raw("lower(email)"), unique: true
    create_index "users", db.raw("lower(username)"), unique: true

  [3]: =>
    create_table "user_profiles", {
      {"user_id", types.foreign_key}
      {"bio", types.text null: true}
      {"website", types.text null: true}
      {"twitter", types.text null: true}
      {"created_at", types.time}
      {"updated_at", types.time}
      {"password_reset_token", types.varchar null: true}
      "PRIMARY KEY (user_id)"
    }
    create_index "user_profiles", "password_reset_token", where: "password_reset_token is not null"

}
