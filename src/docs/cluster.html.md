---
quote: "For systems, the analogue of a face-lift is to add to the control graph an edge that creates a cycle, not just an additional node."
title: "Stardog Cluster"
layout: default
related: ""
toc: true
---

In this chapter we explain how to configure, use, and administer Stardog Cluster for uninterrupted operations.

## The Big Picture

Let's start with a few big picture points about Stardog Cluster and deployment strategies.

### What is Stardog Cluster?

First, Stardog Cluster is a collection of Stardog Server instances running on one or more virtual or physical machines that, *from the client's perspective*, behave like a single (that is, non-distributed, non-clustered) Stardog. That's important because it's important from the perspective of a client of Stardog's various services that Stardog Cluster act like Stardog (non-cluster); of course Stardog Cluster should have some different operational properties, the main one of which is high availability. But from the client's perspective Cluster should be indistinguishable from non-cluster.

### What about Deployment?

Third, clustered database deployment is notable for a few reasons:

2. it's a complete pain in the ass
3. it's different in every computing environment on earth

We've made Stardog Cluster deployment easier for you, but we haven't solved the
problem of universal devops or deployment of distributed databases. It may be painful to deploy Stardog Cluster, and that will likely depend 
on details of yr computing environment about which we probably know very little.

Three additional points ameliorate this pain:

1. we've built a deployment tool, called [Starman](http://github.com/clarkparsia/starman), that will work for many cases; and we've open sourced it
2. we've fully documented what is required to configure and deploy a Stardog Cluster
3. Stardog Cluster's dependencies are few and ubiquitous:
	- ssh
	- JVM 1.6 or greater

Okay, so a quick deployment overview:

