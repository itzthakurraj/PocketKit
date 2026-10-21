package com.pocketkit.app

import android.content.Context
import android.content.Intent
import android.net.Uri
import android.os.Build
import android.os.VibrationEffect
import android.os.Vibrator
import android.os.VibratorManager
import android.webkit.JavascriptInterface
import android.widget.Toast
import java.util.Locale

class WebAppInterface(private val context: Context) {

    @JavascriptInterface
    fun showToast(message: String) {
        Toast.makeText(context, message, Toast.LENGTH_SHORT).show()
    }

    @JavascriptInterface
    fun shareText(title: String, text: String) {
        val intent = Intent(Intent.ACTION_SEND).apply {
            type = "text/plain"
            putExtra(Intent.EXTRA_SUBJECT, title)
            putExtra(Intent.EXTRA_TEXT, text)
        }
        val chooser = Intent.createChooser(intent, "Share via")
        chooser.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
        context.startActivity(chooser)
    }

    @JavascriptInterface
    fun openExternalUrl(url: String) {
        try {
            val intent = Intent(Intent.ACTION_VIEW, Uri.parse(url)).apply {
                addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
            }
            context.startActivity(intent)
        } catch (_: Exception) {}
    }

    @JavascriptInterface
    fun getAppVersion(): String {
        return "2.0.4"
    }

    @JavascriptInterface
    fun isNativeApp(): Boolean {
        return true
    }

    /**
     * Tactile Haptic Feedback Bridge for Android Native App
     * Triggers hardware vibrator with customized waveforms to assist users with visual impairments.
     */
    @JavascriptInterface
    fun performHapticFeedback(patternType: String) {
        try {
            val vibrator = if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.S) {
                val vibratorManager = context.getSystemService(Context.VIBRATOR_MANAGER_SERVICE) as? VibratorManager
                vibratorManager?.defaultVibrator
            } else {
                @Suppress("DEPRECATION")
                context.getSystemService(Context.VIBRATOR_SERVICE) as? Vibrator
            }

            vibrator?.let { v ->
                if (v.hasVibrator()) {
                    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
                        when (patternType.lowercase()) {
                            "selection", "tap" -> {
                                v.vibrate(VibrationEffect.createOneShot(14, VibrationEffect.DEFAULT_AMPLITUDE))
                            }
                            "light", "button" -> {
                                v.vibrate(VibrationEffect.createOneShot(20, VibrationEffect.DEFAULT_AMPLITUDE))
                            }
                            "medium", "modal" -> {
                                v.vibrate(VibrationEffect.createOneShot(38, VibrationEffect.DEFAULT_AMPLITUDE))
                            }
                            "heavy", "download" -> {
                                v.vibrate(VibrationEffect.createOneShot(60, VibrationEffect.DEFAULT_AMPLITUDE))
                            }
                            "success" -> {
                                val timings = longArrayOf(0, 30, 40, 45)
                                val amplitudes = intArrayOf(0, 160, 0, 240)
                                v.vibrate(VibrationEffect.createWaveform(timings, amplitudes, -1))
                            }
                            "error", "warning" -> {
                                val timings = longArrayOf(0, 55, 35, 55)
                                val amplitudes = intArrayOf(0, 255, 0, 255)
                                v.vibrate(VibrationEffect.createWaveform(timings, amplitudes, -1))
                            }
                            "voice" -> {
                                val timings = longArrayOf(0, 35, 30, 35)
                                val amplitudes = intArrayOf(0, 180, 0, 200)
                                v.vibrate(VibrationEffect.createWaveform(timings, amplitudes, -1))
                            }
                            else -> {
                                v.vibrate(VibrationEffect.createOneShot(25, VibrationEffect.DEFAULT_AMPLITUDE))
                            }
                        }
                    } else {
                        @Suppress("DEPRECATION")
                        v.vibrate(25)
                    }
                }
            }
        } catch (_: Exception) {}
    }

    /**
     * Regional Locale information from Android device system settings
     */
    @JavascriptInterface
    fun getDeviceLanguage(): String {
        return Locale.getDefault().language
    }

    @JavascriptInterface
    fun getDeviceLocale(): String {
        return Locale.getDefault().toLanguageTag()
    }
}
