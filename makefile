.PHONY: build build-standardjs build-sully build-nyc

build-standardjs:
	docker build -t markbirbeck/standardjs ./modules/standardjs

build-nyc:
	docker build -t markbirbeck/nyc ./modules/nyc

build: build-standardjs build-sully build-nyc

build-sully:
	docker build -t markbirbeck/sully ./src
