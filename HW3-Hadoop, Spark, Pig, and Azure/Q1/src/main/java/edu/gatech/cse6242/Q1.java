package edu.gatech.cse6242;

import org.apache.hadoop.fs.Path;
import org.apache.hadoop.conf.Configuration;
import org.apache.hadoop.io.*;
import org.apache.hadoop.mapreduce.*;
import org.apache.hadoop.util.*;
import org.apache.hadoop.mapreduce.lib.input.FileInputFormat;
import org.apache.hadoop.mapreduce.lib.output.FileOutputFormat;

import java.io.*;
import java.util.StringTokenizer;

public class Q1 {
	
  public static class TargetNodeMapper
  	extends Mapper<Object, Text, IntWritable, IntWritable>{
	  
	  private IntWritable targetID  = new IntWritable();
	  private IntWritable weight = new IntWritable();
	  
	  public void map(Object key, Text value, Context context) throws IOException, InterruptedException {
	  StringTokenizer itr = new StringTokenizer(value.toString(), "\\n");
	  
	  while (itr.hasMoreTokens()) {
		  String row = itr.nextToken();
		  String[] rowSplit = row.split("\\t");
		  int tgt = Integer.parseInt(rowSplit[1]);
		  int wgt = Integer.parseInt(rowSplit[2]);
		  targetID.set(tgt);
		  weight.set(wgt);
		  context.write(targetID, weight);
	  }
	}
  }
  
  public static class MinReducer
  	  extends Reducer<IntWritable, IntWritable, IntWritable, IntWritable> {
	  
	private IntWritable result = new IntWritable();
	
	public void reduce(IntWritable key, Iterable<IntWritable> values, 
					   Context context) throws IOException, InterruptedException{
		int min = Integer.MAX_VALUE;
		int num = 0;
		for (IntWritable val : values){
			num = val.get();
			if (num < min){
				min = num;
			}
		}
		result.set(min);
		context.write(key, result);
	}
  }
	
  public static void main(String[] args) throws Exception {
    Configuration conf = new Configuration();
    Job job = Job.getInstance(conf, "Q1");
    
    job.setJarByClass(Q1.class);
    job.setMapperClass(TargetNodeMapper.class);
    job.setCombinerClass(MinReducer.class);
    job.setReducerClass(MinReducer.class);
    job.setOutputKeyClass(IntWritable.class);
    job.setOutputValueClass(IntWritable.class);
    

    FileInputFormat.addInputPath(job, new Path(args[0]));
    FileOutputFormat.setOutputPath(job, new Path(args[1]));
    System.exit(job.waitForCompletion(true) ? 0 : 1);
  }
}
