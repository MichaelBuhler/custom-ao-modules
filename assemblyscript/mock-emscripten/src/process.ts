
export function handle (msgJson: string, envJson: string) : ArrayBuffer {
  const result = `{
    "ok": true,
    "response": {
      "Output": "Hello, world!"
    }
  }`
  return String.UTF8.encode(result)
}
