`arg_inNumber.wait();
Number num = arg_inNumber.get();

std::string str = std::to_string(num);
arg_outStr.set_value(String(str));`
