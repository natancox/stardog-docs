PUB   = ../published/
IMG   = $(PUB)img/
VER   = 2.2.4
DATE  = "11 December 2014"
FILES = index.ad
OLD   = $(PUB)$(VER)
BIN   = asciidoctor -t

convert:
	$(BIN) -v -d book -a version=$(VER) -a release-date=$(DATE) -a allow-uri-read -a data-uri -a stylesheet=stardog.css docs/index.ad -o docs/index.html

clean:
	-rm -r docs/foundation

v: convert
	open http://localhost:8001/

serve:
	ruby -run -e httpd docs/ -p 9090

pub: #we used to have convert here, which was useful, but it conflicts with rel
	cp docs/index.html $(PUB)
	cp -R docs/icv $(PUB)
	cp docs/img/cp.png $(IMG)

new:
	asciidoctor -v -t -d book -a version=$(NEWVER) -a release-date="$(NEWDATE)" -a allow-uri-read -a data-uri -a stylesheet=stardog.css docs/index.ad -o docs/index.html

#my god this is ugly! a release script would be better...
rel: 
	mkdir -p $(PUB)$(VER)
	cp $(PUB)index.html $(OLD)
	cp -R $(PUB)icv $(OLD)
	cp -R $(PUB)java $(OLD)
	cp -R $(PUB)man $(OLD)
	make new
	make pub
