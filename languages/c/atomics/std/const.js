<%= variable('const') %> = std::shared_ptr<String>((String*) malloc(sizeof(String)));
<%= variable('const') %>->length = ${ metaInformation.parameters.value.length};
<%= variable('const') %>->data = std::shared_ptr<char>((char*) malloc(sizeof(char) * ${ metaInformation.parameters.value.length + 1 }));
memcpy(&(*<%= variable('const') %>->data), "${ metaInformation.parameters.value }\0", sizeof(char) * ${ metaInformation.parameters.value.length + 1 });