#!/bin/bash
proguard=$1
echo "Setting up the proguard document"

cat <<EOF >> $proguard
-keep class * extends java.util.ListResourceBundle {
	protected Object[][] getContents();
}

-keep public class com.google.android.gms.common.internal.safeparcel.SafeParcelable {
	public static final *** NULL;
}

-keepnames @com.google.android.gms.common.annotation.KeepName class *
-keepclassmembernames class * {
	@com.google.android.gms.common.annotation.KeepName *;
}

-keepnames class * implements android.os.Parcelable {
	public static final ** CREATOR;
}
EOF

