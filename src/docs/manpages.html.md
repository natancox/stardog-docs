---
quote: "In programming, as in everything else, to be in error is to be reborn."
title: "Man Pages"
layout: default
related: ""
toc: true
---

Stardog command-line interface is comprehensively documented in `man` pages that ship with Stardog. Those `man` pages are reproduced here in HTML as a convenience to the reader.  To install the man pages locally in your environment:

    $ cp docs/man/Man1/* /usr/local/share/man1
    $ cp docs/man/Man8/* /usr/local/share/man8
    $ mandb
    $ man stardog-admin-server-start


## `stardog` CLI

1. [`data add`](/man/data-add.html), [`data export`](/man/data-export.html), [`data obfuscate`](/man/data-obfuscate.html), [`data remove`](/man/data-remove.html), [`data size`](/man/data-size.html)
2. [`icv convert`](/man/icv-convert.html), [`icv explain`](/man/icv-explain.html), [`icv export`](/man/icv-export.html), [`icv validate`](/man/icv-validate.html)
3. [`namespace add`](/man/namespace-add.html), [`namespace list`](/man/namespace-list.html), [`namespace remove`](/man/namespace-remove.html)
4. [`query execute`](/man/query-execute.html), [`query explain`](/man/query-explain.html), [`query obfuscate`](/man/query-obfuscate.html), [`query search`](/man/query-search.html)
5. [`reasoning consistency`](/man/reasoning-consistency.html), [`reasoning explain`](/man/reasoning-explain.html)
6. [`vcs commit`](/man/vcs-commit.html), [`vcs diff`](/man/vcs-diff.html), [`vcs list`](/man/vcs-list.html), [`vcs query`](/man/vcs-query.html), [`vcs revert`](/man/vcs-revert.html), [`vcs tag`](/man/vcs-tag.html).

## `stardog-admin` CLI

1. [`db backup`](/man/db-backup.html), [`db copy`](/man/db-copy.html), [`db create`](/man/db-create.html), [`db drop`](/man/db-drop.html), [`db list`](/man/db-list.html), [`db migrate`](/man/db-migrate.html), [`db offline`](/man/db-offline.html), [`db online`](/man/db-online.html), [`db optimize`](/man/db-optimize.html), [`db restore`](/man/db-restore.html), [`db status`](/man/db-status.html)
2. [`icv add`](/man/icv-add.html), [`icv drop`](/man/icv-drop.html),  [`icv remove`](/man/icv-remove.html)
2. [`metadata get`](/man/metadata-get.html), [`metadata set`](/man/metadata-set.html)
3. [`role add`](/man/role-add.html), [`role grant`](/man/role-grant.html), [`role list`](/man/role-list.html), [`role permission`](/man/role-permission.html), [`role remove`](/man/role-remove.html), [`role revoke`](/man/role-revoke.html)
4. [`server start`](/man/server-start.html), [`server status`](/man/server-status.html), [`server stop`](/man/server-stop.html)
4. [`query kill`](/man/query-kill.html), [`query list`](/man/query-list.html), [`query status`](/man/query-status.html)
5. [`user add`](/man/user-add.html), [`user addrole`](/man/user-addrole.html), [`user disable`](/man/user-disable.html), [`user enable`](/man/user-enable.html), [`user grant`](/man/user-grant.html), [`user list`](/man/user-list.html), [`user passwd`](/man/user-passwd.html), [`user permission`](/man/user-permission.html), [`user remove`](/man/user-remove.html), [`user removerole`](/man/user-removerole.html), [`user revoke`](/man/user-revoke.html)
