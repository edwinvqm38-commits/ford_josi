package app.josi.copilot;

import android.os.Bundle;
import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
    @Override public void onCreate(Bundle savedInstanceState) {
        registerPlugin(JosiVoicePlugin.class);
        super.onCreate(savedInstanceState);
    }
}
