package app.josi.copilot;

import android.Manifest;
import android.content.Context;
import android.content.Intent;
import android.media.AudioAttributes;
import android.media.AudioFocusRequest;
import android.media.AudioManager;
import android.os.Build;

import androidx.core.content.ContextCompat;

import com.getcapacitor.JSObject;
import com.getcapacitor.PermissionState;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;
import com.getcapacitor.annotation.Permission;
import com.getcapacitor.annotation.PermissionCallback;

@CapacitorPlugin(name = "JosiVoice", permissions = {
        @Permission(strings = {Manifest.permission.RECORD_AUDIO}, alias = "mic"),
        @Permission(strings = {Manifest.permission.POST_NOTIFICATIONS}, alias = "notif")
})
public class JosiVoicePlugin extends Plugin implements VoiceService.Sink {
    private AudioFocusRequest focusReq;

    @Override public void load() { VoiceService.sink = this; }

    @Override public void onText(String kind, String text) {
        JSObject o = new JSObject(); o.put("kind", kind); o.put("text", text);
        notifyListeners("text", o);
    }
    @Override public void onState(String state, String msg) {
        JSObject o = new JSObject(); o.put("state", state); o.put("msg", msg);
        notifyListeners("state", o);
    }

    @PluginMethod public void start(PluginCall call) {
        if (getPermissionState("mic") != PermissionState.GRANTED) {
            requestPermissionForAliases(new String[]{"mic", "notif"}, call, "permDone");
            return;
        }
        go(call);
    }
    @PermissionCallback private void permDone(PluginCall call) {
        if (getPermissionState("mic") != PermissionState.GRANTED) { call.reject("Permiso de micrófono denegado"); return; }
        go(call);
    }
    private void go(PluginCall call) {
        VoiceService.sink = this;
        Context c = getContext();
        ContextCompat.startForegroundService(c, new Intent(c, VoiceService.class));
        JSObject r = new JSObject(); r.put("running", true); call.resolve(r);
    }

    @PluginMethod public void stop(PluginCall call) {
        Context c = getContext();
        c.stopService(new Intent(c, VoiceService.class));
        call.resolve();
    }

    /** Pausa el reconocimiento (mientras Josi habla o el modo Live usa el micrófono). */
    @PluginMethod public void pause(PluginCall call) {
        boolean p = Boolean.TRUE.equals(call.getBoolean("on", true));
        VoiceService.setPaused(p);
        call.resolve();
    }

    /** Baja el volumen de la radio mientras Josi habla. */
    @PluginMethod public void duck(PluginCall call) {
        AudioManager am = (AudioManager) getContext().getSystemService(Context.AUDIO_SERVICE);
        boolean on = Boolean.TRUE.equals(call.getBoolean("on", true));
        if (on) {
            if (Build.VERSION.SDK_INT >= 26) {
                focusReq = new AudioFocusRequest.Builder(AudioManager.AUDIOFOCUS_GAIN_TRANSIENT_MAY_DUCK)
                        .setAudioAttributes(new AudioAttributes.Builder()
                                .setUsage(AudioAttributes.USAGE_ASSISTANCE_NAVIGATION_GUIDANCE)
                                .setContentType(AudioAttributes.CONTENT_TYPE_SPEECH).build())
                        .build();
                am.requestAudioFocus(focusReq);
            } else {
                am.requestAudioFocus(null, AudioManager.STREAM_MUSIC, AudioManager.AUDIOFOCUS_GAIN_TRANSIENT_MAY_DUCK);
            }
        } else {
            if (Build.VERSION.SDK_INT >= 26 && focusReq != null) am.abandonAudioFocusRequest(focusReq);
            else am.abandonAudioFocus(null);
        }
        call.resolve();
    }

    @PluginMethod public void status(PluginCall call) {
        JSObject r = new JSObject(); r.put("running", VoiceService.running); r.put("paused", VoiceService.paused);
        call.resolve(r);
    }
}
