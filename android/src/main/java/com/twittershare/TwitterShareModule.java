package com.twittershare;

import android.app.Activity;
import android.app.AlertDialog;
import android.content.DialogInterface;
import android.content.Intent;
import android.net.Uri;

import androidx.annotation.NonNull;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.module.annotations.ReactModule;

@ReactModule(name = TwitterShareModule.NAME)
public class TwitterShareModule extends ReactContextBaseJavaModule {
  public static final String NAME = "TwitterShare";

  public TwitterShareModule(ReactApplicationContext reactContext) {
    super(reactContext);
  }
  @Override
  @NonNull
  public String getName() {
    return NAME;
  }
  @ReactMethod
  public void SendTweet(String msg, String uriStr, Promise promise) {
    ReactApplicationContext context = getReactApplicationContext();
    Intent intent = null;
    try{
      intent = new Intent();
      intent.setAction(Intent.ACTION_SEND);
      intent.putExtra(Intent.EXTRA_TEXT,msg);
      intent.setType("text/plain");
      if(uriStr.equals(false)){
        intent.putExtra(Intent.EXTRA_STREAM,uriStr);
        intent.setType("image/*");
      }

      intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
      intent.setPackage("com.twitter.android");
      context.startActivity(intent);
      promise.resolve(true);
    }catch (Exception e){
      promise.reject("Error: ",e);
    }
  }
}
