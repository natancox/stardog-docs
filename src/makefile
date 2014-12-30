PUB = ../published/
IMG = $(PUB)img/
VER = 2.2.4
DATE = "11 December 2014"

convert:
	asciidoctor                   \
		-v                        \
		-t                        \
		-a version=$(VER)         \
		-a release-date=$(DATE)   \
		-a allow-uri-read         \
		-a data-uri               \
		-a stylesheet=stardog.css \
		docs/index.ad             \
		-o docs/index.html

#needs to pass -a titlelogo=stardog.png
#needs to move header-logo.ad to no-header-logo.ad and vice versa...poor man's conditional include...
pdf: export JAVA_OPTS="-Xmx2048m"
pdf:
	~/.gvm/asciidoctorj/1.5.2/bin/asciidoctorj \
		-b pdf                                 \
		-a version=$(VER)                      \
		-a release-date=$(DATE)                \
		-a allow-uri-read                      \
		-a data-uri                            \
		-a stylesheet=stardog.css              \
		docs/index.ad                          \
		-o docs/stardog-manual-$(VER).pdf

epub: export JAVA_OPTS="-Xmx2048m"
epub:
	~/.gvm/asciidoctorj/1.5.2/bin/asciidoctorj -b epub3 -a allow-uri-read -a data-uri -a stylesheet=stardog.css docs/index.ad -o docs/stardog-manual-$(VER).epub

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
