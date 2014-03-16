---
quote: Making something variable is easy. Controlling duration of constancy is the trick.
title: Programming with Groovy
shortTitle: Groovy
layout: default
toc: true
---

[Groovy](http://http://groovy.codehaus.org//) is an agile and dynamic
programming language for the JVM, making popular programming features
such as closures available to Java developers. Stardog's Groovy support
makes life easier for developers who need to work with RDF, SPARQL, and
OWL by way of Stardog.

The Groovy for Stardog [source
code](http://github.com/clarkparsia/stardog-groovy) is available on
Github.

Binary releases are available on the [Github release page](https://github.com/clarkparsia/stardog-groovy/releases).

As of version 2.1.2, Stardog-Groovy can be included via "com.complexible.stardog:stardog-groovy:2.1.2" after installing the local jars in your M2 repo.  Using the embedded server with Stardog Groovy is not supported in 2.1.2, due to conflicts of the asm library for various third party dependencies.  If you wish to use the embedded server with similar convenience APIs, please try [Stardog Spring](http://docs.stardog.com/spring/). 

## Overview

Groovy for Stardog <t>springVersion</t> provides a set of Groovy API
wrappers for developers to build applications with Stardog and take
advantage of native Groovy features. For example, you can create a
Stardog connection pool in a single line, much like Groovy SQL support.
In Groovy for Stardog, queries can be iterated over using closures and
transaction safe closures can be executed over a connection.

For the first release, Groovy for Stardog includes
`com.clarkparsia.stardog.ext.groovy.Stardog` with the following methods:

1.  `Stardog(map)` constructor for managing Stardog connection pools
2.  `each(String, Closure)` for executing a closure over a query's
    results, including projecting SPARQL result variables into the
    closure.
3.  `query(String, Closure)` for executing a closure over a query's
    results, passing the BindingSet to the closure
4.  `insert(List)` for inserting a list of vars as a triple, or a list
    of list of triples for insertion
5.  `remove(List)` for removing a triple from the database
6.  `withConnection` for executing a closure with a transaction safe
    instance of
    [Connection](http://stardog.com/docs/java/snarl/com/clarkparsia/stardog/api/Connection.html)

In addition to the core capabilities, Groovy for Stardog also integrates
with the Spring bindings and can use a `DataSource` to initialize the
constructor. Combining both together creates an easy to use solution for
other Groovy environments, such as [Grails](http://www.grails.org).

## Building Groovy for Stardog

To build Groovy for Stardog, you need a release of Stardog; we use
[Gradle](http://www.gradle.org/) to build Stardog for Groovy. Then,

1.   Download and run a Stardog server with a "testdb", used for testing.
1.   run `gradlew build`, which eventually results in a
    `stardog-groovy.jar` in `build/libs`; finally,
1.   `gradlew install` does a build, generates a POM, and installs the
    POM in local Maven repo; alternately,

`mvn install` will work, too:

```java
mvn install:install-file
    -DgroupId=com.clarkparsia.stardog
    -DartifactId=stardog-groovy
    -Dversion=2.1.2
    -Dfile=stardog-groovy.jar
    -Dpackaging=jar
    -DpomFile=pom.xml```

## Examples

Here are some examples of the more interesting parts of Stardog Groovy.

### Create a Connection

<gist>4652565?file=StardogConnection.groovy</gist>

### SPARQL Vars Projected into Groovy Closures

<gist>4652590?file=Projection.groovy</gist>

###  Add & Remove Triples

<gist>4652608?file=StardogAddRemove.groovy</gist>

### `withConnection` Closure

<gist>4652621?file=StardogWithConnection.groovy</gist>

###  SPARQL Update Support

<gist>7862684?file=StardogGroovyUpdate.groovy</gist>


