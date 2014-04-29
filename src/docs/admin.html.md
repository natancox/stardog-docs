---
quote: "In man-machine symbiosis, it is man who must adjust: The machines can't."
title: "Administration"
layout: default
related: ""
toc: true
---

In this chapter we describe the administration of Stardog Server and
Stardog databases, including the various
Stardog command-line programs, configuration options, etc. Security is an important part of Stardog administration; it's
discussed in a separate [chapter](../security).

## Command Line Interface

Stardog's command-line interface (CLI) comes in two parts:

1. `stardog-admin`: admininstrative client (uses HTTP or SNARL)
2. `stardog`: a user's client (uses HTTP or SNARL)

The admin and user's tools operate on local or remote databases, using
either HTTP or SNARL Protocols. Both of these CLI tools are Unix-only,
are self-documenting, and the help output of these tools is their
canonical documentation.

The CLI tools were completely rewritten for Stardog 1.2: online
documentation, including examples, is much more extensive; and the
commands and their arguments are rationalized and consistent. The
documentation of these tools in this chapter goes into more detail,
offers background, etc. But if there is a conflict between this
documentation and the output of the CLI tools' `help` command, the CLI
tools' output is correct.

### Help

To use the Stardog CLI tools, you can start by asking them to display
help:

``` bash
stardog help
```

Or:

``` bash
$ stardog-admin help
```

And for the very laziest among us, these work too:

``` bash
$ stardog

$ stardog-admin
```

### Security Considerations

We split the functionality into two CLI programs
because of security: `stardog-admin` will need, in
production environments, to have considerably tighter access
restrictions than `stardog`.

<div class="metro danger large label">Security Notice</div>

For usability, Stardog <t>version</t> provides a
default user "admin" and password "admin" in `stardog-admin` commands
if no user or password are given. This is obviously **not secure**;
before any serious use of Stardog is contemplated, read the
[security](../security) chapter at least twice, and
then--minimally--change the administrative password to something we
haven't published on the interwebs!

### Command Groups

The CLI tools both contain a lot of functionality; we've introduced
"command groups" to make CLI subcommands easier to find. To print help
for a particular command group, just ask for help:

```bash
$ stardog help [command_group_name]
```

The command groups and their subcommands include

- data: add, remove, export;
- query: search, execute, explain, status;
- reasoning: explain, consistency; namespace: add, list, remove;
- server: start, stop;
- metadata: get, set;
- user: add, drop, edit, grant, list, permission, revoke, passwd;
- role: add, drop, grant, list, permission, revoke;
- db: backup, copy, create, drop, migrate, optimize, list, online, offline, repair, restore, status.

The main help command for either CLI tool will print a listing of the
command groups:

```bash
usage: stardog  []

The most commonly used stardog commands are:
    data        Commands which can modify or dump the contents of a database
    help        Display help information
    icv         Commands for working with Stardog Integrity Constraint support
    namespace   Commands which work with the namespaces defined for a database
    query       Commands which query a Stardog database
    reasoning   Commands which use the reasoning capabilities of a Stardog database
    version     Prints information about this version of Stardog

See 'stardog help ' for more information on a specific command.
```

To get more information about a particular command, simply issue the
help command for it including its command group:

```bash
$ stardog help query execute
```

Finally, everything here about command groups, commands, and online help
works equally well for `stardog-admin`.

The result of all these changes is a better user experience:

```bash
$ stardog reasoning consistency -u myUsername -p myPassword -r QL myDB

$ stardog-admin db migrate -u myUsername -p myPassword myDb
```

### Autocomplete

Stardog 1.2 also includes support for CLI autocomplete via the bash
autocomplete feature. To install autocomplete for bash shell, you'll
first want to make sure bash completion is installed:

#### Homebrew

```bash
$ brew install bash-completion
```

Then enable it in .bash\_profile:

```bash
if [ -f `brew --prefix`/etc/bash_completion ]; then
  . `brew --prefix`/etc/bash_completion
fi
```
#### MacPorts

First, you really should be using Homebrew; you feel me?

If not, then:

```bash
$ sudo port install bash-completion
```

Enable it in .bash\_profile:

```bash
if [ -f /opt/local/etc/bash_completion ]; then
   . /opt/local/etc/bash_completion
fi
```

Finally, an example for our Linux friends:

#### Ubuntu

```bash
$ sudo apt-get install bash-completion
```

#### Fedora

```bash
$ sudo yum install bash-completion
```

#### All Platforms

Now put the Stardog autocomplete script—`stardog-completion.sh`—into yr
bash\_completion.d directory, typically one of
`/etc/bash_completion.d, /usr/local/etc/bash_completion.d or ~/bash_completion.d.`

Alternately you can put it anywhere you want, but tell `.bash_profile`
about it:

```bash
source ~/.stardog-completion.sh
```

### How to Make a Connection String

We've simplified connection strings in Stardog 1.2 to improve usability.
A connection string may consist solely of the database name in cases
where (a) Stardog is running on the standard ports; (b) SNARL is
enabled; and (c) the command is invoked on the same machine where the
server is running. In any other cases, a "fully qualified" connection
string, as described below, is required.

Additionally, we've rationalized the method of specifying the connection
string: instead of using the `-c` option in a command, the connection
string is now assumed to be the first argument of the command.

Some CLI subcommands require a Stardog connection string as an argument
to identify the server and database upon which operations are to be
performed. Connection strings are URLs and may either be local to the
machine where the CLI is run or they may be on some other remote
machine. There are two URL schemes recognized by Stardog: `http://` and
`snarl://`. The former uses Stardog's (extended) version of SPARQL
Protocol; the latter uses Stardog's native data access protocol, called
SNARL, which is based on Google's Protocol Buffers.

As of Stardog 1.2, in `stardog-admin` the `--server` option for setting
the default server is a global arg.

Note: `stardog-admin` and `stardog` user's client works with HTTP or
SNARL Protocol, interchangeably.SNARL is faster than HTTP in cases where
payloads to and from the server are relatively *small*; for payloads
that are large, raw transfer time dominates and there isn't much or any
difference in performance.

### Example Connection Strings

To make a connection string, you need to know the URL scheme; the
machine name and port the Stardog Server is running on; any (optional)
URL path to the database (it's very unlikely you'll need this); and the
name of the database:

```http
{scheme}{machineName}:{port}/{databaseName};{connectionOptions}
snarl://server/billion-triples-punk
http://localhost:5000/myDatabase
http://169.175.100.5:1111/myOtherDatabase;reasoning=QL
snarl://stardog:8888/the_database
snarl://localhost:1024/db1;reasoning=NONE
```

Using the default ports for SNARL and HTTP protocols simplifies
connection strings. `connectionOptions` are a series of `;` delimited
key-value pairs which themselves are `=` delimited. Key names must be
**lowercase** and their values are case-sensitive.

Finally, in the case where the scheme is SNARL, the machine is
"localhost", and the port is the default SNARL port, a connection string
may consist of the "databaseName" only.

## Server Admin

