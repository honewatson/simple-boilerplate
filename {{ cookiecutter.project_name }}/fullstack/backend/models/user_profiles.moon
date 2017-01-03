import Model from require "lapis.db.model"
class UserProfiles extends Model
  @primary_key: {"user_id"}
  @timestamp: true

  @relations: {
    {"user", belongs_to: "Users"}
  }
