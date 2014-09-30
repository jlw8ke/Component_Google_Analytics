#!/bin/bash
if grep -e 'com.google.android.gms:play-services' app/build.gradle; then
		echo 'Google Play Services has already been added to the project'	
else
	echo 'Adding Google Play Servies dependency to the gradle file'
	awk '/dependencies/{print;print "\t// Google Play Services\n\tcompile \"com.google.android.gms:play-services:5.2.08\"\n";next}1' app/build.gradle > tempfile
	mv tempfile app/build.gradle
fi

