---
title: Web Console
shortTitle: Console
layout: default
toc: true
quote: Interfaces keep things tidy, but don't accelerate growth: Functions do.
---

## Introduction 

The Stardog Web Console is a responsive web app for the Stardog Server and for every Stardog database that makes administration and interaction with data quick and easy; you can access it at `http://foo:5820` where `foo` is the name of the machine where Stardog is running.

## A Screenshot Tour...

Seriously, this is a lot more fun if you just [download](http://stardog.com/) the damn thing and hit it with a browser!

### Login

To login into the Stardog Web Console, provide your username and password. If you're an administrative user, you'll have all the operations available, otherwise the functionality will be limited by your permissions.

![Stardog Web Console - Login](/img/console/screen_login.png)

### Homepage

![Stardog Web Console - Homepage](/img/console/screen_home.png)

### Databases

![Stardog Web Console - Databases](/img/console/screen_dbs.png)

#### View a database settings

![Stardog Web Console - DB View](/img/console/screen_db_view.png)

#### Database Status

You can set the database online/offline with the switch included in the top right of the action bar. Setting the switch to `on` will set the database `online`, switching it `off` will set the database `offline`.

__NOTE__: Setting a database offline will result in downtime on all the services provided by the database, e.g. querying, searching, modifying, etc.

### DB Actions

Within the database view, a bar with actions available on the database is included. Depending on the database status, the actions available are:

Status: __Online__

- Query - Takes you to the Query Panel of the database, letting you query the DB with SPARQL queries
- Browse - Takes you to the Schema Browser of the database

Status: __Offline__

- Edit - Will render the database view in edit mode, letting you modify the database settings
- Migrate - Migrates the existing content of a legacy database to new format
- Optimize - Optimize an existing database

#### Drop a database

To drop a database click on the `Drop` button, a confirmation will appear to verify the removal. 

![Stardog Web Console - Drop a Database](/img/console/screen_delete_confirm.png)

#### Creating a new database

To create a new database click the `New DB` button in the database listing screen. A wizard will be shown to select and customize the settings of the DB.
All values are optional except the database name, and all of them are pre-filled with the default values. You can finish the wizard to create a DB since the first step, just typing the database name and finish.

![Stardog Web Console - New DB](/img/console/screen_new_db.png)

You can go through the wizard with the `Next` and `Back` buttons, setting up every section of the database options. Every option contains help as a tooltip that is shown having the cursor over the option label.

Once you're done setting the database options, at any step of the wizard, just click finish to create the database. You'll be redirected to the database view once it has been created in Stardog.

#### Browsing the database as Linked Data

You can browse the database as Linked Data graph, too.

![Stardog Web Console - Browse](/img/console/screen_instance_browsing.png)

#### Browsing the Schema

You can browse the schema (the class and property trees).

![Stardog Web Console - Schema Browsing](/img/console/screen_schema_browsing.png)

#### Querying a database

Stardog Web Console includes a SPARQL query editor for executing queries against the database; the editor includes some canned exploration queries, too.

![Stardog Web Console - SPARQL Query](/img/console/screen_sparql_query.png)

![Stardog Web Console - Exploration Queries](/img/console/screen_exploration_queries.png)

### Searching a database

You can search the contents of the database using Stardog's search capability.

![Stardog Web Console - Searching](/img/console/screen_semantic_search.png)

#### Editing data in a database

You can edit any statements in the database (with the requisite permissions).

![Stardog Web Console - Editing](/img/console/screen_editing.png)

#### Listing running queries

To list the current running queries on the system click on `Query Management` in the top navbar, you'll be redirected to an accordion style listing of running queries. This listing is refreshed constantly to reflect the running queries in real time, if you have a query that has been running for a while it will be shown here. 

![Stardog Web Console - Query List](/img/console/screen_query_list.png)

#### View a running query

Clicking on the query entry in the listing will show the running query related information, such as the user who posted the query, the database it is running on, the reasoning level used for the query and the related timestamps. The query will be shown at the bottom.

![Stardog Web Console - Query Info](/img/console/screen_query_info.png)

To kill a running query, click on the query element in the listing to expand it and show its related information, a `Kill` button will be show, you can click on that button to terminate the query.

### Users, Roles, Permissions

#### Listing users

On the navbar click on `Security > Users`, a listing of the existent users in the system will be shown.

![Stardog Web Admin Console - Users](/img/console/screen_users.png)

#### View user permissions & roles

The user's view lets you administer a user's permissions and the roles it has been assigned to. To add permissions to a new resource for the user, click on the `Add Permission` button and provide the information for the resource, once it has been added to the list, click on the specific allowed actions. To add permissions to a resource already in the permissions table, just click on the permission actions to add/remove.

To assign the user to a role, just type the role name in the `Add role` input and click on `Add`. The role names will be autocompleted to the ones already existing in the system.

![Stardog Web Console - User View](/img/console/screen_user_view.png)

#### Create a new user

To create a new user click on the `New User` button and provide the required information on the new User popup modal. You'll be redirected to the user's view once it has been created in Stardog.

![Stardog Web Admin Console - New User](/img/console/screen_new_user.png)

#### Listing roles

On the navbar click on `Security > Roles`, a listing of the existent roles in the system will be shown.

![Stardog Web Console - Roles](/img/console/screen_roles.png)

#### View role permissions & users assigned to it

The roles's view lets you administer a role's permissions and the users it has been assigned to. To add permissions to a new resource for the role, click on the `Add Permission` button and provide the information for the resource, once it has been added to the list, click on the specific allowed actions. To add permissions to a resource already in the permissions table, just click on the permission actions to add/remove.

To assign a user to the role, just type the username in the `Add user` input and click on `Add`. The usernames will be autocompleted to the ones already existing in the system.

![Stardog Web Console - Role View](/img/console/screen_role_view.png)