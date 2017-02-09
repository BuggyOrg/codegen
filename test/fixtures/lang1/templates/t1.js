module.exports = {
  main: (graph) => {
    return t('T1.t1')(graph) + ';' + t('T1.t2')(graph)
  },
  T1: {
    t1: () => `t1-content`,
    t2: () => `t2-content`
  }
}
