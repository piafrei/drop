# Drop installation guide

**Requirement**

* [Git](https://git-scm.com/)
* [NodeJS](https://nodejs.org/en/)
* Ionic Dev App (from AppStore)

**Installation**

1. `npm install -g ionic cordova`
3. [Create an Ionic Account](https://dashboard.ionicframework.com/signup)
4. `cd PATH/TO/INSTALL(C:/)`
5. `git clone https://github.com/piafrei/drop.git`
6. `cd drop`
7. `npm install`
8. `ionic cordova prepare`
9. `ionic serve -l --devapp` on Win or `ionic serve --c` on Mac
12. Login to the Ionic Dev App with the account created in step 3.

**CREATE APK FILE**

Android Plattform erzeugen und unsignierte APK erzeugen<br>
`ionic cordova build android --prod --release`

---

App Key generieren<br>
`keytool -genkey -keystore <KEY-NAME>.keystore -alias <KEY-ALIAS> -keyalg RSA -keysize 2048 -validity 999999`

---

APK Signieren<br>
- Jarsigner liegt unter Windows meistens in: <br>`C:\Program Files\Java\jdk<VERSION>\bin\jarsigner.exe`<br>

`"path/to/jarsigner.exe" -verbose -sigalg SHA1wthRSA -digestalg SHA1 -keystore <KEY-NAME>.keystore "C:\drop\platforms\android\app\build\outputs\apk\release\app-release-unsigned.apk" drop`<br>

"C:\Program Files\Java\jdk1.8.0_211\bin\jarsigner.exe" -verbose -sigalg SHA1withRSA -digestalg SHA1 -keystore drop-key.keystore "C:\drop\platforms\android\app\build\outputs\apk\release\app-release-unsigned.apk" drop

---

APK optimieren und fertigstellen<br>
`"path/to/zipalign.exe" -v 4 "C:\drop\platforms\android\app\build\outputs\apk\release\app-release-unsigned.apk" Drop.apk`<br>

"C:\Users\hofherr\AppData\Local\Android\Sdk\build-tools\28.0.3\zipalign.exe" -v 4 "C:\drop\platforms\android\app\build\outputs\apk\release\app-release-unsigned.apk" Drop.apk

- Zipalign.exe liegt unter Windows unter  `C:\Users\hofherr\AppData\Local\Android\Sdk\build-tools\28.0.3\zipalign.exe`

[Link zum Tutorial](https://ionicframework.com/docs/publishing/play-store)




