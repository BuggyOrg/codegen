function edge_name_from(edge) {
  return `out_from_${sanitize(edge.from.node)}_${edge.from.port}`
}

function edge_name_to(edge) {
  return `in_to_${sanitize(edge.to.node)}_${edge.to.port}`
}

function edge_name(edge) {
  return `edge_${sanitize(edge.from.node)}_${sanitize(edge.to.node)}`
}
