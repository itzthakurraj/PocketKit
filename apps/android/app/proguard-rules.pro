# Proguard rules for PocketKit Android App
-keepattributes *Annotation*
-keepattributes JavascriptInterface
-keepclassmembers class * {
    @android.webkit.JavascriptInterface <methods>;
}

# Preserve WebKit & AndroidX classes
-keep class androidx.webkit.** { *; }
-keepclassmembers class com.pocketkit.app.WebAppInterface {
    <methods>;
}
