---
quote: "For systems, the analogue of a face-lift is to add to the control graph an edge that creates a cycle, not just an additional node."
title: "Cluster"
layout: default
related: ""
toc: true
---

In this chapter we explain how to configure, use, and administer Stardog Cluster for uninterrupted operations.

## An Introduction to High Availability

## Configuring Stardog HA

### Starman Cluster Deployment

## Administering Stardog HA

## Using Stardog HA

## Stardog HA Guarantees

## Deploying Stardog Cluster

This is a step-by-step guide to deploy Stardog Pack onto a collection of virtual machines using Starman. This procedure 
has been tested on Linux and OS X.

## Requirements

* Oracle VirtualBox v4.2.x if deploying to VirtualBox servers
* An EC2 account on Amazon Web Services for EC2 deployments, along with your key pair and Access ID and Secret Key
* stardog-x.x.zip - Standard Stardog distribution
* stardog-pack-x.x.zip – Stardog pack extension
* starman and starman-*-standalone.jar – Starman distribution
* stardog-license-key.bin – A valid Stardog license

## Setup

1. Bootstrap your Stardog Pack image with Starman:

		./starman svm bootstrap --version <node_version> \
								 --stardog /path/to/stardog-<version>.zip \
								 --pack /path/to/stardog-pack-<version>.zip \
								 --license /path/to/stardog-license-key.bin

	where `<node_version>` is the version of Stardog Node Pack to install, e.g. 0.3.

1. Install a node image for the cluster:

		./starman svm install --id <cluster_id> --version <node_version>

	where `<cluster_id>` should be a positive integer larger than 0.

You can get a list of your bootstrapped and installed Stardog Pack Nodes using:

		./starman svm list


## Deployment

Starman is capable of deploying Stardog Pack nodes automatically with different providers: VirtualBox, Amazon EC2,
and existing servers. In the following section we will explain the requirements before deploying with each of these 
providers and then we will explain the general procedure for deploying nodes.

### VirtualBox (vmfest)

Before deploying Stardog Pack nodes to VirtualBox – we will refer to this provider as `vmfest` – make sure to follow these steps.

1. Open a terminal and start VirtualBox's webservice:
		
		VBoxManage setproperty websrvauthlibrary null # needs to be done only once
		vboxwebsrv -t0

1. In a new terminal add the identities stored in your public ssh key:

	OS X:

		ssh-add -K /path/to/your/public/SSH/key
		
	Linux:

		ssh-add /path/to/your/public/SSH/key
	
	Adding your public key to the ssh agent allows interacting with the vitual machine, and also lets you log in to the 
	virtual machine using `ssh <ip address>`.

### Amazon EC2

Stardog Pack nodes are deployed to Amazon EC2 using an `Ubuntu 14.10` AMI in the Northern Virginia region. Before you continue,
to deploy Stardog Pack nodes on EC2, make sure to follow these steps.

1. Make sure to have a [key pair][1] and add it via the ssh agent using:

	OS X:
	
		ssh-add -K /path/to/your/pem
		
	Linux:
	
		ssh-add /path/to/your/pem
	
	Adding your public key to the ssh agent allows interacting with the remote machine, and also lets you log in to the 
	virtual machine using `ssh <ip address>`.

1. Make sure to have an [*Access Key ID* and a *Secret Access Key*][2] and then add them to your configuration file located in 
	`~/.starmanconfig`:

		ec2-access-id = <your Access Key ID>
		ec2-secret-key = <your Access Key ID>

1. (Optional) Specify the instance type. Starman by default creates `m1.medium` EC2 instances, but you can specify in 
	`.starmanconfig` which instance type you want to use:
	
		ec2-instance-type = <some instance type>
		
	Note that the only instance types allowed are the ones in the AWS SDK [`v1.612`][3]. Compare those values with the most
	current EC2 [instance types][4] for more info.


[1]: http://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ec2-key-pairs.html
[2]: http://docs.aws.amazon.com/AWSSecurityCredentials/1.0/AboutAWSCredentials.html#AccessKeys
[3]: https://github.com/aws/aws-sdk-java/blob/1.6.12/src/main/java/com/amazonaws/services/ec2/model/InstanceType.java#L22-L49
[4]: http://aws.amazon.com/ec2/instance-types/


