# Scalable PageRank via Virtual Memory (MMap), Random Forest in Python, and Weka

## Q1: Scalable single-PC PageRank on 70M edge graph

#### Overview:
Use your computer's virtual memory to implement the PageRank algorithm that will scale to graph datasets with as many as billions of edges using a single computer. The idea is to place the dataset in the computer's (unlimited) virtual memory, as it's often too big to fit in the RAM. When running algorithms on the dataset, the operating system will automatically decide when to load the necessary data into RAM. 

The approach to putting data into your machine's virtual memory is called "memory mapping" which allows the dataset to be treated as if it's an in-memory dataset. Memory-mapping a file does NOT cause the whole file to be read into memory. Instead, data is loaded and kept in memory only when needed. 

Python modules mmap and struct are used to map a large graph dataset into the computer's virtual memory. 

**Goal:** Implement the PageRank algorithm, using the power iteration method, and run it on the LiveJournal dataset. 

#### Steps:
1. Install [Homebrew](https://brew.sh/)
2. Install PyPy, a Just-In-Time compilation runtime for python, which supports fast packing and unpacking. In terminal run:
    ```
    brew install pypy
    ```
3. Download the [LiveJournal graph dataset] (https://snap.stanford.edu/data/soc-LiveJournal1.html) (an edge list file)
4. Convert the graph's edge list to binary files. While in the Q1 folder, in terminal run:
    ```
    python q1_utils.py convert <path-to-edgelist.txt>
    ```
5. This generates 3 output files:  
    1. path-to-edgelist.bin: 
        * binary file containing edges (source, target) in little-endian "int" C type  
    2. path-to-edgelist.idx: 
        * binary file containing (node, degree) in little-endian "long long" C type
    3. path-to-edgelist.json: 
        * metadata about the conversion process (required to run pagerank)
6. Implement and run the PageRank algorithm on LiveJournal graph's binary files. Run the following code to execute PageRank implementation:
    ```
    pypy q1_utils.py pagerank <path to JSON file for LiveJournal> 
    ```
7. Output is the 10 nodes with the highest PageRank scores with filename: pagerank_nodes_iterations.txt
8. Experiment with different number of iterations:
    ```
    pypy q1_utils.py pagerank <path to JSON file for LiveJournal> --iterations <num>
    ```
9. The nodes' ordering starts to stabilize with more iterations.  

## Q2: Random Forest Classifier in Python (2.7)

#### Overview:  
Implement a random forest classifier in Python. The performance of the classifier will be evaluated via the out-of-bag (OOB) error estimate, using the provided dataset. 

**Dataset:**  
[UCI Credit Approval Dataset](https://archive.ics.uci.edu/ml/datasets/Credit+Approval) where each record is a credit card application. All attribute names and values have been changed to meaningless to maintain confidentiality. The dataset has been cleaned to remove missing attributes. Each line describes an instance using 16 columns: first 15 columns represent the attributes of the application, and the last column is the label for credit card approval (0 "denied" and 1 "approved"). Dataset is listed in the folder as "hw4-data.csv"

Each tree in the forest is constructed using a different bootstrap random sample with replacement from the original data. Statistically, about one-third of the cases are left out of the bootstrap sample and not used in the construction of the kth tree. Each record left out in the construction of the kth tree can be assigned a class, essentially used as a "test set". The majority vote for that record will be its predicted class. 

OOB error estimate - the proportion of times that a predicted class is not equal to the true class of a record averaged over all records will be used for measurement.

Information gain is used to perform splitting in the decision tree. 

**Files:**  

1. util.py:
    * implement the functions to compute entropy, information gain, and perform splitting.  
2. decision_tree.py:
	* implement the learn() method to build your decision tree using teh utility functions above.
    * implement the classify() method to predict the label of a test record using your decision tree.
3. random_forest.py:
    * implement the functions _bootstrapping(), fitting(), voting()


#### Steps:
1. To run the code to implement the decision tree, in terminal run: 
    ```
    python random_forest.py 
    ```
2. Output for accuracy and OOB estimate are displayed in the terminal
3. Average accuracy: ~86%; Average OOB estimate: ~14%  
  
  
## Q3: Train Classifiers Using Weka

#### Overview: 
Use Weka to train classifiers for the same UCI Credit Approval Dataset used in Q2, and compare the performance of the random forest implementation with Weka's.

#### Steps:  
1. Download and install [Weka](https://www.cs.waikato.ac.nz/ml/weka/downloading.html)
2. Install the [latest JRE](https://www.java.com/en/) to avoid Java or runtime-related issues. 
3. Run the following classifier experiments with 10-fold CV and parameter tuning and report the results in report.txt:
    1. Random Forest
    2. Logistic Regression
    3. Multi-layer Perceptron
    4. SVM
    5. Naive Bayes
    
