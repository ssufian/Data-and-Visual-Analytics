package edu.gatech.cse6242

import org.apache.spark.SparkContext
import org.apache.spark.SparkContext._
import org.apache.spark.SparkConf
import org.apache.spark.sql.SQLContext
import org.apache.spark.sql.functions._

object Q2 {


	//Define the schema using a case class. Must be defined before running main class.
	case class Email(src: Int, tgt: Int, wtg: Int)

	def main(args: Array[String]) {
    	val sc = new SparkContext(new SparkConf().setAppName("Q2"))
		val sqlContext = new SQLContext(sc)
		import sqlContext.implicits._

    	// read the file
    	val file = sc.textFile("hdfs://localhost:8020" + args(0))

		//Inferring the Schema using Reflection. From case class Email above.
		val df = file.map(_.split("\t")).map(e => Email(e(0).toInt, e(1).toInt, e(2).toInt)).toDF()

		//Df for sum of all incoming edge weights >= 5 grouped by tgt
		val incoming = df.select("tgt","wtg").filter("wtg >= 5").groupBy("tgt").agg(sum("wtg").as("in"))
		
		//Df for sum of all outgoing edge weights >= 5 grouped by src
		val outgoing = df.select("src","wtg").filter("wtg >= 5").groupBy("src").agg(sum("wtg").as("out"))
		
		//Df that calcs all sum(incoming edge weights) - sum(all outgoing edge weights) for each node
		val accumulated = incoming.join(outgoing, "src" === "tgt","outer").select("src","in" - "out") 

		//Convert df to rows of strings, tab-delimted and save output
		accumulated.map(x => x.mkString("\t")).saveAsTextFile("hdfs://localhost:8020" + args(1))

    	// store output on given HDFS path.
    	// YOU NEED TO CHANGE THIS
    	//file.saveAsTextFile("hdfs:///user/cse6242/q2output1.tsv" + args(1))
  	}
}
