
process = {}

process.handle = function (msg, env)
  local result = {
    Output = 'Hello, world!'
  }
  return result
end

return process
