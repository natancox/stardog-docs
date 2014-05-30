---
quote: "It is easier to write an incorrect program than understand a correct one."
title: "Integrity Constraint Validation"
layout: "default"
related: ""
toc: true
---

## Introduction

Stardog Integrity Constraint Validation ("ICV") validates RDF data stored in a Stardog database according to data rules (i.e., "constraints") described by users and that make sense for their domain, application, and data. These constraints are written in SPARQL, OWL, or SWRL. This chapter explains how to use ICV and how it works.

The use of high-level languages (OWL 2, SWRL, and SPARQL) to validate
RDF data using closed world semantics is one of Stardog's unique
capabilities. Using high level languages like OWL, SWRL, and SPARQL as schema or constraint languages for RDF and Linked Data has several advantages:

-   Unifying the domain model with data quality rules
-   Aligning the domain model and data quality rules with the
    integration model and language (i.e., RDF)
-   Being able to query the domain model, data quality rules,
    integration model, mapping rules, etc with SPARQL
-   Being able to use automated reasoning about all of these things to insure logical consistency, explain errors and problems, etc.

If you are also interested in theory and background, please see the [ICV specification](/icv/icv-specification.html), which has all the formal details.

## Getting Started with ICV

This log of a CLI session gives a full example of how to validate data using a mix of integrity constraints expressed in OWL and SPARQL. It uses data and constraints linked below.

<gist>5612900?file=commands.log</gist>

 See the following Gists to follow along at home:

