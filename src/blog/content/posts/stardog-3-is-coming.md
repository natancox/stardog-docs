+++
date = "2015-01-22T12:28:02-05:00"
draft = false 
author = "Kendall Clark, Mike Grove, Pavel Klinov, Evren Sirin"
title = "A Preview of Stardog 3: Part One"

+++

In this first post of a quick series we'll be looking at the big
changes in the upcoming Stardog 3 release.Stardog 3 is
the result of more than **10,000 commits**.<!--more-->

In this post we'll look at HA Cluster and performance
improvements. Then we'll look at improvements to Stardog's reasoning
capabilities. Finally, we'll look at improvements to ICV, search, and
some miscellaneous items.

{{% figure src="/img/change.jpg" class="inliner" %}}

## High Availability

Stardog HA Cluster beta was released in Fall, 2014; while it was
usable, it wasn't as robust as we wanted. Let's start by saying that
distributed systems of any kind are hard And distributed semantic
graph databases are even harder. But for the 3.0 release 
Edgar Rodriguez Diaz and Fernando Hernandez just **crushed**.

Stardog 3 is ready for continuous operations.

## Annual Subscription License Model

As a result of the production-ready state of HA Cluster, we're
introducing a new wrinkle in the Stardog licensing model: per-node
annual subscriptions. This wrinkle is optimized for multi-node
clusters.

{{% figure src="/img/commit.jpg" class="inliner" %}}
## Write Performance

Stardog privileges reads over writes; but that doesn't mean we will
accept slow write performance. Stardog's write speed at database
creation time has been one of the best in the industry for a while;
and now with Stardog 3, updates to an existing database are equally
fast, which means a big speedup in the common case.

Stardog 3 is more clever about handling updates so there are fewer
configuration options to tweak. The number of threads used for parsing
and processing files, the size of buffers used during processing,
etc. are automatically computed and adjusted so you can add a few
triples or a lot without tweaking.

Concurrency for transactions has also been improved: read queries can
continue execution while a large update transaction is committed. This
means you can wipe and reload a database while it is online without
disrupting queries in-flight. As an added benefit, the logs will show
the progress for long write transactions, just like the progress of
database creation, so you'll know when a huge update is going
to finish.

{{% figure src="/img/writing.jpg" class="inliner" %}}
## Query Performance

Stardog has always been optimized for SPARQL query evaluation
performance. We continue to treat slow queries as bugs to be fixed as
quickly as possible.

Here are some of things we did to improve query performance in 3.0:

* **We made hash and loop joins more memory efficient.**

    The classic hash and (nested) loop join algorithms are memory
    intensive. For example, `HashJoin(A, B)` would typically create an
    in-memory hashtable for B and then look up joinable solutions
    while iterating over `A`. This is problematic if `B` produces a
    lot of bindings since they all have to sit in memory. They might
    even sit there long enough to be promoted to the old GC generation
    with all the entailed problems.

    One way to address this issue, implemented in Stardog 2.x, is
    persistent hashtables. This addresses the memory problem but at a
    certain cost: persistent hashtables are slower to build and use.

    Stardog 3 can take an operator and use it as a hashtable, which
    works best if the operator is sorted so that each look-up can be
    done in `O(logN)` time.  The new implementation doesn't incur any
    upfront cost and is, thus, ideal for queries with a `LIMIT` clause
    or `ASK` form.

* **Implemented optimizations based on the new hashtables.**

    Consider a query:

    <pre><code class="sparql">?x a :Type . #A
    ?x dc:creator ?creator . #B
    ?creator :ssn "XXX-XX-XXXX" #C</code></pre>

    Imagine that `A` and `B` are unselective and `C` is very
    selective. Stardog 2.x favors hash joins with small hash tables
    and would create a join tree like `HashJoin(A MergeJoin(B,
    C))`. Since C is selective, `MergeJoin(B, C)` may return few
    bindings, making the hashtable of the top hash join small. But the
    top hash join requires full iteration over `A`, which is a lot of
    IO.

    Stardog 3 finds a better plan: `HashJoin(MergeJoin(B, C), A)`. Now
    we iterate over the small number of bindings returned by
    `MergeJoin(B, C)` and for each do a `O(logN)` lookup **directly** in
    the index for `A`, which now looks like a hash table for the
    top hash join. This requires very little IO and memory at only a
    marginal cost of look-up `O(logN)`, instead of pseudo-constant time
    for real hashtables.

* **Made in-memory hashtables more efficient.**

    It's still important to have fast in-memory hashtables for those
    case where it seems like building them leads to better
    plans. Stardog 3's hashtables were rewritten to make sure no
    unnecessary memory is ever spent in any of the relevant data
    structures.

* **Query planner improvements, too.**

    - Stardog 3 has a new cost model for the planner to take full
      advantage of the new hash and loop join algorithms.

    - A new algorithm for algebraic rewriting, that is, transforming
      the original SPARQL algebra into an equivalent one for which it
      is more likely that the join order optimizer will find the
      optimal join tree, which is particularly important for complex
      queries with `UNION` and `OPTIONAL`. The trick here is to figure
      out which `BGP`s can act like a key, propagate that information
      throughout the plan tree, determine if cardinalities can be
      reduced by joining with this key, and then compute chains of
      patterns to connect the key with the relevant scopes.

Fun stuff!

## Conclusion

In the next two parts of this series we'll look at Stardog 3's
improvements in reasoning, ICV, search, and custom aggregates.

You can download Stardog 3 at [stardog.com](http://stardog.com/).
