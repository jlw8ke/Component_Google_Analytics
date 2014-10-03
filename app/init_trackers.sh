#!/bin/bash

echo 'imma make these trackers'
for tracker in "$@"
do
    echo "Initializing tracker: $tracker.xml"
    cat <<EOF >> ./app/src/main/res/xml/$tracker.xml
<?xml version="1.0" encoding="utf-8"?>
<resources xmlns:tools="http://schemas.android.com/tools"
tools:ignore="TypographyDashes">
	<!--  The following value should be replaced with correct property id. -->
	<string name="ga_trackingId">UA-XXXXXXX-Y</string>

	<integer name="ga_sessionTimeout">300</integer>

	<!-- Enable automatic Activity measurement -->
	<bool name="ga_autoActivityTracking">true</bool>
</resources>
EOF
done