1. if you're deploying to EC2, yr own servers, or to Oracle's VirtualBox, Starman will very likely just work
2. if you're deploying to something else, [read the deployment recipe]() and adapt it to yr infrastructure
	- sharing configurations based on other systems so we can put them in Starman's repo would be cool
	- pull requests to make Starman (which is based on [Pallet](http://palletops.com/)) work with other targets are even cooler

Finally, here's the overview of what you'll have to do to deploy with Starman:

1. configure Stardog Cluster
2. bootstrap and locally install Stardog Cluster images
3. depending on yr deployment target, do some deploy target specific stuff...
4. deploy Stardog Cluster to the chosen deployment target

## Configuring Stardog Cluster

First, make sure that you have the Stardog Cluster software and dependencies:

* stardog-x.x.zip: Stardog >= 2.2.1 
* starman and starman-*-standalone.jar: the Starman distribution
* stardog-license-key.bin: a valid Stardog license

In fact this is pretty easy since we distribute Starman with Stardog starting with 2.2.1; but you may at some point start using a custom Starman separately, etc. so just remember that it is a Stardog Cluster dependency unless yr using some other deployment system.

By default Starman creates a configuration file in `~/.starmanconfig` and all installed Stardog Cluster images will be stored under
`~/.starman`. If you wish to change the location where Starman stores Stardog Cluster images, simply set the environment variable 
`$STARMAN_HOME` to where you want the installations to reside. This will change the location of `~/.starman` to `$STARMAN_HOME/starman`,
and `~/.starmanconfig` to `$STARMAN_HOME/starmanconfig`.

The following properties can be configured in `starmanconfig`, depending on which deploy targets (EC2, VirtualBox, or other servers you choose):

``` bash
# for deploying on some machines you have access to over an IP network...
# the list of IPs for deploying on existing machines
default-nodes = 10.11.12.13:10.11.12.14:10.11.12.15

# for deploying on EC2...
# EC2 credentials
ec2-access-id = myaccessid
ec2-secret-key = secret
# EC2 instance type
ec2-instance-type = m1.medium
# EC2 AMI ID - Ubuntu 14.04 AMIs are supported*
ec2-ami-id = ami-c8cf3ba0
ec2-region-id = us-east-1d

# if you're using VirtualBox...	
# Minimum RAM assigned for VM in VirtualBox deployments
vmfest-node-min-ram = 3500
# Minimum cores assigned for VM in VirtualBox deployments
vmfest-node-min-cores = 2
	
# JVM options for Stardog instances – they will override the default JVM options specified in stardog-admin
stardog-java-args = -Xmx3g -Xms3g -Dapple.awt.UIElement=true -Dfile.encoding=UTF-8
	
# Stardog additional properties – these will be appended to stardog.properties
# in addition to the properties used for Stardog cluster configuration.
# Simply use the same property names that Stardog already uses prefixed with 'stardog-properties-'.
# E.g.:
stardog-properties-stardog.default.cli.server = snarl://localhost:6000
	
# Additional CLI options for ./stardog-admin server start – these will be added at the end of the command.
# Note that Starman already sets values for the options --home, --port, and --bind in order to run Stardog in
# cluster mode
stardog-cli-opts = --disable-security
	
# Additional properties for zookeeper – these will be appended at the end of zookeeper.properties.
# Use the prefix 'zookeeper-properties-'
zookeeper-properties-tickTime=2000
```

As of Stardog 2.2.1, Starman is only tested with Ubuntu 14.04 AMIs. It may or may not work with other AMIs. You can find a comprehensive list of available Ubuntu 14.04 AMIs and the instance types compatible with each of them [here][https://cloud-images.ubuntu.com/locator/ec2/].

## Setting Up Stardog Cluster with Starman

Second, you have to do some general setup for Stardog Cluster.

Now we have to setup Stardog Cluster.

First, bootstrap your Stardog Cluster image with Starman:
``` bash
./starman svm bootstrap --tag <tag_name> \
					--stardog /path/to/stardog-<version>.zip \
					--license /path/to/stardog-license-key.bin
```
where `<tag_name>` is a custom name for the Stardog Cluster image to install, e.g. myImage.

Second, locally install a cluster image:
``` bash
./starman svm install --id <cluster_id> --tag <tag_name>
```
where `<cluster_id>` should be a positive integer larger than 0.

You can list yr bootstrapped and locally installed Stardog Cluster images using:

``` bash
./starman svm list
```

Third, now that Stardog Cluster is bootstrapped and its images are localled prepared, we can deploy them to one of the deployment targets, so now you have to decide what yr deployment target is: EC2, VirtualBox, or other servers. Then follow the instructions in the appropriate subsection below:

### Virtual Machine

Requirement: Oracle VirtualBox v4.2.x if deploying to VirtualBox servers

Before deploying Stardog Cluster image nodes to VirtualBox---we refer to this provider as `vmfest`---make sure to follow these steps.

Open a terminal and start VirtualBox's webservice:

``` bash		
VBoxManage setproperty websrvauthlibrary null # needs to be done 
```
only once

``` bash
vboxwebsrv -t0
```

In a new terminal add the identities stored in your public ssh key:

OS X:
``` bash
ssh-add -K /path/to/your/public/SSH/key
```
	
Linux:
``` bash
ssh-add /path/to/your/public/SSH/key
```
	
Adding your public key to the ssh agent allows interacting with the vitual machine, and also lets you log in to the 
virtual machine using `ssh <ip address>`.

### Amazon EC2

Requirements: An EC2 account on Amazon Web Services for EC2 deployments, along with your key pair and Access ID and Secret Key.

Make sure to have a [key pair][key-pairs] and add it via the ssh agent using:

OS X:
``` bash	
ssh-add -K /path/to/your/pem
```
		
Linux:
``` bash	
ssh-add /path/to/your/pem
```
	
Adding your public key to the ssh agent allows interacting with the remote machine, and also lets you log in to the 
virtual machine using `ssh <ip address>`.

Make sure to have an [*Access Key ID* and a *Secret Access Key*][access-keys] and then add them to your configuration file located in 
`~/.starmanconfig`:

``` bash
ec2-access-id = <your Access Key ID>
ec2-secret-key = <your Access Key ID>
```

(Optional) Specify the instance type. Starman by default creates `m1.medium` EC2 instances, but you can specify in 
.starmanconfig` some other EC2 instance types:

``` bash	
ec2-instance-type = <some instance type>
```
		
Note that the only instance types allowed are the ones in the AWS SDK [`v1.8.2`][aws-sdk]. Compare those values with the most
current EC2 [instance types][instance-types] for more info.

[key-pairs]: http://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ec2-key-pairs.html
[access-keys]: http://docs.aws.amazon.com/AWSSecurityCredentials/1.0/AboutAWSCredentials.html#AccessKeys
[aws-sdk]: https://github.com/aws/aws-sdk-java/blob/1.8.2/src%2Fmain%2Fjava%2Fcom%2Famazonaws%2Fservices%2Fec2%2Fmodel%2FInstanceType.java#L22-L56
[instance-types]: http://aws.amazon.com/ec2/instance-types/

### Other Servers

In order to simplify the process we assume that the remote machines are running Ubuntu, and that the user has [password-less][ssh-auth] SSH
access and is able to execute [password-less][ubuntu-sudoers] sudo in the remote machines.

As of Stardog 2.2.1, the only cluster commands supported for deploying to existing servers are `cluster deploy`, `cluster start` and `cluster stop`.
Before using Starman with existing servers, you will need to edit the Starman configuration file located in `~/.starmanconfig`
and make sure to add the list of default nodes as follows:

``` bash
default-nodes=10.11.12.13:10.11.12.14:10.11.12.15
```

where the property `default-nodes` is a colon-separated list of IP addresses that correspond to the existing servers.

[ssh-auth]: http://www.howtogeek.com/168147/add-public-ssh-key-to-remote-server-in-a-single-command/
[ubuntu-sudoers]: http://askubuntu.com/a/192062


## Deploying Stardog Cluster

When using any of the following commands make sure to replace the `--provider` option argument with any of these: `vmfest` for
VirtualBox, `ec2` for Amazon EC2, or `default` for existing servers.

The last bit of information here is the *cluster size*. As of 2.2.1, Stardog Cluster only supports the cluster topology "one coordinator, many followers", but we need to determine the size of the cluster, which should be a multiple of 3. We pass that to Starman deploy using the `--numvms`<fn>This will be renamed `--clustersize` in a future release.</fn> argument.

First, deploy Stardog Cluster:

``` bash
./starman cluster deploy --id <cluster_id> --numvms <num_nodes> --provider <provider>
```

Starman will create the Cluster, and then perform the required setup on the required nodes. This step will take a 
while depending on the network, since Starman is copying Stardog Cluster images to *n* machines.

Detailed output can be seen in the log file `./logs/pallet.log`.
	
Second, start Stardog Cluster:

``` bash
./starman cluster start --id <cluster_id> --provider <provider>
```

The output of cluster startup is a list of IP addresses; to meld these into a single symbolic name for the database is left as an exercise for the reader but we recommend suitable configuration of DNS or HaProxy or similar. The nodes of the Stardog Cluster, as of Stardog 2.2.1, implement a simple round robin strategy for distributing read operations over the cluster; write operations are directed to the Coordinator exclusively.

Third, for stopping the cluster you can execute:

``` bash
./starman cluster stop --id <cluster_id> --provider <provider>
```
### Adding or removing nodes

To add nodes to an existing cluster:

``` bash
./starman cluster addnodes --id <cluster_id> --numvms <num_vms> --provider <provider>
```

It will add `num_vms` to a cluster. Please note that if a node is added to a cluster, it will only start a Stardog server
in the new nodes; if you want to also replicate the Zookeeper servers, you will have to stop the cluster and start it
again. This limitation is due to the fact that Zookeeper is not capable of hot reconfiguration as of `v3.4.x`.

To remove nodes from an existing cluster there are two options:

``` bash
./starman cluster removenodes --id <cluster_id> --provider <provider> --numvms <num_vms>
```

It will remove `num_vms` from a cluster. Note that this will remove an entire VM from the cluster, which may or not also
remove a Zookeeper server. Zookeeper is able to account for node failures, but this may not be the behavior the user intended.
The other option is to specify a comma-separated list of IP addresses that correspond to the IPs of nodes to be removed:

``` bash
./starman cluster removenodes --id <cluster_id> --provider <provider> --nodes 10.11.12.13,10.11.12.14,10.11.12.15
```

## Interacting with the Cluster via Starman

We can verify that Stardog Cluster was deployed successfully using

``` bash
./starman cluster list --provider
```

You should see a list of the created nodes. Since Starman adds a password-less login with SSH authentication on the remote machines, you can also log in via SSH

``` bash
ssh <ipaddress>
```

### Interacting with the Cluster via Stardog Client

In order to interact with the Stardog Cluster using Stardog CLI tools in the ordinary way---`stardog-admin` and `stardog`---you must install Stardog locally as you usually do by unzipping the contents of `stardog-*.zip`, for example (for `v2.2.1`).

With the provided Stardog binaries in the Stardog Cluster distribution you can query the state of the cluster using

``` bash
stardog-2.2.1/bin/stardog-admin --server snarl://<ipaddress>:5820/ pack info
```

where `ipaddress` is the IP address of any of the nodes in the cluster. This will print the available nodes in the 
cluster, as well as the roles (participant or coordinator). You can also input the proxy IP address and port to get 
the same information.

### Adding/Removing data

To add or remove data, simply use the `stardog data add` or `remove` commands to any node in the cluster. Queries 
can be issued to any node in the cluster using the `stardog query` command. All the `stardog-admin` features are also available in cluster mode, which means you can use any of the commands to create databases, adminster users, and the rest of the functionality available in single server mode.

You can use Starman to copy files remotely for bulk loading files to your cluster:

``` bash
./starman cluster copyfile --id <cluster id> --provider <provider> <origin> <destination>
```

`<origin>` is the path in your local machine and `<destination>` is the path in the remote machines. This command 
will copy the local files to all the servers in the cluster in the specified path.

## Cluster Admin

In order to undeploy a Stardog Pack cluster use

``` bash
./starman cluster undeploy --id <cluster_id> --provider <provider>
```

This will destroy all the virtual or remote machines part of cluster.

If you wish to uninstall a Stardog Cluster image from your local Starman system use:

``` bash
./starman svm uninstall --id <cluster_id>
```
		
If you wish to remove a Stardog Cluster image tag from your local Starman system use:

``` bash
./starman svm remove --tag <version>
```
		
To list bootstrapped and installed Stardog Pack versions:

``` bash
./starman svm list
```

<!--	


## Deploying a Stardog Cluster manually

In addition to Starman, in this release we provide the ability to create a cluster manually using the `stardog-admin`
commands and some additional configuration. Multiple Stardog and Zookeeper servers can be launched within the same
machine or on multiple machines. In order to deploy a cluster in a single machine you must ensure that each Stardog and
Zookeeper server have different home folders.

For the following deployment example, we will assume two servers each with a different `$STARDOG_HOME`.

### Deployment steps

First, ensure that the two nodes have a different `$STARDOG_HOME`, e.g:

``` bash
mkdir ~/node1
mkdir ~/node2
```

Next, place a copy of your stardog license key in both folders, and create a `stardog.properties` file with the 
following information for `node1`:

``` bash
# Flag to enable pack, without this flag set, the rest of the properties have no effect
pack.enabled=true
# The address where Stardog server is listening on this machine
pack.node.address=127.0.0.1:6000
# the connection string for ZooKeeper where cluster state is stored
pack.cluster.address=127.0.0.1:2180,127.0.0.1:2181
# credentials used for securing ZooKeeper state
pack.cluster.username=pack
pack.cluster.password=admin
```

And the following information for `node2`:

``` bash
# Flag to enable pack, without this flag set, the rest of the properties have no effect
pack.enabled=true
# The address where Stardog server is listening on this machine
pack.node.address=127.0.0.1:6001
# the connection string for ZooKeeper where cluster state is stored
pack.cluster.address=127.0.0.1:2180,127.0.0.1:2181
# credentials used for securing ZooKeeper state
pack.cluster.username=pack
pack.cluster.password=admin
```

`pack.node.address` will be the port in which Stardog will be listening to when communicating with other nodes, whereas
`pack.cluster.address` is a Zookeeper connection string where the Stardog cluster stores its cluster state.
`pack.cluster.username` and `pack.cluster.password` are just user and password tokens for node inter-communication and
can be different from actual Stardog users and passwords, however you must make sure that all nodes use the same user 
and password combination.

Next, you will create the Zookeeper configuration for each node. For convenience, Stardog just forwards the start command
to Zookeeper via the Stardog CLI, thus the configuration file for Zookeeper is a standard Zookeeper configuration file.
For this example we will use the following `zookeeper.properties` file in `node1`:

``` bash
tickTime=2000
dataDir=/tmp/zookeeperdata1/
clientPort=2180
initLimit=5
syncLimit=2
server.1=127.0.0.1:2888:3888
server.2=127.0.0.1:6888:7888
```

And the following information for `node2`:

``` bash
tickTime=2000
dataDir=/tmp/zookeeperdata2/
clientPort=2181
initLimit=5
syncLimit=2
server.1=127.0.0.1:2888:3888
server.2=127.0.0.1:6888:7888
```

Note that the `clientPort` specified in `zookeeper.properties` and the ports used in `pack.cluster.address` in
`stardog.properties` are the same. The ports used in lines `server.1` and `server.2` must not be the same if creating
a cluster in a single machine. `dataDir` is a directory where Zookeeper keeps track of the cluster state and where it
dumps log information about the cluster. You will need to create such folders as needed:

``` bash
mkdir /tmp/zookeeperdata1
mkdir /tmp/zookeeperdata2
```

Next, Zookeeper requires a `myid` file in the `dataDir` folder to identify itself, you will create that file as follows
for `node1` and `node2`, respectively:

``` bash
echo 1 > /tmp/zookeeperdata1/myid
echo 2 > /tmp/zookeeperdata2/myid
```

For more information on how to configure Zookeeper please refer to the official [docs][zk-admin].

In the next few steps you will use the Stardog Admin CLI commands to deploy Zookeeper, Stardog and the Proxy.

To start the Zookeeper cluster you will use the `stadog-admin` command in the [distribution](#installing-stardog-cluster-locally).
You will start Zookeeper as follows:

``` bash
./stardog-admin cluster zkstart --home ~/node1
./stardog-admin cluster zkstart --home ~/node2
```

This will use the `zookeeper.properties` config file in `~/node1` and `~/node2`, respectively, and log its output to
`~/node1/zookeeper.log` and `~/node2/zookeeper.log`. For more information you can use:

``` bash
./stardog-admin help pack zkstart
```

Once Zookeeper is started, you will start Stardog in cluster mode you will use the `server start` command with the
following options:

``` bash
./stardog-admin server start --home ~/node1 --port 6000
./stardog-admin server start --home ~/node2 --port 6001
```

Lastly, you will start the proxy server as follows:

``` bash
./stardog-admin pack proxystart --zkconnstr 127.0.0.1:2180,127.0.0.1:2181 --user pack --password admin --port 5820
```

Note that the `zkconnstr` option is the same connection string as `pack.cluster.address` in `stardog.properties`, and 
`user` and `password` are the same as `pack.cluster.username` and `pack.cluster.password`, respectively. For 
more information on the proxy configuration execute:

``` bash
./stardog-admin help cluster proxystart
```

You will now have a cluster running with two nodes in the same machine. Since the proxy was conveniently configured to
use port `5820` you can execute standard Stardog CLI commands in cluster mode such as:

``` bash
./stardog-admin db create -n myDb
./stardog data add myDb /path/to/my/data
./stardog query myDb "select * { ?s ?p ?o } limit 5"
```

To add more Stardog Cluster nodes, simply repeat the steps for Stardog. Zookeeper nodes run independently, so configurations
such as two Zookeeper servers and three Stardog servers are possible – simply point Stardog to the corresponding 
Zookeeper cluster.


[zk-admin]: http://zookeeper.apache.org/doc/r3.3.3/zookeeperAdmin.html#ch_administration

## Using the command line help

In this release we also added a help system to make Starman easier to use. For a comprehensive list of available commands
and options execute:

``` bash
./starman help
```

Similar to Stardog, we also provide a way to get more command-specific help by specifying the command, e.g:

``` bash
./starman help cluster deploy
```

Starman also includes an autocomplete feature like Stardog. Simply follow [Stardog's Autocomplete][sd-cli] steps for the `starman-completion.sh`
script provided in the Starman distribution.

[sd-cli]: http://docs.stardog.com/admin/#sd-Command-Line-Interface
-->

## Troubleshooting

### Zookeeper

By default, Zookeeper uses [majority quorums][zk-quorums] for leader election which means that, at any given time,
Zookeeper requires that there are at least *n/2 + 1* nodes when leader election is happening. In the unfortunate event
that a Stardog Cluster is stuck in this phase, you can use Starman to recover a Zookeeper node using:

``` bash
./starman cluster addnodes --provider <provider> --id <cluster id> --zk-node
```
     
Starman will attempt to guess which of the Zookeeper server(s) was lost and try to bring a Zookeeper server back---one at
a time---with the same hostname.

Starman creates a list of hostnames when nodes are deployed to a cluster and uses that list to communicate between
nodes in the Zookeeper cluster. This way whenever a Zookeeper server is lost, a new one can be brought back without
having to use the same IP address, which may not be possible or expensive for some cloud providers.

[zk-quorums]: http://zookeeper.apache.org/doc/r3.3.5/zookeeperInternals.html#sc_quorum

## Stardog Cluster Guarantees

Stardog Cluster implements an atomic commitment protocol based on [two-phase commit (2PC)](http://en.wikipedia.org/wiki/Two-phase_commit_protocol) over a shared replicated memory that's provided by [Apache ZooKeeper](http://zookeeper.apache.org/). A cluster is composed of a set of Stardog servers running together. One of the servers is known as the Coordinator and the rest as Participants. In case the Coordinator fails at any point, a new Coordinator will be elected out of the remaining available participants. Stardog Cluster supports both `read` (e.g., querying) and `write` (e.g., adding data) requests. Read requests are load-balanced over the available Participants, whereas write requests are transparently forwarded to and handled by the Coordinator. In some future release we may change the protocol implemented by the Cluster and thus change some of the allowable topologies, including multiple-writers and multiple-readers.

###Consistency Guarantees

When a client commits a transaction (containing a list of `write` requests), it will be acknowledged by the Coordinator only after every non-failing Participant has committed the transaction. If a Participant fails during the process of committing a transaction, it will be expelled from the cluster by the Coordinator and put in a temporary `failed` state. If the Coordinator fails during the process, the transaction will be aborted, and a new Coordinator will be elected automatically. Since `failed` nodes are not used for any subsequent `read` or `write` requests, **if a commit is acknowledged by the Coordinator, then Stardog Cluster guarantees that the data has been accordingly modified at *every* available node in the cluster**.

While this approach to consistency is less performant, with respect to write operations, than eventual consistency used by other distributed databases, typically those databases offer a much less expressive data model than Stardog, which makes an eventually consistency model more appropriate for those systems. But since Stardog's data model is not only richly expressive but rests in part on provably correct semantics, we think that a strong consistency model is worth the cost.<fn>Based on customer feedback we may relax these consistency guarantees in some future release. Please get in touch if you think an eventually consistent approach is more appropriate for yr use of Stardog.</fn>

