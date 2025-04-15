# Test Suite

The following features are tested by the test suite in this repository.

The module behaves differently based on the presence and value of an `Action` tag on the incoming message.

Some modules only support a (comma-separated) subset of features.

If a module is marked as `all`, it is expected to pass every test in the suite.

See [test.mjs](./test.mjs) for the test suite implementation.

| Feature Name | `Action` Tag Value | Description |
| --- | --- | --- |
| `hello` | _undefined_ | The module is expected to set the `Output` field of the outbox to `"Hello, world!"` when the incoming message has no `Action` tag. |
| `echo` | `"Echo"` | The module is expected to echo (copy) the value of the `Data` field on the incoming message to the `Output` field of the  outbox. |
| `ping` | `"Ping"` | The module is expected to place an outgoing message into the `Messages` array of the outbox. The outgoing message needs to `Target` the sender of the original message, have a valid `Anchor`, and set the tag `Action: "Pong"`. |
| `other` | _any other value_ | The module is expected to set an `Error` in it's evaluation result if the `Action` tag on the incoming message is neither `"Echo"` nor `"Ping"` |

_N.B.: Not every test may be passing for every language and build method in this repository._
