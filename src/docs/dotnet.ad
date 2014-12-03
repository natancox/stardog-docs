---
quote: Syntactic sugar causes cancer of the semicolon.
layout: "default"
title: Programming with .Net
shortTitle: .Net
toc: true
---

## Introduction

In the [Network Programming](../network/) chapter, we looked at 
how to interact with Stardog over a network via HTTP and SNARL
protocols.  In this chapter we describe how to program Stardog 
from .Net using [dotNetRDF](http://www.dotnetrdf.org).

**Note**: this is an open source library developed and supported by third parties; 
questions or issues with the .Net API should be directed to
[dotNetRDF](http://www.dotnetrdf.org).

You should also be aware that dotNetRDF uses the HTTP API for all
communication with Stardog so you **must** enable 
the HTTP server to use Stardog from .Net. It's enabled by 
default so most users should not need to do anything to fulfill
this requirement.

If you're a Java developer see the [Programming with Java](../java)
chapter.  Alternatively If you're a Spring developer, you might want
to read the [Programming with Spring](../spring) chapter.  If you 
prefer a ORM-style approach, you might want to use 
[Empire](https://github.com/mhgrove/Empire), which is an implementation
of [JPA](http://www.oracle.com/technetwork/java/javaee/tech/persistence-jsp-140049.html) 
for RDF that works with Stardog.

## Creating & Administering Databases

The `StardogServer` class provides some limited administrative functionality by
implementing the dotNetRDF [Servers API][]

dotNetRDF actually provides several classes for administering a Stardog server:

- [StardogServer](http://www.dotnetrdf.org/api/index.asp?Topic=VDS.RDF.Storage.Management.StardogServer) - Connection for the current version of Stardog
- [StardogV2Server](http://www.dotnetrdf.org/api/index.asp?Topic=VDS.RDF.Storage.Management.StardogV2Server) - Connection for Stardog V2 servers
- [StardogV1Server](http://www.dotnetrdf.org/api/index.asp?Topic=VDS.RDF.Storage.Management.StardogV1Server) - Connection for Stardog V1 servers

This provides backwards compatibility for users who wish to communicate with 
older versions of Stardog.  Using the wrong connector for the version of 
Stardog you are running may result in errors.

[Servers API]: https://bitbucket.org/dotnetrdf/dotnetrdf/wiki/UserGuide/Storage/Servers

### Creating a Database

You can create a basic disk-backed database with Stardog with one line of code:

<gist>5732640</gist>

It is important to note that, as shown in the examples, you **should** take care
to always dispose of the `IStorageServer` and/or `IStorageProvider` instances you
create when you are done working with them.

You can also use the `StardogDiskTemplate` or `StardogMemTemplate` to configure a 
disk or memory-backed database with whatever options you desire; they both derive 
from `BaseStardogTemplate` which contains many properties that can be used 
to configure Stardog database options:

<gist>5732680</gist>

This illustrates how to create a disk backed database named 'id' which supports 
[full text search](../using/#sd-Searching) and has durable transactions
enabled.

The following shows how to create a disk backed database with ICV guard mode enabled
 at the QL reasoning type.  For more information on what the available
properties are see [BaseStardogTemplate](http://www.dotnetrdf.org/api/index.asp?Topic=VDS.RDF.Storage.Management.Provisioning.Stardog.BaseStardogTemplate),
for what they mean to Stardog please refer to the [admin docs](../admin/), 
specifically the section on administering a database.

<gist>5732690</gist>

For performing other basic administrative tasks via dotNetRDF please refer to the
[Servers API][] documentation. Also note, Stardog database administration can be performed from the 
[command line](../admin/) which is substantially more powerful and 
supports bulk loading of data at database creation time which 
dotNetRDF does not currently support.

## Connecting to a Database

Connecting to a database can be done using the dotNetRDF [Storage API][],
this provides a [StardogConnector](http://www.dotnetrdf.org/api/index.asp?Topic=VDS.RDF.Storage.StardogConnector)
which implements their `IStorageProvider` interface.

Making a connection requires at a minimum knowing the Base URI of your Stardog server 
and the name of the database.  The Base URI is the HTTP URL that Stardog prints 
out when you start up the server and is typically of the form `http://machine:5820`
where `machine` is replaced with the name of the host on which the server
is running and `5820` changed only if you have configured Stardog to run 
on a different HTTP port than the default.  As Stardog implements comprehensive 
[security](../security/), you will also likely require user credentials.

[Storage API]: https://bitbucket.org/dotnetrdf/dotnetrdf/wiki/UserGuide/Storage%20API

<gist>5732808</gist>

dotNetRDF actually provides several classes for connecting to a Stardog server:

- [StardogConnector](http://www.dotnetrdf.org/api/index.asp?Topic=VDS.RDF.Storage.StardogConnector) - Connection for the current version of Stardog
- [StardogV2Connector](http://www.dotnetrdf.org/api/index.asp?Topic=VDS.RDF.Storage.StardogV2Connector) - Connection for Stardog V2 servers
- [StardogV1Connector](http://www.dotnetrdf.org/api/index.asp?Topic=VDS.RDF.Storage.StardogV1Connector) - Connection for Stardog V1 servers

This provides backwards compatibility for users who wish to communicate with older 
versions of Stardog.  Using the wrong connector for the version of Stardog you
are running may result in errors.

Connections to Stardog also allow you to specify the reasoning mode used for queries 
as part of the connection information like so:

<gist>5732812</gist>
  
Note that is it possible to change the reasoning mode used at any time by
changing the value of the `Reasoning` property, _though remember that this 
only affects subsequently issued queries i.e. it does not affect queries
that are already in-flight_.

## Using the Storage API

This section covers how to carry out various common operations against Stardog 
using dotNetRDF's [Storage API][], you may wish to refer to their 
[Triple Store Integration][] documentation for some more generic examples of
using this API.

[Triple Store Integration]: https://bitbucket.org/dotnetrdf/dotnetrdf/wiki/UserGuide/Triple%20Store%20Integration
  
When using this API transactions are primarily handled for you with the connection 
operating in auto-commit mode by default, any write operations will automatically use 
a new transaction and commit or roll it back as appropriate.

Transactions may be manually managed using the `Begin()`, `Commit()` and `Rollback()` 
methods, and read operations will only use transactions when they run in the context of 
an active transaction.

### Adding Data

The simplest way to add data is to call the `SaveGraph()` method which saves a RDF 
graph to the store.

<gist>5786144</gist>

By default, RDF added will go to the named graph corresponding to the `BaseUri` 
property of the provided graph unless it is `null` in which case it gets added
to the default graph.
	  
When you use the `SaveGraph()` method the exact behaviour depends on the target 
graph, saving to the default graph appends data while saving to named graph 
overwrites data.  You can inspect the `IOBehaviour` property to see all flags 
that apply to Stardog connectivity when used via dotNetRDF.
	  
### Modifying Data
	  
If you want to add or remove data from an existing graph, then you can use the 
`UpdateGraph()` method, which takes a URI for the graph to update and collections 
of triples to be added and removed.  _Note that removals are always processed 
before additions_.
	  
<gist>5833189</gist>
	  
### Loading Data
  
Since the `IStorageProvider` API is primarily graph-oriented the simplest way 
to load data is to load an entire graph from a database:

<gist>5786161</gist>

If you need more fine grained control over loading data then you should make 
an appropriate SPARQL Query as detailed later in this chapter.

### Removing Data

As previously mentioned the `IStorageProvider` API is graph-oriented, you can
delete an entire graph from your Stardog database using the `DeleteGraph()`
method:

<gist>7230262</gist>

Alternatively if you want to remove specific triples you should use the 
`UpdateGraph()` method as already shown in the earlier Modifying Data section

## Making SPARQL Queries

You can make a SPARQL query simply by calling the `Query()` method which is
from the [IQueryableStorage](http://www.dotnetrdf.org/api/index.asp?Topic=VDS.RDF.Storage.IQueryableStorage)
interface.  SPARQL queries may be passed in directly as strings like so:

<gist>7230219</gist>

We **strongly** recommend the use of the parameterized query support over 
concatenating strings together in order to build your SPARQL query.  This 
latter approach opens up the possibility for SPARQL injection attacks 
unless you are very careful in scrubbing your input.  This can be done using
the [SparqlParameterizedString](http://www.dotnetrdf.org/api/index.asp?Topic=VDS.RDF.Query.SparqlParameterizedString)
class like so:

<gist>7230407</gist>

dotNetRDF uses the ADO.Net style `@param` to specify parameters in the query string
which then must have values set for them using the relevant methods prior to calling
`ToString()` to retrieve the final query string.

### Reasoning

Stardog supports various levels of reasoning by using a query rewriting technique.
In short, when reasoning is requested, a query is automatically rewritten into *n* 
queries, which are then executed. As mentioned earlier reasoning is enabled at the 
`StardogConnector` layer and then any queries executed over that connection are 
executed with reasoning enabled; you don't need to do anything up front when you 
create your database if you want to use reasoning.  The in-use reasoning mode for 
your connection may be changed at any time by setting the `Reasoning` property 
appropriately.

For more information on how reasoning is supported in Stardog, check out the 
[reasoning section](../owl2/)


## Making SPARQL Updates

From dotNetRDF 1.0.3 onwards it is possible to make native SPARQL updates against Stardog 
when using the `StardogV2Connector` or the `StardogConnector`.  SPARQL Updates are
made simply by calling the `Update()` method which is from the 
[IUpdateableStorage](http://www.dotnetrdf.org/api/index.asp?Topic=VDS.RDF.Storage.IUpdateableStorage)
interface.  SPARQL Updates may be passed in directly as strings like so:

<gist>8019566</gist>

We **strongly** recommend the use of the parameterized update support over 
concatenating strings together in order to build your SPARQL update.  This 
latter approach opens up the possibility for SPARQL injection attacks 
unless you are very careful in scrubbing your input.  This can be done using
the [SparqlParameterizedString](http://www.dotnetrdf.org/api/index.asp?Topic=VDS.RDF.Query.SparqlParameterizedString)
class like so:

<gist>8019591</gist>

dotNetRDF uses the ADO.Net style `@param` to specify parameters in the query string
which then must have values set for them using the relevant methods prior to calling
`ToString()` to retrieve the final query string.

### Approximating Stardog Updates

Even when using older versions of dotNetRDF or older versions of Stardog which do not
support SPARQL Update natively it is still possible to perform SPARQL Updates on
Stardog using dotNetRDF's approximated update support.

To do this you create a [GenericUpdateProcessor](http://www.dotnetrdf.org/api/index.asp?Topic=VDS.RDF.Update.GenericUpdateProcessor)
instance which wraps your `IStorageProvider` instance.  This provides a `ProcessCommandSet()`
method which takes in a [SparqlUpdateCommandSet](http://www.dotnetrdf.org/api/index.asp?Topic=VDS.RDF.Update.SparqlUpdateCommandSet)
instance and executes it against the underlying store.  Where the underlying store does
not support SPARQL Update natively it does its best to translate the update commands into
their equivalent Storage API operations to execute the update as faithfully as possible.

<gist>8019694</gist>

**Note:** You can safely use the `GenericUpdateProcessor` even with newer versions of
dotNetRDF and Stardog where native SPARQL Update is supported since if the underlying
store supports SPARQL Update natively the `GenericUpdateProcessor` delegates execution
to the stores `Update()` method.
	  
## dotNetRDF Documentation</h2>

Please see the [dotNetRDF API](http://www.dotnetrdf.org/api/) docs for more detailed
information on the available APIs or see the [dotNetRDF User Guide](http://bitbucket.org/dotnetrdf/dotnetrdf/wiki/User%20Guide)
for a more general overview of dotNetRDF.