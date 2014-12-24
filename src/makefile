PUB = ../published/
IMG = $(PUB)img/
VER = 3.0
DATE = "11 December 2014"

FILES = index.ad testing.ad

convert:
	asciidoctor -v -t -d book -a version=$(VER) -a release-date=$(DATE) -a allow-uri-read -a data-uri -a stylesheet=stardog.css docs/index.ad -o docs/index.html

test_doc:
	asciidoctor -v -t -d book -a allow-uri-read -a data-uri -a stylesheet=stardog.css docs/testing.ad -o docs/testing.html

clean:
	-rm -r docs/foundation

v: convert
	open http://localhost:8001/

serve:
	ruby -run -e httpd docs/ -p 9090

pub: convert
	cp docs/index.html $(PUB)
	cp -R docs/icv $(PUB)
	cp docs/img/cp.png $(IMG)
