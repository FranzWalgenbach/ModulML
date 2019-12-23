from flask import Flask,render_template,url_for,request, session, escape, redirect, make_response
from flask_bootstrap import Bootstrap
import pandas as pd
import numpy as np
from sklearn import tree
from sklearn.metrics import accuracy_score, recall_score
import os
import json
import ast
from IPython.core.display import Image, display
from six import StringIO
import pydot
import time
from sklearn.feature_extraction.text import CountVectorizer
import joblib

def create_app():
	app = Flask(__name__)
	#app = create_app()
	Bootstrap(app)

	#Define all pages and connect them via 'next' parameter
	@app.route('/')
	def root():
		return render_template('index.html', next='results')

	@app.route('/lizenzen')
	def lizenzen():
		return render_template('lizenzen.html')

	@app.route('/start')
	def start():
		return render_template('start.html')

	@app.route('/quiz_start')
	def quiz_start():
		return render_template('quiz_start.html', next='quiz_decisiontree')

	@app.route('/decisiontree')
	def decisiontree():
		return render_template('decisiontree.html')

	@app.route('/decisiontreeanimation')
	def decisiontreeanimation():
		return render_template('animation.html')

	@app.route('/quiz_decisiontree')
	def quiz_decisiontree():
		return render_template('quiz_decisiontree.html', next='results')

	@app.route('/example')
	def example():
		return render_template('example.html')

	@app.route('/results')
	def results():
		#Initialize cookies
		resp = make_response(render_template('results.html', next='tuning'))
		train = {"max_depth": "Standardwert", "min_samples_split": 2, "min_samples_leaf": 1, "max_features": "Standardwert", "threshold": 0.5, "Wind_max": 1, "Wind_mittel": 1, "Schneehöhe": 1, "Bedeckungsgrad": 1, "Dampfdruck": 1, "Luftdruck": 1, "Temp_mittel": 1, "rel_Feuchte": 1, "Temp_max_2m": 1, "Temp_min_2m": 1, "Temp_min_5cm": 1, "accuracy_train": 0.0, "recall": 0.0, "recall_with_best_accuracy": 0.0}
		train_str = json.dumps(train)
		resp.set_cookie('train', train_str)
		test = {"max_depth": "Standardwert", "min_samples_split": 2, "min_samples_leaf": 1, "max_features": "Standardwert", "threshold": 0.5, "Wind_max": 1, "Wind_mittel": 1, "Schneehöhe": 1, "Bedeckungsgrad": 1, "Dampfdruck": 1, "Luftdruck": 1, "Temp_mittel": 1, "rel_Feuchte": 1, "Temp_max_2m": 1, "Temp_min_2m": 1, "Temp_min_5cm": 1, "accuracy_test": 0.0, "recall": 0.0, "recall_with_best_accuracy": 0.0}
		test_str = json.dumps(test)
		resp.set_cookie('test', test_str)
		return resp

	@app.route('/parameter')
	def parameter():
		return render_template('parameter.html')

	@app.route('/tuning')
	def tuning():
		train_cookie = request.cookies.get('train')
		test_cookie = request.cookies.get('test')
		#Set cookies if this page is accessed directly
		if train_cookie == None or test_cookie == None:
			resp = make_response(render_template('weather_tuning.html', next='cancer'))
			if train_cookie == None:
				train = {"max_depth": "Standardwert", "min_samples_split": 2, "min_samples_leaf": 1, "max_features": "Standardwert", "threshold": 0.5, "Wind_max": 1, "Wind_mittel": 1, "Schneehöhe": 1, "Bedeckungsgrad": 1, "Dampfdruck": 1, "Luftdruck": 1, "Temp_mittel": 1, "rel_Feuchte": 1, "Temp_max_2m": 1, "Temp_min_2m": 1, "Temp_min_5cm": 1, "accuracy_train": 0.0, "recall": 0.0, "recall_with_best_accuracy": 0.0}
				train_str = json.dumps(train)
				resp.set_cookie('train', train_str)
			if test_cookie == None:
				test = {"max_depth": "Standardwert", "min_samples_split": 2, "min_samples_leaf": 1, "max_features": "Standardwert", "threshold": 0.5, "Wind_max": 1, "Wind_mittel": 1, "Schneehöhe": 1, "Bedeckungsgrad": 1, "Dampfdruck": 1, "Luftdruck": 1, "Temp_mittel": 1, "rel_Feuchte": 1, "Temp_max_2m": 1, "Temp_min_2m": 1, "Temp_min_5cm": 1, "accuracy_test": 0.0, "recall": 0.0, "recall_with_best_accuracy": 0.0}
				test_str = json.dumps(test)
				resp.set_cookie('test', test_str)
			return resp
		else:
			return render_template('weather_tuning.html', next='cancer')

	@app.route('/weathertrain', methods=['POST'])
	def weathertrain():
		X_train = pd.read_csv(r'data/wetter/X_train.csv')
		y_train = pd.read_csv("data/wetter/y_train.csv")

		X_test = pd.read_csv("data/wetter/X_test.csv")
		y_test = pd.read_csv("data/wetter/y_test.csv")


		# Features and Labels
		y = y_train

		y_test = y_test.to_numpy()


		# Receiving input from form
		if request.method == 'POST':
			#changing parameters
			max_depth = None
			help = request.form['max_depth']
			if help != '':
				max_depth = int(float(help))

			min_samples_split = 2
			help = request.form['min_samples_split']
			if help != '' and help!='1' and help != '0':
				min_samples_split = int(float(help))

			min_samples_leaf = 1
			help = request.form['min_samples_leaf']
			if help != '' and help != '0':
				min_samples_leaf = int(float(help))

			max_features = None
			help = request.form['max_features']
			if help != '':
				max_features = int(float(help))

			threshold = 0.5
			help = request.form['threshold']
			if help != 0.5:
				threshold = float(help)
			#Define classifier
			clf = tree.DecisionTreeClassifier(random_state=4, max_depth=max_depth, min_samples_split=min_samples_split, min_samples_leaf=min_samples_leaf, max_features=max_features)
			#Check for features
			feature_list = ['Wind_max', 'Wind_mittel', 'Schneehöhe', 'Bedeckungsgrad', 'Dampfdruck', 'Luftdruck', 'Temp_mittel', 'rel_Feuchte', 'Temp_max_2m', 'Temp_min_2m', 'Temp_min_5cm']
			for checkbox in feature_list:
				value = request.form.get(checkbox)
				if value == None:
					X_train[checkbox] = 0
					X_test[checkbox] = 0

			clf.fit(X_train,y)
			#Adjust prediction if threshold is not default
			if threshold != 0.5:
				predicted_probaTrain = clf.predict_proba(X_train)
				my_prediction = (predicted_probaTrain [:,1] >= threshold).astype('int')
				predicted_probaTest = clf.predict_proba(X_test)
				my_prediction_test = (predicted_probaTest [:,1] >= threshold).astype('int')
			else:
				my_prediction = clf.predict(X_train)
				my_prediction_test = clf.predict(X_test)
		else:
			my_prediction = 'internal Server Error'

		#Render graph representation
		millis = int(round(time.time() * 1000))
		renderImage = False
		zoom = False
		if max_depth != None and max_depth <= 6 and max_depth >= 3:
			zoom = True
		#Render only if depth of tree is not too high
		if max_depth != None and max_depth <= 6:
			dot_data = StringIO()
			tree.export_graphviz(clf, out_file=dot_data, feature_names= X_train.columns, class_names= ['0', '1'], filled=True, rounded=True, special_characters=True)
			(graph,)  = pydot.graph_from_dot_data(dot_data.getvalue())
			png_str = graph.create_png(prog='dot')
			Img=(Image(png_str))
			with open("static/temp/dt_{}.png".format(millis), "wb") as png:
				png.write(Img.data)
			renderImage = True
		#Calculate accuracy and recall
		accuracy_test = accuracy_score(y_test, my_prediction_test)
		accuracy_train = accuracy_score(y, my_prediction)

		recall_test = recall_score(y_test, my_prediction_test)
		recall_train = recall_score(y, my_prediction)

		train_cookie = request.cookies.get('train')
		test_cookie = request.cookies.get('test')
		train_cookie = ast.literal_eval(train_cookie)
		test_cookie = ast.literal_eval(test_cookie)

		train = train_cookie["accuracy_train"]
		test = test_cookie["accuracy_test"]
		#Check if new parameters are better for test data
		if accuracy_test >= test:
			for checkbox in feature_list:
				value = request.form.get(checkbox)
				if value == None:
					test_cookie[checkbox] = 0
				else:
					test_cookie[checkbox] = 1
			if max_depth == None:
				test_cookie["max_depth"] = "Standardwert"
			else:
				test_cookie["max_depth"] = max_depth
			test_cookie["min_samples_split"] = min_samples_split
			test_cookie["min_samples_leaf"] = min_samples_leaf
			if max_features == None:
				test_cookie["max_featues"] = "Standardwert"
			else:
				test_cookie["max_features"] = max_features
			test_cookie["threshold"] = threshold
			test_cookie["accuracy_test"] = accuracy_test
			test_cookie["recall_with_best_accuracy"] = recall_test

		test_cookie["recall"] = recall_test
		#Check if new parameters are better for train data
		if accuracy_train >= train:
			for checkbox in feature_list:
				value = request.form.get(checkbox)
				if value == None:
					train_cookie[checkbox] = 0
				else:
					train_cookie[checkbox] = 1
			if max_depth == None:
				train_cookie["max_depth"] = "Standardwert"
			else:
				train_cookie["max_depth"] = max_depth
			train_cookie["min_samples_split"] = min_samples_split
			train_cookie["min_samples_leaf"] = min_samples_leaf
			if max_features == None:
				train_cookie["max_featues"] = "Standardwert"
			else:
				train_cookie["max_features"] = max_features
			train_cookie["threshold"] = threshold
			train_cookie["accuracy_train"] = accuracy_train
			train_cookie["recall_with_best_accuracy"] = recall_train

		train_cookie["recall"] = recall_train
		#Set variables for output of currently best parameters
		max_depth_train = train_cookie["max_depth"]
		min_samples_split_train = train_cookie["min_samples_split"]
		min_samples_leaf_train = train_cookie["min_samples_leaf"]
		max_features_train = train_cookie["max_features"]
		threshold_train = train_cookie["threshold"]

		max_depth_test = test_cookie["max_depth"]
		min_samples_split_test = test_cookie["min_samples_split"]
		min_samples_leaf_test = test_cookie["min_samples_leaf"]
		max_features_test = test_cookie["max_features"]
		threshold_test = test_cookie["threshold"]

		feature_list_train = {}
		feature_list_test = {}
		for column in feature_list:
			value_train = train_cookie[column]
			value_test = test_cookie[column]
			feature_list_train[column] = value_train
			feature_list_test[column] = value_test

		best_accuracy_train = train_cookie["accuracy_train"]
		best_accuracy_test = test_cookie["accuracy_test"]

		recall_with_best_accuracy_train = train_cookie["recall_with_best_accuracy"]
		recall_with_best_accuracy_test = test_cookie["recall_with_best_accuracy"]
		#Create response
		resp = make_response(render_template('resultsweather.html',accuracy_train = round(accuracy_train,5) , accuracy_test = round(accuracy_test,5), max_depth_train = max_depth_train, max_depth_test = max_depth_test, min_samples_split_train = min_samples_split_train, min_samples_split_test = min_samples_split_test, min_samples_leaf_train = min_samples_leaf_train, min_samples_leaf_test = min_samples_leaf_test, max_features_train=max_features_train, max_features_test=max_features_test, threshold_train=threshold_train, threshold_test=threshold_test, recall_train=round(recall_train,5), recall_test=round(recall_test,5), recall_with_best_accuracy_train=round(recall_with_best_accuracy_train,5), recall_with_best_accuracy_test=round(recall_with_best_accuracy_test,5), feature_list_train=feature_list_train, feature_list_test=feature_list_test, best_accuracy_test = round(best_accuracy_test,5), best_accuracy_train = round(best_accuracy_train,5), millis=millis, renderImage=renderImage, zoom=zoom))

		train_str = json.dumps(train_cookie)
		resp.set_cookie('train', train_str)
		test_str = json.dumps(test_cookie)
		resp.set_cookie('test', test_str)

		return resp


	@app.route('/deleteImage', methods=['POST'])
	def deleteImage():
		filepath = 'static/temp/dt_'+request.form['millis']+'.png'
		if os.path.exists(filepath):
			os.remove(filepath)
		return 'done'

	@app.route('/sensspez')
	def sensspez():
		return render_template('sensspez.html')


	@app.route('/ethics')
	def ethics():
		return render_template('ethics.html')

	@app.route('/cancer')
	def cancer():
		return render_template('cancer.html')


	@app.route('/predictcancer', methods=['POST'])
	def predictcancer():

		# Loading predefined Model
		clf_random = joblib.load("cancer/models/dtmodel_random.pkl")

		clf_simple = joblib.load("cancer/models/dtmodel_simple.pkl")

		clf_knn = joblib.load("cancer/models/knn_model.pkl")

		clf_rf = joblib.load("cancer/models/rf_model.pkl")

		clf_rf_opt = joblib.load("cancer/models/rf_opt_model.pkl")

		# Receives input from form
		if request.method == 'POST':
			texture_mean = request.form['texture_mean']
			area_mean = request.form['area_mean']
			smoothness_mean = request.form['smoothness_mean']
			concavity_mean = request.form['concavity_mean']
			area_se = request.form['area_se']
			concavity_se = request.form['concavity_se']
			smoothness_worst = request.form['smoothness_worst']
			concavity_worst = request.form['concavity_worst']
			symmetry_worst = request.form['symmetry_worst']

			model = request.form['model']
			data = [[texture_mean, area_mean, smoothness_mean, concavity_mean, area_se, concavity_se, smoothness_worst, concavity_worst, symmetry_worst]]
			vect = data
			if model == 'simple':
				my_prediction = clf_simple.predict(vect)
			elif model == 'random':
				my_prediction = clf_random.predict(vect)
			elif model == 'knn':
				my_prediction = clf_knn.predict(vect)
			elif model == 'rf':
				my_prediction = clf_rf.predict(vect)
			else:
				my_prediction = clf_rf_opt.predict(vect)
		else:
			my_prediction = 'internal Server Error'
		return render_template('resultscancer.html',prediction = my_prediction )
	return app


if __name__ == '__main__':
	app = create_app()
	app.run(debug=False)
