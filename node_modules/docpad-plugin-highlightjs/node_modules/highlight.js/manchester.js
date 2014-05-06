module.exports = function (hljs) {

  var IDEN_REGEX = "[a-zA-Z0-9_\\-]+";
  var IDEN_EMPTY_REGEX = "[a-zA-Z0-9_\\-]*";

  var MANCHESTER_KEYWORDS = {
    keyword: 'Datatype Class ObjectProperty DataProperty AnnotationProperty NamedIndividual ' +
      'Annotations Prefix Ontology Import Self ' +
      'EquivalentTo SubClassOf DisjointWith DisjointUnionOf HasKey ' +
      'Domain Range Characteristics SubPropertyOf InverseOf SubPropertyChain ' +
      'Functional InverseFunctional Reflexive Irreflexive Symmetric Asymmetric Transitive ' +
      'Individual Types Facts SameAs DifferentFrom ' +
      'EquivalentClasses DisjointClasses EquivalentProperties DisjointProperties SameIndividual DifferentIndividuals',
    built_in: 'inverse or and not length minLength maxLength pattern langRange ' +
      'that some only value min max exactly '
  };

  var URIS = [
    {
      className: 'uri',
      begin: '<', end: '>'
    },
    {
      className: 'uri',
      begin: IDEN_EMPTY_REGEX+ '?\\:'+ IDEN_REGEX
    }
  ];

  var STR_CONTAINS = [hljs.BACKSLASH_ESCAPE];
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

  var SET_OPTS = {
    className: 'constant',
    begin: '{', end: '}'
  };

  var NUM_RANGE = {
    className: 'constant',
    begin: '\\[', end: '\\]'
  };

  var NUMBERS = [hljs.BINARY_NUMBER_MODE, hljs.C_NUMBER_MODE];

  var MANCHESTER_DEFAULT_CONTAINS = [
    SET_OPTS,
    NUM_RANGE
  ].concat(NUMBERS).concat(URIS).concat(STRINGS);

  return {
    case_insensitive: false,
    keywords: MANCHESTER_KEYWORDS,
    contains: MANCHESTER_DEFAULT_CONTAINS
  };
};