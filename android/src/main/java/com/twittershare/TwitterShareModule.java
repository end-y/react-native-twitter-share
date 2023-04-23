package com.twittershare;

import android.content.Intent;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;

import androidx.annotation.NonNull;
import androidx.core.content.FileProvider;

import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.module.annotations.ReactModule;

import android.net.Uri;
import android.os.Environment;
import android.util.Base64;

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
  public void GetAbsolutePath(Promise promise){
    try{
      String externalStoragePath = Environment.getExternalStorageDirectory().getAbsolutePath();
      promise.resolve(externalStoragePath);
    }catch (Exception e){
      promise.reject("Error: ",e);
    }

  }
  @ReactMethod
  public void SendTweet(String msg, String uriStr, Boolean base64, Promise promise) throws IOException {
    ReactApplicationContext context = getReactApplicationContext();
    Intent intent = null;
    try{
      intent = new Intent();
      intent.setAction(Intent.ACTION_SEND);
      intent.putExtra(Intent.EXTRA_TEXT,msg);
      intent.setType("text/plain");
      if(!uriStr.equals(false)){
        Uri photoURI = null;
        if(base64.equals(true)){
          byte[] bytes = Base64.decode(uriStr, Base64.DEFAULT);
          File file = new File(context.getCacheDir(), "image.jpg");
          FileOutputStream outputStream = new FileOutputStream(file);
          outputStream.write(bytes);
          outputStream.close();
          photoURI = FileProvider.getUriForFile(context, context.getApplicationContext().getPackageName() + ".provider", file);
        }else{
          photoURI = FileProvider.getUriForFile(context, context.getApplicationContext().getPackageName() + ".provider",new File(uriStr));
        }
        intent.addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION);
        intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
        intent.setType("image/*");
        intent.putExtra(Intent.EXTRA_STREAM, photoURI);

      }
      intent.setPackage("com.twitter.android");
      context.startActivity(intent);
      promise.resolve(true);
    }catch (Exception e){
      promise.reject("Error: ", e);
    }
  }
}
