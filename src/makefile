PUB = ../published/
IMG = $(PUB)img/
convert: #do css first...
	asciidoctor -v -t -d book -a allow-uri-read -a data-uri -a stylesheet=stardog.css docs/index.ad -o docs/index.html

clean:
	rm -r docs/foundation

v:
	open http://localhost:8001/

serve:
	ruby -run -e httpd docs/ -p 9090

pub: convert
	cp docs/index.html $(PUB)
	cp -R docs/icv $(PUB)
	cp docs/img/cp.png $(IMG)