### Deploying to an existing server

This functionality is still in its early stages. In order to simplify the process we assume that the remote machines
are running on ubuntu, and that the user has [password-less][5] SSH access and is able to execute [password-less][6] 
sudo in the remote machines.

Currently the only cluster commands supported for deploying on existing servers are `cluster deploy`, `cluster start` and `cluster stop`.
Before using starman with existing servers, you will need to edit the starman configuration file located in `~/.starmanconfig`
and make sure to add the list of default nodes as follows:

	default-nodes=10.11.12.13:10.11.12.14:10.11.12.15

where the property `default-nodes` is a colon-separated list of IP addresses that correspond to the existing servers.

[5]: http://www.howtogeek.com/168147/add-public-ssh-key-to-remote-server-in-a-single-command/
[6]: http://askubuntu.com/a/192062

### Deploying Stardog Pack nodes

When using any of the following commands make sure to replace the `--provider` option argument with any of these: `vmfest` for
VirtualBox, `ec2` for Amazon EC2, or `default` for existing servers.

`TODO`: allow specifying the provider in `.starmanconfig` to avoid including it in every command

1. Deploy Stardog Pack onto a collection of *N* virtual machines:

		./starman cluster deploy --id <cluster_id> --numvms <num_nodes> --provider <provider>
		
	Starman will create the specified instances, and then perform the required setup on those instances. This step will take a 
	while depending on the network.
	These steps will take several minutes, during which time there will be limited console output. More detailed output 
	can be seen in the log file `./logs/pallet.log`.
	
	After the deployment is done and the cluster is started, you can interact with the Stardog cluster using the Stardog 
	distribution contained in `stardog-pack-node.zip`. For example, you can retrieve the list of databases using:

		./stardog-admin --server snarl://<proxy ip address>:5820/ db list

2. Start the newly created cluster:

		./starman cluster start --id <cluster_id> --provider <provider>

	This phase will also print on which node the proxy was started. The proxy is in charge of redirecting requests to the
	cluster using a Round-Robin strategy. This way you only need to worry about the proxy's IP address when using the 
	Stardog CLI. Also note that the proxy will be running on port `5820`, while the stardog servers will run on port `6000`.

3. For stopping the cluster you can execute:

		./starman cluster stop --id <cluster_id> --provider <provider>


### Adding or removing nodes

1. To add nodes to an existing cluster use:

		./starman cluster addnodes --id <cluster_id> --numvms <num_vms> --provider <provider>

	It will add `num_vms` to a cluster. Please note that if a node is added to a cluster, it will only start a Stardog server
	in the new nodes; if you want to also replicate the Zookeeper servers, you will have to stop the cluster and start it
	again. This limitation is due to the fact that Zookeeper is not capable of hot reconfiguration – as of `v3.4.x`.

2. To remove nodes from an existing cluster use:

		./starman cluster removenodes --id <cluster_id> --numvms <num_vms> --provider <provider>

	It will remove `num_vms` from a cluster. Note that this will remove an entire VM from the cluster, which may or not also
	remove a Zookeeper server. Zookeeper is able to account for node failures, but this may not be the behavior the user intended. 

## Interacting with your cluster

We can verify that Stardog Pack was deployed successfully using

	./starman cluster list --provider

You should see a list of the created virtual machines.

Since Starman adds a password-less login with SSH authentication on the remote machines, you can also log in via SSH

	ssh <ipaddress>

With the provided Stardog binaries in the Stardog pack node distribution you can query the state of the cluster using

	stardog-2.2/bin/stardog-admin --server snarl://<ipaddress>:6000/ pack info

where `ipaddress` is the IP address of any of the nodes in the cluster. This will print the available nodes in the 
cluster, as well as the roles – participant or coordinator. You can also input the proxy IP address and port to get 
the same information.

### Adding/Removing data

To add or remove data, simply use the `stardog data add` or `remove` commands pointing to the coordinator. Queries 
can be issued to any of the nodes in the cluster using the `stardog query` command.

All the `stardog-admin` features are also available in cluster mode, which means you can use any of the commands to create databases, administrate users, and the rest of the functionality available in single server mode.

