// Input: An edge
// Creates a promise (the output of a function) and the corresponding future for a later function call
function setup_func_arguments(edge) {
  const type = Graph.port(edge.from, graph).type

  const promise = new PromiseBuilder(type, edge_name_from(edge))
    .end()
    .build()

  const future = new SharedFutureBuilder(type, edge_name_to(edge))
    .assignFromPromise(edge_name_from(edge))
    .end()
    .build()

  return `${promise}
  ${future}`
}

function compound_process(node) {
  const independentVariables = Graph.edges(graph)
    .filter((e) => !(Node.equal(e.from.node, node) || Node.equal(e.to.node, node)))
    .map(setup_func_arguments).join('\n  ')

  const inputPortVariables = Graph.outIncidents(node, graph).map((e) =>
    new SharedFutureBuilder(Graph.port(e.from, graph).type, edge_name_to(e))
      .assign(func_arg(e.from))
      .end()
      .build()
  ).join('\n  ')

  const outputPortVariables = Graph.inIncidents(node, graph).map(setup_func_arguments).join('\n  ')

  const functionCalls = Graph.nodes(graph).map(func_call_async).join('\n  ')

  const outputAssignments = Node.outputPorts(node).map((p) => {
    const var_name = edge_name_to(Graph.inIncident(p, graph))
    return `${ var_name }.wait();\n  ${func_arg(p) }.set_value(${ var_name }.get());`
  })

  return `${func_def(node)} {
  // Create independent variables
  ${independentVariables}
  // Create input port variables
  ${inputPortVariables}
  // Create output port variables
  ${outputPortVariables}

  // Function calls
  ${functionCalls}

  // Output assignments
  ${outputAssignments}
}`
}
