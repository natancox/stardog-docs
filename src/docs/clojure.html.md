---
quote: It is better to have 100 functions operate on one data structure than 10 functions on 10 data structures.
title: Programming with Clojure
shortTitle: Clojure
layout: default
toc: true
---

[Clojure](http:/clojure.org) isClojure is a dialect of Lisp, and shares with Lisp the code-as-data philosophy and
a powerful macro system. Clojure is predominantly a functional programming language, and features a rich set of immutable,
persistent data structures. Stardog's Clojure suppoort makes life easier for developers who need to work with RDF, SPARQL, and
OWL by way of Stardog using the facilities of Clojure.

The Stardog-clj [source
code](http://github.com/clarkparsia/stardog-clj) is available on
Github and licensed under the Apache 2.0 license.

For version 0.1.0, installation is done by building and running a local "lein install" or the artifact.  Future versions will be available in Clojars.



## Overview

Stardog-clj provides a set of functions as API wrappers to the native
SNARL API.  These functions provide the basis for working with Stardog,
starting with connection management, connection pooling, and the core parts
of the API, such as executing a SPARQL query or adding and removing RDF from
the Stardog database.  Over time, other parts of the Stardog API will be appropriately
wrapped with Clojure functions and idiomatic Clojure data structures.


For the first release, Stardog-clj provides the following features:

1.  Specification based descriptions for connections, and corresponding "connection" and "with-connection-pool" functions and macros
2.  Functions for query, ask, graph, and update to execute SELECT< ASK, CONSTRUCT, and SPARQL-Update queries respectively
3.  Functions for insert and remove, for orchestrating the Adder and Remover APIs in SNARL
4.  Macros for resource handling, including with-connection-tx, with-connnection-pool, and with-transaction
5.  Support for programming Stardog applications with either the connection pool or direct handling of the connection
6.  Idiomatic clojure handling of data structures, with converters that can be passed to query functions

The API with source docs can be found in the stardog.core and stardog.values namespaces.

## API Overview

The API provides a natural progression of functions for interacting with Stardog

<dl class="metro">
<dt>`(create-db-spec "testdb" "snarl://localhost:5820/" "admin" "admin" "none")`</dt>
<dd>Creates a connection spec, for use in `connect` or `make-datasource` with the potential parameters:
`{:url "snarl://localhost:5820/" :db "testdb" :pass "admin" :user "admin" :max-idle 100 :max-pool 200 :min-pool 10 :reasoning "none"}`</dd>
<dt>`(connect db-spec)`</dt>
<dd>Creates a single Connection using the database spec.  Can be used with standard `with-open` macro, `with-transaction`, `with-connection-tx`.</dd>
<dt>`(make-datasource db-spec)`</dt>
<dd>Creates a data source, i.e. ConnectionPool, using the database spec.  Best used within the `with-connection-pool` macro.</dd>
<dt>`(with-transaction [connection...] body)`</dt>
<dd>Executes the body with a transaction on each of the connections.</dd>
<dt>`(with-transaction [connection...] body)`</dt>
<dd>Executes the body with a transaction on each of the connections.</dd>
<dt>`(with-connection-tx binding-forms body)`</dt>
<dd>Establishes a connection and a transaction to execute the body within.</dd>
<dt>`(with-connection-pool [con pool] .. con, body ..)`</dt>
<dd>Evaluates body in the context of an active connection obtained from the connection pool.</dd>
</dl>

Using these functions, queries can then be made against the database.

`query`

Executes a query and returns results. When constructing a query from text, the parameters are:

-   connection: The connection to query over (required).
-   text: The text of the connection (String - required).

Remaining argument are optional, and may be positional args, a map of args, or named args. Mapped and named args use the keys:

-   base, parameters, reasoning, limit, offset, converter, key-converter

Positional arguments are in order:

-   base: The base URI for the query (String).
-   parameters: A parameter map to bind parameters in the query (Map).
-   reasoning: The type of reasoning to use with the query (String/keyword).
-   converter: A function to convert returned values with (Function).
-   key-converter: A function to convert returned binding names with (Function).
-   limit: The limit for the result. Must be present to use offset (integer).
-   offset: The offset to start the result (integer)."




## Building Stardog-clj

To build Stardog-clj, you need a release of Stardog; we use
[Leiningen](http://leiningen.org/) as the build tool. Then,

1. Download stardog from [Stardog.com](http://www.stardog.com)
2. Run "mavenInstall" from the stardog-2.1.2/bin folder
3. Run "stardog-admin server start"
4. Run "stardog-admin db create -n testdb data/University0_0.owl"
5. You can now run lein compile, use the lein repl, and run lein midje to perform the tests
6. Run "lein install", which will install stardog-clj into ~/.m2/repository/stardog-clj/stardog-clj


## Examples

Here are some examples of using stardog-clj

### Create a connection and run a query

<gist>10039066?file=Stardog.clj</gist>

### Insert data

<gist>10039743?file=StardogInsert.clj</gist>

### Run a query with a connection pool

<gist>10041003?file=StardogPool.clj</gist>



