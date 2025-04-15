
-- this table is the `process` module
local process = {}

-- you need to set a unique anchor on each outgoing message
local nextAnchor = 0

-- define the `handle()` function on the process module
function process.handle (msg, env)

  -- Find the `Action` tag on the message
  local actionTag = nil
  for _, tag in ipairs(msg.Tags) do
    if tag.name == 'Action' then
      actionTag = tag
      break
    end
  end

  if actionTag then

    if actionTag.value == 'Echo' then
      -- echo the message Data to the evaluation Output
      return { Output = msg.Data }
    end

    if actionTag.value == 'Ping' then
      -- reply to sender with a Pong message
      local anchor = string.format('%032d', nextAnchor)
      nextAnchor = nextAnchor + 1
      return {
        Messages = {
          {
            Target = msg.From,
            Anchor = anchor,
            Tags = {
              { name = 'Action', value = 'Pong' }
            }
          }
        },
      }
    end

    -- The requested action is not supported
    return { Error = 'Unsupported action: '..actionTag.value }

  else

    -- Output `Hello, world!` if no action was requested
    return { Output = 'Hello, world!' }

  end

  -- This line should not be reached
  return { Error = 'Unreachable' }

end

-- return/export the process module
return process