- [Constraints in OWL](https://gist.github.com/evren/5612900#file-sota-constraints-ttl)
- [Example Data in Turtle](https://gist.github.com/evren/5612900#file-sota-data-ttl)
- [Java Example](https://gist.github.com/evren/5612900#file-sota-example-java)
- [Example Output](https://gist.github.com/evren/5612900#file-sota-example-out)
- [SPARQL Query Example in Java](https://gist.github.com/evren/5612900#file-sota-query-example-java)
- [SPARQL Query Output](https://gist.github.com/evren/5612900#file-sota-query-out)
- [Constraints in SPARQL](https://gist.github.com/evren/5612900#file-sota-query-sparql)

And, finally, the [full Gist with links to everything](https://gist.github.com/evren/5612900). In the rest of this chapter, we explain in more detail about programmatic access, as well as give a full slate of examples of ICV in action.

## ICV & OWL 2 Reasoning

**An integrity constraint may be satisfied or violated in either of two
ways: by an explicit statement in a Stardog database or by a statement that's been legally inferred by Stardog (because a user requested reasoning).**

This means that when ICV is enabled for a Stardog database, it has to be enabled with respect to a reasoning type (which we sometimes call in the Stardog Docs a "reasoning level"). The valid choices of reasoning type are any type or kind of reasoning supported by Stardog. See [Stardog's reasoning & inference chapter](/owl2#reasoning-levels) for more.

The implication is that ICV is performed with three inputs:

1. a Stardog database,
2. a set of constraints, and
3. a reasoning type (which may be, of course, no reasoning).

This is the case because domain modelers, ontology developers, or integrity constraint authors must consider the interactions between explicit and inferred statements and how these are accounted for in integrity constraints.

### Security Implications <t>secnote</t>

There is a security implication in this design choice that may not be
obvious. Changing the reasoning type associated with a database and
integrity constraint validation has serious security implications with
respect to a Stardog database and may only be performed by a user role
with sufficient privileges for that action.

##ICV Examples

Rather than discuss the [formal semantics](/icv/icv-specification.html) of
ICV here, we will look at some examples. The following examples use [OWL
2's Manchester syntax](http://www.w3.org/TR/owl2-manchester-syntax/); and they assume a simple data schema, which is
available as an [OWL ontology](/icv/company.owl) and as a [UML diagram](/icv/ClassDiagram.png). The examples also assume that the default
namespace is `<http://example.com/company.owl#>` and that `xsd:` is
bound to the standard, `<http://www.w3.org/2001/XMLSchema#>`.

[Reference Java code](https://gist.github.com/1333767) is available for each of
the following examples and is also distributed with Stardog.

### Subsumption Constraints

This kind of constraint guarantees certain subclass and superclass
(i.e., subsumption) relationships exist between instances.

#### Managers must be employees.

##### Constraint
```sparql
:Manager rdfs:subClassOf :Employee
```
##### Database A <t>i</t>
```sparql
:Alice a :Manager .
```
##### Database B <t>v</t>
```sparql
:Alice a :Manager , :Employee .
```
This constraint says that if an RDF individual is an instance of
`Manager`, then it must also be an instance of `Employee`. In
A, the only instance of `Manager`, namely `Alice`, is not an instance of
`Employee`; therefore, A is invalid. In B, `Alice` is an instance of
Database both `Manager` and `Employee`; therefore, B is valid.

### Domain-Range Constraints

These constraints control the types of domain and range instances of
properties.

#### Only project leaders can be responsible for projects.

##### Constraint
```sparql
:is_responsible_for rdfs:domain :Project_Leader
```
##### Database A <t>i</t>
```sparql
:Alice :is_responsible_for :MyProject .

:MyProject a :Project .
```
##### Database B <t>i</t>
```sparql
:Alice a :Project_Leader ;
	:is_responsible_for :MyProject .
```
##### Database C <t>v</t>
```sparql
:Alice a :Project_Leader ;
	:is_responsible_for :MyProject .

:MyProject a :Project .
```
This constraint says that if two RDF instances are related to each other via the property `is_responsible_for`, then
the range instance must be an instance of `Project_Leader` and the domain instance must be an instance of
`Project`. In Database A, there is only one pair of individuals related
via `is_responsible_for`, namely `(Alice, MyProject)`, and `MyProject`
is an instance of `Project`; but `Alice` is not an instance of
`Project_Leader`. Therefore, A is invalid. In B, `Alice` is an instance
of `Project_Leader`, but `MyProject` is not an instance of `Project`;
therefore, B is not valid. In C, `Alice` is an instance of
`Project_Leader`, and `MyProject` is an instance of `Project`;
therefore, C is valid.

#### Only employees can have an SSN.

##### Constraint
```sparql
:ssn rdfs:domain :Employee

```
##### Database A <t>i</t>
```sparql
:Bob :ssn "123-45-6789" .
```
##### Database B <t>v</t>
```sparql
:Bob a :Employee ;
	:ssn "123-45-6789" ..
```
This constraint says that if an RDF instance `i` has a data assertion
via the the property `SSN`, then `i` must be an instance of `Employee`.
In A, `Bob` is not an instance of `Employee` but
has `SSN`; therefore, A is invalid. In B, `Bob` is an
instance of `Employee`; therefore, B is valid.

#### A date of birth must be a date.

##### Constraint
```sparql
:dob rdfs:range xsd:date
```
##### Database A <t>i</t>
```sparql
:Bob :dob "1970-01-01" .
```
##### Database B <t>v</t>
```sparql
:Bob :dob "1970-01-01"^^xsd:date
```
This constraint says that if an RDF instance `i` is related to a literal
`l` via the data property `DOB`, then `l` must have the XML Schema type
`xsd:date`. In A, `Bob` is related to the untyped literal
`"1970-01-01"` via `DOB` so A is invalid. In B, the literal
`"1970-01-01"` is properly typed so it's valid.

### Participation Constraints

These constraints control whether or not an RDF instance participates
in some specified relationship.

#### Each supervisor must supervise at least one employee.

##### Constraint
```sparql
# Constraint in Terp syntax:
# :Supervisor rdfs:subClassOf (:supervises some :Employee)

:Supervisor rdfs:subClassOf
              [ a owl:Restriction ;
                owl:onProperty :supervises ;
                owl:someValuesFrom :Employee
              ] .
```
##### Database A <t>v</t>
```sparql
:Alice a owl:Thing .
```
##### Database B <t>i</t>
```sparql
:Alice a :Supervisor .
```
##### Database C <t>i</t>
```sparql
:Alice a :Supervisor ;
	:supervises :Bob .
```
##### Database D <t>v</t>
```sparql
:Alice a :Supervisor ;
	:supervises :Bob .

:Bob a :Employee
```
This constraint says that if an RDF instance `i` is of type
`Supervisor`, then `i` must be related to an individual `j` via the
property `supervises` and also that `j` must be an instance of `Employee`.
In A, `Supervisor` has no instances; therefore, A is trivially
valid. In B, the only instance of `Supervisor`, namely `Alice`, is
related to no individual; therefore, B is invalid. In C, `Alice` is
related to `Bob` via `supervises`, but `Bob` is not an instance of
`Employee`; therefore, C is invalid. In D, `Alice` is related to `Bob`
via `supervises`, and `Bob` is an instance of `Employee`; hence, D
is valid.

#### Each project must have a valid project number.

##### Constraint
```sparql
# Constraint in Terp syntax:
# :Project rdfs:subClassOf (:number some xsd:integer[>= 0, < 5000])

:Project rdfs:subClassOf
              [ a owl:Restriction ;
                owl:onProperty :number ;
                owl:someValuesFrom
                        [ a rdfs:Datatype ;
                          owl:onDatatype xsd:integer ;
                          owl:withRestrictions ([xsd:minInclusive 0] [ xsd:maxExclusive 5000])
                        ]
              ] .
```
##### Database A <t>v</t>
```sparql
:MyProject a owl:Thing .
```
##### Database B <t>i</t>
```sparql
:MyProject a :Project
```
##### Database C <t>i</t>
```sparql
:MyProject a :Project ;
	:number "23" .
```
##### Database D <t>i</t>
```sparql
:MyProject a :Project ;
	:number "6000"^^xsd:integer .
```
##### Database E <t>v</t>
```sparql
:MyProject a :Project ;
	:number "23"^^xsd:integer .
```
This constraint says that if an RDF instance `i` is of type `Project`,
then `i` must be related via the property `number` to an integer between
`0` and `5000` (inclusive)--that is, projects have project numbers in a certain range.
In  A, the individual `MyProject` is
not known to be an instance of `Project` so the constraint does not
apply at all and A is valid. In B, `MyProject` is an instance of
`Project` but doesn't have any data assertions via `number` so A
is invalid. In C, `MyProject` does have a data property assertion via
`number` but the literal `"23"` is untyped--so it's not an integer--therefore,
C is invalid. In D, `MyProject` is related to an integer via
`number` but it is out of the range: D is invalid. Finally,
in E, `MyProject` is related to the integer `23` which is in the range
of `[0,5000]` so E is valid.

### Cardinality Constraints

These constraints control the number of various relationships or
property values.

#### Employees must not work on more than 3 projects.

##### Constraint
```sparql
# Constraint in Terp syntax:
# :Employee rdfs:subClassOf (:works_on max 3 :Project)

:Employee rdfs:subClassOf
              [ a owl:Restriction ;
                owl:onProperty :works_on;
                owl:maxQualifiedCardinality "3"^^xsd:nonNegativeInteger ;
                owl:onClass :Project
              ] .
```
##### Database A <t>v</t>
```sparql
:Bob a owl:Thing.
```
##### Database B <t>v</t>
```sparql
:Bob a :Employee ;
	:works_on :MyProject .

:MyProject a :Project .
```
##### Database C <t>i</t>
```sparql
:Bob a :Employee ;
	:works_on :MyProject , :MyProjectFoo , :MyProjectBar , :MyProjectBaz .

:MyProject a :Project .

:MyProjectFoo a :Project .

:MyProjectBar a :Project .

:MyProjectBaz a :Project .
```
If an RDF instance `i` is an `Employee`, then
`i` must not be related via the property `works_on` to more than 3
instances of `Project`. In  A, `Bob` is not known
to be an instance of `Employee` so the constraint does not apply and the
A is valid. In B, `Bob` is an instance of `Employee` but is known
to work on only a single project, namely `MyProject`, so B is
valid. In C, `Bob` is related to 4 instances of `Project`
via `works_on`.

Now, pay attention, because this is important. Stardog ICV implements a weak form of the *unique name assumption*, that is, it assumes that things which have different names are, in fact, different things.<fn>The standard inference semantics of OWL 2 do not adopt the unique name assumption because, in information integration scenarios, things often have more than one name but that doesn't mean they are different things. For example, when several databases or other data sources all contain some partial information about, say, an employee, but they each name or identify the employee in different ways. OWL 2 won't assume these are different employees just because there are several names.</fn> Since Stardog ICV uses closed world (instead of open world) semantics,<fn>Strictly speaking, this is a bit misleading. Stardog ICV actually uses both open and closed world semantics: since inferences can violate or satisfy constraints, and Stardog uses open world semantics to calculate inferences, then the ICV process is compatible with open world reasoning, to which it then applies a form of closed world validation, as described in this chapter. Relax: we're experts and this stuff *works*!</fn> it assumes that the different projects with different names are, in fact, separate projects, which (in this case) violates the constraint and makes C invalid.

#### Departments must have at least 2 employees.

##### Constraint
```sparql
# Constraint in Terp syntax:
# :Department rdfs:subClassOf (inverse :works_in min 2 :Employee)

:Department rdfs:subClassOf
              [ a owl:Restriction ;
                owl:onProperty [owl:inverseOf :works_in] ;
                owl:minQualifiedCardinality "2"^^xsd:nonNegativeInteger ;
                owl:onClass :Employee
              ] .
```
##### Database A <t>v</t>
```sparql
:MyDepartment a owl:NamedIndividual .
```
##### Database B <t>i</t>
```sparql
:MyDepartment a :Department .

:Bob a :Employee ;
	:works_in :MyDepartment .
```
##### Database C <t>v</t>
```sparql
:MyDepartment a :Department .

:Alice a :Employee ;
	:works_in :MyDepartment .

:Bob a :Employee ;
	:works_in :MyDepartment .
```
This constraint says that if an RDF instance `i` is a `Department`, then
there should exist at least 2 instances `j` and `k` of class `Employee`
which are related to `i` via the property `works_in` (or, equivalently,
`i` should be related to them via the inverse of `works_in`). In A,
`MyDepartment` is not known to be an instance
of `Department` so the constraint does not apply. In B, `MyDepartment`
is an instance of `Department` but only one
instance of `Employee`, namely `Bob`, is known to work in it, so the
B is invalid. In C, `MyDepartment` is related to the individuals
`Bob` and `Alice`, which are both instances of `Employee` and
(again, due to weak Unique Name Assumption in Stardog  ICV), are
assumed to be distinct, so C is valid.

#### Managers must manage exactly 1 department.

##### Constraint
```sparql
# Constraint in Terp syntax:
# :Manager rdfs:subClassOf (:manages exactly 1 :Department)

:Manager rdfs:subClassOf
              [ a owl:Restriction ;
                owl:onProperty :manages ;
                owl:qualifiedCardinality "1"^^xsd:nonNegativeInteger ;
                owl:onClass :Department
              ] .
```
##### Database A <t>v</t>
```sparql
    Individual: Isabella
```
##### Database B <t>i</t>
```sparql
:Isabella a :Manager .
```
##### Database C <t>i</t>
```sparql
:Isabella a :Manager ;
	:manages :MyDepartment .
```
##### Database D <t>v</t>
```sparql
:Isabella a :Manager ;
	:manages :MyDepartment .

:MyDepartment a :Department .
```
##### Database E <t>i</t>
```sparql
:Isabella a :Manager ;
	:manages :MyDepartment , :MyDepartment1 .

:MyDepartment a :Department .

:MyDepartment1 a :Department .
```
This constraint says that if an RDF instance `i` is a `Manager`, then it
must be related to exactly 1 instance of `Department` via the property
`manages`. In A, the individual `Isabella` is not known to be
an instance of `Manager` so the constraint does not apply and the
A is valid. In B, `Isabella` is an instance of `Manager` but is
not related to any instances of `Department`, so B is
invalid. In C, `Isabella` is related to the individual `MyDepartment`
via the property `manages` but `MyDepartment` is not known to be an
instance of `Department`, so C is invalid. In D, `Isabella`
is related to exactly one instance of `Department`, namely
`MyDepartment`, so D is valid. Finally, in E, `Isabella` is
related to 2 distinct (again, because of weak UNA) instances of
`Department`, namely `MyDepartment` and `MyDepartment1`, so E
is invalid.

#### Entities may have no more than one name.

##### Constraint
```sparql
:name a owl:FunctionalProperty .
```
##### Database A <t>v</t>
```sparql
:MyDepartment a owl:Thing .
```
##### Database B <t>v</t>
```sparql
:MyDepartment :name "Human Resources" .
```
##### Database C <t>i</t>
```sparql
:MyDepartment :name "Human Resources" , "Legal" .
```
This constraint says that no RDF instance `i` can have more than 1
assertion via the data property `name`. In A, `MyDepartment` does not have any data property assertions so A is valid.
In B, `MyDepartment` has a single assertion via `name`, so the ontology
is also valid. In C, `MyDepartment` is related to 2 literals, namely
`"Human Resources"` and `"Legal"`, via `name`, so C is
invalid.

### Property Constraints

These constraints control how instances are related to one another via
properties.

#### The manager of a department must work in that department.

##### Constraint
```sparql
:manages rdfs:subPropertyOf :works_in .
```
##### Database A <t>i</t>
```sparql
:Bob :manages :MyDepartment
```
##### Database B <t>v</t>
```sparql
:Bob :works_in :MyDepartment ;
	:manages :MyDepartment .
```
This constraint says that if an RDF instance `i` is related to `j` via
the property `manages`, then `i` must also be related to `j` va the
property `works_in`. In A, `Bob` is related to `MyDepartment`
via `manages`, but not via `works_in`, so A is invalid. In
B, `Bob` is related to `MyDepartment` via both `manages` and
`works_in`, so B is valid.

#### Department managers must supervise all the department's employees.

##### Constraint
```sparql
:is_supervisor_of owl:propertyChainAxiom (:manages [owl:inverseOf :works_in]) .
```
##### Database A <t>i</t>
```sparql
:Jose :manages :MyDepartment ;
	:is_supervisor_of :Maria .

:Maria :works_in :MyDepartment .

:Diego :works_in :MyDepartment .
```
##### Database B <t>v</t>
```sparql
:Jose :manages :MyDepartment ;
	:is_supervisor_of :Maria , :Diego .

:Maria :works_in :MyDepartment .

:Diego :works_in :MyDepartment .
```
This constraint says that if an RDF instance `i` is related to `j` via
the property `manages` and `k` is related to `j` via the property
`works_in`, then `i` must be related to `k` via the property
`is_supervisor_of`. In  A, `Jose` is related to `MyDepartment`
via `manages`, `Diego` is related to `MyDepartment` via `works_in`, but
`Jose` is not related to `Diego` via any property, so A is
invalid. In B, `Jose` is related to `Maria` and `Diego`--who are both
related to `MyDepartment` by way of `works_in`--via the property
`is_supervisor_of`, so B is valid.

### Complex Constraints

These constraints are more complex, often including multiple conditions.

#### Employee Constraints

Each employee either works on at least one project, supervises at least
one employee that works on at least one project, or manages at least one
department.

##### Constraint
```sparql
# Constraint in Terp syntax:
# :Employee rdfs:subClassOf (:works_on some (:Project or (:supervises some (:Employee and (:works_on some :Project))) or (:manages some :Department)))

:Employee rdfs:subClassOf
              [ a owl:Restriction ;
                owl:onProperty :works_on ;
                owl:someValuesFrom
                        [ owl:unionOf (:Project
                                      [ a owl:Restriction ;
                                        owl:onProperty :supervises ;
                                        owl:someValuesFrom
                                              [ owl:intersectionOf (:Employee
                                                                    [ a owl:Restriction ;
                                                                      owl:onProperty :works_on ;
                                                                      owl:someValuesFrom :Project
                                                                    ])
                                              ]
                                      ]
                                      [ a owl:Restriction ;
                                        owl:onProperty :manages ;
                                        owl:someValuesFrom :Department
                                      ])
                        ]
              ] .


```
##### Database A <t>i</t>
```sparql
:Esteban a :Employee .
```
##### Database B <t>i</t>
```sparql
:Esteban a :Employee ;
	:supervises :Lucinda .

:Lucinda a :Employee .
```
##### Database C <t>v</t>
```sparql
:Esteban a :Employee ;
	:supervises :Lucinda .

:Lucinda a :Employee ;
	:works_on :MyProject .

:MyProject a :Project .
```
##### Database D <t>v</t>
```sparql
:Esteban a :Employee ;
	:manages :MyDepartment .

:MyDepartment a :Department .
```
##### Database E <t>v</t>
```sparql
:Esteban a :Employee ;
	:manages :MyDepartment ;
	:works_on :MyProject .

:MyDepartment a :Department .

:MyProject a :Project .
```
This constraint says that if an individual `i` is an instance of
`Employee`, then at least one of three conditions must be met:

* it is related to an instance of `Project` via the property `works_on`
* it is related to an instance `j` via the property `supervises` and `j` is an instance of `Employee` and is also related to some instance of `Project` via the property `works_on`
* it is related to an instance of `Department` via the property `manages`.

A and B are invalid because none of the conditions are met. C
meets the second condition: `Esteban` (who is an `Employee`) is related
to `Lucinda` via the property `supervises` whereas `Lucinda` is both an
`Employee` and related to `MyProject`, which is a `Project`, via the
property `works_on`. D meets the third condition: `Esteban` is related
to an instance of `Department`, namely `MyDepartment`, via the property
`manages`. Finally, E meets the first and the third conditions because
in addition to managing a department `Esteban` is also related an
instance of `Project`, namely `MyProject`, via the property `works_on`

#### Employees and US government funding

Only employees who are American citizens can work on a project that
receives funds from a US government agency.

##### Constraint
```sparql
# Constraint in Terp syntax:
# :Project and (:receives_funds_from some :US_Government_Agency)) rdfs:subClassOf (inverse :works_on only (:Employee and (:nationality value "US")))

[ owl:intersectionOf (:Project
                       [ a owl:Restriction ;
                         owl:onProperty :receives_funds_from ;
                         owl:someValuesFrom :US_Government_Agency
                       ]) .
] rdfs:subClassOf
              [ a owl:Restriction ;
                owl:onProperty [owl:inverseOf :works_on] ;
                owl:allValuesFrom [ owl:intersectionOf (:Employee
                                                        [ a owl:Restriction ;
                                                          owl:hasValue "US" ;
                                                          owl:onProperty :nationality
                                                        ])
                                  ]
              ] .

```
##### Database A <t>v</t>
```sparql
:MyProject a :Project ;
	:receives_funds_from :NASA .

:NASA a :US_Government_Agency
```
##### Database B <t>i</t>
```sparql
:MyProject a :Project ;
	:receives_funds_from :NASA .

:NASA a :US_Government_Agency .

:Andy a :Employee ;
	:works_on :MyProject .
```
##### Database C <t>v</t>
```sparql
:MyProject a :Project ;
	:receives_funds_from :NASA .

:NASA a :US_Government_Agency .

:Andy a :Employee ;
	:works_on :MyProject ;
	:nationality "US" .
```
##### Database D <t>i</t>
```sparql
:MyProject a :Project ;
	:receives_funds_from :NASA .

:NASA a :US_Government_Agency .

:Andy a :Employee ;
	:works_on :MyProject ;
	:nationality "US" .

:Heidi a :Supervisor ;
	:works_on :MyProject ;
	:nationality "US" .
```
##### Database E <t>v</t>
```sparql
:MyProject a :Project ;
	:receives_funds_from :NASA .

:NASA a :US_Government_Agency .

:Andy a :Employee ;
	:works_on :MyProject ;
	:nationality "US" .

:Heidi a :Supervisor ;
	:works_on :MyProject ;
	:nationality "US" .

:Supervisor rdfs:subClassOf :Employee .
    SubClassOf: Employee
```
This constraint says that if an individual `i` is an instance of
`Project` and is related to an instance of `US_Government_Agency` via
the property `receives_funds_from`, then any individual `j` which is
related to `i` via the property `works_on` must satisfy two conditions:

* it must be an instance of `Employee`
* it must not be related to any literal other than `"US"` via the data property `nationality`.

A is valid because there is no individual related to
`MyProject` via `works_on`, so the constraint is trivially satisfied.
B is invalid since `Andy` is related to `MyProject` via
`works_on`, `MyProject` is an instance of `Project` and is related to
an instance of `US_Government_Agency`, that is, `NASA`, via
`receives_funds_from`, but `Andy` does not have any data property
assertions. C is valid because both conditions are met. D is not valid
because `Heidi` violated the first condition: she is related to
`MyProject` via `works_on` but is not known to be an instance of
`Employee`. Finally, this is fixed in E--by way of a handy OWL
axiom--which states that every instance of `Supervisor` is an
instance of `Employee`, so `Heidi` is inferred to be an
instance of `Employee` and, consequently, E is valid.

If you made it this far, you deserve a drink!


## Explaining ICV Violations

ICV violations can be explained using [proof trees](../owl2#sd-Proof-Trees)
similar to inferences. The following command will explain the IC violations
for constraints stored in the database:

```bash
$ stardog icv explain --reasoning EL "myDB"
```

It is possible to explain violations for external constraints by passing the
file with constraints as an additional argument:

```bash
$ stardog icv explain --reasoning EL "myDB" constraints.ttl
```

## Using ICV Programmatically

This section will describe how to use Stardog ICV via the SNARL APIs. For
more information on using SNARL in general, please refer to the
section on [programming with Stardog in Java](../java).

There is command-line interface support for many of the operations
necessary to using ICV with a Stardog database; please see the
[Administration](../admin) chapter for that documentation.

To use ICV in Stardog, one must:

1.  create some constraints
2.  associate those constraints with a Stardog database

### Creating Constraints

[`Constraints`](../java/snarl/com/complexible/stardog/icv/Constraint.html)
can be created using the
[`ConstraintFactory`](../java/snarl/com/complexible/stardog/icv/ConstraintFactory.html)
which provides methods for creating integrity constraints from OWL
axioms or from SPARQL select queries. `ConstraintFactory` expects your
constraints, if they are defined as OWL axioms, as an RDF triple (or
graph). To aid in authoring constraints in OWL,
[`ExpressionFactory`](../java/snarl/com/complexible/common/openrdf/util/ExpressionFactory.html)
is provided for building the [RDF
equivalent](http://www.w3.org/TR/owl2-mapping-to-rdf/) of the OWL axioms
of your constraint.

You can also write your constraints in OWL in your favorite editor and load them into the database from your OWL file.

We recommend defining your constraints as OWL axioms, but you are free
to define them using SPARQL `SELECT` queries. If you choose to define a
constraint using a SPARQL `SELECT` query, please keep in mind that if your
query returns results, those are interpreted as the violations of the
integrity constraint.

An example of creating a simple constraint using `ExpressionFactory`:

<gist>1333767?file=CreateConstraint.java</gist>

### Adding Constraints to Stardog

The [ICVConnection](../java/snarl/com/complexible/stardog/icv/api/ICVConnection.html) interface provides programmatic access to the ICV support in Stardog.
It provides support for adding, removing and clearing integrity constraints in
your database as well as methods for checking whether or not the data is
valid; and when it's not, retrieving the list of violations.

This example shows how to add an integrity constraint to a Stardog
database.

<gist>1333767?file=AddConstraint.java</gist>

Here we show how to add a set of constraints as defined in a local OWL
ontology.

<gist>1333767?file=AddConstraint2.java</gist>


### IC Validation

Checking whether or not the contents of a database are valid is easy. Once you have an
[`ICVConnection`](../java/snarl/com/complexible/stardog/icv/api/ICVConnection.html)
you can simply call its
[`isValid()`](../java/snarl/com/complexible/stardog/icv/api/ICVConnection.html#isValid(&#41;)
method which will return whether or not the contents of the database are
valid with respect to the constraints associated with that database.
Similarly, you can provide some
[`constraints`](../java/snarl/com/complexible/stardog/icv/Constraint.html)
to the `isValid()` method to see if the data in the database is invalid
for those ``specific`` constraints; which can be a subset of the
constraints associated with the database, or they can be new constraints
you are working on.

If the data is invalid for some constraints—either the explicit
constraints in your database or a new set of constraints you have
authored—you can get some information about what the violation was from
the SNARL IC Connection.
[`ICVConnection.getViolationBindings()`](../java/snarl/com/complexible/stardog/icv/api/ICVConnection.html#getViolationBindings(&#41;)
will return the constraints which are violated, and for each constraint,
you can get the violations as the set of bindings that satisfied the
constraint query. You can turn the bindings into the individuals which
are in the violation using
[`ICV.asIndividuals()`](../java/snarl/com/complexible/stardog/icv/ICV.html#asIndividuals(&#41;).

### ICV and Transactions

In addition to using the ICConnection a data oracle to tell whether or
not your data is valid with respect to some constraints, you can also
use Stardog's ICV support to protect your database from invalid data by
using ICV as a guard within transactions.

When guard mode for ICV is enabled in Stardog, each commit is inspected
to ensure that the contents of the database are valid for the set of
constraints that have been associated with it. Should someone attempt to
commit data which violates one or more of the constraints defined for
the database, the commit will fail and the data will not be
added/removed from your database.

By default, reasoning is not used when you enable guard mode, however
you are free to specify any of the reasoning types supported by Stardog
when enabling guard mode. If you have provided a specific reasoning type
for guard mode it will be used during validation of the integrity
constraints. This means you can author your constraints with the
expectation of inference results satisfying a constraint.

<gist>1333782?file=CreateDiskAndICV.java</gist>

This illustrates how to create a persistent disk database with ICV guard
mode enabled at the QL reasoning type. Guard mode can also be enabled
when the database is created on the [command line](../admin)

## Terminology

This chapter may be easier for you to
understand if you read this section on terminology a few times.

### ICV, Integrity Constraint Validation

The process of checking whether some Stardog database is valid with
respect to some integrity constraints. The result of ICV is a boolean
value (true if valid, false if invalid) and, optionally, an `explanation
of constraint violations`.

### Schema, TBox

A schema (or "terminology box" a.k.a., TBox) is a set of statements that
define the relationships between data elements, including property and
class names, their relationships, etc. In practical terms, schema
statements for a Stardog database are RDF Schema and OWL 2 terms,
axioms, and definitions.

### Data, ABox

All of the triples in a Stardog database that aren't part of the schema
are part of the data (or "assertional box" a.k.a. ABox).

### Integrity Constraint

A declarative expression of some rule or constraint which data must
conform to in order to be valid. Integrity Constraints are typically
domain and application specific. They can be expressed in OWL 2 (any
legal syntax), SWRL rules, or (a restricted form of) SPARQL queries.

### Constraints

Constraints that have been associated with a Stardog database and which
are used to validate the data it contains. Each Stardog may optionally
have one and only one set of constraints associated with it.

### Closed World Assumption, Closed World Reasoning

Stardog ICV assumes a closed world with respect to data and constraints:
that is, it assumes that all relevant data is known to it and included
in a database to be validated. It interprets the meaning of Integrity
Constraints in light of this assumption; if a constraint says a value
`must` be present, the absence of that value is interpreted as a
constraint violation and, hence, as invalid data.

### Open World Assumption, Open World Reasoning

A legal OWL 2 inference may violate or satisfy an Integrity Constraint
in Stardog. In other words, you get to have your cake (OWL as a
constraint language) and eat it, too (OWL as modeling or inference
language). This means that constraints are applied to a Stardog database
`with respect to an OWL 2 profile`.

### Monotonicity

OWL is a monotonic language: that means you can never ``add`` anything to a
Stardog database that causes there to be ``fewer`` legal inferences. Or, put
another way, the only way to decrease the number of legal inferences is
to ``delete`` something.

Monotonicity interacts with ICV in the following ways:

1.  Adding data to or removing it from a Stardog database may make it
    invalid.
2.  Adding schema statements to or removing them from a Stardog database
    may make it invalid.
3.  Adding new constraints to a Stardog database may make it invalid.
4.  Deleting constraints from a Stardog database `cannot make it
    invalid`.
