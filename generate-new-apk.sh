#!/usr/bin/env bash
ionic cordova build android --prod --release

"C:\Program Files\Java\jdk1.8.0_211\bin\jarsigner.exe" -verbose -sigalg SHA1wthRSA -digestalg SHA1 -keystore drop-key.keystore "C:\drop\platforms\android\app\build\outputs\apk\release\app-release-unsigned.apk" drop

"C:\Users\hofherr\AppData\Local\Android\Sdk\build-tools\28.0.3\zipalign.exe" -v 4 "C:\drop\platforms\android\app\build\outputs\apk\release\app-release-unsigned.apk" Drop.apk
