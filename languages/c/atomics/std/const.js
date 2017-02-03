<%= variable('const') %> = std::shared_ptr<String>((String*) malloc(sizeof(String)));
<%= variable('const') %>->length = ${ node.metaInformation.parameters.value.length};
<%= variable('const') %>->data = std::shared_ptr<char>((char*) malloc(sizeof(char) * ${ node.metaInformation.parameters.value.length + 1 }));
memcpy(&(*<%= variable('const') %>->data), "${ node.metaInformation.parameters.value }\0", sizeof(char) * ${ node.metaInformation.parameters.value.length + 1 });