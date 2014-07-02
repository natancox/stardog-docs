---
quote: "The string is a stark data structure and everywhere it is passed there is much duplication of process. It is a perfect vehicle for hiding information."
title: "Using Stardog"
layout: default
related: ""
toc: true
---

While Stardog is a full-featured RDF database, its primary purpose is to
execute queries against RDF data which it has under direct
management.<fn>This implies that Stardog will not retrieve data from the Web
or from any other network via HTTP URLs in order to query that data. If
you want to query data using Stardog, you must add that data to a new or
existing Stardog database.</fn> Stardog supports the [SPARQL](http://www.cambridgesemantics.com/2008/09/sparql-by-example) query language, a W3C standard.

## Querying

Stardog currently supports the [SPARQL 1.1 Query
language](http://www.w3.org/TR/sparql11-query/). <fn>Stardog does not support SPARQL 1.1 federation (the
`SERVICE` keyword).</fn> Stardog also supports the [OWL 2 Direct Semantics
entailment regime](http://www.w3.org/TR/2012/CR-sparql11-entailment-20121108/).

To execute a SPARQL query against a Stardog database, use the `query`
subcommand:

```bash
$ stardog query myDb "select * where { ?s ?p ?o }"
```

Detailed information on using the query command in Stardog can be found
on its [`man` page](/man/query-execute.html).

<div id="functions"></div>
### Functions

Stardog supports all of the functions in SPARQL, as well as some others from XPath and SWRL. Any of these functions can be used in queries or rules. Some functions appear in multiple namespaces, but all of the namespaces will work:

Prefix     | Namespace
---------- | ----------------------------------------
stardog    | [tag:stardog:api:functions:](#)
fn         | [http://www.w3.org/2005/xpath-functions#](http://www.w3.org/2005/xpath-functions#)
math       | [http://www.w3.org/2005/xpath-functions/math#](http://www.w3.org/2005/xpath-functions/math#)
swrlb      | [http://www.w3.org/2003/11/swrlb#](http://www.w3.org/2003/11/swrlb#)
afn        | [http://jena.hpl.hp.com/ARQ/function#](http://jena.hpl.hp.com/ARQ/function#)

The function names and URIs supported by Stardog are included below. Some of these functions exist in SPARQL natively, which just means they can be used without an explicit namespace.

Function name             | Recognized URIs
:-----------------------  | :-----------------------
abs                       | [fn:numeric-abs](http://www.w3.org/2005/xpath-functions#numeric-abs), [swrlb:abs](http://www.w3.org/2003/11/swrlb#abs)
acos                      | [math:acos](http://www.w3.org/2005/xpath-functions/math#acos)
add                       | [fn:numeric-add](http://www.w3.org/2005/xpath-functions#numeric-add)
asin                      | [math:asin](http://www.w3.org/2005/xpath-functions/math#asin)
atan                      | [math:atan](http://www.w3.org/2005/xpath-functions/math#atan)
ceil                      | [fn:numeric-ceil](http://www.w3.org/2005/xpath-functions#numeric-ceil), [swrlb:ceiling](http://www.w3.org/2003/11/swrlb#ceiling)
concat                    | [fn:concat](http://www.w3.org/2005/xpath-functions#concat), [swrlb:stringConcat](http://www.w3.org/2003/11/swrlb#stringConcat)
contains                  | [fn:contains](http://www.w3.org/2005/xpath-functions#contains), [swrlb:contains](http://www.w3.org/2003/11/swrlb#contains)
containsIgnoreCase        | [swrlb:containsIgnoreCase](http://www.w3.org/2003/11/swrlb#containsIgnoreCase)
cos                       | [math:cos](http://www.w3.org/2005/xpath-functions/math#cos), [swrlb:cos](http://www.w3.org/2003/11/swrlb#cos)
cosh                      | [stardog:cosh](tag:stardog:api:functions:cosh)
date                      | [swrlb:date](http://www.w3.org/2003/11/swrlb#date)
dateTime                  | [swrlb:dateTime](http://www.w3.org/2003/11/swrlb#dateTime)
day                       | [fn:day-from-dateTime](http://www.w3.org/2005/xpath-functions#day-from-dateTime)
dayTimeDuration           | [swrlb:dayTimeDuration](http://www.w3.org/2003/11/swrlb#dayTimeDuration)
divide                    | [fn:numeric-divide](http://www.w3.org/2005/xpath-functions#numeric-divide), [swrlb:divide](http://www.w3.org/2003/11/swrlb#divide)
encode_for_uri            | [fn:encode-for-uri](http://www.w3.org/2005/xpath-functions#encode-for-uri)
exp                       | [math:exp](http://www.w3.org/2005/xpath-functions/math#exp), [afn:e](http://jena.hpl.hp.com/ARQ/function#e)
floor                     | [fn:numeric-floor](http://www.w3.org/2005/xpath-functions#numeric-floor), [swrlb:floor](http://www.w3.org/2003/11/swrlb#floor)
hours                     | [fn:hours-from-dateTime](http://www.w3.org/2005/xpath-functions#hours-from-dateTime)
integerDivide             | [fn:numeric-integer-divide](http://www.w3.org/2005/xpath-functions#numeric-integer-divide), [swrlb:integerDivide](http://www.w3.org/2003/11/swrlb#integerDivide)
lcase                     | [fn:lower-case](http://www.w3.org/2005/xpath-functions#lower-case), [swrlb:lowerCase](http://www.w3.org/2003/11/swrlb#lowerCase)
log                       | [math:log](http://www.w3.org/2005/xpath-functions/math#log)
log10                     | [math:log10](http://www.w3.org/2005/xpath-functions/math#log10)
max                       | [fn:max](http://www.w3.org/2005/xpath-functions#max), [afn:max](http://jena.hpl.hp.com/ARQ/function#max)
min                       | [fn:min](http://www.w3.org/2005/xpath-functions#min), [afn:min](http://jena.hpl.hp.com/ARQ/function#min)
minutes                   | [fn:minutes-from-dateTime](http://www.w3.org/2005/xpath-functions#minutes-from-dateTime)
mod                       | [swrlb:mod](http://www.w3.org/2003/11/swrlb#mod)
month                     | [fn:month-from-dateTime](http://www.w3.org/2005/xpath-functions#month-from-dateTime)
multiply                  | [fn:numeric-multiply](http://www.w3.org/2005/xpath-functions#numeric-multiply)
normalizeSpace            | [fn:normalize-space](http://www.w3.org/2005/xpath-functions#normalize-space), [swrlb:normalizeSpace](http://www.w3.org/2003/11/swrlb#normalizeSpace)
pi                        | [math:pi](http://www.w3.org/2005/xpath-functions/math#pi), [afn:pi](http://jena.hpl.hp.com/ARQ/function#pi)
pow                       | [math:pow](http://www.w3.org/2005/xpath-functions/math#pow), [swrlb:pow](http://www.w3.org/2003/11/swrlb#pow)
replace                   | [fn:replace](http://www.w3.org/2005/xpath-functions#replace)
round                     | [fn:numeric-round](http://www.w3.org/2005/xpath-functions#numeric-round), [swrlb:round](http://www.w3.org/2003/11/swrlb#round)
roundHalfToEven           | [fn:numeric-round-half-to-even](http://www.w3.org/2005/xpath-functions#numeric-round-half-to-even), [swrlb:roundHalfToEven](http://www.w3.org/2003/11/swrlb#roundHalfToEven)
seconds                   | [fn:seconds-from-dateTime](http://www.w3.org/2005/xpath-functions#seconds-from-dateTime)
sin                       | [math:sin](http://www.w3.org/2005/xpath-functions/math#sin), [swrlb:sin](http://www.w3.org/2003/11/swrlb#sin)
sinh                      | [stardog:sinh](tag:stardog:api:functions:sinh)
sqrt                      | [math:sqrt](http://www.w3.org/2005/xpath-functions/math#sqrt), [afn:sqrt](http://jena.hpl.hp.com/ARQ/function#sqrt)
strafter                  | [fn:substring-after](http://www.w3.org/2005/xpath-functions#substring-after), [swrlb:substringAfter](http://www.w3.org/2003/11/swrlb#substringAfter)
strbefore                 | [fn:substring-before](http://www.w3.org/2005/xpath-functions#substring-before), [swrlb:substringBefore](http://www.w3.org/2003/11/swrlb#substringBefore)
strends                   | [fn:ends-with](http://www.w3.org/2005/xpath-functions#ends-with), [swrlb:endsWith](http://www.w3.org/2003/11/swrlb#endsWith)
stringEqualIgnoreCase     | [swrlb:stringEqualIgnoreCase](http://www.w3.org/2003/11/swrlb#stringEqualIgnoreCase)
strlen                    | [fn:string-length](http://www.w3.org/2005/xpath-functions#string-length), [swrlb:stringLength](http://www.w3.org/2003/11/swrlb#stringLength)
strstarts                 | [fn:starts-with](http://www.w3.org/2005/xpath-functions#starts-with), [swrlb:startsWith](http://www.w3.org/2003/11/swrlb#startsWith)
substring                 | [fn:substring](http://www.w3.org/2005/xpath-functions#substring), [swrlb:substring](http://www.w3.org/2003/11/swrlb#substring)
subtract                  | [fn:numeric-subtract](http://www.w3.org/2005/xpath-functions#numeric-subtract), [swrlb:subtract](http://www.w3.org/2003/11/swrlb#subtract)
tan                       | [math:tan](http://www.w3.org/2005/xpath-functions/math#tan), [swrlb:tan](http://www.w3.org/2003/11/swrlb#tan)
tanh                      | [stardog:tanh](tag:stardog:api:functions:tanh)
time                      | [swrlb:time](http://www.w3.org/2003/11/swrlb#time)
timezone                  | [fn:timezone-from-dateTime](http://www.w3.org/2005/xpath-functions#timezone-from-dateTime)
toDegrees                 | [stardog:toDegrees](tag:stardog:api:functions:toDegrees)
toRadians                 | [stardog:toRadians](tag:stardog:api:functions:toRadians)
translate                 | [fn:translate](http://www.w3.org/2005/xpath-functions#translate), [swrlb:translate](http://www.w3.org/2003/11/swrlb#translate)
ucase                     | [fn:upper-case](http://www.w3.org/2005/xpath-functions#upper-case), [swrlb:upperCase](http://www.w3.org/2003/11/swrlb#upperCase)
unaryMinus                | [fn:numeric-unary-minus](http://www.w3.org/2005/xpath-functions#numeric-unary-minus), [swrlb:unaryMinus](http://www.w3.org/2003/11/swrlb#unaryMinus)
unaryPlus                 | [fn:numeric-unary-plus](http://www.w3.org/2005/xpath-functions#numeric-unary-plus), [swrlb:unaryPlus](http://www.w3.org/2003/11/swrlb#unaryPlus)
year                      | [fn:year-from-dateTime](http://www.w3.org/2005/xpath-functions#year-from-dateTime)
yearMonthDuration         | [swrlb:yearMonthDuration](http://www.w3.org/2003/11/swrlb#yearMonthDuration)

### `DESCRIBE`

SPARQL's `DESCRIBE` keyword is deliberately underspecified; vendors are free to do, for good or bad, whatever they want. In Stardog, a `DESCRIBE <theResource>` query retrieves the predicates and objects for all the triples for which `<theResource>` is the subject. There are, of course, about seventeen thousand other ways to implement `DESCRIBE`; we've implemented four or five of them and may expose them to users in a future release of Stardog _based on user feedback and requests_.

Now you know and knowing is one-quarter of the fun.

## Updating

There are many ways to update the data in a Stardog database; the most commonly used methods are the CLI and SPARQL Update queries, both of which we discuss below.

### SPARQL Update <t>new2</t>

SPARQL 1.1 Update can be used to insert RDF into or delete RDF from a Stardog database using SPARQL query forms `INSERT` and `DELETE`, respectively.

```sparql
PREFIX dc: <http://purl.org/dc/elements/1.1/>
PREFIX ns: <http://example.org/ns#>
INSERT DATA
{ GRAPH <http://example/bookStore> { <http://example/book1>  ns:price  42 } }
```

An example of deleting RDF:

```sparql
PREFIX dc: <http://purl.org/dc/elements/1.1/>

DELETE DATA
{
  <http://example/book2> dc:title "David Copperfield" ;
                         dc:creator "Edmund Wells" .
}
```

Or they can be combined with `WHERE` clauses:

```sparql
PREFIX foaf:  <http://xmlns.com/foaf/0.1/>

WITH <http://example/addresses>
DELETE { ?person foaf:givenName 'Bill' }
INSERT { ?person foaf:givenName 'William' }
WHERE
  { ?person foaf:givenName 'Bill' }
```

### Adding Data with the CLI

The most efficient way to load data into Stardog is at database creation
time. See the [Creating a Database](../admin/#create) section for bulk
loading data at database creation time. To add data to an existing
Stardog database, use the [add](/docs/man/data-add.html) command:

```bash
$ stardog data add myDatabase 1.rdf 2.rdf 3.rdf
```

The optional arguments are `-f` (or `--format`) to specify the RDF
serialization type of the files to be loaded; if you specify the wrong
type, `add` will fail. If you don't specify a type, Stardog will try to
determine the type on its own based on the file extension. For example,
the files that have names ending with '.ttl' will be parsed with Turtle
syntax. If you specify a type, then all the files being loaded must of
that same type.

If you want to add data to a named graph, specify it via the
`--graph-uri` or `-g` options.

### Removing Data with the CLI

To remove data from a Stardog database,
[remove](/docs/man/data-remove.html) is used by specifying—

1.  one Named Graph, OR
2.  one or more files containing RDF (in some recognized serialization
    format, i.e., RDF/XML, Turtle, Trig), OR
3.  one Named Graph and one or more RDF files.

For example,

```bash
$ stardog data remove -g http://foo myDatabase
```

will remove the named graph `http://foo` and all its triples from
`myDatabase`.

```bash
$ stardog data remove myDatabase 1.rdf
```

will remove the triples in `1.rdf` from (the default graph of)
`myDatabase`.

```bash
$ stardog data remove -g http://foo -f TURTLE myDatabase 2.rdf 3.rdf
```

will remove the triples in the Turtle files `2.rdf` and `3.rdf` from the
named graph `http://foo` of `myDatabase`.

Strict or loose parsing may be set for the input payload by using
`--strict-parsing=TRUE|FALSE`.

### How Stardog Handles RDF Parsing

RDF parsing in Stardog is strict: it requires typed RDF literals to
match their explicit datatypes, URIs to be well-formed, etc. In some
cases, strict parsing isn't ideal, so it may be disabled using the
`--strict-parsing=FALSE` to disable it.

However, even with strict parsing disabled, Stardog's RDF parser may
encounter parse errors from which it cannot recover. And loading data in
lax mode may lead to unexpected SPARQL query results. For example,
malformed literals (`"2.5"^^xsd:int`) used in filter evaluation may lead
to undesired results.

## Versioning

Stardog supports graph change management capability that lets users track changes between
revisions of a Stardog database, add comments and other metadata to the revisions,
extract diffs between those revisions, tag revisions with labels, and query over the revision history of the database using SPARQL.

The following examples give a very brief overview of this capability; see the [VCS man pages](/manpages/) for all the details.

### Committing Changes

Commit a new version by adding and removing triples specified in files. Different from the 'data add/remove' commands, commit allows one to add and remove triples in one commit and associate a commit message. Removals are performed before additions.

To commit changes:

```bash
$ stardog vcs commit --add add_file1.ttl add_file2.ttl --remove remove_file.ttl -m "This is an example commit" myDb
```

### Viewing Revisions

To see all revision (commits) in a database:

```bash
$ stardog vcs list myDb
$ stardog vcs list --committer userName myDb
```

The output can be tweaked using `--after`, `--before`, and `--committer`.

### Reverting Revisions

You can revert specific revisions, ranges, etc.

```bash
$ stardog vcs revert myDb
$ stardog vcs revert myDb de44369d-cc7b-4244-a3fb-3f6e271420b0
```

### Viewing Diffs

You can also see the differences between revisions; by default, between the head version and its previous versions or the changes in a specific commit, respectively: 

```bash
$ stardog vcs diff myDb
$ stardog vcs diff myDb de44369d-cc7b-4244-a3fb-3f6e271420b0
```

### Using Tags

You can also create, drop, list tags, i.e., named revisions:

```bash
$ stardog vcs tag --list myDb
```

### Querying the Revision History

All of the revision history of the database is represented as RDF using the W3C PROV vocabulary and can be queries using SPARQL:

```bash
$ stardog vcs query myDb 'SELECT...'
```

## Exporting

To export data from a Stardog database back to RDF,
[export](/docs/man/data-export.html) is used by specifying—

1.  the connection string of the database to export
2.  the export format: `N-TRIPLES, RDF/XML, TURTLE, TRIG`. default is
    'N-TRIPLES'— 'TRIG' must be used when exporting the entire database
    if the database contains triples inside named graphs.
3.  optionally, the URI of the named graph to export if you wish to
    export a single named graph only.
4.  the file to export to

For example,

```bash
$ stardog data export --format TURTLE myDatabase myDatabase_output.ttl

$ stardog data export --graph-uri http://example.org/context myDatabase myDatabase_output.nt
```

## Searching
Stardog includes an RDF-aware semantic search capability: it will index
RDF literals and supports information retrieval-style queries over
indexed data.

### Indexing Strategy

The indexing strategy creates a "search document" per RDF literal. Each
document consists of the following fields: literal ID; literal value;
and contexts.

### Search in SPARQL

We use the predicate `http://jena.hpl.hp.com/ARQ/property#textMatch` to
access the search index in a SPARQL query.

For example,

```bash
SELECT DISTINCT ?s ?score
WHERE {
?s ?p ?l.
( ?l ?score ) <http://jena.hpl.hp.com/ARQ/property#textMatch> ( 'mac' 0.5 50 ).
}
```
This query selects the top 50 literals, and their scores, which match
'mac' and whose scores are above a threshold of 0.5. These literals are
then joined with the generic BGP `?s ?p ?l` to get the resources (?s)
that have those literals. Alternatively, you could use
`?s rdf:type ex:Book` if you only wanted to select the books which
reference the search criteria; you can include as many other BGP's as
you like to enhance your initial search results.

### Searching with the Command Line

First, check out the CLI help for the
[search](/docs/man/query-search.html) subcommand:

```bash
$ stardog help query search
```

Okay, now let's do a search over the O'Reilly book catalog in RDF for
everything mentioning "html":

```bash
$ stardog query search -q "html" -l 10 catalog
```

The results?

```bash
Index    Score    Hit
====================
0    6.422    urn:x-domain:oreilly.com:product:9780596527402.IP
1    6.422    urn:x-domain:oreilly.com:product:9780596003166.IP
2    6.422    urn:x-domain:oreilly.com:product:9781565924949.IP
3    6.422    urn:x-domain:oreilly.com:product:9780596002251.IP
4    6.422    urn:x-domain:oreilly.com:product:9780596101978.IP
5    6.422    urn:x-domain:oreilly.com:product:9780596154066.IP
6    6.422    urn:x-domain:oreilly.com:product:9780596157616.IP
7    6.422    urn:x-domain:oreilly.com:product:9780596805876.IP
8    6.422    urn:x-domain:oreilly.com:product:9780596527273.IP
9    6.422    urn:x-domain:oreilly.com:product:9780596002961.IP
```

### Query Syntax

Stardog search is based on Lucene 4.2.0: we support all of the [search
modifiers](http://lucene.apache.org/java/3_4_0/queryparsersyntax.html)
that Lucene supports, with the exception of fields.

-   wildcards: `?` and `*`
-   fuzzy: `~` and `~` with similarity weights (e.g. `foo~0.8`)
-   proximities: `"semantic web"~5`
-   term boosting
-   booleans: `OR`, `AND`, `+`, `NOT`, and `-`.
-   grouping

For a more detailed discussion, see the [Lucene
docs](http://lucene.apache.org/java/3_3_0/queryparsersyntax.html).


## Obfuscating

When sharing sensitive RDF data with others, you might want to (selectively) obfuscate it so that sensitive bits are not present, but non-sensitive bits remain. For example, this feature can be used to submit Stardog bug reports using sensitive data.

Data obfuscation works much the same way as the `export` command and supports the same set of arguments:

```bash
$ stardog data obfuscate myDatabase obfDatabase.ttl
```

By default, all URIs, bnodes, and string literals in the database will be obfuscated using the SHA256 message digest algorithm. Non-string typed literals (numbers, dates, etc.) are left unchanged as well as URIs from built-in namespaces RDF, RDFS, and OWL. It is possible to customize obfuscation by providing a configuration file.

```bash
$ stardog data obfuscate --config obfConfig.ttl myDatabase  obfDatabase.ttl
```

The configuration specifies which URIs and strings will be obfuscated by defining inclusion and exclusion filters. See the example configuration file provided in the distribution for details.

Once the data is obfuscated, queries written against the original data will no longer work. Stradog provides query obfuscation capability, too, so that queries can be executed against the obfuscated data. If a custom configuration file is used to obfuscate the data, then the same configuration should be used for obfuscating the queries as well:

```bash
$ stardog query obfuscate --config obfConfig.ttl myDatabase myQuery.sparql > obfQuery.ttl
```
