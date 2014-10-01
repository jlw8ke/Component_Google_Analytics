if grep -e 'uses-permission android:name="android.permission.INTERNET"' app/src/main/AndroidManifest.xml; then
	echo 'Internet permission is already in manifest'
else
	echo 'Adding internet permission'
	awk '/<application/{
		print "\t<uses-permission android:name=\"android.permission.INTERNET\" />";
	}1' app/src/main/AndroidManifest.xml > manifestTempfile
	mv manifestTempfile app/src/main/AndroidManifest.xml
fi

if grep -e 'uses-permission android:name="android.permission.ACCESS_NETWORK_STATE"' app/src/main/AndroidManifest.xml; then
	echo 'Network access permission is already in manifest'
else
	echo 'Adding network access permission'
	awk '/<application/{
		print "\t<uses-permission android:name=\"android.permission.ACCESS_NETWORK_STATE\" />";
	}1' app/src/main/AndroidManifest.xml > tempfile
	mv tempfile app/src/main/AndroidManifest.xml
fi	
