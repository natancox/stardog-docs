+++
date = "2015-01-22T14:48:27-05:00"
draft = false 
title = "A Preview of Stardog 3: Part Three"
author = "Kendall Clark"
+++

In this final preview of Stardog 3, we examine improvements in Search,
Custom Aggregates, ...

<!--more-->

## Search

Previously we used the default Analyzer in Lucene for our search
index.  This works fine in most cases, but there are situations where
you'll want to use your own stop word list, or be able to include
Analyzer's for different languages.  So in Stardog 3.0 we added the
ability to override the default and specify which Analyzer will be
used when indexing your RDF.  Now you can use any of the bundled
Lucene Analyzers when indexing or even your own.

## Custom Aggregates

The SPARQL specification defines an extensibility mechanism for
filter/bind functions in 17.6 (Extensible Value Testing).  This
provides a convenient way for users to implement domain specific
functions, identified by URIs, and use them in filter, bind, or
projection expressions the same way they'd use any other function,
such as str.  Unfortunately, the spec did not allow for user-defined
aggregate functions, and user-defined functions were not valid to use
in aggregations.  In Stardog 3.0 we've added this capability.  Now
users can specify their own aggregate functions, such as Geometric
mean, using the same mechanisms for custom user-defined functions.
This is done without modifying SPARQL syntax; no new keywords are
added.  The only catch is you have to prefix your aggregate function
with the token "agg:" in your SPARQL query:

<pre><code class="sparql">PREFIX agg: &lt;urn:agg>
PREFIX stardog: &lt;tag:stardog:api:>

SELECT (agg:stardog:gmean(distinct ?O) AS ?mean)
WHERE { ?S ?P ?O }
</code></pre>

There are a couple things to note, the `PREFIX` declaration for agg is
not needed. But including it makes the query portable across SPARQL
systems; "agg:stardog:gmean" is a valid QName, so, by including the
prefix, that query will parse in correctly in any compliant SPARQL
parser.  However in Stardog 3.0, we'll notice the "agg:" token and
that will get consumed and, in this case, the custom aggregate with
the QName "stardog:gmean" will be used over the group of bindings for
?o.

