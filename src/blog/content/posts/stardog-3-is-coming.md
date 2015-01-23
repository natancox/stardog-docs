+++
date = "2015-01-22T12:28:02-05:00"
draft = false 
author = "Kendall Clark"
title = "A Preview of Stardog 3: Part One"

+++

In this first post of a quick series we'll be looking at the big
changes in the upcoming Stardog 3.0 release. As you'll see, we've been
working hard to deliver the best enterprise semantic graph database on
the planet. Stardog 3.0 is the result of more than **10,000
commits**. Wow.

In this post we'll look at HA Cluster and performance improvements. In
the next post we'll look at improvements to Stardog's reasoning
capabilities. Finally, we'll look at improvements to ICV, search, and
some miscellaneous items.

{{% figure src="/img/change.jpg" class="inliner" %}}

### High Availability

Stardog HA Cluster beta was released in Fall, 2014; while it was
usable, it wasn't as robust as we wanted. Let's start by saying that
distributed systems of any kind are hard! And distributed semantic
graph databases are even harder. But for the 3.0 release 
Edgar Rodriguez Diaz and Fernando Hernandez just **crushed**.

Stardog 3.0 is ready for continuous operations.

### Annual Subscription License Model

balh blah blah

{{% figure src="/img/commit.jpg" class="inliner" %}}
### Write Performance

Stardog has always privileged reads over writes; but we don't want the
privilege to run unchecked and we don't want write performance to be
unduly slow. For the 3.0 release Evren Sirin rewrote two code
paths--one for bulk writing at database-creation time and the other
for incremental writes--into a single, blazingly fast code
path. Stardog's incremental performance is now within 5% of its bulk
writing performance which means a big speedup in the common case.

something, something

{{% figure src="/img/writing.jpg" class="inliner" %}}
### Query Performance

One of Stardog's distinguishers has always been SPARQL query
evaluation performance. We continue to treat slow queries as bugs to
be fixed as quickly as possible. 

Pavel, smart algebraic rewriter, hash tables, memory pressure
