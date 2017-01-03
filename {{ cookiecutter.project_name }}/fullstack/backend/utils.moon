fileExists = (name) ->
  f = io.open name, "r"
  if f
    io.close(f)
    true
  else
    false

splitFilename = (strFilename) ->
	-- Returns the Path, Filename, and Extension as 3 values
  string.match(strFilename, "(.-)([^\\]-([^\\%.]+))$")

splitByLines = (str) ->
    t = {}
    helper = (line) -> 
        table.insert(t, line)
        ""
    helper( (str:gsub("(.-)r?n", helper)) )
    t


{ :fileExists, :splitFilename, :splitByLines }