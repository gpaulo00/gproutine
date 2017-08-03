
/**
 * Make an effect call for the gproutine
 * @param  {String} name Effect name
 * @param  {...any} args Effect arguments
 * @return {Object}      Built Effect
 */
export default function effect(name, ...args) {
  return {
    "@@gproutine/IO": true,
    type: name,
    args,
  }
}
