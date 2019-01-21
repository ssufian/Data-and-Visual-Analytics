package edu.gatech.cse6242;

import org.apache.hadoop.fs.Path;
import org.apache.hadoop.conf.Configuration;
import org.apache.hadoop.io.*;
import org.apache.hadoop.mapreduce.*;
import org.apache.hadoop.util.*;
import org.apache.hadoop.mapreduce.lib.input.FileInputFormat;
import org.apache.hadoop.mapreduce.lib.output.FileOutputFormat;
import java.io.IOException;
import java.util.StringTokenizer;

public class Q4 {

	public static class Mapper1 extends Mapper<Object, Text, IntWritable, IntWritable> {
	  
	  	private IntWritable src  = new IntWritable();
		private IntWritable tgt = new IntWritable();
		private final static IntWritable one = new IntWritable(1);
		private final static IntWritable n_one = new IntWritable(-1);
	  
	  	public void map(Object key, Text value, Context context) throws IOException, InterruptedException {
	  
	  		StringTokenizer itr = new StringTokenizer(value.toString(), "\\n");

	  		while (itr.hasMoreTokens()) {
		  	String row = itr.nextToken();
		  	String[] rowSplit = row.split("\\t");
		  	int source = Integer.parseInt(rowSplit[0]);
		  	int target = Integer.parseInt(rowSplit[1]);
		  	src.set(source);
		  	tgt.set(target);
		  	context.write(src, one);     //Source node ID (key) has value of 1
		  	context.write(tgt, n_one);   //Target node ID (key) has value of -1
	  		}
		}

	}

	public static class Reducer1 extends Reducer<IntWritable, IntWritable, IntWritable, IntWritable> {

		private IntWritable diff = new IntWritable();

		public void reduce(IntWritable key, Iterable<IntWritable> values, 
					   Context context) throws IOException, InterruptedException{
		
		int out_in = 0;
		
		for (IntWritable val : values){
			out_in += val.get();		//Gets total (out-degree - in-degree) for each node ID
		}

		diff.set(out_in);
		context.write(key, diff);		//Node ID (key), (out-degree - in-degree) of that node (value)
		}
	}


	public static class Mapper2 extends Mapper<Object, Text, IntWritable, IntWritable> {
		
		private IntWritable diff = new IntWritable();
		private final static IntWritable one = new IntWritable(1);

		public void map(Object key, Text value, Context context) throws IOException, InterruptedException {
			
			StringTokenizer itr = new StringTokenizer(value.toString(), "\\n");

	  		while (itr.hasMoreTokens()) {
		  	String row = itr.nextToken();
		  	String[] rowSplit = row.split("\\t");
		  	int difference = Integer.parseInt(rowSplit[1]);
			diff.set(difference);
			context.write(diff, one);	//Set (out-degree - in-degree) as key, and 1 as value
	  		}
		}
	}

	public static class Reducer2 extends Reducer<IntWritable, IntWritable, IntWritable, IntWritable> {

		private IntWritable node_count = new IntWritable();

		public void reduce(IntWritable key, Iterable<IntWritable> values, 
					   Context context) throws IOException, InterruptedException{
		int sum = 0;
		
		for (IntWritable val : values){
			sum += val.get();			//Count of nodes with the same difference in (out-degree - in-degree)
		}

		node_count.set(sum);
		context.write(key, node_count); //Node degree difference (key), Count of nodes that have the same value of differences (value)
		}
	}

	public static void main(String[] args) throws Exception {
    	Configuration conf = new Configuration();
    	Job job1 = Job.getInstance(conf, "Q4 - Differences");

    	//Job 1:
    	//Configure and setup job1 with the first Mapper and Reducer class.
    	job1.setJarByClass(Q4.class);
    	job1.setMapperClass(Mapper1.class);
    	job1.setCombinerClass(Reducer1.class);
    	job1.setReducerClass(Reducer1.class);
    	job1.setOutputKeyClass(IntWritable.class);
   		job1.setOutputValueClass(IntWritable.class);

   		//This will write the output of the first reducer step to a temporary directory on hadoop named tmp
    	FileInputFormat.addInputPath(job1, new Path(args[0]));
    	FileOutputFormat.setOutputPath(job1, new Path("tmp"));

    	job1.waitForCompletion(true);

    	//Job 2:
    	//Configure and setup job2 with second mapper and reducer class
    	Job job2 = Job.getInstance(conf, "Q4 - Count Nodes");
    	job2.setJarByClass(Q4.class);
    	job2.setMapperClass(Mapper2.class);
    	job2.setCombinerClass(Reducer2.class);
    	job2.setReducerClass(Reducer2.class);
    	job2.setOutputKeyClass(IntWritable.class);
   		job2.setOutputValueClass(IntWritable.class);

   		//Read from the output temporary directory of the first job
    	FileInputFormat.addInputPath(job2, new Path("tmp"));
    	FileOutputFormat.setOutputPath(job2, new Path(args[1]));

    	System.exit(job2.waitForCompletion(true) ? 0 : 1);
  }
}
