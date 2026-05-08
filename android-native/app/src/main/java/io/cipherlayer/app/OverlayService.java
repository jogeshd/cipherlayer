package io.cipherlayer.app;

import android.app.Service;
import android.content.Context;
import android.content.Intent;
import android.graphics.PixelFormat;
import android.os.Build;
import android.os.IBinder;
import android.view.Gravity;
import android.view.LayoutInflater;
import android.view.View;
import android.view.WindowManager;
import android.view.accessibility.AccessibilityNodeInfo;
import android.widget.ImageView;
import android.widget.Toast;

public class OverlayService extends Service {
    private static WindowManager windowManager;
    private static View floatingButton;
    private static AccessibilityNodeInfo activeNode;

    @Override
    public IBinder onBind(Intent intent) {
        return null;
    }

    public static void showFloatingButton(Context context, AccessibilityNodeInfo node) {
        activeNode = node;
        if (floatingButton != null) return;

        windowManager = (WindowManager) context.getSystemService(WINDOW_SERVICE);

        int layoutType;
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            layoutType = WindowManager.LayoutParams.TYPE_APPLICATION_OVERLAY;
        } else {
            layoutType = WindowManager.LayoutParams.TYPE_PHONE;
        }

        final WindowManager.LayoutParams params = new WindowManager.LayoutParams(
                WindowManager.LayoutParams.WRAP_CONTENT,
                WindowManager.LayoutParams.WRAP_CONTENT,
                layoutType,
                WindowManager.LayoutParams.FLAG_NOT_FOCUSABLE,
                PixelFormat.TRANSLUCENT);

        params.gravity = Gravity.TOP | Gravity.END;
        params.x = 0;
        params.y = 200;

        floatingButton = LayoutInflater.from(context).inflate(R.layout.overlay_button, null);
        
        ImageView logo = floatingButton.findViewById(R.id.cipher_logo);
        String packageName = node.getPackageName().toString();
        
        if (packageName.equals("com.whatsapp")) {
            logo.setBackgroundResource(R.drawable.circle_bg_whatsapp);
        } else if (packageName.equals("org.telegram.messenger")) {
            logo.setBackgroundResource(R.drawable.circle_bg_telegram);
        }

        floatingButton.setOnClickListener(v -> {
            // Logic to encrypt text in the activeNode
            encryptCurrentText(context);
        });

        windowManager.addView(floatingButton, params);
    }

    private static void encryptCurrentText(Context context) {
        if (activeNode == null) return;
        
        CharSequence text = activeNode.getText();
        if (text == null) return;

        // Simple placeholder for PolyShield encryption
        String encrypted = "🛡️[" + text.toString() + "]🛡️";
        
        // Use accessibility to paste back the text
        android.os.Bundle arguments = new android.os.Bundle();
        arguments.putCharSequence(AccessibilityNodeInfo.ACTION_ARGUMENT_SET_TEXT_CHARSEQUENCE, encrypted);
        activeNode.performAction(AccessibilityNodeInfo.ACTION_SET_TEXT, arguments);
        
        Toast.makeText(context, "PolyShield Applied", Toast.LENGTH_SHORT).show();
    }
}
