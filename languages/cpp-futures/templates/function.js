
// FUNCTION DEFINITION
function func_def(node) {
  return `void ${ func_name(node) }(${ arg_list(node) })`
}
function func_name(node) {
  return `P_${ componentName(node) }_${ sanitize(node.id) }`
}

function arg_list(node) {
  const inFormatted = Node.inputPorts(node).map(input_arg)
  const outFormatted = Node.outputPorts(node).map(output_arg)
  return flatten([inFormatted, outFormatted]).join(', ')
}

function input_arg(port) {
  return new SharedFutureBuilder(port.type, func_arg(port)).build()
}
function output_arg(port) {
  return new PromiseBuilder(port.type, func_arg(port)).build()
}

// FUNCTION CALLING
function func_call_async(node) {
  return `std::thread(${ func_name(node) }, ${ call_list(node) }).detach();`
}

function call_list(node) {
  const inFormatted = Node.inputPorts(node).map((p) =>
    Graph.inIncidents(p, graph).map(edge_name_to))
  const outFormatted = Node.outputPorts(node).map((p) =>
    Graph.outIncidents(p, graph).map((e) => 'std::move(' + edge_name_from(e) + ')'))

  return flatten([inFormatted, outFormatted]).join(', ') // TODO .filter((arg) => arg != '') ?
}

// UTILS
function func_arg(port) {
  return `arg_${ port_name(port) }`
}