Stardog Server is multi-protocol beast: it supports both SNARL and HTTP
protocols. The default port for SNARL is **5820**; the default port for
HTTP is **5822**. **All administrative functions work over SNARL or HTTP
protocols.**

<div id="sd-HTTP-SNARL-Unification"></div>
### HTTP & SNARL Server Unification <t>new2</t>

To use any of these commands against a remote server, pass a global
`--server` argument with an HTTP or SNARL URL.

**Note**: If you are running `stardog-admin` on the same machine where
Stardog Server is running, and you're using the default protocol ports,
then you can omit the `--server` argument and simply pass a database
name via `-n` option. Most of the following commands assume this case
for ease of exposition.

### Server Security

See the [Security Chapter](../security) for information about Stardog's
security system, secure deployment patterns, and more.

### Configuring Stardog Server

**Note**: the properties described in this section control the behavior
of the Stardog Server (whether HTTP or SNARL protocols are in use); to
set properties or other metadata on individual Stardog *databases*, see
[Administering a Database](#admin-database).

Stardog Server's behavior can be configured via the JVM arg
`stardog.home`, which sets Stardog Home, overriding the value of
`STARDOG_HOME` set as an environment variable. Stardog Server's behavior
can also be configured via a `stardog.properties`—which is a Java
Properties file—file in `STARDOG_HOME`. To change the behavior of a
running Stardog Server, it is necessary to restart it.

The following twiddly knobs for Stardog Server are available in
`stardog.properties`:<fn>For more details about configuring these values, see the `examples/stardog.properties` file that is distributed with Stardog.</fn>

1.  `strict.parsing`: Controls whether Stardog parses RDF strictly
    (`true`, the default) or laxly (`false`)
2.  `query.all.graphs`: Controls what Stardog Server queries over; if
    `true`, it will query over the default graph and the union of all
    named graphs; if `false` (the default), it will query only over the
    default graph.
3.  `query.timeout`: Sets the upper bound for query execution time
    that's inherited by all databases unless explicitly overriden. See
    [Query Management](#manage-queries) section below for details.
4.  `logging.[access,audit].[enabled,type,file]`: Controls whether and
    how Stardog logs server events; described in detail below.
5.  `logging.slow_query.enabled`, `logging.slow_query.time`, `logging.slow_query.type`:
    The three slow query logging options are
    used in the following way. To enable logging of slow queries, set
    `enabled` to `true`. To define what counts as a "slow" query, set
    `time` to a time duration value (positive integer plus "h", "m",
    "s", or "ms" for hours, minutes, seconds, or milliseconds
    respectively). To determine the type of logging, set `type` to
    `text` (the default) or `binary`. **To state the obvious explicitly,
    a `logging.slow_query.time` that exceeds the value of
    `query.timeout` will result in null logs.**
6.  `database.connection.timeout.ms`: Controls how long, in
    milliseconds,connections may idle before being automatically closed
    by the server.
7.  `http.max.connections`: The next two parameters control the maximum
    number of simultaneous connections that the Stardog client will use; for more
    information, see the [relevant Apache
    docs](http://hc.apache.org/httpcomponents-client-ga/tutorial/html/connmgmt.html).
8. `http.max.get.query.length`: The length in characters of the longest
    SPARQL query that will be serialized via HTTP `GET`; queries longer
    are serialized via `POST`.
9. `bnode.preserve.id`: Determines how the Stardog parser handles bnode
    identifiers that may be present in (some) RDF input. If this
    property is enabled (i.e., `TRUE`), parsing and data loading
    performance are improved; but the other effect is that if distinct
    input files use (randomly or intentionally) the same bnode
    identifier, that bnode will point to one and the same node in the
    database. If you have input files that use explicit bnode
    identifiers, and multiple files may use the asame bnode idenitifers,
    and you don't want those bnodes to be smushed into a single node in
    the database, then this configuration option should be disabled (set
    to `FALSE`).
10. `load.parser.count`, `load.processor.count`: Determines the number of parser and
     processor threads, respectively, to be used during bulk loading
     of data at database creation time. The default values are `3`
     and `4` respectively, but they may be set higher, to good effect,
     if you have mulitcore CPUs. The former is effective only if multiple
     input files are being processed; the latter is effective even
     if a single file is processed as input. The heuristic for these settings is

     * the value of `load.parser.count` + `load.processor.count` should neither exceed `20` nor be equal to or greater than the number of available cores
     * the two values should be roughly equal
     * the values don't have much effect unless or until you're loading billions of triples
11. `password.length.min`: Sets the password policy for the minimum length of 
    user passwords, the value can't be lower than 1 or greater than `password.length.max`. 
    Default: `4`.
12. `password.length.max`: Sets the password policy for the maximum length of 
    user passwords, the value can't be greater than 20 or lower than 1. Default: `20`.
13. `password.regex`: Sets the password policy of accepted chars in user passwords, via a 
    Java regular expression. Default: `[\\w@#$%]+`

### Starting & Stopping the Server

**Note**: Unlike the other `stardog-admin` subcommands, starting the
server may only be run locally, i.e., on the same machine
the Stardog Server will run on.

The simplest way to start the server—running on the default port,
detaching to run as a daemon, and writing
`stardog.log` to the current working directory— is

```bash
$ stardog-admin server start
```

To specify parameters:

```bash
$ stardog-admin server start --logfile mystardog.log --port=8080
```

Note: the port can be specified using the property `--port`.
The HTTP interface can be disabled by using the flag
`--no-http` and the SNARL interface via `--no-snarl`.

To shut down the server:

```bash
$ stardog-admin server stop
```

If you started stardog on a port other than the default, or want to shut
down a remote server, you can simply use the `--server` option to
specify the location of the server you wish to shut down.

By default Stardog will bind it's server to `0.0.0.0`.  You can specify a different
network interface for Stardog to bind to using the `--bind` property of `server start`.

<div id="sd-JMX"></div>
### Server Monitoring with Watchdog & JMX <t>new2</t>

Stardog includes integration with JMX called Watchdog.  In addition to providing
some basic JVM information, Watchdog also exports information about the Stardog
DBMS configuration as well as stats for all of the databases within the system,
such as the total number of open connections, size, and average query time.

#### Accessing Watchdog

To access Watchdog, you can simply use a tool like VisualVM or JConsole
to attach to the process running the JVM, or connect directly to the JMX server.

You can also access information from Watchdog in the web console for the database,
or by performing a `GET` on `/{db}/watchdog` which will return a simple JSON object
containing the information available via JMX.

#### Configuring Watchdog

By default, Watchdog will bind an RMI server for remote access on port 5833.  If you
want to change which port Watchdog binds the remote server to, you can set the property
`watchdog.port` via `stardog.properties` find in your `$STARDOG_HOME`.  If you wish
to disable remote access to JMX altogether you can set `watchdog.remote.access` to `false`
in `stardog.properties`.  Finally, if you wish to disable Watchdog completely, just
set `watchdog.enabled` to `false` in `stardog.properties`.

### Locking Stardog Home

Stardog Server will lock `STARDOG_HOME` when it starts to prevent
synchronization errors and other nasties if you start more than one
Stardog Server with the same `STARDOG_HOME`. If you need to run more
than one Stardog Server instance, choose a different `STARDOG_HOME` or
pass a different value to `--home`.

### Access & Audit Logging

See the `stardog.properties` file (in the distribution) for a complete
discussion of how access and audit logging work in Stardog Server.
Basically, audit logging is a
superset of the events in access logging. Access logging covers the most
commonly required logging events; you should consider enabling audit
logging if you really need to log *every* every server event. Logging
generally doesn't have a statistically significant impact on
performance; but the safest way to insure that is the case is to log to
a separate disk (or to a centralized logging server altogether, etc.).

The important configuration choices are whether logs should be binary or
plain text (both based on ProtocolBuffer message formats); the type of
logging (audit or access); the logging location (which may be "off disk"
or even "off machine") Logging to a centralized logging facility
requires a Java plugin that implements the Stardog Server logging
interface; see the [Java Chapter](/java/) for more information; and
the log rotation policy (file size or time).

Slow query logging is also available. See the [Managing Queries]() section
below.

## Database Admin

Stardog is a multi-tenancacy system and will happily provide access to
multiple, distinct databases.

### Configuring a Database

To administer a Stardog database, some config options must be set at
creation time; others may be changed subsequently and some may never be
changed. All of the config options have sensible defaults (except,
obviously, for database name), so you don't have to twiddle any of the
knobs till you really need to.

### Configuration Options

The following are the legal configuration options for a Stardog
database:

- `database.name`: A legal database name.
- `database.online`: The status of the database: online or offline. It may be set so that the database is created initially in online or offline status; subsequently, it can't be set directly but only by using the relevant admin commands.
- `icv.active.graphs`: Specifies which part of the database, in terms of named graphs, is checked with IC validation. Set to `tag:stardog:api:context:all` to validate all the named graphs in the database.
- `icv.enabled`: Determines whether ICV is active for the database; if true, all database mutations are subject to IC validation (i.e., "guard mode").
- `icv.reasoning-type`: Determines what kind of reasoning is used during IC validation.
- `index.differential.enable.limit`: Sets the minimum size of the Stardog database before differential indexes are used.
- `index.differential.merge.limit`: Sets the size in number of RDF triples before the differential indexes are merged to the main indexes.
- `index.literals.canonical`: Enables RDF literal canonicalization. See [literal canonicalization](../java/snarl/com/clarkparsia/stardog/index/IndexOptions.html#CANONICAL_LITERALS) for details.
- `index.named.graphs`: Enables optimized index support for named graphs; speeds SPARQL query evaluation with named graphs at the cost of some overhead for database loading and index maintenance.
- `index.persist`: Enables persistent indexes.
- `index.persist.sync`: Enables whether memory indexes are synchronously or asynchronously persisted to disk with respect to a transaction.
- `index.statistics.update.automatic`: Sets whether statistics are maintained automatically.
- `index.type`: Sets the index type (memory or disk).
- `reasoning.consistency.automatic`: Enables automatic consistency checking with respect to a transaction.
- `reasoning.punning.enabled`: Enables punning.
- `reasoning.schema.graphs`: Determines which, if any, named graph or graphs contains the "tbox", i.e., the schema part of the data.
- `search.enabled`: Enables semantic search on the database.
- `search.reindex.mode`: Sets how search indexes are maintained.
- `transactions.durable`: Enables durable transactions.

#### A Note About Database Status

A database must be set to `offline` status before most configuration
parameters may be changed. Hence, the normal routine is to set the database
offline, change the parameters, and then set the database to online. All
of these operations may be done programmatically from CLI tools, such
that they can be scripted in advance to minimize downtime. In a future
version, we will allow some properties to be set while the database
remains online.

#### Summary of Configuration Options

The following table summarizes the options:

Config Option                       | Mutability | Default    | API
:---------------------------------  | :--------  | :--------  | :------------------
database.archetypes                 | Yes        |            | [DatabaseOptions.ARCHETYPES](/java/snarl/com/complexible/stardog/db/DatabaseOptions.html#ARCHETYPES)
database.name                       | No         |            | [DatabaseOptions.NAME](/java/snarl/com/complexible/stardog/db/DatabaseOptions.html#NAME)
database.namespaces                 | Yes        | rdf, rdfs, xsd, owl, stardog | [DatabaseOptions.NAMESPACES](/java/snarl/com/complexible/stardog/db/DatabaseOptions.html#NAMESPACES)
database.online                     | No         | true       | [DatabaseOptions.ONLINE](/java/snarl/com/complexible/stardog/db/DatabaseOptions.html#ONLINE)
icv.active.graphs                   | No         | default    | [DatabaseOptions.ICV_ACTIVE_GRAPHS](/java/snarl/com/complexible/stardog/db/DatabaseOptions.html#ICV_ACTIVE_GRAPHS)
icv.consistency.automatic           | No         | false      | [DatabaseOptions.ICV_CONSISTENCY_AUTOMATIC](/java/snarl/com/complexible/stardog/db/DatabaseOptions.html#ICV_CONSISTENCY_AUTOMATIC)
icv.enabled                         | Yes        | false      | [DatabaseOptions.ICV_ENABLED](/java/snarl/com/complexible/stardog/db/DatabaseOptions.html#ICV_ENABLED)
icv.reasoning.type                  | Yes        | NONE       | [DatabaseOptions.ICV_REASONING_TYPE](/java/snarl/com/complexible/stardog/db/DatabaseOptions.html#ICV_REASONING_TYPE)
index.connection.timeout            | Yes        | 3600000    | [IndexOptions.INDEX_CONNECTION_TIMEOUT_MS](/java/snarl/com/complexible/stardog/index/IndexOptions.html#INDEX_CONNECTION_TIMEOUT_MS)
index.differential.enable.limit     | Yes        | 1000000    | [IndexOptions.DIFF_INDEX_MIN_LIMIT](/java/snarl/com/complexible/stardog/index/IndexOptions.html#DIFF_INDEX_MIN_LIMIT)
index.differential.merge.limit      | Yes        | 10000      | [IndexOptions.DIFF_INDEX_MAX_LIMIT](/java/snarl/com/complexible/stardog/index/IndexOptions.html#DIFF_INDEX_MAX_LIMIT)
index.literals.canonical            | No         | true       | [IndexOptions.CANONICAL_LITERALS](/java/snarl/com/complexible/stardog/index/IndexOptions.html#CANONICAL_LITERALS)
index.named.graphs                  | No         | true       | [IndexOptions.INDEX_NAMED_GRAPHS](/java/snarl/com/complexible/stardog/index/IndexOptions.html#INDEX_NAMED_GRAPHS)
index.persist                       | Yes        | false      | [IndexOptions.PERSIST](/java/snarl/com/complexible/stardog/index/IndexOptions.html#PERSIST)
index.persist.sync                  | Yes        | true       | [IndexOptions.SYNC](/java/snarl/com/complexible/stardog/index/IndexOptions.html#SYNC)
index.statistics.update.automatic   | Yes        | true       | [IndexOptions.AUTO_STATS_UPDATE](/java/snarl/com/complexible/stardog/index/IndexOptions.html#AUTO_STATS_UPDATE)
index.type                          | No         | Disk       | [IndexOptions.INDEX_TYPE](/java/snarl/com/complexible/stardog/index/IndexOptions.html#INDEX_TYPE)
query.timeout                       | Yes        |            | [DatabaseOptions.QUERY_TIMEOUT](/java/snarl/com/complexible/stardog/db/DatabaseOptions.html#QUERY_TIMEOUT)
reasoning.consistency.automatic     | Yes        | false      | [DatabaseOptions.CONSISTENCY_AUTOMATIC](/java/snarl/com/complexible/stardog/db/DatabaseOptions.html#CONSISTENCY_AUTOMATIC)
reasoning.punning.enabled           | No         | false      | [DatabaseOptions.PUNNING_ENABLED](/java/snarl/com/complexible/stardog/db/DatabaseOptions.html#PUNNING_ENABLED)
reasoning.schema.graphs             | Yes        | default    | [DatabaseOptions.SCHEMA_GRAPHS](/java/snarl/com/complexible/stardog/db/DatabaseOptions.html#SCHEMA_GRAPHS)
search.enabled                      | Yes        | false      | [DatabaseOptions.SEARCHABLE](/java/snarl/com/complexible/stardog/db/DatabaseOptions.html#SEARCHABLE)
transactions.durable                | Yes        | false      | [DatabaseOptions.TRANSACTIONS_DURABLE](/java/snarl/com/complexible/stardog/db/DatabaseOptions.html#TRANSACTIONS_DURABLE)

#### Legal Values of Configuration Options

The following options take a boolean value:
`database.online, icv.enabled, index.literals.canonical, index.named.graphs, index.persist, index.sync, index.statistics.update.automatic, reasoning.consistency.automatic, reasoning.punning.enabled, search.enabled, transactions.durable`.

The legal value of `database.name` is given by the regular expression
`[A-Za-z]{1}[A-Za-z0-9_-]`.

The legal value of `icv.active.graphs` is a list of named graph
identifiers. See `reasoning.schema.graphs` below for syntactic sugar
URIs for default graph and all named graphs.

The legal value of `icv.reasoning.type` is one of the reasoning levels
(i.e, one of the following strings): `NONE, RDFS, QL, RL, EL, DL`.

The legal value of `index.differential.*` is an integer.

The legal value of `index.type` is the string "disk" or "memory"
(case-insensitive).

The legal value of `reasoning.schema.graphs` is a list of named graph
identifiers, including (optionally) the special names,
`tag:stardog:api:context:default` and `tag:stardog:api:context:all`,
which represent the default graph and the union of all named graphs and
the default graph, respectively. In the context of database
configurations only, Stardog will recognize `default` and `*` as shorter
forms of those URIs, respectively.

The legal value of `search.reindex.mode` is one of the strings `sync` or
`async` (case insensitive) or a legal [Quartz cron
expression](http://www.quartz-scheduler.org/documentation/quartz-2.1.x/tutorials/crontrigger).

### Managing Database Status

Databases are either online or offline; this allows database maintenance
to be decoupled from server maintenance.

#### Online and Offline

Databases are put online or offline synchronously: these operations
block until other database activity is completed or terminated. See
`stardog-admin help db` for details.

#### Examples

To set a database from offline to online:

```bash
$ stardog-admin db offline myDatabase
```

To set the database online:

```bash
$ stardog-admin db online myDatabase
```

If Stardog Server is shutdown while a database is offline, the database
will be offline the next time the server starts.

### Creating a Database

Stardog databases may be created locally or remotely; but, of course,
performance is better if data files don't have to be transferred over a
network during creation and initial loading.See the section below about
loading compressed data. All data files, indexes, and server metadata
for the new database will be stored in Stardog Home. Stardog won't
create a database with the same name as an existing database.Stardog
database names must conform to the regular expression,
`[A-Za-z]{1}[A-Za-z0-9_-] `.

**Note: there are four reserved words that may not be used for the
names of Stardog databases:** `system`, `admin`, `watchdog`, and `docs`.

Minimally, the only thing you must know to create a Stardog database is
a database *name*; alternately, you may customize some other database
parameters and options depending on anticipated workloads, data
modeling, and other factors.

See `stardog-admin help db create` for all the details including
examples.

<div id="sd-Archetypes"></div>
### Database Archetypes <t>new2</t>

Stardog database archetypes are a new feature in 2.0. A database archetype is a named, vendor-defined or user-defined bundle of data and functionality to be applied at database-creation time. Archetypes are primarily for supporting various data standards or toolchain configurations in a simple way.

For example, the SKOS standard from W3C defines an OWL vocabulary for building taxonomies, thesauruses, etc. SKOS is made up by a vocabulary, some constraints, some kinds of reasoning, and (typically) some SPARQL queries. If you are developing an app that uses SKOS and Stardog, without the archetype feature, you are responsible for assembling all that SKOS stuff yourself. Which is tedious, error-prone, and not very rewarding even when it's done right.

Rather than putting that burden on Stardog users, we've created database archetypes as a mechanism to collect these "bundles of stuff" which, as a developer, you can then simply attach to a particular database.

The last point to make is that archetypes are composable: you can mix-and-match them at database creation time as needed.

In the 2.0 release, we're supporting three database archetypes: [PROV](http://www.w3.org/TR/prov-overview/) and [SKOS](http://www.w3.org/2004/02/skos/).

#### SKOS Archetype

The SKOS archetype is for databases that will contain SKOS data, and includes the SKOS schema, SKOS constraints using Stardog's Integrity Constraint Validation, and some namespace-prefix bindings.

#### PROV Archetype

The PROV archetype is for databases that will contain PROV data, and includes the SKOS schema, SKOS constraints using Stardog's Integrity Constraint Validation, and some namespace-prefix bindings.

<t>shout</t> Archetypes are composable, so you can use more of them and they are intended to be used alongside *your domain data*, which may include as many other schemas, ontologies, etc. as are required.

### Database Creation Templates

As a boon to the overworked admin or devops peeps, Stardog Server
supports a feature we call "database creation templates", which is to
say that you can pass a Java Properties file with config values set and
with the values (typically just the database name) that are unique to a
specific database passed in CLI parameters.

#### Examples

To create a new database with the default options by simply providing a
name and a set of initial datasets to load:

```bash
$ stardog-admin db create -n myDb input.ttl another_file.rdf moredata.rdf.gz
```

Datasets can be loaded later as well, though bulk loading at creation
time is the fastest way to load data.

To create (in this case, an empty) database from a template file:

```bash
$ stardog-admin db create -c database.properties
```

At a minimum, the configuration file must have a value for
`database.name` option.

Finally, if you only want to change only a few configuration options you
can directly provide the values for these options in the CLI args as
follows:

```bash
$ stardog-admin db create -n db -o icv.enabled=true icv.reasoning.type=QL -- input.ttl
```

Note that '--' is used in this case when -o is the last option to
delimit the value for -o from the files to be bulk loaded.

Please refer to the CLI help for more details of the `db create`
command.

### Database Create Options

<table dir="ltr" border="1" cellspacing="0" cellpadding="2" width="100%" summary="Options for the Stardog create command">
      <thead>
        <tr>
          <th width="15%">Name</th>
          <th>Description</th>
          <th width="10%">Arg values</th>
          <th width="10%">Default</th>
        </tr>
      </thead>
      <tfoot>
        <tr>
          <th width="15%">Name</th>
          <th>Description</th>
          <th width="10%">Arg values</th>
          <th width="10%">Default</th>
        </tr>
      </tfoot>
      <tbody>
        <tr>
          <td><tt>--durable</tt>, <tt>-d</tt></td>

          <td>If present, sets all mutation operations to database as transactionally durable; durability increases the cost of all mutation operations.</td>
          <td></td>

          <td><tt>False</tt></td>
        </tr>
        <tr>
          <td><tt>--type</tt>, <tt>-t</tt></td>
          <td>Specifies the kind of database to be created: Memory or Disk.</td>
          <td><tt>M</tt>,<tt>D</tt></td>
          <td>Disk</td>
        </tr>
        <tr>
          <td><tt>--searchable</tt>, <tt>-s</tt></td>
          <td>Specifies this database should be searchable.</td>
          <td></td>
          <td>None</td>
        </tr>
        <tr>
          <td><tt>--index-triples-only</tt>, <tt>-i</tt></td>
          <td>Specifies this database's indexes should be optimized for RDF triples (as opposed to quads) only</td>
          <td>None</td>
          <td></td>
        </tr>
      </tbody>
      <caption>Options for the Stardog <tt>create</tt> command.</caption>
</table>

### Repairing a Database

Repairs a corrupted Stardog database. This command needs exclusive
access to your Stardog home directory and therefore requires the Stardog
server not to be running.  This also means that the command can only be
run on the machine where the Stardog home directory is located at and
you will not be able to start the Stardog server while this command is
running. Please note that the repair process can take considerable
time for large databases. If the built-in Stardog system
database is corrupted then you can use the database name 'system' as the
repair argument. If an I/O error or an index exception occurs while querying a DB, the DB might be corrupted and repaired with the repair command. If the errors occur during executing admin commands, then the system DB might have been corrupted. System database corruptions can also cause other problems including authorization errors.

To repair the database myDB:

```bash
$ stardog-admin db repair myDB
```

To repair the system database:

```bash
$ stardog-admin db repair system
```

### Backing Up and Restoring

Stardog includes both physical and logical backup utilities; logical backups are accomplished using the `export` CLI command. Physical backups and restores are accomplished using `stardog-admin db backup` and `stardog-admin db restore` respectively. These tools perform physical backups, including database metadata, rather than logical backups via some RDF serialization. They are *native* Stardog backups and can only be restored with Stardog tools. Backup may be accomplished while a database is online; backup is performed in a read transaction: reads and writes may continue, but writes performed during the backup are not reflected in the backup.

See the man pages for [`backup`](/man/db-backup.html) and [`restore`](/man/db-restore.html) for details.

#### Backup

`stardog-admin db backup` assumes a default location for its output, namely, `$STARDOG_HOME/.backup`; that default may be overriden by passing a `-t` or `--to` argument. Backup sets are stored in the backup directory by database name and then in data-versioned subdirectories for each backup volume. Of course you can use a variety of OS-specific options to accomplish remote backups over some network or data protocol; those options are left as an exercise for the admin.

To backup a Stardog database called `foobar`:

```bash
$ stardog-admin db backup foobar
```

To perform a remote backup, for example, pass in a specific directory that may be mounted in the current OS namespace via some network protocol, thus:

```bash
$ stardog-admin db backup --to /my/network/share/stardog-backups foobar
```

Note: Stardog's backup/restore approach is optimized for minimizing the amount of time it takes to backup a database, with the result that restore takes a bit longer than if the system were optimized for fast restores.

#### Restore

To restore a Stardog database from a Stardog backup volume, simply pass a fully-qualfied path to the volume in question. The location of the backup should be the full path to the backup, not the location of the backup directory as specified in your Stardog configuration. There is no need to specify the name of the database to restore.

Restore a database from its backup:

    $ stardog-admin db restore $STARDOG_HOME/.backups/myDb/2012-06-21


##### One-time Database Migrations for Backup

The new backup system, introduced in Stardog 2.1, cannot directly backup databases created in versions before 2.1. These databases must be explicitly migrated in order to use the new backup system; this is a one-time operation per database and is accomplished by running

```bash
$ stardog-admin db migrate foobar
```

in order to migrate a database called `foobar`. Again, this is a one-time operation only and all databases created with 2.1 (or greater) do not require it.


### Namespace Prefix Bindings

SPARQL queries can become verbose because of the (often redundant)
`PREFIX` declarations in the prologue of each query. Stardog allows
database administrators to persist and manage custom namespace prefix
bindings, which works in the following way:

1.  At database creation time, if data is loaded to the database that
    contains namespace prefixes, then those are persisted for the life
    of the database. Any subsequent queries to the database may simply
    omit the `PREFIX` declarations:

```bash
$ stardog query myDB "select * {?s rdf:type owl:Class}"
```

2.  To add new bindings, use the `namespace` subcommand in the CLI:

```bash
$ stardog namespace add myDb --prefix ex --uri 'http://example.org/test#'
```

3.  To modify an existing binding, delete the existing one and then add
    a new one:

```bash
$ stardog namespace remove myDb --prefix ex
```

4.  Finally, to see all of the existing namespace prefix bindings:

```bash
$ stardog namespace list myDB
```

If no files are used during database creation, or if the files do not
define any prefixes (e.g. NTriples), then the "Big Four" default
prefixes are stored: RDF, RDFS, XSD, and OWL.

When executing queries in the CLI, the default table format for SPARQL
`SELECT` results will use the bindings as qnames. SPARQL `CONSTRUCT`
query output (including export) will also use the stored prefixes.

To reiterate, namespace prefix bindings are *per database*, not global.

### Index Strategies

By default Stardog builds extra indexes for named graphs. These
additional indexes are used when SPARQL queries specify datasets using
`FROM` and `FROM NAMED`. With these additional indexes, better
statistics about named graphs are also computed.

Stardog may also be configured to create and to use fewer indexes, if
the database is only going to be used to store RDF triples, that is,
will not be used to store named graph information. In this mode, Stardog
will maintain fewer indexes, which will result in faster database
creation and faster updates without compromising query answering
performance. In such databases, quads (that is: triples with named
graphs or contexts specified) may still be added to these database at
any time, but query performance may degrade in such cases.

To create a database which indexes only RDF triples, set the option
`index.named.graphs` to `false` at database creation time. The CLI
provides a shorthand option--`-i` or `--index-triples-only`--which is
equivalent.

Please note that this option can only be set at database creation time
and cannot be changed later without rebuilding the database, so use this
option with caution.

### Differential Indexes

While Stardog is generally biased in favor of read (i.e., query)
performance, write performance is also important in many applications.
In order to increase write performance, Stardog may be used, optionally,
with a *differential index*.

Stardog's differential index is used to persist additions and removals
separately from the main indexes, such that updates to the database can
be performed faster. Query answering takes into consideration all the
data stored in the main indexes and the differential index; hence, query
answers are computed as if all the data is stored in the main indexes.

There is a slight overhead for query answering with differential indexes
if the differential index size gets too large. For this reason, the
differential index is merged into the main indexes when its size reaches
the `DIFF_INDEX_MAX_LIMIT`. There is no benefit of differential indexes
if the main index itself is small. For this reason, the differential
index is not used until the main index size reaches
`DIFF_INDEX_MAX_LIMIT`.

In most cases, the default value of the `DIFF_INDEX_MAX_LIMIT` parameter
will work fine and doesn't need to be changed. The corollary of this
claim is that you shouldn't change this value in a production system
till you've tested the effects of a change in a non-production system.

### Loading Compressed Data

Stardog supports loading data from compressed files directly: there's
no need to uncompress files before loading since compressed input may be faster to load. In any event, loading compressed data is the recommended way to load large input files.Stardog supports GZIP and ZIP compressions natively.<fn>In Stardog <t>version</t> compressed data may only be loaded at database creation time. We will support adding compressed data to an existing database in a future release.</fn>

#### GZIP and BZIP2

A file passed to `create` will be treated as compressed if the file name ends with '.gz' or '.bz2'. The RDF
format of the file is determined by the extension that comes before
'.gz' or '.bz2'. For exammple, if a file named 'test.ttl.gz' is used as input, Stardog will
perform GZIP decompression during loading and parse the file with Turtle
parser. All the formats supported by Stardog (RDF/XML, Turtle, Trig,
etc.) can be used with GZIP compression.

#### ZIP

The ZIP support works differently since zipped files can contain
multiple files. When an input file name ends with '.zip', Stardog
performs ZIP decompression and tries to load all the files inside the
ZIP file. The RDF format of the files inside the zip file is determined
by their file names as usual. If there is an unrecognized file extension
(e.g. '.txt'), that file will be skipped.

### Dropping a Database

This command removes a database and all associated files and metadata.
This means all files on disk pertaining to the database will be deleted,
so only use `drop` when you're certain! Databases must be offline in
order to be dropped.

It takes as its only argument a valid database name. For example,

```bash
$ stardog-admin db drop my_db
```

### Using Integrity Constraint Validation

Stardog supports integrity constraint validation as a data quality
mechanism via closed world reasoning. Constraints can be specified in
OWL, SWRL, and SPARQL.

Please see the [ICV chapter](../icv) for more about using ICV in Stardog
programmatically.

The CLI `icv` subcommand can be used to add, delete, or drop all
constraints from an existing database. It may also be used to validate
an existing database with constraints that are passed into the `icv`
subcommand; that is, using different constraints than the ones already
associated with the database.

For details of ICV usage, see `stardog help icv` and
`stardog-admin help icv`.

For ICV in transacted mutations of Stardog databases, see the database
creation section above.

### Migrating a Database

The `migrate` subcommand migrates an older Stardog database to the
latest version of Stardog. Its only argument is the name of the database
to migrate. `migrate` won't necessarily work between arbitrary Stardog
version, so before upgrading check the release notes for a new version
carefully to see whether migration is required or possible.

```bash
$ stardog-admin db migrate myDatabase
```

will update `myDatabase` to the latest database format.

### Getting Database Information

You can get some information about a database (online/offline status,
creation time, last modification time, etc.) by running the following
command:

```bash
$ stardog-admin metadata get my_db_name
```

This will return all the metadata stored about the database, including
the values of configuration options used for this database instance. If
you want to get the value for a specific option then you can run the
following command:

```bash
$ stardog-admin metadata get -o index.named.graphs my_db_name
```

### Managing Queries

Stardog includes the capability to manage running queries according to
configurable policies set at run-time; this capability includes support
for

-   **listing** running queries;
-   **deleting** running queries;
-   **reading** the status of a running query;
-   **killing** running queries that exceed a time threshold
    automatically;
-   **logging** slow queries for analysis.

Stardog is pre-configured with sensible *server-wide* defaults for query
management parameters; these defaults may be overridden or disabled per
database.

#### Configuring Query Management

For many uses cases the default configuration will be sufficient. But
you may need to tweak the timeout parameter to be longer or shorter,
depending on the hardware, data load, queries, throughput, etc. The
default configuration has a server-wide query timeout value of
`query.timeout`, which is inherited by all the databases in the server.
You can customize the server-wide timeout value and then set
per-database custom values, too. Any database without a custom value
inherits the server-wide value. To disable query timeout, set
`query.timeout` to `0`.

#### Listing Queries

To see all running queries, use the `query list` subcommand:

```bash
$ stardog-admin query list
```

The results are formatted tabularly:

```bash
+----+----------+-------+--------------+
| ID | Database | User  | Elapsed time |
+----+----------+-------+--------------+
| 2  | test     | admin | 00:00:20.165 |
| 3  | test     | admin | 00:00:16.223 |
| 4  | test     | admin | 00:00:08.769 |
+----+----------+-------+--------------+

3 queries running
```

You can see the user who owns the query (superuser's can see all running
queries), as well as the elapsed time and the database against which the
query is running. The ID column is the key to deleting queries.

#### Deleting Queries

To delete a running query, simply pass its ID to the `query kill`
subcommand:

```bash
$ stardog-admin query kill 3
```

The output confirms the query kill completing successfully:

```bash
Query 3 killed successfully
```

#### Automatically Killing Queries

For production use, especially when a Stardog database is exposed to
arbitrary query input, some of which may not execute in an acceptable
time period, the automatic query killing feature is useful. It will
protect a Stardog Server from queries consuming too many resources.

Once the execution time of a query exceeds the value of `query.timeout`,
the query will be killed automatically. The client that submitted the
query will receive an error message. The value of `query.timeout` may be
overriden by setting a different value (smaller or longer) in database
options. To disable, set to `query.timeout` to `0`.

The value of `query.timeout` is a positive integer concated with a
letter, all of which is interpreted as a time duration: 'h' (for hours),
'm' (for minutes), 's' (for seconds, )or 'ms' (for milliseconds). For
example, '1h' for 1 hour, '5m' for 5 minutes, '90s' for 90 seconds, and
'500ms' for 500 milliseconds.

The default, out-of-the-box value of `query.timeout` is five minutes.

#### Query Status

To see more detail about one running query, use the `query status`
subcommand:

```bash
$ stardog-admin query status 1
```

The resulting output includes query metadata, including the query
itself:

```bash
Username: admin
Database: test
Started : 2013-02-06 09:10:45 AM
Elapsed : 00:01:19.187
Query   :
select ?x ?p ?o1 ?y ?o2
   where {
     ?x ?p ?o1.
     ?y ?p ?o2.
     filter (?o1 > ?o2).
    }
order by ?o1
limit 5
```

#### Slow Query Logging

Stardog does not log slow queries in the default configuration,
primarily because there isn't a sensible default meaning of "slow
query", which is entirely relative to queries, access patterns, dataset
sizes, etc. While slow query logging has very minimal overhead, what
counts as a slow query in some context may be quite acceptable in
another. To enable slow query logging, see the [Stardog Server Properties](<t>FIXME</t>)
discussion above.

#### Protocols and Java API

For HTTP protocol support, see [Stardog's Apiary](http://docs.stardog.apiary.io/) docs.

For Java, see [Stardog Javadocs](http://stardog.com/docs/java/snarl/).

#### Security and Query Management

The security model for query management is very simple: any user can
kill any running query submitted by that user; a superuser can kill any
running query. The same general restriction is applied to query status;
you cannot see query status for a query you do not own, either as a
non-superuser or as superuser.

### Managing Search Indexes

Stardog's search service is described in the [Using Stardog](../using)
chapter.

But managing the reindexing of search indexes is an administrative task.

There are three modes for rebuilding indexes:

1.  `sync`: Recompute the search index synchronously with a transacted
    write.
2.  `async`: Recompute the search index asynchronously as soon as
    possible with respect to a transacted write.
3.  Scheduled: Use a [cron
    expression](http://www.quartz-scheduler.org/documentation/quartz-2.1.x/tutorials/crontrigger)
    to specify when the search index should be updated.

This is specified when creating a database by setting the property
`search.reindex.mode` to "sync", "async", or to a valid cron expression.
The default is "sync".

### Transactions and Database Guarantees

Stardog has had native ACID transactions from its initial release. In 1.2 we introduced a new transaction subsystem written from scratch.

#### Atomicity

> By convention hot, by convention cold, but in reality atoms and void,
> and also in reality we know nothing, since the truth is at bottom.--Democritus

Atoms in ancient Greece were thought to be uncuttable bits of simple stuff. And it's in something like this sense that databases may provide a guarantee of atomicity--groups of database actions (i.e., mutations) are irreducible and indivisible: either all of the changes happen or none of them happens.

Stardog's transacted writes are atomic.

#### Consistency

Data stored should be valid with respect to the data model (in this case, RDF) and to the guarantees offered by the database, as well as to any appliction-specific integrity contraints that may exist. Stardog's transactions are guaranteed not to violate integrity constraints during execution. A transaction that would leave a database in an inconsistent or invalid state is aborted.

See the [ICV chapter](/icv) for a more detailed consideration of Stardog's integrity constraint mechanism.

#### Isolation

A Stardog connection will run in `READ COMMITTED` isolation level if it has not started an explicit transaction and will run in `READ COMMITTED SNAPSHOT` isolation level if it has started a transaction. In either mode, uncommitted changes will only be visible to the connection that made the changes: no other connection can see those values before they are committed. Thus, 'dirty reads' can never occur. Neither mode locks the database; if there are conflicting changes, the latest commit wins.

The difference between `READ COMMITTED` and `READ COMMITTED SNAPSHOT` isolation levels is that in the former case a connection will see updates committed by another connection immediately, whereas in the latter case a connection will see a transactionally consistent snapshot of the data as it existed at the start of the transaction and will not see any updates.

We illustrate the difference between these two levels with the following example where initially the database contains a single triple `:x :value 1`.

Time | Connection 1 | Connection 2 | Connection 3
-----|--------------|--------------|-------------
0    | SELECT ?val {?x :val ?val}<br>#reads 1 | SELECT ?val {?x :val ?val}<br>#reads 1 | SELECT ?val {?x :val ?val}<br>#reads 1
1    | BEGIN TX     |              |
2    | INSERT {:x :value 2}<br>DELETE {:x :value ?old} | |
3    | SELECT ?val {?x :val ?val}<br>#reads 2 | SELECT ?val {?x :val ?val}<br>#reads 1 | SELECT ?val {?x :val ?val}<br>#reads 1
4    |              |              |BEGIN TX
6    | COMMIT       |              |
7    | SELECT ?val {?x :val ?val}<br>#reads 2 | SELECT ?val {?x :val ?val}<br>#reads 2 | SELECT ?val {?x :val ?val}<br>#reads 1
8    |              |              | INSERT { :x :value 3 }<br>DELETE {:x :value ?old}
9    |              |              | COMMIT
10   | SELECT ?val {?x :val ?val}<br>#reads 3 | SELECT ?val {?x :val ?val}<br>#reads 3 | SELECT ?val {?x :val ?val}<br>#reads 3

#### Durability

By default Stardog's transacted writes are not durable; in some applications, in which durability of transactions is  required, durability should be enabled.

#### Commit Failure Autorecovery

Stardog's transaction framework, which we call
`erg`, is mostly maintenance free; but there are some rare conditions in
which manual intervention may be needed.

Stardog's strategy for recovering automatically from (the very unlikely
event of) commit failure is as follows:

-   Stardog will automatically roll back the transaction upon a commit
    failure;
-   Stardog automatically takes the affected database offline for
    maintenance;<fn>The probability of recovering from a catastrophic
    transaction failure is inversely proportional to the number of
    subsequent write attempts; hence, Stardog offlines the database to
    prevent subsequent write attempts and to increase the
    likelihood of recovery.</fn> then
-   Stardog will then begin recovery automatically, bringing the
    recovered database back online once that task is successful so that
    operations may resume.

With an appropriate logging configuration for production usage (at least
error-level logging), log messages for the preceding recovery operations
will occur. If for whatever reason the database fails to be returned
automatically to online status, an administrator may use the CLI tools
(i.e., `stardog-admin db online`) to attempt to online the database.

### Optimizing Bulk Data Loading

Stardog tries hard to do bulk loading at database creation time in the
most efficient and scalable way possible. But data loading time can vary
widely, depending on factors in the data to be loaded, including the
number of unique resources, etc. Here are some tuning tips that may work
for you:

1.  Load [compressed data files](#compressed) since compression
    minimizes disk access
2.  Use a multicore machine since bulk loading is highly parallelized
    and indexes are built concurrently.
3.  Load multiple files together at creation time since different files
    will be parsed and processed concurrently improving the load speed
4.  Turn off [`strict.parsing`](#jvm-arg).
5.  If you are not using named graphs, use [triples only indexing
    strategy](#index-strategies)

## Capacity Planning
The primary system resources used by Stardog are CPU, memory, and disk.<fn>Of
course Stardog also uses file handles and sockets, but we don't discuss those here.</fn> In
what follows we primarily discuss memory and disk. Stardog will take
advantage of multiple CPUs, cores, and core-based threads in data
loading and in throughput-heavy or multi-user loads. And obviously
Stardog performance is influenced by the speed of CPUs and cores. But
some workloads are bound by main memory or by disk I/O (or both) more
than by CPU. In general, use the fastest CPUs you can afford with the
largest secondary caches and the most number of cores and core-based
threads of execution, especially in multi-user workloads.

The following subsections provides more detailed guidance for the memory
and disk resource requirements of Stardog.

#### Memory usage

Stardog uses system memory aggressively and the total system memory
available to Stardog is typically the most important factor in
performance. Stardog uses both JVM memory (known as heap memory) and
also the operating system memory outside the JVM (known as non-heap
memory). Having more system memory available is always good; however,
increasing JVM memory too close to total system memory is not usually
prudent as it will tend to increase Garbage Collection (GC) time in the
JVM.

The following table shows recommended JVM memory and system
memory requirements for Stardog:<fn>Note: these are very conservative values and are somewhat dataset specific. Yr data may require less memory.</fn>

<table dir="ltr" border="1" cellspacing="0" cellpadding="2" summary="Stardog memory usage">
      <thead>
        <tr>
          <th># triples</th>
          <th>JVM memory</th>
          <th>Off-heap memory</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>100 million</td>
          <td>3GB</td>
          <td>3GB</td>
        </tr>
        <tr>
          <td>1 billion</td>
          <td>4GB</td>
          <td>8GB</td>
        </tr>
        <tr>
          <td>10 billion</td>
          <td>8GB</td>
          <td>64GB</td>
        </tr>
        <tr>
          <td>20 billion</td>
          <td>16GB</td>
          <td>128GB</td>
        </tr>
        <tr>
          <td>50 billion</td>
          <td>32GB</td>
          <td>256GB</td>
        </tr>
      </tbody>
      <caption>Recommended memory resources</caption>
    </table>

By default, Stardog CLI sets the maximum JVM memory to 2GB. This setting
works fine for most small to medium database sizes (up to 100 million
triples). As the database size increases, we recommend increasing JVM
memory. You can increase the JVM memory for Stardog by setting the
system property `STARDOG_JAVA_ARGS` using the standard JVM options. For
example, you can set this property to `"-Xms4g -Xmx4g -XX:MaxDirectMemorySize=8g"`
to increase the JVM memory to 4GB and off-heap to 8GB. We recommend
setting the minimum heap size (`-Xms` option) as close to
the max heap size (`-Xmx` option) as possible.

##### System Memory and JVM Memory

Stardog 2.1 moved to an off-heap, custom memory allocation scheme. Please note that the memory provisioning recommendations above are for two kinds of memory allocations for the JVM in which Stardog will run. The first is for memory that the JVM will manage explicitly (i.e., "JVM memory"); and the second, i.e., "Off-heap memory" is for memory that Stardog will manage explicitly, i.e., off the JVM heap, but for which the JVM should be notified via the `MaxDirectMemorySize` property. In most cases, this should be somewhat less than the total memory available to the underlying operating system as requirements dictate.

#### Disk usage

Stardog stores data on disk in a compressed format. The disk space
needed for a database depends on many factors besides the number of
triples, including the number of unique resources and literals in the
data, average length of resource identifiers and literals, and how much
the data is compressed. The following table shows average disk space
used by a Stardog database:

<table dir="ltr" border="1" cellspacing="0" cellpadding="2" summary="Stardog disk usage">
      <thead>
        <tr>
          <th># triples</th>
          <th>Disk space used</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>1 billion</td>
          <td>70GB - 100GB</td>
        </tr>
        <tr>
          <td>10 billion</td>
          <td>700GB - 1TB</td>
        </tr>
      </tbody>
      <caption>Average disk space used</caption>
    </table>

These numbers are given for information purposes and the actual disk
usage for a database may be significantly different in practice. Also it
is important to note that the amount of disk space needed at creation
time for bulk loading data is higher as several temporary files will be
created. The additional disk space needed at bulk loading time can be
40% to 70% of the final database size.

Disk space used by a database is non-trivially smaller if [triples only
indexing strategy](#index-strategies) is used. Triples-only indexing
reduces overall disk space used by 25% in average; however, please note
the tradeoff: SPARQL queries involving named graphs perform
significantly better with quads indexing.

The disk space used by Stardog is additive for multiple databases and
there is very little disk space used outside the databases. To calculate
the total disk space needed for multiple databases, one can simply sum
up the disk space needed by each database.

## Using Stardog on Windows

Stardog provides Windows batch (`.bat`) files for use on Windows; they
provide roughly the same set of functionality provided by the Bash
scripts which are used on \*nix systems. There are however, a few small
differences between the two. When you start a server with
`server start`, this does not detach to the background, it will run in
the current console.

To shut down the server correctly, you should either issue a
`server stop` command from another window, or press CTRL-C (and then
response 'Y' when asked to "Terminate batch job"). Do not under any
circumstance close the window without shutting down the server. This
will simply kill the process without shutting down Stardog which could
cause your database to be corrupted.

The .bat scripts for windows support our standard `STARDOG_HOME` and
`STARDOG_JAVA_ARGS` environment variables which can be used to control
where Stardog's database is stored and usually, how much memory is given
to Stardog's JVM when it starts. By default, the script will use the JVM
that is available in the directory from which Stardog is run via the
`JAVA_HOME` environment variable. If this is not set, it will simply
execute `java` from within that directory.

### Running Stardog as a Windows Service

You can run Stardog as a Windows Service using the following
configuration. Please, note, that the following assumes commands are
executed from a Command Prompt with administrative privileges:

#### Installing the Service

Change the directory to the Stardog installation directory:

    cd c:\stardog-$VERSION

#### Configuring the Service

The default settings with which the service will be installed are

-   2048 MB of RAM
-   `STARDOG_HOME` is the same as the installation directory
-   the name of the installed service will be "Stardog Service"
-   Stardog service will write logs to the "logs" directory within the
    installation directory

To change these settings, set appropriate environment variables:

-   `STARDOG_MEMORY`: the amount of memory in MB (e.g., set
    `STARDOG_MEMORY`=4096)
-   `STARDOG_HOME`: the path to `STARDOG_HOME` (e.g., set
    `STARDOG_HOME`=c:\\stardog-home)
-   `STARDOG_SERVICE_DISPLAY_NAME`: a different name to be displayed in
    the list of services (e.g., set
    `STARDOG_SERVICE_DISPLAY_NAME`=Stardog Service)
-   `STARDOG_LOG_PATH`: a path to a directory where the log files should
    be written (e.g., set `STARDOG_LOG_PATH`=c:\\stardog-logs)

Note: if you have changed the default administrator password, you also
need to modify `stop-service.bat` and specify the new username and
password there (by passing `-u` and `-p` parameters in the line that
invokes `stardog-admin server stop`). In one of the future releases, an
alternative solution will be provided that avoids the need to encode the
administrator's password in the file.

#### Installing Stardog as a Service

Run the `install-service.bat` script.

At this point the service has been installed, but it is not running. To
run it, see the next section or use any Windows mechanism for
controlling the services (e.g., type `services.msc` on the command
line).

#### Starting, Stopping, & Changing Service Configuration

Once the service has been installed, execute `stardog-serverw.exe`,
which will allow you to configure the service (e.g., set whether the
service is started automatically or manually), manually start and stop
the service, as well as to configure most of the service parameters.

#### Uninstalling the Stardog Service

The service can be uninstalled by running `uninstall-service.bat`
script.
