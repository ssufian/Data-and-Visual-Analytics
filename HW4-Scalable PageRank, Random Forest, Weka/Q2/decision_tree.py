from util import entropy, information_gain, partition_classes
import numpy as np 
import ast

class DecisionTree(object):
	def __init__(self):
		# Initializing the tree as an empty dictionary or list, as preferred
		#self.tree = []
		self.tree = {}
		pass

	def learn(self, X, y, remaining_attr = None):
		# TODO: Train the decision tree (self.tree) using the the sample X and labels y
		# You will have to make use of the functions in utils.py to train the tree
		
		# One possible way of implementing the tree:
		#    Each node in self.tree could be in the form of a dictionary:
		#       https://docs.python.org/2/library/stdtypes.html#mapping-types-dict
		#    For example, a non-leaf node with two children can have a 'left' key and  a 
		#    'right' key. You can add more keys which might help in classification
		#    (eg. split attribute and split value)

		#Create numpy arrays for X and y and preserve data type
		X_np = np.array(X, dtype = object)
		y_np = np.array(y, dtype = object)
	
		#At the root node set the column indexes as attributes
		if (remaining_attr == None): 
			attributes = range(X_np.shape[1]) 
		else:
			attributes = remaining_attr       #Retrieve remaining attributes from iterations
	
		#If labels are all the same, or attributes are less than 4, return a leaf node with majority of labels as value
		if (np.unique(y_np).size == 1 or len(attributes) < 4):
			a, b = np.unique(y_np, return_counts = True)
			self.tree = {"attribute": None, "value": a[np.argmax(b)], "left": None, "right": None}
			return self.tree
		
		#Iterate through each attribute to find the best value & attribute and use that to split
		best_attr_gain = []
		best_value = []

		for i in attributes:
			best_info_gain = 0.0
			value = 0
			unique_vals = np.unique(X_np[:,i])

			for val in unique_vals:
				X_left, X_right, y_left, y_right = partition_classes(X, y, split_attribute = i, split_val = val)
				info_gain = information_gain(y, [y_left, y_right])
				if (info_gain > best_info_gain):
					best_info_gain = info_gain
					value = val
			best_attr_gain.append(best_info_gain) #Add the best info gain for each attribute
			best_value.append(value)              #Add the best value for each attribute (the best info gain)


		best_attr = attributes[np.argmax(best_attr_gain)] #Get the best attribute among remaining attributes
		best_val = best_value[np.argmax(best_attr_gain)]  #Get the best value among remaining attributes

		#Split on the best attribute and value
		X_left, X_right, y_left, y_right = partition_classes(X, y, split_attribute = best_attr, split_val = best_val) 
	
		#Remove the attribute used to split
		attributes.remove(best_attr)
	
		#If there is no further split, then return a leaf node, else split further
		if (len(y_left) < 1 or len(y_right) < 1):
			a, b = np.unique(y_np, return_counts = True)
			self.tree = {"attribute": None, "value": a[np.argmax(b)], "left": None, "right": None}
			return 
		else:
			left = DecisionTree()
			right = DecisionTree()
			self.tree = {"attribute": best_attr, "value": best_val, "left": left, "right": right}
			left.learn(X_left, y_left, attributes)
			right.learn(X_right, y_right, attributes)
		pass


	def classify(self, record):
		# TODO: classify the record using self.tree and return the predicted label

		#While attribute does not equal None, that means leaf node hasn't been reached
		#If less than or equal, or both, depending on instance of record value, split node further to the left <= or right > (based on util.py partition class)
		while (self.tree["attribute"] != None):
			if (isinstance(self.tree["value"],(int,float))):
				if(record[self.tree["attribute"]] <= self.tree["value"]):
					return self.tree["left"].classify(record)
				else:
					return self.tree["right"].classify(record)
			else:
				if(record[self.tree["attribute"]] == self.tree["value"]):
					return self.tree["left"].classify(record)
				else:
					return self.tree["right"].classify(record)
		else:
			return self.tree["value"]

		pass
