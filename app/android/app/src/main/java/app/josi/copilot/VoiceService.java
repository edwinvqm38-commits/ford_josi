package app.josi.copilot;

import android.app.Notification;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.app.Service;
import android.content.Context;
import android.content.Intent;
import android.content.pm.ServiceInfo;
import android.os.Build;
import android.os.IBinder;

import androidx.annotation.Nullable;
import androidx.core.app.NotificationCompat;
import androidx.core.app.ServiceCompat;

import org.json.JSONObject;
import org.vosk.Model;
import org.vosk.Recognizer;
import org.vosk.android.RecognitionListener;
import org.vosk.android.SpeechService;
import org.vosk.android.StorageService;

/** Servicio en primer plano: mantiene el micrófono abierto y reconoce voz sin conexión con Vosk. */
public class VoiceService extends Service implements RecognitionListener {
    public interface Sink { void onText(String kind, String text); void onState(String state, String msg); }

    public static volatile Sink sink;
    public static volatile boolean running = false;
    public static volatile boolean paused = false;
    static final String CH = "josi_voz";

    private Model model;
    private SpeechService speech;

    @Override public void onCreate() {
        super.onCreate();
        NotificationManager nm = (NotificationManager) getSystemService(Context.NOTIFICATION_SERVICE);
        if (Build.VERSION.SDK_INT >= 26) {
            nm.createNotificationChannel(new NotificationChannel(CH, "Josi escuchando", NotificationManager.IMPORTANCE_LOW));
        }
    }

    @Override public int onStartCommand(Intent intent, int flags, int startId) {
        if (intent != null && "STOP".equals(intent.getAction())) { stopSelf(); return START_NOT_STICKY; }
        Intent open = new Intent(this, MainActivity.class).addFlags(Intent.FLAG_ACTIVITY_SINGLE_TOP);
        PendingIntent pi = PendingIntent.getActivity(this, 0, open, PendingIntent.FLAG_IMMUTABLE | PendingIntent.FLAG_UPDATE_CURRENT);
        Intent stop = new Intent(this, VoiceService.class).setAction("STOP");
        PendingIntent ps = PendingIntent.getService(this, 1, stop, PendingIntent.FLAG_IMMUTABLE | PendingIntent.FLAG_UPDATE_CURRENT);
        Notification n = new NotificationCompat.Builder(this, CH)
                .setSmallIcon(android.R.drawable.ic_btn_speak_now)
                .setContentTitle("Josi está escuchando")
                .setContentText("Toca para abrir. Usa Detener para apagar el micrófono.")
                .setContentIntent(pi).addAction(0, "Detener", ps).setOngoing(true).build();
        int type = Build.VERSION.SDK_INT >= 30 ? ServiceInfo.FOREGROUND_SERVICE_TYPE_MICROPHONE : 0;
        ServiceCompat.startForeground(this, 41, n, type);
        running = true;
        if (speech == null && model == null) loadModel();
        return START_STICKY;
    }

    private void emitState(String s, String m) { Sink k = sink; if (k != null) k.onState(s, m); }

    private void loadModel() {
        emitState("loading", "Preparando voz sin conexión…");
        StorageService.unpack(this, "model-es", "model", m -> {
            model = m;
            try {
                Recognizer rec = new Recognizer(model, 16000.0f);
                speech = new SpeechService(rec, 16000.0f);
                speech.startListening(this);
                speech.setPause(paused);
                emitState("ready", "");
            } catch (Exception e) { emitState("error", String.valueOf(e.getMessage())); }
        }, e -> emitState("error", "Modelo: " + e.getMessage()));
    }

    public static void setPaused(boolean p) { paused = p; }
    SpeechService speechRef() { return speech; }

    // --- RecognitionListener ---
    private String field(String json, String key) {
        try { return new JSONObject(json).optString(key, ""); } catch (Exception e) { return ""; }
    }
    @Override public void onPartialResult(String h) { String t = field(h, "partial"); Sink k = sink; if (k != null && !t.isEmpty()) k.onText("partial", t); }
    @Override public void onResult(String h) { String t = field(h, "text"); Sink k = sink; if (k != null && !t.isEmpty()) k.onText("final", t); }
    @Override public void onFinalResult(String h) { onResult(h); }
    @Override public void onError(Exception e) { emitState("error", String.valueOf(e.getMessage())); }
    @Override public void onTimeout() { }

    @Override public void onDestroy() {
        running = false;
        if (speech != null) { speech.stop(); speech.shutdown(); speech = null; }
        if (model != null) { model.close(); model = null; }
        emitState("stopped", "");
        super.onDestroy();
    }

    @Nullable @Override public IBinder onBind(Intent i) { return null; }
}
