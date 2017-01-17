<%= variable('const') %> = (char*) malloc(sizeof(char) * ${ metaInformation.value.length + 1 });
<%= variable('const') %> = "${ metaInformation.value }\0";