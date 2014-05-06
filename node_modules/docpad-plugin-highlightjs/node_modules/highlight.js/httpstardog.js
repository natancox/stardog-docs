module.exports = function (hljs) {

  var HTTP_KEYWORDS = {
    keyword: 'get post put delete patch options'
  };

  var URL_VAR = {
    className: 'variable',
    begin: '{', end: '}'
  };

  var MIME_TYPES = [{
    className: 'title',
    beginWithKeyword: true,
    keywords: 'application\/rdf+xml application\/x-turtle text\/turtle text\/plain application\/x-trig ' +
              'application\/trix text\/x-nquads application\/ld+json application\/sparql-results+xml ' +
              'application\/sparql-results+json text\/boolean application\/x-binary-rdf-results-table ' +
              'application\/json'
  },
  {
    className: 'title',
    beginWithKeyword: true,
    keywords: 'rdf void'
  }];

  var NUMBERS = [hljs.BINARY_NUMBER_MODE, hljs.C_NUMBER_MODE];

  var HTTP_DEFAULT_CONTAINS = [
    URL_VAR
  ].concat(NUMBERS).concat(MIME_TYPES);

  return {
    case_insensitive: true,
    keywords: HTTP_KEYWORDS,
    contains: HTTP_DEFAULT_CONTAINS
  };
};