#for GNU make

#DDEBUG = -O0 -g -DDEBUG=1
#DDEBUG = -DDEBUG=1
CXXFLAGS = -O3 -Wall -Wextra -Wno-unused-parameter -std=c++11 $(DDEBUG)
CXX = g++ $(CXXFLAGS)

check32: check32.cpp tinymt32.hpp
	${CXX} -o $@ check32.cpp

#check64: check64.cpp tinymt64.hpp
#	${CCXX} -o $@ check64.cpp

.c.o:
	${CC} -c $<

clean:
	rm -rf *.o *~ *.dSYM crushes
