---
quote: "Every program is a part of some other program and rarely fits."
title: "What's New and When?"
layout: default
related: ""
toc: true
---

This page briefly lists major features and other notable changes to Stardog from 1.0 to 2.0; it will be updated for each new release. For a complete list of changes, including notable bug fixes, see the [Release Notes](/docs/RELEASE_NOTES.txt).

## 2.2

- Support for RDF versioning
- Admin support for Web Console

## 2.1

- Database repair, backup & restore utilities
- Improved query scalability by flowing intermediate results off-heap or onto disk; requires a JDK that supports `sun.misc.Unsafe`
- [Performance](/performance): significant improvement in performance of bulk loading and total scalability of a database
- Generation of multiple proofs for inferences & inconsistencies; proofs for integrity constraint violations
- Reduced memory footprint of queries while being executed

## 2.0

- [SPARQL 1.1 Update](/using/#sd-Updating); the most requested feature ever!
- [Web Console](/console): a Stardog Web app for managing Stardog Databases; includes Linked Data Server, etc.
- [JMX monitoring](/admin/#sd-JMX); includes graphical monitoring via Web Console
- [HTTP & SNARL servers unified](/admin/#sd-HTTP-SNARL-Unification) into a single server (default port 5820)
- [Database archetypes](/admin/#sd-Archetypes) for PROV, SKOS; extensible for user-defined ontologies, schemas, etc.
- [Stardog Rules Syntax](/owl2/#sd-Stardog-Rules-Syntax): new syntax for user-defined rules
- [Performance improvements](/performance) for SPARQL query evaluation
- [Hierarchical explanations](/owl2/#sd-Proof-Trees) of inferences using proof trees
- [SL reasoning profile](/owl2/#sd-Profiles)
- Client and server dependencies cleanly separated
- Evaluation of non-recursive datalog queries to improve reasoning performance

## 1.2

- Query management: slow query log, kill-able queries, etc.
- new CLI
- new transaction layer
- SPARQL Service Description
- new security layer
- Query rewrite cache
- Removed Stardog Shell

## 1.1.2

- New optimizer for subqueries

## 1.1

- SPARQL 1.1 Query
- Transitive reasoning
- User-defined rules in SWRL
- new SWRL builtins and syntactic sugar for schema-queries
- Improved performance of reasoning queries involving rdf:type
- Improved performance of search indexing
- Deprecated Stardog Shell

## 1.0.4

- Convert ICVs to SPARQL queries in the CLI or Java API
- Running as a Windows Service
- Parametric queries in CLI

## 1.0.2

- Stardog Community
- ICV in SNARL and HTTP
- HTTP Admin protocol extensions
- SPARQL 1.1 Graph Store Protocol

## 1.0.1

- Self-hosting Stardog documentation
- Prefix mappings per database
- Access and audit logging

## 1.0

- Execute `DESCRIBE` queries against multiple resources
- Database consistency checking from CLI
- Inference explanations from CLI
