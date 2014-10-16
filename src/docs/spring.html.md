---
quote: "It goes against the grain of modern education to teach children to program. What fun is there in making plans, acquiring discipline in organizing thoughts, devoting attention to detail and learning to be self-critical?"
title: Programming with Spring
shortTitle: Spring
layout: default
toc: true
---

The Spring for Stardog [source code](http://github.com/clarkparsia/stardog-spring) is available on Github.

Binary releases are available on the [Github release page](https://github.com/clarkparsia/stardog-spring/releases).

As of 2.1.3, Stardog-Spring and Stardog-Spring-Batch can both be retrieved from Maven central:

*   `com.complexible.stardog:stardog-spring:2.1.3`
*   `com.complexible.stardog:stardog-spring-batch:2.1.3`

The corresponding Stardog Spring version will match the Stardog release, e.g. stardog-spring-2.2.2 for Stardog 2.2.2.

## Overview

Spring for Stardog makes it possible to rapidly build Stardog-backed applications with the Spring Framework. As with many other parts of Spring, Stardog's Spring
integration uses the template design pattern for abstracting standard
boilerplate away from application developers.

Stardog Spring can be included via Maven with "com.complexible.stardog:stardog-spring:version" and "com.complexible.stardog:stardog-spring-batch" for Spring Batch support.  Both of these dependencies require the local "mavenInstall" script be run,
and the Stardog Spring packages installed in Maven.  Embedded server is still supported, but via providing an implementatino of the Provider interface.
This enables users of the embedded server to have full control over how to use the embedded server.

At the lowest level, Spring for Stardog includes

1.  `DataSouce` and `DataSourceFactoryBean` for managing Stardog
    connections
2.  `SnarlTemplate` for transaction- and connection-pool safe Stardog
    programming
3.  `DataImporter` for easy bootstrapping of input data into Stardog

In addition to the core capabilities, Spring for Stardog also integrates
with the Spring Batch framework. Spring Batch enables complex batch
processing jobs to be created to accomplish tasks such as ETL or legacy
data migration. The standard ItemReader and ItemWriter interfaces are
implemented with a separate callback writing records using the SNARL
Adder API.

Future releases of Spring for Stardog will address other command
enterprise capabilities: Spring Integration, Spring Data, etc.

## Building Spring for Stardog

To build Spring for Stardog, you need a release of Stardog; we use
[Gradle](http://www.gradle.org/) to build Stardog for Spring.  Gradle 1.9 is the preferred version. Then,

-   edit `build.gradle` to point `stardogLocation` at a Stardog release
    directory;
-   run `gradlew`, which will download and bootstrap a gradle build
    environment;
-   then run `gradlew build`, which eventually results in a
    `stardog-spring.jar` in `build/libs`; finally,
-   `gradlew install` does a build, generates a POM, and installs the
    POM in local Maven repo; alternately, though generally you should use the latest from Maven Central.

Note: The stardogLocation and "fileTree" dependency is included in development of Stardog Spring, as a local embedded server is used for automated testing.  Before running the build, you should edit the "CHANGE" areas in teh build file to point to your local Stardog instance.  See the README on the respective Github projects for more details.


## Basic Spring

There are three Beans to add to a Spring application context:

-   `DataSourceFactoryBean`: `com.clarkparsia.stardog.ext.spring.DataSourceFactoryBean`
-   `SnarlTemplate`: `com.clarkparsia.stardog.ext.spring.SnarlTemplate`
-   `DataImporter`: `com.clarkparsia.stardog.ext.spring.DataImporter`

`DataSourceFactoryBean` is a Spring `FactoryBean` that configures and
produces a `DataSource`. All of the Stardog `ConnectionConfiguration`
and `ConnectionPoolConfig` methods are also property names of the
`DataSourceFactoryBean`--for example, "to", "url", "createIfNotPresent".

`DataSource` is a Spring for Stardog class, similar to
`javax.sql.DataSource`, that can be used to retrieve a `Connection` from
the `ConnectionPool`. This additional abstraction serves as place to add
Spring-specific capabilities (e.g. `spring-tx` support in the future)
without directly requiring Spring in Stardog.

`SnarlTemplate` provides a template abstraction over much of Stardog's
native API, [SNARL](/java), and follows the same approach of other
Spring template, i.e., `JdbcTemplate`, `JmsTemplate`, and so on.

Spring for Stardog also comes with convenience mappers, for
automatically mapping result set bindings into common data types. The
`SimpleRowMapper` projects the `BindingSet` as a `List>` and a
`SingleMapper` that accepts a constructor parameter for binding a single
parameter for a single result set.

For example,

<gist>4570152?file=SingleMapper.java</gist>

The key methods on `SnarlTemplate` include the following:

    query(String sparqlQuery, Map args, RowMapper)

`query()` executes the SELECT query with provided argument list, and
invokes the mapper for result rows.

    doWithAdder(AdderCallback)

`doWithAdder()` is a transaction- and connection-pool safe adder call.

    doWithGetter(String subject, String predicate, GetterCallback)

`doWithGetter()` is the connection pool boilerplate method for the
`Getter` interface, including the programmatic filters.

    doWithRemover(RemoverCallback)

`doWithRemover()` As above, the remover method that is transaction and
pool safe.

    execute(ConnectionCallback)

`execute()` lets you work with a connection directly; again, transaction
and pool safe.

    construct(String constructSparql, Map args, GraphMapper)

`construct()` executes a SPARQL CONSTRUCT query with provided argument
list, and invokes the `GraphMapper` for the result set.

`DataImporter` is a new class that automates the loading of RDF files
into Stardog at initialization time.

It uses the Spring Resource API, so files can be loaded anywhere that is
resolvable by the Resource API: classpath, file, url, etc. It has a
single load method for further run-time loading and can load a list of
files at initialization time. The list assumes a uniform set of file
formats, so if there are many different types of files to load with
different RDF formats, there would be different `DataImporter` beans
configured in Spring.

Here's a sample `applicationContext`:

<gist>1115889?file=applicationContext.xml</gist>

Another example with reasoning and credentials set in the factory bean:

<gist>8747480?file=stardog-spring.xml</gist>

## Spring Batch

In addition to the base `DataSource` and `SnarlTemplate`, Spring Batch
support adds the following:

-   `SnarlItemReader`:
    `com.clarkparsia.stardog.ext.spring.batch.SnarlItemReader`
-   `SnarlItemWriter`:
    `com.clarkparsia.stardog.ext.spring.batch.SnarlItemWriter`
-   `BatchAdderCallback`:
    `com.clarkparsia.stardog.ext.spring.batch.BatchAdderCallback`

These beans can then be used within Spring Batch job definition, for
example:

<gist>4570209?file=batchContext.xml</gist>


## Examples

### query() with SELECT queries

<gist>1115894?file=spring-select.java</gist>

### doWithGetter

<gist>1115915?file=dowithgetter.java</gist>

### doWithAdder

<gist>1115915?file=doWithAdder.java</gist>

### doWithRemover

<gist>1115915?file=doWithRemover.java</gist>

### construct()

<gist>1115915?file=construct.java</gist>

### update()

<gist>7846171?file=StardogSpringUpdate.java</gist>

### ask()

<gist>7846198?file=StardogSpringAsk.java</gist>



