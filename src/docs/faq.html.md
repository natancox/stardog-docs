---
quote: "Software is under a constant tension. Being symbolic it is arbitrarily perfectible; but also it is arbitrarily changeable."
title: "FAQ"
layout: "default"
toc: true
---

Some frequently asked questions for which we have answers.

## SPARQL 1.1

**Question:** Does Stardog support SPARQL 1.1?

**Answer:** Yes. 

## Deadlocks and Slowdowns

**Question:** Stardog slows down or deadlocks?! I don't understand why,
I'm just trying to send some queries and do something with the
results...in a tight inner loop of doom!

**Answer:** Make sure you are closing result sets (`TupleQueryResult`
and `GraphQueryResult`; or the Jena equivalents) when you are done with
them. These hold open resources both on the client and on the server and
failing to close them when you are done will cause files, streams,
lions, tigers, and bears to be held open. If you do that enough, then
you'll eventually exhaust all of the resources in their respective
pools, which can cause slowness or, in some cases, deadlocks waiting for
resources to be returned.

Similarly close your connections when you are done with them. Failing to
close `Connections`, `Iterations`, `QueryResults`, and other *closeable*
objects will lead to undesirable behavior.

## Bulk Update Performance

**Question:** I'm adding one triple at a time, in a tight loop, to
Stardog; is this the ideal strategy with respect to performance?

**Question:** I'm adding millions of triples to Stardog and I'm
wondering if that's the best approach?

**Answer:** The answer to both questions is "not really"...

Generally overall update performance is best if you write between 1k
and 100k triples at a time. You may need to experiment to find the sweet
spot with respect to your data, database size, the size of the
differential index, and update frequency.

## Public Endpoint

**Question:** I want to use Stardog to serve a public SPARQL endpoint;
is there some way I can do this without publishing user account
information?

**Answer:** We don't necessarily recommend this, but it's possible.
Simply pass `--disable-security` to `stardog-admin` when you start the
Stardog Server; while this may be the worst possible name for an
argument, since it doesn't actually disable security, it will use the
built-in anonymous user (given the default configuration and user
accounts) in a way that makes Stardog usable for a public endpoint.

## Remote Bulk Loading

**Question:** I'm trying to create a database and bulk load files from
my machine to the server and it's not working, the files don't seem to
load, what gives?

**Answer:** Stardog does not tranfser files during database creation to
the server, sending big files over a network kind of defeats the purpose
of blazing fast bulk loading. If you want to bulk load files from your
machine to a remote server, copy them to the server and bulk load them.

