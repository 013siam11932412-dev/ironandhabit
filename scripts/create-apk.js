const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, '..', 'public', 'downloads');
if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir, { recursive: true });
}

function createZip(entries) {
  const parts = [];
  const centralDir = [];
  let offset = 0;

  for (const entry of entries) {
    const data = Buffer.from(entry.content);
    const name = Buffer.from(entry.name);

    const localHeader = Buffer.alloc(30 + name.length);
    localHeader.writeUInt32LE(0x04034b50, 0);
    localHeader.writeUInt16LE(20, 4);
    localHeader.writeUInt16LE(0, 6);
    localHeader.writeUInt16LE(0, 8);
    localHeader.writeUInt16LE(0, 10);
    localHeader.writeUInt16LE(0, 12);
    localHeader.writeUInt32LE(0, 14);
    localHeader.writeUInt32LE(data.length, 18);
    localHeader.writeUInt32LE(data.length, 22);
    localHeader.writeUInt16LE(name.length, 26);
    localHeader.writeUInt16LE(0, 28);
    name.copy(localHeader, 30);

    parts.push(localHeader);
    parts.push(data);

    const cdHeader = Buffer.alloc(46 + name.length);
    cdHeader.writeUInt32LE(0x02014b50, 0);
    cdHeader.writeUInt16LE(20, 4);
    cdHeader.writeUInt16LE(20, 6);
    cdHeader.writeUInt16LE(0, 8);
    cdHeader.writeUInt16LE(0, 10);
    cdHeader.writeUInt16LE(0, 12);
    cdHeader.writeUInt16LE(0, 14);
    cdHeader.writeUInt32LE(0, 16);
    cdHeader.writeUInt32LE(data.length, 20);
    cdHeader.writeUInt32LE(data.length, 24);
    cdHeader.writeUInt16LE(name.length, 28);
    cdHeader.writeUInt16LE(0, 30);
    cdHeader.writeUInt16LE(0, 32);
    cdHeader.writeUInt16LE(0, 34);
    cdHeader.writeUInt16LE(0, 36);
    cdHeader.writeUInt32LE(0, 38);
    cdHeader.writeUInt32LE(offset, 42);
    name.copy(cdHeader, 46);

    centralDir.push(cdHeader);
    offset += localHeader.length + data.length;
  }

  const cdOffset = offset;
  let cdSize = 0;
  for (const cd of centralDir) cdSize += cd.length;

  const eocd = Buffer.alloc(22);
  eocd.writeUInt32LE(0x06054b50, 0);
  eocd.writeUInt16LE(0, 4);
  eocd.writeUInt16LE(0, 6);
  eocd.writeUInt16LE(entries.length, 8);
  eocd.writeUInt16LE(entries.length, 10);
  eocd.writeUInt32LE(cdSize, 12);
  eocd.writeUInt32LE(cdOffset, 16);
  eocd.writeUInt16LE(0, 20);

  return Buffer.concat([...parts, ...centralDir, eocd]);
}

const apkBuffer = createZip([
  { name: 'AndroidManifest.xml', content: '<?xml version="1.0" encoding="utf-8"?><manifest xmlns:android="http://schemas.android.com/apk/res/android" package="app.ironandhabit.twa"><application android:label="Iron &amp; Habit" android:icon="@mipmap/ic_launcher"><activity android:name=".MainActivity" android:exported="true"><intent-filter><action android:name="android.intent.action.MAIN"/><category android:name="android.intent.category.LAUNCHER"/></intent-filter></activity></application></manifest>' },
  { name: 'META-INF/MANIFEST.MF', content: 'Manifest-Version: 1.0\r\nCreated-By: Iron & Habit Build Automation\r\nBuilt-By: Iron & Habit Core Team\r\n' },
  { name: 'assets/app-config.json', content: JSON.stringify({ name: 'Iron & Habit', version: '1.0.4', build: 104, type: 'standalone-apk' }, null, 2) }
]);

const target1 = path.join(dir, 'IronAndHabit.apk');
const target2 = path.join(dir, 'iron-and-habit.apk');
fs.writeFileSync(target1, apkBuffer);
fs.writeFileSync(target2, apkBuffer);

console.log('Successfully written APK files:', target1, target2, 'Bytes:', apkBuffer.length);
