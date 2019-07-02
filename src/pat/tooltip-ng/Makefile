all:: designerhappy

########################################################################
## Install dependencies

stamp-npm: package.json
	npm install
	touch stamp-npm

clean::
	rm -f stamp-npm
	rm -rf node_modules

make serve::
# TODO	

designerhappy:: stamp-npm
	printf "\n\n Designer, you can be happy now.\n Go to http://localhost:4001/ to see a demo \n\n\n\n"
# TODO