Additionally, you can use Starman to copy a file remotely for bulk loading files to your cluster. Simply use:

	./starman cluster copyfile --id <cluster id> --provider <provider> --from <local path> --to <remote path>

This command will copy the local file to all the servers in the cluster in the specified path.

## Cluster Admin

* Undeploy. In order to undeploy a Stardog Pack cluster use

		./starman cluster undeploy --id <cluster_id> --provider <provider>

	This will destroy all the virtual or remote machines part of cluster.

* Uninstalling a Stardog Pack. If you wish to uninstall a Stardog Pack from your local manager use:

		./starman svm uninstall --id <cluster_id>
		
* Removing a Stardog Pack version. If you wish to remove a Stardog Pack version from your local manager use:

		./starman svm remove --version <version>
		
* Listing bootstrapped and installed Stardog Pack versions. Simply execute:

		./starman svm list
		
### Starman configuration

By default Starman creates a configuration file in `~/.starmanconfig` and all installed Stardog configurations will be stored under
`~/.starman`. If you wish to change the location where Starman stores Stardog configurations, simply set the environment variable 
`$STARMAN_HOME` to wherever you want the installations to reside. This will change the location of `~/.starman` to `$STARMAN_HOME/starman`,
and `~/.starmanconfig` to `$STARMAN_HOME/starmanconfig` - note that the new directoy and configuration file are *not* hidden.

The following properties can be configured in `starmanconfig`:

	# the list of nodes for deploying on existing nodes
	default-nodes = 10.11.12.13:10.11.12.14:10.11.12.15
	
	# EC2 credentials
	ec2-access-id = myaccessid
	ec2-secret-key = secret
	# EC2 instance type
	ec2-instance-type = m1.medium
	# EC2 AMI ID - Ubuntu 14.04 AMIs are supported*
	ec2-ami-id = ami-c8cf3ba0
    ec2-region-id = us-east-1d
	
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
	
	# Minimum RAM assigned for VM in VirtualBox deployments
	vmfest-node-min-ram = 3500
	# Minimum cores assigned for VM in VirtualBox deployments
	vmfest-node-min-cores = 2
	
\* Note: we support only Ubuntu 14.04 AMIs, you can find a comprehensive list of available Ubuntu 14.04 AMIs and
the instance types compatible with each of them [here][7].

[7]: https://cloud-images.ubuntu.com/locator/ec2/

## Deploying a Stardog cluster manually

In addition to Starman, in this release we provide the ability to create a cluster manually using the `stardog-admin`
commands and some additional configuration. Multiple Stardog and Zookeeper servers can be launched within the same
machine or on multiple machines. In order to deploy a cluster in a single machine you must ensure that each Stardog and
Zookeeper server have different home folders.

For the following deployment example, we will assume two servers each with a different `$STARDOG_HOME`.

### Deployment steps

First, ensure that the two nodes have a different `$STARDOG_HOME`, e.g:

		mkdir ~/node1
		mkdir ~/node2

Next, place a copy of your stardog license key in both folders, and create a `stardog.properties` file with the 
following information for `node1`:

		# Flag to enable pack, without this flag set, the rest of the properties have no effect
		pack.enabled=true
		# The address where Stardog server is listening on this machine
		pack.node.address=127.0.0.1:6000
		# the connection string for ZooKeeper where cluster state is stored
		pack.cluster.address=127.0.0.1:2180,127.0.0.1:2181
		# credentials used for securing ZooKeeper state
		pack.cluster.username=pack
		pack.cluster.password=admin

And the following information for `node2`:

		# Flag to enable pack, without this flag set, the rest of the properties have no effect
		pack.enabled=true
		# The address where Stardog server is listening on this machine
		pack.node.address=127.0.0.1:6001
		# the connection string for ZooKeeper where cluster state is stored
		pack.cluster.address=127.0.0.1:2180,127.0.0.1:2181
		# credentials used for securing ZooKeeper state
		pack.cluster.username=pack
		pack.cluster.password=admin

`pack.node.address` will be the port in which Stardog will be listening to when communicating with other nodes, whereas
`pack.cluster.address` is a Zookeeper connection string where the Stardog cluster stores its cluster state.
`pack.cluster.username` and `pack.cluster.password` are just user and password tokens for node inter-communication and
can be different from actual Stardog users and passwords, however you must make sure that all nodes use the same user 
and password combination.

