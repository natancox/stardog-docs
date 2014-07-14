---
quote: "The proof of a system's value is its existence."
layout: "default"
title: "OWL & Rule Reasoning"
toc: true
shortTitle: Reasoning
---

##Introduction

In this chapter we describe [how to use Stardog's reasoning
capabilities](#reasoning); we also address some [common
problems](#trouble) and [known issues](#issues). We also describe
[Stardog's approach to query answering](#approach) in some detail, as
well as a set of [guidelines](#guidelines) that contribute to efficient
query answering. If you are not familiar with the terminology, you can
peruse the section on [terminology](#terminology).

Stardog reasoning is based on the [OWL 2 Direct Semantics Entailment
Regime](http://www.w3.org/TR/2010/WD-sparql11-entailment-20100126/#id45013).
Stardog performs reasoning in a lazy and late-binding fashion: it
does not materialize inferences; but, rather, reasoning is performed at
query time according to a given reasoning level. This allows for maximum
flexibility while maintaining excellent performance and scalability.

### Reasoning Levels

Stardog supports several reasoning levels; the reasoning level determines the kinds of inference rules or axioms that are to be considered during query evaluation:

-   **NONE**. No axioms are considered.
-   **RDFS**. For the OWL 2 axioms allowed in [RDF
    schema](http://www.w3.org/TR/rdf-schema/) (mainly subclasses,
    subproperties, domain, and ranges).
-   **QL**. For [OWL 2 QL](http://www.w3.org/TR/owl2-profiles/#OWL_2_QL)
    axioms.
-   **RL**. For [OWL 2 RL](http://www.w3.org/TR/owl2-profiles/#OWL_2_RL)
    axioms.
-   **EL**. For [OWL 2 EL](http://www.w3.org/TR/owl2-profiles/#OWL_2_EL)
    axioms.
-   **DL**. For [OWL 2 DL](http://www.w3.org/TR/owl2-syntax/) axioms.
-   **SL**. For a combination of RDFS, QL, RL, and EL axioms, plus [SWRL rules](http://www.w3.org/Submission/SWRL/).

## Using Reasoning

In order to perform query evaluation with reasoning, Stardog requires a
schema (sometimes called a "TBox") to be present in the database. Since
schemas are serialized as RDF, they are loaded into a Stardog database
in the same way that any RDF is loaded into a Stardog database. Also,
note that, since it is just more RDF triples, the schema may change as
needed: it is neither fixed nor compiled in any special way.

The schema may reside in the default graph, in a specific named graph,
or in a collection of graphs. You can tell Stardog where the schema is
by setting the `reasoning.schema.graphs` property to one or more named
graph URIs. If you want the default graph to be considered part of the
schema, then you can use the special built-in URI
`tag:stardog:api:context:default`. If you want to use all named graphs
(that is, to tell Stardog to look for the schema in every named graph),
you can use `tag:stardog:api:context:all`. The default value for this
property is to use the default graph only.

### Query Answering

All of Stardog's interfaces (API, network, and CLI) support reasoning during query evaluation.

### Command Line

In order to evaluate queries in Stardog using reasoning via the command
line, a specific reasoning level must be specified in the [connection
string](../admin/):

```bash
$ ./stardog query "myDB;reasoning=QL" "SELECT ?s { ?s a :C } LIMIT 10"
```

### HTTP

For HTTP, the reasoning level is specified with the other connection
parameters:

```bash
$ curl -u admin:admin -X GET "http://localhost:5822/myDB/query?reasoning=ql&query=..."
```

### `ReasoningConnection` API

In order to use the ReasoningConnection API one needs to specify a
reasoning level. See the [Java Programming](../java/) chapter for
details on specifying the reasoning level programmatically.

Currently, the API has two methods:

-   `isConsistent()`, which can be used to check if the current DB is
    consistent with respect to the reasoning level.
-   `isSatisfiable(URI theURIClass)`, which can be used to check if the
    given class if satisfiable with respect to the current DB and
    reasoning level.

## Explaining Reasoning Results

Stardog can be used to check if the current DB logically entails a set
of triples; moreover, Stardog can explain why this is so. An explanation
of an inference is the minimum set of statements explicitly stored in
the database that together justify or warrant the inference.
Explanations are useful for debugging and understanding, especially when
large number of statements interact with each other to infer new
statements.

Explanations can be retrieved using the CLI command `explain inference`
by providing an input file that contains the inferences to be explained:

```bash
$ stardog reasoning explain "myDB;reasoning=EL" inference_to_explain.ttl
```

The output is displayed in a concise syntax designed to be legible; but
it can be rendered in any one of the supported RDF syntaxes if desired.
Explanations are also accessible through the [extended HTTP
protocol](../network/#extended-http) and SNARL API. See the examples
included in the distribution for more details about retrieving
explanations programmatically.

<div id="sd-Proof-Trees"></div>
### Proof Trees <t>new2</t>

Proof trees are a hierarchical presentation of multiple explanations (of inferences) to make data, schemas, and rules more intelligible. Proof tree<fn>Triggered using the `--format tree` option of the `reasoning explain` CLI command.</fn> provides an explanation for an inference or an
inconsistency in a *hierarchical structure*. Nodes in the proof tree may
represent an assertion in a Stardog database. Multiple assertion nodes are
grouped under an inferred node.

#### Example

For example, if we are explaining the inferred triple `:Alice
rdf:type :Employee` , the root of the proof tree will show that
inference:

```sparql
INFERRED :Alice rdf:type :Employee
```

The children of an inferred node will provide more explanation for
that inference:

```sparql
INFERRED :Alice rdf:type :Employee
    ASSERTED :Manager rdfs:subClassOf :Employee
    INFERRED :Alice rdf:type :Manager
```

The fully expanded proof tree will show the asserted triples and
axioms for every inference:

```sparql
INFERRED :Alice rdf:type :Employee
    ASSERTED :Manager rdfs:subClassOf :Employee
    INFERRED :Alice rdf:type :Manager
        ASSERTED :Alice :supervises :Bob
        ASSERTED :supervises rdfs:domain :Manager
```

The CLI explanation command prints the proof tree using indented text;
but, using the SNARL API, it is easy to create a tree widget
in a GUI to show the explanation tree, such that users can expand and
collapse details in the explanation.

Another feature of proof trees is the ability to merge multiple
explanations into a single proof tree with multiple branches when
explanations have common statements. Consider the following example
database:


```sparql
#schema
:Manager rdfs:subClassOf :Employee
:ProjectManager rdfs:subClassOf :Manager
:ProjectManager owl:equivalentClass (:manages some :Project)
:supervises rdfs:domain :Manager
:ResearchProject rdfs:subClassOf :Project
:projectID rdfs:domain :Project

# instance data
:Alice :supervises :Bob
:Alice :manages :ProjectX
:ProjectX a :ResearchProject
:ProjectX :projectID "123-45-6789"
```

In this database, there are three different unique explanations
for the inference `:Alice rdf:type :Employee`:

##### Explanation 1

```sparql
:Manager rdfs:subClassOf :Employee
:ProjectManager rdfs:subClassOf :Manager
:supervises rdfs:domain :Manager
:Alice :supervises :Bob
```

##### Explanation 2

```sparql
:Manager rdfs:subClassOf :Employee
:ProjectManager rdfs:subClassOf :Manager
:ProjectManager owl:equivalentClass (:manages some :Project)
:ResearchProject rdfs:subClassOf :Project
:Alice :manages :ProjectX
:ProjectX a :ResearchProject
```
##### Explanation 3

```sparql
:Manager rdfs:subClassOf :Employee
:ProjectManager rdfs:subClassOf :Manager
:ProjectManager owl:equivalentClass (:manages some :Project)
:projectID rdfs:domain :Project
:Alice :manages :ProjectX
:ProjectX :projectID "123-45-6789"
```

All three explanations have some triples in common; but
when explanations are retrieved separately, it is hard to see how
these explanations are related. When explanations are merged, we
get a single proof tree where alternatives for subtrees of the
proof are shown inline. In indented text rendering, the merged
tree for the above explanations would look as follows:

```sparql
INFERRED :Alice a :Employee
   ASSERTED :Manager rdfs:subClassOf :Employee
   1.1) INFERRED :Alice a :Manager
      ASSERTED :supervises rdfs:domain :Manager
      ASSERTED :Alice :supervises :Bob
   1.2) INFERRED :Alice a :Manager
      ASSERTED :ProjectManager rdfs:subClassOf :Manager
      INFERRED :Alice a :ProjectManager
         ASSERTED :ProjectManager owl:equivalentClass (:manages some :Project)
         ASSERTED :Alice :manages :ProjectX
         2.1) INFERRED :ProjectX a :Project
            ASSERTED :projectID rdfs:domain :Project
            ASSERTED :ProjectX :projectID "123-45-6789"
         2.2) INFERRED :ProjectX a :Project
            ASSERTED :ResearchProject rdfs:subClassOf :Project
            ASSERTED :ProjectX a :ResearchProject
```

In the merged proof tree, alternatives for an
explanation is shown with a number id. In the above tree,
`:Alice a :Manager` is the first inference for which we have
multiple explanations so it gets the id `1`. Then each alternative
explanation gets an id appended to this (so explanations `1.1` and
`1.2` are both alternative explanations for inference `1`). We
also have multiple explanations for inference `:ProjectX a :Project`
so its alternatives get ids `2.1` and `2.2`.
Again, a tree widget in a GUI can show this proof tree in a more
user-friendly way.

## User-defined Rule Reasoning

Many reasoning problems may be solved with OWL's axiom-based approach;
but, of course, not all reasoning problems are amenable to this
approach. A user-defined rules approach complements the OWL axiom-based
approach nicely and increases the expressive power of a reasoning system
from the user's point of view. Many RDF databases support user-defined
rules only. Stardog is one of the only RDF databases that
comprehensively supports both axioms and rules. Some problems (and some
people) are simply a better fit for a rules-based approach to modeling
and reasoning than to an axioms-based approach.

**Remember**: there isn't a one-size-fits-all answer to the question
"rules or axioms or both?" Use the thing that makes the most sense to you
and to the people you're working with, etc.

Stardog supports user-defined rule reasoning together with a rich set of
built-in functions using the [SWRL](http://www.w3.org/Submission/SWRL/)
syntax and builtin-ins library. In order to apply SWRL user-defined
rules, you must include the rules as part of the database's schema: that
is, put your rules where your axioms are, i.e., in the schema. See
[Schema Extraction](#tbox_extraction) for more details. Once the rules
are part of the schema, they will be used for reasoning automatically
when using the **SL** reasoning level.

Assertions implied by the rules *will not* be materialized. Instead,
rules are used to expand queries just as regular axioms are in Stardog.
**Note**: to trigger rules to "fire", execute a query. It's that simple.

<div id="sd-Stardog-Rules-Syntax"></div>
### Stardog Rules Syntax <t>new2</t>

Stardog supports two different syntaxes for defining rules. The first
is native Stardog Rules syntax and is based on SPARQL, so you
can re-use what you already know about SPARQL to write rules.
**Unless you have specific requirements otherwise, you should use this
syntax for user-defined rules in Stardog.** The second, the *de facto*
standard RDF/XML syntax for SWRL. It has the advantage of being supported
in many tools; but it's not fun to read or to write. You probably
don't want to use it. Better: don't use this syntax!

Stardog Rules Syntax is basically SPARQL "basic graph patterns" (BGPs) plus some
very explicit new bits (`IF-THEN`) to denote the head and the body of a
rule.<fn>Quick refresher: the `IF` clause defines the conditions to match in the
data; if they match, then the contents of the `THEN` clause "fire", that is,
they are inferred and, thus, available for other queries, rules, or axioms,
etc.</fn> You define URI prefixes in the normal way  (examples below) and use
regular SPARQL variables for rule variables. As you can see, some SPARQL 1.1
syntactic sugar--property paths, especially, but also bnode syntax--make complex
Stardog Rules quite concise and elegant.

#### How to Use Stardog Rules

There are three things to sort out:

1. Where to put these rules?
2. How to represent these rules?
3. What are the gotchas?

First, the rules go into the database, of course; and, in particular, they go into
the named graph in which Stardog expects to find the TBox. This setting by
default in Stardog is the "default graph", i.e., unless you've changed
the value of `reasoning.schema.graphs`, you're probably going to be
fine; that is, just add the rules to the database and it will all
work out.<fn>Of course if you've tweaked `reasoning.schema.graphs`, then you
should put the rules into the named graphs that are specifed
in that configuration parameter.</fn>

Second, you represent the rules with specially constructed RDF triples. Here's
a kind of template example:

```sparql
@prefix rule: <tag:stardog:api:rule:> .
[] a rule:SPARQLRule;
   rule:content """
   ...la di dah the rule goes here!
   """.
```

So there's a namespace--`tag:stardog:api:rule:`--that has a predicate, `content`, and a class, `SPARQLRule`. The object of this triple contains *one* rule in Stardog Rules syntax. A more realistic example:

```sparql
@prefix rule: <tag:stardog:api:rule:> .

[] a rule:SPARQLRule ;
  rule:content """
    PREFIX :<urn:test:>
      IF {
            ?r a :Rectangle ;
               :width ?w ;
               :height ?h
            BIND (?w * ?h AS ?area)
          }
      THEN {
              ?r :area ?area
          }""" .
```

That's pretty easy!<fn>We'll produce a complete tutorial and spec for an upcoming 2.0.x release.</fn>

Third, what are the gotchas? There are two:

1. The RDF serialization of rules in, say, a Turtle file has to use the `tag:stardog:api:rule:` namespace URI and then whatever prefix, if any, mechanism that's valid for that serialization. In the examples here, we use Turtle. Hence, we use `@prefix`, etc.
2. However, the namespace URIs used *by the rules themselves* can be defined in only two places: the string that contains the rule--in the example above, you can see the default namespace is `urn:test:`--or in the Stardog database in which the rules are stored. Either place will work; if there are conflicts, the "closest definition wins", that is, if `foo:Example` is defined in both the rule content and in the Stardog database, the definition in the rule content is the one that Stardog will use.

#### Stardog Rules Examples

```sparql
PREFIX rule: <tag:stardog:api:rule:>
PREFIX : <urn:test:>
PREFIX gr: <http://purl.org/goodrelations/v1#>

:Product1 gr:hasPriceSpecification [ gr:hasCurrencyValue 100.0 ] .
:Product2 gr:hasPriceSpecification [ gr:hasCurrencyValue 500.0 ] .
:Product3 gr:hasPriceSpecification [ gr:hasCurrencyValue 2000.0 ] .

[] a rule:SPARQLRule ;
   rule:content """
       PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>
       PREFIX gr: <http://purl.org/goodrelations/v1#>
       PREFIX :<urn:test:>
     IF {
        ?offering gr:hasPriceSpecification ?ps .
        ?ps gr:hasCurrencyValue ?price .
        FILTER (?price >= 200.00).
     }
     THEN {
        ?offering a :ExpensiveProduct .
     }
   """.
```

This example is self-contained: it contains some data (the `:Product...` triples) and a rule. It also demonstrates the use of SPARQL's `FILTER` to do numerical (and other) comparisons.

Here's a more complex example that includes four rules and, again, some data.

```sparql
PREFIX rule: <tag:stardog:api:rule:>
PREFIX : <urn:test:>

:c a :Circle ;
   :radius 10 .

:t a :Triangle ;
   :base 4 ;
   :height 10 .

:r a :Rectangle ;
   :width 5 ;
   :height 8 .

:s a :Rectangle ;
   :width 10 ;
   :height 10 .

[] a rule:SPARQLRule ;
   rule:content """
     PREFIX :<urn:test:>
     IF {
        ?r a :Rectangle ;
           :width ?w ;
           :height ?h
        BIND (?w * ?h AS ?area)
     }
     THEN {
         ?r :area ?area
     }""" .

[] a rule:SPARQLRule ;
   rule:content """
     PREFIX :<urn:test:>
     IF {
        ?t a :Triangle ;
           :base ?b ;
           :height ?h
        BIND (?b * ?h / 2 AS ?area)
     }
     THEN {
         ?t :area ?area
     }""" .

[] a rule:SPARQLRule ;
   rule:content """
     PREFIX :<urn:test:>
     PREFIX math: <http://www.w3.org/2005/xpath-functions/math#>
     IF {
          ?c a :Circle ;
             :radius ?r
          BIND (math:pi() * math:pow(?r, 2) AS ?area)
     }
     THEN {
         ?c :area ?area
     }""" .


[] a rule:SPARQLRule ;
   rule:content """
     PREFIX :<urn:test:>
     IF {
          ?r a :Rectangle ;
             :width ?w ;
             :height ?h
          FILTER (?w = ?h)
     }
     THEN {
         ?r a :Square
     }""" .
```

This example also demonstrates how to use SPARQL's `BIND` to introduce intermediate variables and do calculations with or to them.

Let's look at some other rules, but just the rule content this time for concision, to see some use of other SPARQL features.

This rule says that a person between 13 and 19 (inclusive) years of age is a teenager:

```sparql
PREFIX swrlb: <http://www.w3.org/2003/11/swrlb#>
PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>

IF {
      ?x a :Person; hasAge ?age.
      FILTER (?age >= 13 && ?age <= 19)
}
THEN {
      ?x a :Teenager.
}
```

This rule says that a male person with a sibling who is the parent of a female is an "uncle of a niece":

```sparql
IF {
      $x a Person; a :Male; :hasSibling $y;
      $y :isParentOf $z;
      $z a :Female.
}
THEN {
      $x a :UncleOfNiece.
}
```

You can use SPARQL 1.1 property paths (and bnodes for unnecessary variables (that is, ones that aren't used in the `THEN`)) to render this rule even more concisely:

```sparql
IF {
      $x a :Person, :Male; :hasSibling/:isParentOf [a :Female]
}
THEN {
      $x a :UncleOfNiece.
}
```

Aside: that's pure awesome.

And of course a person who's male and has a niece or nephew is an uncle of his
niece(s) and nephew(s):

```sparql
IF {
     ?x a :Male; :isSiblingOf/:isParentOf ?z
}
THEN {
      ?x :isUncleOf ?z.
}
```

A super user can read all of the things!

```sparql
IF {
      ?x a :SuperUser.
      ?y a :Resource.
      ?z a <http://www.w3.org/ns/sparql#UUID>.
}
THEN {
      ?z a :Role.
      ?x :hasRole ?z; :readPermission ?y.
}
```

### Supported Built-Ins

Stardog supports a wide variety of functions from SPARQL, XPath, SWRL, and some native Stardog functions, too. All of them may be used in either Stardog Rules syntax or in SWRL syntax. The supported functions are enumerated [here](/using/#functions).

## Special Predicates

Stardog supports some builtin predicates with special meaning in order to queries and rules easier to read and write. These special predicates are primarily syntactic sugar for more complex structures.

### Direct/Strict Subclasses, Subproperties, & Direct Types

Besides the standard RDF(S) predicates `rdf:type`, `rdfs:subClassOf` and
`rdfs:subPropertyOf`, Stardog supports the following special built-in
predicates:

-   `sp:directType`
-   `sp:directSubClassOf`
-   `sp:strictSubClassOf`
-   `sp:directSubPropertyOf`
-   `sp:strictSubPropertyOf`

Where the `sp` prefix binds to `tag:stardog:api:property:`. Stardog also recognizes `sesame:directType`,
`sesame:directSubClassOf`, and `sesame:strictSubClassOf` predicates where the prefix `sesame` binds to
`http://www.openrdf.org/schema/sesame#`.

We show what these each of these predicates means by relating them to an
equivalent triple pattern; that is, you can just write the predicate rather than the (more unwieldy) triple pattern.

```sparql
# c1 is a subclass of c2 but not equivalent to c2

:c1 sp:strictSubClassOf :c2      =>       :c1 rdfs:subClassOf :c2 .
                                          FILTER NOT EXISTS {
                                             :c1 owl:equivalentClass :c2 .
                                          }
```

```sparql
# c1 is a strict subclass of c2 and there is no c3 between c1 and c2 in the strict subclass hierarchy

:c1 sp:directSubClassOf :c2      =>       :c1 sp:strictSubClassOf :c2 .
                                          FILTER NOT EXISTS {
                                             :c1 sp:strictSubClassOf :c3 .
                                             :c3 sp:strictSubClassOf :c2 .
                                          }
```

```sparql
# ind is an instance of c1 but not an instance of any strict subclass of c1

:ind sp:directType :c1           =>       :ind rdf:type :c1 .
                                          FILTER NOT EXISTS {
                                             :ind rdf:type :c2 .
                                             :c2 sp:strictSubClassOf :c1 .
                                          }
```

The predicates `sp:directSubPropertyOf` and `sp:strictSubPropertyOf` are defined analogously.

### New Individuals with SWRL

Stardog also supports a special predicate that extends the expressivity of SWRL rules. According to the SWLR spec,
you can't create new individuals (i.e., new instances of classes) in a SWRL rule.

**Note:** Don't get hung up by the tech vocabulary here..."new individual" just means that you can't have a rule
that adds a new instance of some RDF or OWL class as a result of the rule firing.

This restriction is well-motivated as it can easily cause rules to be non-terminating, that is, they never reach
a fixed point, which causes big problems. Stardog's user-defined rules weakens this restriction in some crucial
aspects, subject to the following restrictions, conditions, and warnings.

**This special predicate is basically a loaded gun with which you may shoot yourselves in the foot if you aren't very careful.**

So despite the general restriction in SWRL, in Stardog we actually can create new individuals with a rule by using
the function `UUID()` as follows:

```sparql
IF {
    ?person a :Person .
    BIND (UUID() AS ?parent) .
}
THEN {
    ?parent a :Parent .
}
```

**Note:** Alternatively, we can use the predicate `<http://www.w3.org/ns/sparql#UUID>` as a unary SWRL built-in.

This rule will create a *random* URI for each instance of the class `:Person` and also assert that each new instance
is an instance of `:Parent`.

#### Remarks

* The URIs for the generated individuals are meaningless in the sense that they should not be used in further
queries; that is to say, these URIs are not guaranteed by Stardog to be stable.
* Due to normalization, rules with more than one atom in the head are broken up into several rules. Thus,

```sparql
IF {
    ?person a :Person .
    BIND (UUID() AS ?parent) .
}
THEN {
    ?parent a :Parent ;
            a :Male .
}
```

will be normalized into two rules:

```sparql
IF {
    ?person a :Person .
    BIND (UUID() AS ?parent) .
}
THEN {
    ?parent a :Parent .
}
```

```sparql
IF {
    ?person a :Person .
    BIND (UUID() AS ?parent) .
}
THEN {
    ?parent a :Male .
}
```

As a consequence, in this case, instead of stating that the new
individual is both an instance of `:Male` and `:Parent`, we would create
two *different* new individuals, and assert that one is male and the
other is a parent. If you need to assert various things about the new
individual, we recommend the use of extra rules/axioms. In the previous
example, we can introduce a new class (`:Father`) and add the following
rule to our schema:

```sparql
IF {
    ?person a :Father .
}
THEN {
    ?parent a :Parent ;
            a :Male .
}
```

And then modify the original rule accordingly:

```sparql
IF {
    ?person a :Person .
    BIND (UUID() AS ?parent) .
}
THEN {
    ?parent a :Father .
}
```

## Query Rewriting

Reasoning in Stardog is based (mostly) on a *query rewriting*
technique: Stardog rewrites the user's query with respect to any schema or rules, and then executes the resulting expanded query (EQ) against the data in the normal way. This process is completely automated and requires no intervention from the user per se.

As can be seen in Figure 2, the rewriting process involves five different phases.

![](/img/blackout.png)

Figure 1. Query Answering

![](/img/blackout-internals.png)

Figure 2. Query Rewriting

We illustrate the query answering process by means of an example.
Consider a Stardog database, MyDB<sub>1</sub>, containing the following schema:

```manchester
 :SeniorManager rdfs:subClassOf :manages some :Manager
 :manages some :Employee rdfs:subClassOf :Manager
 :Manager rdfs:subClassOf :Employee
```

Which says that a senior manager manages at least one manager, that
every person that manages an employee is a manager, and that every
manager is also an employee.

Let's also assume that MyDB<sub>1</sub>
contains the following data assertions:

```manchester
:Bill rdf:type :SeniorManager
:Robert rdf:type :Manager
:Ana :manages :Lucy
:Lucy rdf:type :Employee
```

Finally, let's say that we want to retrieve the set of all
employees. We do this by posing the following query:

```sparql
SELECT ?employee WHERE { ?employee rdf:type :Employee }
```

To answer this query, Stardog first **rewrites** it using the information in the schema. So the original query is rewritten into four queries:

```sparql
SELECT ?employee WHERE { ?employee rdf:type :Employee }
SELECT ?employee WHERE { ?employee rdf:type :Manager }
SELECT ?employee WHERE { ?employee rdf:type :SeniorManager }
SELECT ?employee WHERE { ?employee :manages ?x. ?x rdf:type :Employee }
```

Then Stardog executes these queries over the data.

The form of the EQ depends on the reasoning level. For OWL 2 QL, every
EQ produced by Stardog is **guaranteed to be expanded into a set of
queries**. If the reasoning level is OWL 2 RL or EL, then the EQ *may*
(but may not) include a recursive rule. If a recursive rule is included,
Stardog's answers will be sound but incomplete with respect to the
semantics of the reasoning level.<fn>We're working on changes to Stardog's reasoner so that it's complete in the case where recursive rules exist; these changes will be available in the 2.x release cycle.</fn>

### Why Query Rewriting?

Query rewriting has several advantages over the alternative
technique, materialization. In materialization, the data
gets expanded with respect to the schema, not the query. The
schema is used to generate new triples, typicaly when data is added or removed from the system. However, materialization introduces some issues:

-   **data freshness**. Materialization has to be performed every time
    the data or the schema change. This is particularly unsuitable for
    applications where the data changes frequently.
-   **data size**. Depending on the schema, materialization can
    significantly increase the size of the data. A relatively simple
    class hierarchy with a single level of subclasses increases the
    size of the data.
-   **OWL 2 profile reasoning**. Given the fact that QL, RL, and EL, are
    not comparable with respect to expressive power, an application that
    requires reasoning with more than one profile would need to maintain
    different corresponding materialized versions of the data.
-   **Resources**. Depending on the size of the original data and the
    complexity of the schema, materialization can be computationally
    expensive.

## Performance Hints

The query rewriting approach suggests some guidelines for more efficient query answering.

### Hierarchies and Queries

**Avoid unnecessarily deep class/property hierarchies**. If you do not
need to model several different types of a given class or property in
your schema, then don't do that! The reason shallow hierarchies are desirable
is that the maximal hierarchy depth in the ontology partly determines
the maximal size of the EQs produced by Stardog. The larger the EQ, the
more difficult it is to evaluate, generally.

For example, suppose our schema contains a very thorough and detailed
set of subclasses of the class `:Employee`:

```manchester
:Manager rdfs:subClassOf :Employee
:SeniorManager rdfs:subClassOf :Manager
...

:Supervisor rdfs:subClassOf :Employee
:DepartmentSupervisor rdfs:subClassOf :Supervisor
...

:Secretary rdfs:subClassOf :Employee
...
```

If we wanted to retrieve the set of all employees, Stardog would
produce an EQ containing a query of the following form for every
subclass `:Ci` of `:Employee`:

```sparql
SELECT ?employee WHERE { ?employee rdf:type :Ci }
```

Thus, **the more specific the query, the better**. Why? More general queries--that is, queries that contain concepts high up in the class hierarchy defined by the schema--will typically yield larger EQs.

### Domains and Ranges

**Specify domain and range of the properties in the schema**. These
types of axiom can help reduce the size of the EQs significantly. Why?

Consider the following query asking for people and the employees they manage:

```sparql
SELECT ?manager ?employee WHERE
  { ?manager :manages ?employee.
    ?employee rdf:type :Employee. }
```

We know that this query would cause a large EQ given a deep hierarchy
of `:Employee` subclasses. However, if we added the following single
range axiom:

```manchester
      :manages rdfs:range :Employee
```

then the EQ would collapse to:

```sparql
 SELECT ?manager ?employee WHERE { ?manager :manages ?employee }
```

which is considerably cheaper to evaluate.

## Not Seeing Expected Results?

Here's a few things that you might want to know about.

### Are variable types ambiguous?

When a SPARQL query gets executed, each variable is bound to a URI, blank node,
or literal to form a particular result (a collection of these results is known
as a result set). In the context of reasoning, URIs might represent different
entities: individuals, classes, properties, etc. According to the [relevant standard](http://www.w3.org/TR/sparql11-entailment/#OWLDSEnRegime), **every variable in a SPARQL query must bind to at most one of these types of entity**.

Stardog can often figure out the right entity type from the query itself (e.g., given the
triple pattern `?i ?p "a literal"`, we know `?p` is supposed to bind to a data
property); however, some times this isn't possible (e.g., `?s ?p ?o`). In case
the types can't be determined automatically, **Stardog logs a message and evaluates the
query without any reasoning**.

You can add one or more type triples to the query to resolve these ambiguities.<fn>These are harmless and won't otherwise affect query evaluation; they can also be added to the data, instead of to queries, if that fits yr use case better.</fn> 

These "type triples" have the orm `?var a TYPE`, where `TYPE` is a
URI representing the type of entity to which the variable `?var` is supposed to
bind: the most common are `owl:ObjectProperty` or `owl:DatatypeProperty`; in some cases, you might want `owl:NamedIndividual`, or `owl:Class`. For instance, if you are interested in all the
object properties of `:i1`, you can use the following
query:

```sparql
    SELECT ?o 
    WHERE { 
        :i1 ?p ?o. 
        ?p a owl:ObjectProperty.
    }.
```

Since Stardog now knows that `?p` should bind to an object property, we can now infer that `?o` binds to an individual, so there are no ambiguities and reasoning can be performed as requested.

### Is the schema where you think it is?

Stardog might be extracting the wrong schema. You have to tell Stardog where to find the schema. See [Schema Extraction](#tbox_extraction) for details.

### Are you using the right reasoning level?

Perhaps some of the modeling constructs (a.k.a. axioms) in your database are being ignored. You can find out which axioms are being ignored due to the reasoning level used by simply including the following line in the logging.properties file in `STARDOG_HOME`:

```java
        com.clarkparsia.blackout.level = ALL
```

### Are you using DL?

Stardog supports schema-only reasoning for OWL 2 DL, which effectively means that only TBox queries—queries that contain [TBox BGPs](#query_types) only—will return complete query results.

### Are you using SWRL?

As from version 2.0, SWRL rules are only taken into account using the **SL** reasoning level.

### Do you know what to expect?

The [OWL 2 primer](http://www.w3.org/TR/owl2-primer/) is always a good place to start.

## Known Issues

Stardog <t>version</t> does not

-   Follow ontology `owl:imports` statements automatically; any imported
    OWL ontologies that are required for reasoning must be loaded into a
    Stardog database in the normal way.
-   Handle recursive queries. If recursion is necessary to answer the
    query with respect to the schema, results will be sound (no wrong
    answers) but potentially incomplete (some correct answers not
    returned) with respect to the requested reasoning type.
-   Perform equality reasoning. Only *explicit* `owl:sameAs` and
    `owl:differentFrom` data assertions will be taken into account for
    query answering.
-   Perform datatype reasoning or respect user-defined datatypes.

## Terminology

This chapter uses the following terms of art.

### Databases

A *database* (DB), a.k.a. ontology, is composed of two different parts:
the schema or *Terminological Box* (TBox) and the data or *Assertional
Box* (ABox). Analogus to relational databases, the TBox can be thought
of as the schema, and the ABox as the data. In other words, the TBox is
a set of *axioms*, whereas the ABox is a set of *assertions*.

As we explain in [Section OWL 2 Profiles](#profiles), the kinds of
assertion and axiom that one might use for a particular database are
determined by the fragment of OWL 2 to which one would like to adhere.
In general, you should choose the OWL 2 profile that most closely fits
the data modeling needs of your application.

The most common data assertions are class and property assertions. Class
assertions are used to state that a particular individual is an instance
of a given class. Property assertions are used to state that two
particular individuals (or an individual and a literal) are related via
a given property. For example, suppose we have a DB MyDB<sub>2</sub> that
contains the following data assertions:We use the usual standard
prefixes for RDF(S) and OWL.

```manchester
:clark_and_parsia rdf:type :Company
:clark_and_parsia :maintains :Stardog
```

stating that `:clark_and_parsia` is a company, and that
`:clark_and_parsia` maintains `:Stardog`.

The most common schema axioms are subclass axioms. Subclass axioms are
used to state that every instance of a particular class is also an
instance of another class. For example, suppose that MyDB<sub>2</sub> contains
the following TBox axiom:

```manchester
:Company rdfs:subClassOf :Organization
```

stating that companies are a type of organization.

### Queries

When reasoning is enabled, Stardog executes SPARQL queries (simply
queries from now on) depending on the type of Basic Graph Patterns they
contain.

A BGP is said to be an ABox BGP if it is of one of the following forms:

-   **term<sub>1</sub>** `rdf:type` **uri**
-   **term<sub>1</sub>** **uri** **term<sub>2</sub>**
-   **term<sub>1</sub>** `owl:differentFrom` **term<sub>2</sub>**
-   **term<sub>1</sub>** `owl:sameAs` **term<sub>2</sub>**

A BGP is said to be a TBox BGP if it is of one of the following forms:

-   **term<sub>1</sub>** `rdfs:subClassOf` **term<sub>2</sub>**
-   **term<sub>1</sub>** `owl:disjointWith` **term<sub>2</sub>**
-   **term<sub>1</sub>** `owl:equivalentClass` **term<sub>2</sub>**
-   **term<sub>1</sub>** `rdfs:subPropertyOf` **term<sub>2</sub>**
-   **term<sub>1</sub>** `owl:equivalentProperty` **term<sub>2</sub>**
-   **term<sub>1</sub>** `owl:inverseOf` **term<sub>2</sub>**
-   **term<sub>1</sub>** `owl:propertyDisjointWith` **term<sub>2</sub>**
-   **term<sub>1</sub>** `rdfs:domain` **term<sub>2</sub>**
-   **term<sub>1</sub>** `rdfs:range` **term<sub>2</sub>**

A BGP is said to be a Hybrid BGP if it is of one of the following forms:

-   **term<sub>1</sub>** `rdf:type` **?var**
-   **term<sub>1</sub>** **?var** **term<sub>2</sub>**

where **term** (possibly with subscripts) is either an URI or variable;
**uri** is a URI; and **?var** is a variable.

When executing a query, ABox BGPs are handled by Stardog. TBox BGPs are
executed by Pellet embedded in Stardog. Hybrid BGPs by a combination of both.

### Reasoning

Intuitively, reasoning with a DB means to make implicit knowledge
explicit. There are two main use cases for reasoning: infer implicit
knowledge and to discover modeling errors.

With respect to the first use case, recall that MyDB<sub>2</sub> contains the
following assertion and axiom:

```manchester
 :clark_and_parsia rdf:type :Company
 :Company rdfs:subClassOf :Organization
```

From this DB, we can use Stardog in order to *infer* that
`:clark_and_parsia` is an organization:

```
:clark_and_parsia rdf:type :Organization
```

Using reasoning in order to infer implicit knowledge in the context of
an enterprise application can lead to simpler queries. Let us suppose,
for example, that MyDB<sub>2</sub> contains a complex class hierarchy including
several types of organization (including company). Let us further
suppose that our application requires to use Stardog in order to get the
list of all considered organizations. If Stardog were used **with
reasoning**, then we would need only issue the following simple query:

```sparql
SELECT ?org WHERE { ?org rdf:type :Organization}
```

In contrast, if we were using Stardog **with no reasoning**, then we
would have to issue the following considerably more complex query that
considers all possible types of organization:

```sparql
SELECT ?org WHERE
              { { ?org rdf:type :Organization } UNION
              { ?org rdf:type :Company } UNION
...
}
```

Stardog can also be used in order to discover modeling errors in a DB.
The most common modeling errors are *unsatisfiable* classes and
*inconsistent* DBs.

An unsatisfiable class is simply a class that cannot have any instances.
Say, for example, that we added the following axioms to MyDB<sub>2</sub>:

```manchester
 :Company owl:disjointWith :Organization
 :LLC owl:equivalentClass :Company and :Organization
```

stating that companies cannot be organizations and vice versa, and that
an LLC is a company and an organization. The disjointness axiom causes
the class `:LLC` to be unsatisfiable because, for the DB to be
free of any logical contradiction, there can be no instances of `:LLC`.

Asserting (or inferring) that an unsatisfiable class has an instance,
causes the DB to be *inconsistent*. In the particular case of MyDB<sub>2</sub>,
we know that `:clark_and_parsia` is a company *and* an organization (see
above); therefore, we also know that it is an instance of `:LLC`, and as
`:LLC` is known to be unsatisfiable, we have that MyDB<sub>2</sub> is
inconsistent.

Using reasoning in order to discover modeling errors in the context of
an enterprise application is useful in order to maintain a correct
contradiction-free model of the domain. In our example, we discovered
that `:LLC` is unsatisfiable and MyDB<sub>2</sub> is inconsistent, which leads us
to believe that there is a modeling error in our DB. In this case, it is
easy to see that the problem is the disjointness axiom between
`:Company` and `:Organization`.

### OWL 2 Profiles

As explained in the [OWL 2 Web Ontology Language Profiles
Specification](http://www.w3.org/TR/owl2-profiles/) of the W3C, an OWL 2
profile is a trimmed down version of OWL 2 that trades some expressive
power for the efficiency of reasoning. There are three OWL 2 profiles,
each of which achieves efficiency differently.

-   [OWL 2 QL](http://www.w3.org/TR/owl2-profiles/#OWL_2_QL) is aimed at
    applications that use very large volumes of instance data, and where
    query answering is the most important reasoning task. The expressive
    power of the profile is necessarily limited, however it includes
    most of the main features of conceptual models such as UML class
    diagrams and ER diagrams.
-   [OWL 2 EL](http://www.w3.org/TR/owl2-profiles/#OWL_2_EL) is
    particularly useful in applications employing ontologies that
    contain very large numbers of properties and/or classes. This
    profile captures the expressive power used by many such ontologies
    and is a subset of OWL 2 for which the basic reasoning problems can
    be performed in time that is polynomial with respect to the size of
    the ontology.
-   [OWL 2 RL](http://www.w3.org/TR/owl2-profiles/#OWL_2_RL) is aimed at
    applications that require scalable reasoning without sacrificing too
    much expressive power. It is designed to accommodate OWL 2
    applications that can trade the full expressivity of the language
    for efficiency, as well as RDF(S) applications that need some added
    expressivity.

Each profile restricts the kinds of axiom and assertion that can be used
in a DB. Intuitively, QL is the least expressive of the profiles,
followed by RL and EL; however, strictly speaking, no profile is more
expressive than any other as they provide incomparable sets of
constructs.

Stardog supports the three profiles of OWL 2. Notably, since TBox BGPs are handled completely by Pellet, Stardog supports reasoning for the whole of OWL 2 for queries containing TBox BGPs only.
