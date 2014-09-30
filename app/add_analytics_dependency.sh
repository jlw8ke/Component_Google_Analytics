#!/bin/bash
if grep -e 'com.google.android.gms:play-services' app/build.gradle; then
		echo 'Google Play Services has already been added to the project'	
else
	echo 'Adding Google Play Servies dependency to the gradle file'
	sed '/dependencies/ a\ '$'\n compile \'com.google.android.gms:play-services:5.0.77\'\n' app/build.gradle > tempfile.txt
	mv tempfile.txt app/build.gradle
fi