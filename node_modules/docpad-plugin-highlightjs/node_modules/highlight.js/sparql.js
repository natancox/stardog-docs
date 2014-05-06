module.exports = function(hljs) {

  var SPARQL_IDEN_REGEX = "[a-zA-Z0-9_\\-]+";
  var SPARQL_IDEN_EMPTY_REGEX = "[a-zA-Z0-9_\\-]*";

  var SPARQL_KEYWORDS = {
    keyword: 'base prefix select distinct reduced construct describe ' +
      'ask from named where order limit offset filter optional ' +
      'graph by asc desc as having undef values group ' +
      'minus in not service silent using insert delete ' +
      'data copy to move add create drop clear load',
    aggregate: 'count sum min max avg'
  }

  var VARIABLE = {
    className: 'variable',
    begin: '\\?'+ SPARQL_IDEN_REGEX +'|\\$'+ SPARQL_IDEN_REGEX
  };

  var URIS = [
    {
      className: 'uri',
      begin: '<', end: '>'
    },
    {
      className: 'uri',
      begin: SPARQL_IDEN_EMPTY_REGEX+ '?\\:'+ SPARQL_IDEN_REGEX
    },
    {
      className: 'uri',
      begin: '\\ba\\b'
    }
  ];

  var RULE = {
    className: 'rule',
    beginWithKeyword: true, 
    keywords: 'if then'
  };

  var STR_CONTAINS = [hljs.BACKSLASH_ESCAPE, RULE];

  var STRINGS = [
    {
      className: 'string',
      begin: "'", end: "'",
      contains: STR_CONTAINS,
      relevance: 0
    },
    {
      className: 'string',
      begin: '"', end: '"',
      contains: STR_CONTAINS,
      relevance: 0
    }
  ];

  var STRINGS_MULTIPLE = [
    {
      className: 'string',
      begin: "'''", end: "'''",
      contains: STR_CONTAINS,
      relevance: 0
    },
    {
      className: 'string',
      begin: '"""', end: '"""',
      contains: STR_CONTAINS,
      relevance: 0
    }
  ];

  var NUMBERS = [hljs.BINARY_NUMBER_MODE, hljs.C_NUMBER_MODE];

  var COMMENT = {
    className: 'comment',
    begin: '#', end: '\\n'
  };

  var SPARQL_DEFAULT_CONTAINS = [
    COMMENT,
    VARIABLE,
    RULE
  ].concat(STRINGS_MULTIPLE).concat(STRINGS).concat(NUMBERS).concat(URIS);

  return {
    case_insensitive: true,
    keywords: SPARQL_KEYWORDS,
    contains: SPARQL_DEFAULT_CONTAINS
  };
};