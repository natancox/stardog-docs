Stardog Documentation
=====================

We write Stardog docs in Asciidoc: Use rvm and bundler to setup a development environment
with two commands:

* make an rvm environment; 2.1.5 works
* bundler install... installs the required Ruby dependencies

* edit *.ad files using asciidoctor syntax
* edit SASS stuff in style if you need to tweak CSS (you probably don't)
* make css in style/ builds the CSS
* make in src/ builds the output (including embedding HTML and images)

TODO: add a make target to move that stuff to published submodule so it can be
published via Github Pages... There may be a Ruby gem that simplifies that which
we can use.

Be aware of [LICENSE.txt](http://creativecommons.org/licenses/by-sa/3.0/).
