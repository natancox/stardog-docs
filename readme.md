Stardog Documentation
=====================

[![Gitter](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/clarkparsia/stardog-docs?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

We write Stardog docs in Asciidoc. We build with a combination of
Grunt and some Ruby stuffs.

## Development Setup

* make an rvm environment; 2.1.5 works.  If you have rvm, `rvm use ruby 2.1.5`
* `cd src; bundle` for installing asciidoctor and related dependencies
* `npm install` to install Grunt and related dependencies
* If one of the dependency fails, you can manually reinstall a gem with `gem install <gem>`, and then re-run `bundle`
* `cd src/style ; bundle install` to install the CSS processing
* Problems?  Run `rvm list` to see what version of Ruby you are using

Sometimes Compass is just incredibly stupid and you may have to
install Zurb Foundation via Gem by hand.

## Editing Docs

* edit *.ad files using asciidoctor syntax
** note: Asciidoctor != Markdown...!
* edit Sass in style if you need to tweak CSS (you probably don't)
* build with `grunt`
* publish with `grunt pub`
* release with `grunt pub --id=x.y.z --date="'DD Month YYYY"`
* install Prince to build a PDF (optional)

Be aware of [LICENSE.txt](http://creativecommons.org/licenses/by-sa/3.0/).
