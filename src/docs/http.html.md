---
quote: 'If you can imagine a society in which the computer-robot is the only menial, you can imagine anything.'
title: HTTP Programming
layout: default
related: ""
shortTitle: HTTP
toc: true
summary: 'This chapter describes how to interact with Stardog over a network using HTTP.'
---

In the [Programming with Java](../java/) chapter, we consider
interacting with Stardog programatically from a Java program. In this
chapter we consider interacting with Stardog over HTTP. In some use
cases or deployment scenarios, it may be necessary to interact with or
control Stardog remotely over an IP-based network. For those purposes,
Stardog supports [SPARQL 1.0 HTTP Protocol](http://www.w3.org/TR/rdf-sparql-protocol/); the [SPARQL 1.1 Graph Store HTTP Protocol](http://www.w3.org/TR/sparql11-http-rdf-update/); the Stardog HTTP Protocol; and SNARL, an RPC-style protocol
based on [Google Protocol Buffers](http://code.google.com/apis/protocolbuffers/).

## SPARQL Protocol

Stardog supports the standard SPARQL Protocol HTTP bindings in a very
obvious way. Since the Stardog HTTP Protocol is a superset of SPARQL
Protocol, the latter is documented below alongside the former.

Stardog supports SPARQL 1.1's Service Description format. See the
[spec](http://www.w3.org/TR/2013/REC-sparql11-service-description-20130321/)
if you want details.

## Stardog HTTP Protocol

The Stardog HTTP Protocol supports SPARQL Protocol 1.1 and additional resource representations and capabilities.

The Stardog HTTP API v3 is also available on Apiary:
[http://docs.stardog.apiary.io/](http://docs.stardog.apiary.io/).

The Stardog Linked Data API (aka "Annex") is also documented on Apiary: [http://docs.annex.apiary.io/](http://docs.annex.apiary.io/).

### Generating URLs

If you are running the HTTP server at the following URL

```bash
http://localhost:12345/
```

To form the URI of a particular Stardog Database, the Database Short
Name is the first URL path segment appended to the deployment URI. For
example, for the Database called `cytwombly`, deployed in the above
example HTTP server, the Database Network Name might be

```bash
http://localhost:12345/cytwombly
```

All the resources related to this database are identified by URL path
segments relative to the Database Network Name; hence:

```bash
http://localhost:12345/cytwombly/size
```

In what follows, we use [URI Template](http://code.google.com/p/uri-templates/) notation to parameterize the actual request URLs, thus: `/{db}/size`.

We also abuse notation to show the permissible HTTP request types and
default MIME types: `REQ | REQ /resource/identifier → mime_type | mime_type`.

In a few cases, we use `void` as short hand for the case where there is
a response code but the response body may be empty.

### HTTP Headers: `Content-Type` & `Accept`

All HTTP requests that are mutative (add or remove) must include a valid
`Content-Type` header set to the MIME type of the request body, where
"valid" is a valid MIME type for N-Triples, Trig, Trix, Turtle, NQuads,
JSON-LD, or RDF/XML:

- RDF/XML:   `application/rdf+xml`
- Turtle:   `application/x-turtle` or `text/turtle`
- N-Triples:   `text/plain`
- TriG:   `application/x-trig`
- TriX:   `application/trix`
- NQuads:   `text/x-nquads`
- JSON-LD:   `application/ld+json`

SPARQL `CONSTRUCT` queries must also include a `Accept` header set to one of these RDF serialization types.

When issuing a `SELECT` query the `Accept` header should be set to one
of the valid MIME types for `SELECT` results:

- SPARQL XML Results Format:   `application/sparql-results+xml`
- SPARQL JSON Results Format:   `application/sparql-results+json`
- SPARQL Boolean Results:   `text/boolean`
- SPARQL Binary Results:   `application/x-binary-rdf-results-table`

Response Codes
--------------

Stardog uses the following HTTP response codes:

- `200`:   Operation has succeeded.
- `202`:   Operation was recieved successfully and will be processed shortly.
- `400`:   Indicates parse errors or that the transaction identifier specified for an operation is invalid or does not correspond to a known transaction.
- `401`:   Request is unauthorized.
- `403`:   User attempting to perform the operation does not exist, their username or password is invalid, or they do not have the proper credentials to perform the action.
- `404`:   A resource involved in the request--for example the database or transaction--does not exist.
- `409`:   A conflict for some database operations; for example, creating a database that already exists.
- `500`:   A unspecified failure in some internal operation...Call yr office, Senator!

There are also Stardog-specific error codes in the `SD-Error-Code`
header in the response from the server. These can be used to further
clarify the reason for the failure on the server, especially in cases
where it could be ambiguous. For example, if you received a `404` from
the server trying to commit a transaction denoted by the path
`/myDb/transaction/commit/293845klf9f934`...it's probably not clear what is missing: it's either the transaction or the database. In this case, the value of
the `SD-Error-Code` header will clarify.

The enumeration of `SD-Error-Code` values and their meanings are as follows:

- `0`: Authentication error
- `1`: Authorization error
- `2`: Query evaluation error
- `3`: Unknown transaction
- `4`: Unknown database
- `5`: Database already exists
- `6`: Invalid database name
- `7`: Resource (user, role, etc) already exists
- `8`: Invalid connection parameter(s)
- `9`: Invalid database state for the request
- `10`: Resource in use
- `11`: Resource not found

In cases of error, the message body of the result will include any error
information provided by the server to indicate the cause of the error.

## Stardog Resources

To interact with Stardog over HTTP, use the following resource
representations, HTTP response codes, and resource identifiers.

### A Stardog Database

```httpstardog
GET /{db} → void
```

Returns a representation of the database. As of Stardog <t>version</t>, this is
merely a placeholder; in a later release, this resource will serve the
web console where the database can be interacted with in a browser.

### Database Size

```httpstardog
GET /{db}/size → text/plain
```

Returns the number of RDF triples in the database.

### Query Evaluation

```httpstardog
GET | POST /{db}/query
```

The SPARQL endpoint for the database. The valid Accept types are listed
above in the `HTTP Headers` section.

To issue SPARQL queries with reasoning over HTTP, see the [Using Reasoning](http://docs.stardog.com/owl2/#reasoning) section of the [Reasoning](http://docs.stardog.com/owl2/) chapter.

### SPARQL update

```httpstring
GET | POST /{db}/update
```

The SPARQL endpoint for updating the database with SPARQL Update. The valid Accept types are
`application/sparql-update` `or application/x-www-form-urlencoded`.

### Query Plan

```httpstardog
GET | POST /{db}/explain → text/plain
```

Returns the explanation for the execution of a query, i.e., a query
plan. All the same arguments as for Query Evaluation are legal here; but
the only MIME type for the Query Plan resource is `text/plain`.

### Transaction Begin

```httpstardog
POST /{db}/transaction/begin → text/plain
```

Returns a transaction identifier resource as `text/plain`, which is
likely to be deprecated in a future release in favor of a hypertext
format. `POST` to begin a transaction accepts neither body nor arguments.

#### Transaction Security Considerations <t>secnote</t>

Stardog's implementation of transactions with HTTP is
vulnerable to man-in-the-middle attacks, which could be used to violate
Stardog's isolation guarantee (among other nasty side effects). Stardog's transaction identifiers are 64-bit GUIDs and, thus, pretty hard to *guess*; but if you can grab a response in-flight, you can steal the transaction identifier if basic access auth or RFC 2069 digest auth is in use. **You've been warned.**

In a future release, Stardog will use [RFC 2617 HTTP
Digest Authentication](http://tools.ietf.org/html/rfc2617), which is
less vulnerable to various attacks, and will never ask a client to use a
different authentication type, which should lessen the likelihood of
MitM attacks for properly restricted Stardog clients--that is, a
Stardog client that treats any request by a proxy server or origin
server (i.e., Stardog) to use basic access auth or RFC 2069 digest auth
as a MitM attack. See [RFC 2617](http://tools.ietf.org/html/rfc2617) for more information.

### Transaction Commit

```httpstardog
POST /{db}/transaction/commit/{txId} → void | text/plain
```

Returns a representation of the committed transaction; `200` means the
commit was successful. Otherwise a `500` error indicates the commit
failed and the text returned in the result is the failure message.

As you might expect, failed commits exit cleanly, rolling back any
changes that were made to the database.

### Transaction Rollback

```httpstardog
POST /{db}/transaction/rollback/{txId} → void | text/plain
```

Returns a representation of the transaction after it's been rolled back.
`200` means the rollback was successful, otherwise `500` indicates the
rollback failed and the text returned in the result is the failure
message.

### Querying (Transactionally)
```httpstardog
GET | POST /{db}/{txId}/query
```

Returns a representation of a query executed within the `txId`
transaction. Queries within transactions will be slower as extra
processing is required to make the changes visible to the query. Again,
the valid Accept types are listed above in the `HTTP Headers` section.

### Adding Data (Transactionally)

```httpstardog
POST /{db}/{txId}/add → void | text/plain
```

Returns a representation of data added to the database of the specified
transaction. Accepts an optional parameter, `graph-uri`, which specifies
the named graph the data should be added to. If a named graph is not
specified, the data is added to the default (i.e., unnamed) context. The
response codes are `200` for success and `500` for failure.

### Deleting Data (Transactionally)

```httpstardog
POST /{db}/{txId}/remove → void | text/plain
```

Returns a representation of data removed from the database within the
specified transaction. Also accepts `graph-uri` with the analogous
meaning as above (Add in Transaction); response codes are the same as
with Add in Transaction.

### Clear Database

```httpstardog
POST /{db}/{txId}/clear → void | text/plain
```

Removes all data from the database within the context of the
transaction. `200` indicates success; `500` indicates an error. Also
takes an optional parameter, `graph-uri`, which removes data from a
named graph. To clear only the default graph, pass `DEFAULT` as the value of `graph-uri`.

### Explanation of Inferences

```httpstardog
POST /{db}/reasoning/explain → RDF
POST /{db}/reasoning/{txId}/explain → RDF
```

Returns the explanation of the axiom which is in the body of the `POST`
request. The request takes the axioms in any supported RDF format and
returns the explanation for why that axiom was inferred as Turtle.

### Explanation of Inconsistency

```httpstardog
GET | POST /{db}/reasoning/explain/inconsistency → RDF
```

If the database is logically inconsistent, this returns an explanation for the
inconsistency.

### Consistency

```httpstardog
GET | POST /{db}/reasoning/consistency → text/boolean
```

Returns whether or not the database is consistent w.r.t to the TBox.

### Listing Integrity Constraints

```httpstardog
GET /{db}/icv → RDF
```

Returns the integrity constraints for the specified database serialized in any supported RDF format.

### Adding Integrity Constraints

```httpstardog
POST /{db}/icv/add
```

Accepts a set of valid Integrity constraints serialized in any RDF
format supported by Stardog and adds them to the database in an atomic
action. 200 return code indicates the constraints were added
successfully, 500 indicates that the constraints were not valid or
unable to be added.

### Removing Integrity Constraints

```httpstardog
POST /{db}/icv/remove
```

Accepts a set of valid Integrity constraints serialized in any RDF
format supported by Stardog and removes them from the database in a
single atomic action. `200` indicates the constraints were successfully
remove; `500` indicates an error.

### Clearing Integrity Constraints

```httpstardog
POST /{db}/icv/clear
```

Drops **all** integrity constraints for a database. `200` indicates all
constraints were successfully dropped; `500` indicates an error.

### Converting Constraints to SPARQL Queries

```httpstardog
    POST /{db}/icv/convert
```

The body of the `POST` is a single integrity constraint, serialized in
any supported RDF format, with `Content-type` set appropriately. Returns
either a `text/plain` result containing a single SPARQL query; or it
returns `400` if more than one constraint was included in the input.

## Admin Resources

To administer Stardog over HTTP, use the following resource
representations, HTTP response codes, and resource identifiers.

### List databases
```httpstardog
GET /admin/databases → application/json
```
Lists all the databases available.

Output JSON example:

``` javascript
    {
      "databases" : ["testdb", "exampledb"]
    }
```
### Copy a database

```httpstardog
PUT /admin/databases/{db}/copy?to={db_copy}
```

Copies a database `db` to another specified `db_copy`.

### Create a new database

```httpstardog
    POST /admin/databases
```

Creates a new database; expects a multipart request with a JSON
specifying database name, options and filenames followed by (optional)
file contents as a multipart `POST` request.

Expected input (`application/json`):

``` javascript
    {
      "dbname" : "testDb",
      "options" : {
        "icv.active.graphs" : "http://graph, http://another",
        "search.enabled" : true,
        ...
      },
      "files" : [{ "name":"fileX.ttl", "context":"some:context" }, ...]
    }
```

### Drop an existing database

```httpstardog
    DELETE /admin/databases/{db}
```

Drops an existing database `db` and all the information that it
contains. Goodbye Callahan!

### Migrate an existing database

```httpstardog
    PUT /admin/databases/{db}/migrate
```

Migrates the existing content of a legacy database to new format.

### Optimize an existing database

```httpstardog
    PUT /admin/databases/{db}/optimize
```

Optimize an existing database.

### Sets an existing database online.

```httpstardog
    PUT /admin/databases/{db}/online
```

Request message to set an existing database {db} online.

### Sets an existing database offline.

```httpstardog
    PUT /admin/databases/{db}/offline
```

Request message to set an existing database offline; receives optionally
a JSON input to specify a timeout for the offline operation. When not
specified, defaults to 3 minutes as the timeout; the timeout should be
provided in **milliseconds**. The timeout is the amount of time the
database will wait for existing connections to complete before going
offline. This will allow open transaction to commit/rollback, open
queries to complete, etc. After the timeout has expired, all remaining
open connections are closed and the database goes offline.

Optional input (`application/json`):

``` javascript
    {
      "timeout" : <timeout_in_ms>
    }
```

### Set option values to an existing database.

```httpstardog
    POST /admin/databases/{kb}/options
```

Set options in the database passed through a JSON object specification,
i.e. JSON Request for option values. Database options can be found
[here](../admin/#admin-db).

Expected input (`application/json`):

```javascript
    {
      "database.name" : "DB_NAME",
      "icv.enabled" : true | false,
      "search.enabled" : true | false,
      ...
    }
```

### Get option values of an existing database.

```httpstardog
PUT /admin/databases/{kb}/options → application/json
```

Retrieves a set of options passed via a JSON object.
The JSON input has empty values for each key, but will be filled with
the option values in the database in the output.

Expected input:

``` javascript
    {
      "database.name" : ...,
      "icv.enabled" : ...,
      "search.enabled" : ...,
      ...
    }
```

Output JSON example:

``` javascript
    {
      "database.name" : "testdb",
      "icv.enabled" : true,
      "search.enabled" : true,
      ...
    }
```

### Add a new user to the system.

```httpstardog
    POST /admin/users
```

Adds a new user to the system; allows a configuration option for
superuser as a JSON object. Superuser configuration is set as default to
false. The password **must** be provided for the user.

Expected input:

``` javascript
    {
      "username"  : "bob",
      "superuser" : true | false
      "password"  : "passwd"
    }
```

### Change user password.

```httpstardog
    PUT /admin/users/{user}/pwd
```

Changes {user} password in the system. Receives input of new password as
a JSON Object.

Expected input:

``` javascript
    {
      "password" : "xxxxx"
    }
```

### Check if user is enabled.

```httpstardog
    GET /admin/users/{user}/enabled → application/json
```

Verifies if user is enabled in the system.

Output JSON example:

``` javascript
    {
      "enabled": true
    }
```

### Check if user is superuser.

```httpstardog
    GET /admin/users/{user}/superuser → application/json
```

Verifies if the user is a superuser:

``` javascript
    {
      "superuser": true
    }
```

### Listing users.

```httpstardog
    GET /admin/users → application/json
```

Retrieves a list of users.

Output JSON example:

``` javascript
    {
      "users": ["anonymous", "admin"]
    }
```

### Listing user roles.

```httpstardog
    GET /admin/users/{user}/roles → application/json
```

Retrieves the list of the roles assigned to user.

Output JSON example:

``` javascript
    {
      "roles": ["reader"]
    }
```
### Deleting users.

```httpstardog
    DELETE /admin/users/{user}
```

Removes a user from the system.

### Enabling users.

```httpstardog
    PUT /admin/users/{user}/enabled
```

Enables a user in the system; expects a JSON object in the following
format:

``` javascript
    {
      "enabled" : true
    }
```

### Setting user roles.

```httpstardog
    PUT /admin/users/{user}/roles
```

Sets roles for a given user; expects a JSON object specifying the roles
for the user in the following format:

``` javascript
    {
      "roles" : ["reader","secTestDb-full"]
    }
```

### Adding new roles.

```httpstardog
    POST /admin/roles
```

Adds the new role to the system.

Expected input:

``` javascript
 {
   "rolename" : ""
 }
```

### Listing roles.

```httpstardog
GET /admin/roles → application/json
```

Retrieves the list of roles registered in the system.

Output JSON example:

``` javascript
{
   "roles": ["reader"]
 }
```

### Listing users with a specified role.

```httpstardog
GET /admin/roles/{role}/users → application/json
```

Retrieves users that have the role assigned.

Output JSON example:

``` javascript
{
   "users": ["anonymous"]
}
```

### Deleting roles.

```httpstardog
DELETE /admin/roles/{role}?force={force}
```

Deletes an existing role from the system; the force parameter is a
boolean flag which indicates if the delete call for the role must be
forced.

### Assigning permissions to roles.

```httpstardog
PUT /admin/permissions/role/{role}
```

Creates a new permission for a given role over a specified resource;
expects input JSON Object in the following format:

``` javascript
{
   "action" : "read" | "write" | "create" | "delete" | "revoke" | "execute" | "grant" | "*",
   "resource_type" : "user" | "role" | "db" | "named-graph" | "metadata" | "admin" | "icv-constraints" | "*",
   "resource" : ""
}
```

### Assigning permissions to users.

```httpstardog
PUT /admin/permissions/user/{user}
```

Creates a new permission for a given user over a specified resource;
expects input JSON Object in the following format:

``` javascript
{
   "action" : "read" | "write" | "create" | "delete" | "revoke" | "execute" | "grant" | "*",
   "resource_type" : "user" | "role" | "db" | "named-graph" | "metadata" | "admin" | "icv-constraints" | "*",
   "resource" : ""
 }
```

### Deleting permissions from roles.

```httpstardog
POST /admin/permissions/role/{role}/delete
```

Deletes a permission for a given role over a specified resource; expects
input JSON Object in the following format:

``` javascript
 {
    "action" : "read" | "write" | "create" | "delete" | "revoke" | "execute" | "grant" | "*",
    "resource_type" : "user" | "role" | "db" | "named-graph" | "metadata" | "admin" | "icv-constraints" | "*",
    "resource" : ""
 }
```

### Deleting permissions from users.

```httpstardog
POST /admin/permissions/user/{user}/delete
```

Deletes a permission for a given user over a specified resource; expects
input JSON Object in the following format:

``` javascript
{
   "action" : "read" | "write" | "create" | "delete" | "revoke" | "execute" | "grant" | "*",
   "resource_type" : "user" | "role" | "db" | "named-graph" | "metadata" | "admin" | "icv-constraints" | "*",
   "resource" : ""
}
```

### Listing role permissions.

```httpstardog
GET /admin/permissions/role/{role} → application/json
```

Retrieves permissions assigned to the role.

Output JSON example:

```javascript
 {
   "permissions": ["stardog:read:*"]
 }
```

### Listing user permissions.

```httpstardog
GET /admin/permissions/user/{user} → application/json
```

Retrieves permissions assigned to the user.

Output JSON example:

``` javascript
 {
   "permissions": ["stardog:read:*"]
 }
```

### Listing user effective permissions.

```httpstardog
GET /admin/permissions/effective/user/{user} → application/json
```

Retrieves effective permissions assigned to the user.

Output JSON example:

```javascript
    {
      "permissions": ["stardog:*"]
    }
```

### Shutdown server.

```httpstardog
POST /admin/shutdown
```

Shuts down the Stardog Server. If successful, returns a `202` to
indicate that the request was recieved and that the server will be shut
down shortly.
