
export default function effect(name, ...args) {
  return {
    "@@gproutine/IO": true,
    type: name,
    args,
  }
}
