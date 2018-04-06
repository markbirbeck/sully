.PHONY: build build-repolinter build-standardjs build-sully build-nyc

build-repolinter:
	docker build -t markbirbeck/repolinter ./modules/repolinter

build-standardjs:
	docker build -t markbirbeck/standardjs ./modules/standardjs

build-nyc:
	docker build -t markbirbeck/nyc ./modules/nyc

build: build-repolinter build-standardjs build-sully build-nyc

build-sully:
	docker build -t markbirbeck/sully ./src

run:
	docker run \
	  --rm -it \
	  -v /var/run/docker.sock:/var/run/docker.sock \
	  -v ${UUT}:/usr/src/uut \
	  markbirbeck/sully ${UUT}
