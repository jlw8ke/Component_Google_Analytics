#!/bin/bash
if grep -e 'com.google.android.gms:play-services' app/build.gradle; then
		echo 'Google Play Services gradle dependency has already been added to the project'	
else
	echo 'Adding Google Play Servies gradle dependency'
	awk '/dependencies/{print;print "\t// Google Play Services\n\tcompile \"com.google.android.gms:play-services:5.2.08\"\n";next}1' app/build.gradle > tempfile
	mv tempfile app/build.gradle
fi

if grep -e 'meta-data android:name="com.google.android.gms.version' app/src/main/AndroidManifest.xml; then
	echo 'Google Play Services meta-data is already configured'
else
	echo 'Adding Google Play Services meta-data to Manifest'
	awk '/<\/application>/{
		print "\n\t<meta-data android:name=\"com.google.android.gms.version\"";
		print "\t\tandroid:value=\"@integer/google_play_services_version\" />"
	}1' app/src/main/AndroidManifest.xml > manifestTempfile
	mv manifestTempfile app/src/main/AndroidManifest.xml

	if [ ! -f app/src/main/res/values/integers.xml ]; then
		echo "Creating integers.xml file for google play services version"
		cat <<EOT >> app/src/main/res/values/integers.xml
<resources>
	<float name="google_play_services_version">5.2.08</float>
</resources>
EOT
	else
		awk '/<\/resources>/{
			print "\t<float name=\"google_play_services_version\">5.2.08</float>";
		}1' app/src/main/res/values/integers.xml > integerTempfile
		mv integerTempfile app/src/main/res/values/integers.xml
	fi
fi