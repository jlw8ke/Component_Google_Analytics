if grep -e 'uses-permission android:name="android.permission.INTERNET"' app/src/main/AndroidManifest.xml; then
	echo 'Internet permission is already in manifest'
else
	echo 'Adding internet permission'
fi	
