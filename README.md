# Codegen

Utility to create code from buggy graphs.

# Usage

Pass a buggy graph as stdin or as a parameter to the CLI and specify the language.

Languages are specified in special packages. You can find examples inside the `languages`
directory. You can either pass a list of directories or you can pass json files. The
positioning of the languages does matter. A language that is included earlier is
considered before other languages (i.e. `-l c-debugger.json -l c.json` will first
look into the debugger commands before looking in the normal commands for the c language.
This way the debugger language can overwrite definitions from the c language.
