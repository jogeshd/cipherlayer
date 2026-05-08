package io.cipherlayer.app;

import android.accessibilityservice.AccessibilityService;
import android.accessibilityservice.AccessibilityServiceInfo;
import android.os.Bundle;
import android.view.accessibility.AccessibilityEvent;
import android.view.accessibility.AccessibilityNodeInfo;
import android.util.Log;

public class CipherAccessibilityService extends AccessibilityService {
    private static final String TAG = "CipherAccessibility";

    @Override
    public void onAccessibilityEvent(AccessibilityEvent event) {
        String packageName = event.getPackageName() != null ? event.getPackageName().toString() : "";
        
        // Detect WhatsApp or Telegram
        if (packageName.equals("com.whatsapp") || packageName.equals("org.telegram.messenger")) {
            AccessibilityNodeInfo source = event.getSource();
            if (source == null) return;

            // Find EditText fields
            findEditText(source);
        }
    }

    private void findEditText(AccessibilityNodeInfo node) {
        if (node == null) return;

        if ("android.widget.EditText".equals(node.getClassName())) {
            // We found the message input field
            Log.d(TAG, "Found message input in " + node.getPackageName());
            
            // Here we can trigger the overlay to appear
            OverlayService.showFloatingButton(this, node);
        }

        for (int i = 0; i < node.getChildCount(); i++) {
            findEditText(node.getChild(i));
        }
    }

    @Override
    public void onInterrupt() {
        Log.e(TAG, "Accessibility Service Interrupted");
    }

    @Override
    protected void onServiceConnected() {
        super.onServiceConnected();
        AccessibilityServiceInfo info = new AccessibilityServiceInfo();
        info.eventTypes = AccessibilityEvent.TYPE_VIEW_FOCUSED | AccessibilityEvent.TYPE_VIEW_TEXT_CHANGED;
        info.feedbackType = AccessibilityServiceInfo.FEEDBACK_GENERIC;
        info.flags = AccessibilityServiceInfo.FLAG_REPORT_VIEW_IDS;
        setServiceInfo(info);
        Log.d(TAG, "Accessibility Service Connected");
    }
}
