`arg_IO_in.wait();
arg_text.wait();
String text = arg_text.get();
IO io_in = arg_IO_in.get();
io_in.print_string(text);

arg_IO_out.set_value(io_in);`

