# POC: Codegen without templates

## Implemented Requirements
The following requirements are fulfilled:

1. Every script in language/templates should have access to functions defined in other template scripts.
2. Scripts in language/atomics should be as simple as possible (?)
3. Scripts in language/atomics should be called for each atomic node and just generate some code.
4. The language definition should be packageable into a json file.
5. Dependent language definition (not implemented, see [Future Changes] for details)

## Changes
- The language definition can now be written in any JavaScript dialect supported by babel
    - babel-core should be using the .babelrc file when transpiling
- For executing the code NodeJS's [vm](https://nodejs.org/api/vm.html) is used
    - Ability to create a sandbox. A sandbox is just an object containing more objects/functions. These will be available to the code running in the vm.
        - `graph` and `node` are provided as globals.
        - No implicitly capturing of any other functions (e.g. `console` and `JSON` have to be added explicitly to the sandbox).
    - This sandbox will be "[contextified](https://nodejs.org/api/vm.html#vm_what_does_it_mean_to_contextify_an_object)".
        - A "contextified" sandbox can be embedded in other sandboxes.
    - The template scripts are run in a vm using the context resulting in defining their functions within this context.
        - This results in a shared namespace for all function in language/template.
    - Finally an additional script is needed to call the main function of the template.
        - This main function returns the generated code.
    - The language/atomics script are executed in a separate context containing only `node` as a global.
    - See `api::generateTarget` and `api::codeFor` for implementation.
    - See `language/cpp-futures` for an example code generation implementation.

## Advantages
- Write code generation directly in JavaScript, easier to read/write.
- Name spacing for base language and dependent language (see [Future Changes]) meaning no naming collisions.
- Full JavaScript functionality without jumping through hoops.
- Better error messages (although the line/column are for the transpiled files). Can be made better using custom Errors.

An error in templates/main.js
``` sh
cat ../../generated/complex-add.json | node lib/cli.js -l languages/cpp-futures
# -> ReferenceError: error is not defined
#     at main (/Users/pascal/Projects/master-thesis/buggy/codegen-poc/languages/cpp-futures/templates/main.js:5:3)
#     at evalmachine.<anonymous>:1:22
#     at /Users/pascal/Projects/master-thesis/buggy/codegen-poc/lib/api.js:100:70
#     at process._tickCallback (internal/process/next_tick.js:103:7)
```

An error in atomics/print.js
``` sh
cat ../../generated/complex-add.json | node lib/cli.js -l languages/cpp-futures
# -> ReferenceError: error is not defined
#     at /Users/pascal/Projects/master-thesis/buggy/codegen-poc/languages/cpp-futures/atomics/print.js:3:43
#     at ContextifyScript.Script.runInContext (vm.js:32:29)
#     at ContextifyScript.Script.runInNewContext (vm.js:38:15)
# [...]
```

An error while transpiling
``` sh
cat ../../generated/complex-add.json | node lib/cli.js -l languages/cpp-futures
# -> SyntaxError: /Users/pascal/Projects/master-thesis/buggy/codegen-poc/languages/cpp-futures/templates/main.js: "atomic_def" is read-only
#   2 |
#   3 |   const atomic_def = atomics(graph).map(atomic_process).join('\n\n')
# > 4 |   atomic_def = ''
#     |   ^
#   5 |   const compound_def = compounds(graph).map((node) => compound_process(node, graph)).join('\n\n')
#   6 |   const main_name = compounds(graph).filter((n) => n.componentId === 'main')[0]
#   7 |
#     at File.buildCodeFrameError (/Users/pascal/Projects/master-thesis/buggy/codegen-poc/node_modules/babel-core/lib/transformation/file/index.js:431:15)
# [...]
```

## Disadvantages

- Worse performance. JavaScript files need to be transpiled and then compiled.
    - The transpiling can be skipped if a packaged definition is used. But transpiling is not the most expensive in this case.
    
    ```
    cat ../../programs/complex-add.clj
    # -> (defco main [IO] (let [a (math/add 5 5)
    #                      b (math/add 21 5)]
    #                  (print (numToStr (math/add a b)) IO)))

    # Repeated some times so files are cached in memory
    # The rewrite
    cat ../../generated/complex-add.json | time node lib/cli.js -l languages/cpp-futures > /dev/null
    # -> node lib/cli.js -l languages/cpp-futures > /dev/null  1.00s user 0.06s system 115% cpu 0.917 total

    # The old version
    cat ../../generated/complex-add.json | time node lib/cli.js -l languages/cpp-futures > /dev/null
    # -> node lib/cli.js -l languages/cpp-futures > /dev/null  0.68s user 0.04s system 111% cpu 0.642 total
    ```

- The package definition contains the absolute path to the files on the original computer it was created on.
    - Used for generating the error messages.
    - Not meaningful on other computers. But packaged language definition shouldn't contain any errors anyway :)
    - Could be removed from the packaged definition. Needs some changes in the code though.

## Future changes
With respect to changes in the `extensible` branch:

- Languages depending on other languages:
    - This can be modelled by adding the other language in its own namespace in `generateTarget` to `sandbox`
      For example: We have the base language `clike` and the language `cpp` depending on it. First the `clike` context has to be created:

      ``` JavaScript
      const clikeSandbox = {[...]} // The globally needed functions/modules
      const clikeContext = new vm.createContext(clikeSandbox)
      for (const templateName in clike) {
        const template = language.templates[templateName]
        vm.runInContext(template.code, clikeContext, {filename: template.path})
      }
      ```

      At this point all definitions from `clike` are created in `clikeContext`.
      Now `cpp` can be created.
      ``` JavaScript
      const cppSandbox = {[...], clike: {clikeContext} } // The globally needed functions/modules and clike
      const cppContext = new vm.createContext(cppSandbox)
      for (const templateName in cpp) {
        const template = language.templates[templateName]
        vm.runInContext(template.code, cppContext, {filename: template.path})
      }
      ```

      Now every function in `cpp` can access `clike` functions through the `clike` object in its context.

      ``` Javascript
      // in clike:
      function functionDefinition(...) { ... }
      // in cpp
      function main() {
        const f = clike.functionDefinition('foo')
      }
      ```

      This example is static, but the context can be created dynamically based on the dependencies of the languages.
      **Problematic**: The global context needed in `clike` is most likely the same as needed in `cpp`. Therefore the global context is accessible twice in `cpp`: globally and through `clike`.

