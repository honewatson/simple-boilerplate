lapis = require "lapis"
import json_params, capture_errors_json, capture_errors, respond_to, yield_error from require "lapis.application"
import assert_valid from require "lapis.validate"
import slugify, to_json, from_json from require "lapis.util"
import Model from require "lapis.db.model"
csrf = require "lapis.csrf"
import fileExists, splitFilename from require "utils"
json = require "cjson"


class ModelPlus extends Model
  @findAll: (...) =>
    first = select 1, ...
    error "#{@table_name!} trying to find with no conditions" if first == nil

    cond = if "table" == type first
      @db.encode_clause (...)
    else
      @db.encode_clause @encode_key(...)

    table_name = @db.escape_identifier @table_name!

    @load_all @db.select "* from #{table_name} where #{cond}"
    
success = () ->
  { message: "Success!" }

not_found = (name) ->
  { message: "#{name} not found!" }

assert_user = (group) -> (user) ->
  assert_valid user, {
    { "group", one_of: group }
  }

assert_user_crud = (user, group) ->
  assert_valid user, {
    { "group", equals: group }
  }

props_builder = (params, props, update=false) ->
  final = nil
  if update
    for k, v in pairs props
      if params[k]
        update[k] = params[k]
    final = update
  else
    final = { k, params[k] for k, v in pairs props when params[k] }
  if props.slug and params[props.slug]
    final.slug = slugify params[props.slug] 
  final

upload_to_json = (props, upload) ->
  if upload
    for item in *upload
      if props[item]
        props[item] = to_json props[item]
  props

class CrudApplication extends lapis.Application
  group: "admin"
  current_user: group: "read"
  __inherited: (cls) =>
   
    base = cls.__base
    Mod = cls.__base.model
    UploadMod = cls.__base.modelUpload
    mod = Mod.__name
    name = mod\lower!
    cls.__base["/api/#{name}.json"] = respond_to {
      
      POST: capture_errors_json json_params =>
        if base.assert_user_post 
          base.assert_user_post @current_user
        else
          assert_user_crud @current_user, base.group
        if base.validation_post
          assert_valid  @params, base.validation_post
        props = props_builder @params, base.props
        props = upload_to_json props, base.upload
        if base.before_post
          props = base.before_post props
        create_mod = ->
          Mod\create props
        ok, nmod = pcall create_mod
        --json: @params
        if type(nmod) == 'string' and string.find(nmod, "duplicate key")
          nmod = {errors: {"#{mod} '#{@params.name}' already exists!"}}
        elseif base.after_post
          base.after_post @, nmod
        json: nmod

      PUT: capture_errors_json json_params =>

        if base.assert_user_put
          base.assert_user_put @current_user
        else 
          assert_user_crud @current_user, base.group
        if base.validation_put
          assert_valid @params, base.validation_put
        nmod = Mod\find @params.id
        if nmod
          nmod = props_builder @params, base.props, nmod
          nmod = upload_to_json nmod, base.upload
          if base.before_put
            nmod = base.before_put nmod
          ID = base.primary or "id"
          nmod\update [k for k, v in pairs nmod when k != ID and base.props[k] and @params[k] ]
          if base.after_put
            nmod = base.after_put @, nmod
        --json: @params
        else
          nmod = {errors: {"No #{mod} found with id #{@params.id}"}}
        json: nmod
        
      GET: capture_errors_json json_params =>
        if base.assert_user_get_list
          base.assert_user_get_list @current_user
        else 
          assert_user_crud @current_user, base.group
        paginated = Mod\paginated " ORDER BY ID DESC", per_page: base.per_page or 10
        total_items = paginated\total_items!
        if total_items
          query_string = @req.params_get or { page:1 }
          query_string.page = query_string.page or 1
          assert_valid query_string, {
            { "page", is_integer: true }
          } 
          result = { count: total_items, page: query_string.page }
          result.result = paginated\get_page query_string.page
          if base.after_get
            result = base.after_get result
          json: result
        else
          json: { count: total_items, results: {}}
    }

    cls.__base["/api/#{name}/search.json"] = respond_to {
        POST: capture_errors_json json_params =>
          if base.assert_user_search
            base.assert_user_search @current_user
          else 
            assert_user_crud @current_user, base.group
          if base.validation_search
            assert_valid @params, base.validation_search
          local query
          query = { k, @params[k] for k in *base.search when @params[k]}
          if base.before_search
            query = base.before_search query
          nmod = Mod\findAll query
          unless nmod
            nmod = not_found mod
          elseif base.after_search
            nmod  = base.after_search nmod
          unless next nmod
            return {content_type: "application/json", layout: false}, "[]"
          else
            json: nmod  
          
    }

    cls.__base["/api/#{name}/:id.json"] = respond_to {
        GET: capture_errors_json json_params =>
          if base.assert_user_get
            base.assert_user_get @current_user
          else 
            assert_user_crud @current_user, base.group
          nmod = Mod\find @params.id
          result = nmod
          unless nmod
            result =  not_found mod
          elseif base.after_get
            result = base.after_get result
          json: result
        DELETE: capture_errors_json json_params =>
          if base.assert_user_delete
            base.assert_user_delete @current_user
          else 
            assert_user_crud @current_user, base.group
          nmod = Mod\find @params.id
          result = success!
          if nmod
            nmod\delete!
          unless nmod
            result =  not_found mod
          elseif base.after_delete
            result = base.after_delete result
          json: result
    }

    cls.__base["/api/#{name}/upload/:id.json"] = respond_to {
        DELETE: capture_errors_json json_params =>
          if base.assert_user_delete
            base.assert_user_delete @current_user
          else 
            assert_user_crud @current_user, base.group
          nmod = UploadMod\find @params.id
          result = success!
          if nmod
            nmod\delete!
          unless nmod
            result =  not_found mod
          elseif base.after_upload_delete
            result = base.after_upload_delete result
          json: result
    }

    cls.__base["/api/#{name}/upload"] = respond_to {
      GET: capture_errors =>
        csrf_token = csrf.generate_token @, name
        json: { csrf_token:csrf_token, message: "success" }

      POST: capture_errors =>
        assert_valid @params, {
          { "upload", is_file: true }
        }
        csrf.assert_token @, name
        file = @params.upload
        fpath, ffilename, fextension = splitFilename file.filename
        filename = slugify string.gsub(ffilename, fextension, "")
        timestampFilename = os.time() .. '-' .. filename .. "." .. fextension

        folder = "./static/#{name}/#{filename}/"
        unless fileExists folder
          os.execute "mkdir -p " .. folder
        filepath = "#{folder}#{timestampFilename}"
        nfile = UploadMod\create {
          title: @params.title
          original_filename: file.filename
          filename: timestampFilename,
          filepath: filepath,
          folder: folder,
          filename_no_extension: filename
        }
        file2write = io.open(filepath, "w")
        file2write\write file.content
        file2write\close!
        json: nfile
    }

{ :CrudApplication, :assert_user, :ModelPlus }
