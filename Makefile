COFFEE	=	$(shell which coffee)

watch:
	${COFFEE} -w -o ./js -c ./coffee

build:
	${COFFEE} -o ./js -c ./coffee
