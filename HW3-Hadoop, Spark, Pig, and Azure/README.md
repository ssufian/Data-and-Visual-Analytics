# Hadoop, Spark, Pig on Azure and AWS

## Instructions for setting up development environment for Q1 & Q2 (Hadoop and Spark):

#### Installing CDH and steps to run: 
1. Download a preconfigured virtual machine (VM) image from [Cloudera (CDH)](https://www.cloudera.com/downloads/quickstart_vms/5-13.html.html). The virtual image comes with preinstalled Hadoop and Spark. 

2. You can use any VM platform, but [VirtualBox 5.2] (https://www.virtualbox.org/) is recommended.

3. Setup and configure the VM.

4. Once you launch the VM, you will have GUI environment with cloudera user, which has administrator (sudo) privilege. The account details are:  
    > username: cloudera  
    > password: cloudera
5. Load dataset into the HDFS (Hadoop Distributed File System).  

    ```
    sudo su hdfs  
    hadoop fs -mkdir /user/cse6242/  
    hadoop fs -chown cloudera /user/cse6242/  
    exit  
    su cloudera  
    hadoop fs -put path/to/graph1.tsv /user/cse6242/graph1.tsv  
    hadoop fs -put path/to/graph2.tsv /user/cse6242/graph2.tsv
    ```  

6. Now both files are on HDFS, to check try:  

    ```
    hadoop fs -ls /user/cse6242
    ```
7. In the directories of both Q1 and Q2:  
    * Generate a single JAR file in the target directory where pom.xml exists and run:
        ```
        mvn package
        ```  
    * Run the script files that run the code over graph1.tsv and graph2.tsv:
        ```
        ./run1.sh  
        ./run2.sh
        ```

#### Tips to speed up your CDH VM
1. Try allocating 50% or lessor memory for VM
2. Switch on hardware acceleration if possible
3. [Remove services](https://www.cloudera.com/documentation/enterprise/5-9-x/topics/cdh_ig_cdh_comp_uninstall.html) that are not used (Mahout, Oozie, Hive, Sqoop, etc.) 


## Q1: Analyzing a Graph with Hadoop/Java

#### Overview:
Analyze large dataset (graph1.tsv and graph2.tsv) which contains an entire email communication network from a popular social network site. Network organized as a directed graph and each node represents an email address and the edge between two nodes has a weight stating how many times A wrote to B. 

Write a MapReduce program in Java to report the smallest weight among all the weighted inbound edges for each node in the graph.

**Output:** q1output1.tsv and q1output2.tsv


## Q2: Analyzing a Large Graph with Spark/Scala

#### Overview:  
Calculate the gross accumulated node weights for each node in graph1.tsv and graph2.tsv from edge weights using Spark and Scala. Assume the graph to be a representation of a network flow where each edge represents the number of items flowing from source to target. The gross accumulated node weight for a node is now defined as the number of items produced/consumed by the node. 

Perform this task using the DataFrame API in Spark. 

**Output:** q2output1.tsv and q2output2.tsv


## Q3: Analyzing Large Amount of Data with Pig on AWS

#### Overview:  
Use Apache Pig for processing two subsets of the Google books n-grams dataset on Amazon Web Services (AWS). The smaller subset is ~1GB and the larger one ~150GB. An 'n-gram' is a phrase with n words.

Output: The 10 bigrams having the highest average number of appearances per book along with their corresponding averages, in tab-separated format, sorted in descending order. Only consider entries with at least 200 occurences and at least 10 books. If multiple bigrams have the same average, order them alphabetically. 

#### Steps:
1. [Setup AWS](http://poloclub.gatech.edu/cse6242/2018spring/cse6242oan/hw3/AWSSetupGuidelines.pdf)
2. Upload datasets and PIG script into S3 and create cluster with EMR on AWS.
    * **Upload a PIG script** with all the commands which computes and direct the output from the command line into a separate file. 
3. Save output as pig-output.txt


## Q4: Analyzing a Large Graph using Hadoop on Microsoft Azure

#### Overview:  
Use datasets small.tsv (~75MB) and large.tsv (~3GB) where each line represents a single edge consisting of two columns: (Source, Target). Node IDs are positive integers and the rows are already sorted by Source. 

#### Steps:  
1. Write a MapReduce program to compute the distribution of a graph's node degree differences, where:
    * Column 1 ("diff"): is the difference between a node's out-degree and in-degree
    * Column 2 ("count"): is the number of nodes that have the value of differences
2. Generate a single JAR file in the target directory. In the directory which contains pom.xml run the command:
    ```
    mvn clean package
    ```
3. Setup Azure Account and [Create clusters](https://docs.microsoft.com/en-us/azure/hdinsight/hdinsight-hadoop-create-linux-clusters-portal) in HDInsight using the Azure portal.
4. [Install](https://docs.microsoft.com/en-us/cli/azure/install-azure-cli?view=azure-cli-latest) Azure CLI.
5. Upload small.tsv and large.tsv to your blob storage container.
6. Upload Jar file to HDFS-compatible Azure Blob storage through SSH.
7. SSH into the cluster and run the code on the data files. 
8. Merge multiple output files and download small/large.out file to local machine.


## Q5: Regression: Automobile price prediction, using Azure ML studio

#### Overview:
Go through the [automobile price prediction](https://docs.microsoft.com/en-us/azure/machine-learning/studio/create-experiment) tutorial

#### Steps:
1. Repeat experiments in the tutorial and report the values of the metrics
2. Repeat experiment changing 'Fraction of rows in the first output" value in the split module to 0.9 (from 0.75)
3. Change split value back to 0.75 and experiment with other features/Regression Models
