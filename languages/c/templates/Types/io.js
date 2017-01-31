module.exports = {
  IO: {
    definition: `struct IO {};`,
    copy: `
printf("Cannot copy IO."); // impossible to copy IO.
exit(EXIT_FAILURE);
`
  }
}