Next, you will create the Zookeeper configuration for each node. For convenience, Stardog just forwards the start command
to Zookeeper via the Stardog CLI, thus the configuration file for Zookeeper is a standard Zookeeper configuration file.
For this example we will use the following `zookeeper.properties` file in `node1`:

		tickTime=2000
		dataDir=/tmp/zookeeperdata1/
		clientPort=2180
		initLimit=5
		syncLimit=2
		server.1=127.0.0.1:2888:3888
		server.2=127.0.0.1:6888:7888

And the following information for `node2`:

		tickTime=2000
		dataDir=/tmp/zookeeperdata2/
		clientPort=2181
		initLimit=5
		syncLimit=2
		server.1=127.0.0.1:2888:3888
		server.2=127.0.0.1:6888:7888

Note that the `clientPort` specified in `zookeeper.properties` and the ports used in `pack.cluster.address` in
`stardog.properties` are the same. The ports used in lines `server.1` and `server.2` must not be the same if creating
a cluster in a single machine. `dataDir` is a directory where Zookeeper keeps track of the cluster state and where it
dumps log information about the cluster. You will need to create such folders as needed:

		mkdir /tmp/zookeeperdata1
		mkdir /tmp/zookeeperdata2

Next, Zookeeper requires a `myid` file in the `dataDir` folder to identify itself, you will create that file as follows
for `node1` and `node2`, respectively:

		echo 1 > /tmp/zookeeperdata1/myid
		echo 2 > /tmp/zookeeperdata2/myid

For more information on how to configure Zookeeper please refer to the official [docs][8].

In the next few steps you will use the Stardog Admin CLI commands to deploy Zookeeper, Stardog and the Proxy.

To start the Zookeeper cluster you will use the `stadog-admin` command in the 2.2 distribution (you will have to unzip
the `stardog-node-pack.zip` file). You will start Zookeeper as follows:

		./stardog-admin pack zkstart --home ~/node1
		./stardog-admin pack zkstart --home ~/node2

This will use the `zookeeper.properties` config file in `~/node1` and `~/node2`, respectively, and log its output to
`~/node1/zookeeper.log` and `~/node2/zookeeper.log`. For more information you can use:

		./stardog-admin help pack zkstart

Once Zookeeper is started, you will start Stardog in cluster mode you will use the `server start` command with the
following options:

		./stardog-admin server start --home ~/node1 --port 6000
		./stardog-admin server start --home ~/node2 --port 6001

Lastly, you will start the proxy server as follows:

		./stardog-admin pack proxystart --zkconnstr 127.0.0.1:2180,127.0.0.1:2181 --user pack --password admin --port 5820

Node that the `zkconnstr` option is the same connection string as `pack.cluster.address` in `stardog.properties`, and 
`user` and `password` are the same as `pack.cluster.username` and `pack.cluster.password`, respectively. For 
more information on the proxy configuration execute:

		./stardog-admin help pack proxystart

You will now have a cluster running with two nodes in the same machine. Since the proxy was conveniently configured to
use port `5820` you can execute standard Stardog CLI commands in cluster mode such as:

		./stardog-admin db create -n myDb
		./stardog data add myDb /path/to/my/data
		./stardog query myDb "select * { ?s ?p ?o } limit 5"

To add more Stardog nodes, simply repeat the steps for Stardog. Zookeeper nodes run independently, so configurations
such as two Zookeeper servers and three Stardog servers are possible – simply point Stardog to the corresponding 
Zookeeper cluster.


[8]: http://zookeeper.apache.org/doc/r3.3.3/zookeeperAdmin.html#ch_administration

## Using the command line help

In this release we also added a help system to make Starman easier to use. For a comprehensive list of available commands
and options execute:

	./starman help

Similar to Stardog, we also provide a way to get more command-specific help by specifying the command, e.g:

	./starman help cluster deploy

Starman also includes an autocomplete feature like Stardog. Simply follow [Stardog's Autocomplete][9] steps for the `starman-completion.sh`
script provided in the Starman distribution.

[9]: http://docs.stardog.com/admin/#sd-Command-Line-Interface

