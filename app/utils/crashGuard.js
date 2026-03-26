import * as FileSystem from 'expo-file-system';
import { Alert } from 'react-native'

// eslint-disable-next-line import/namespace
const FILE = (FileSystem.documentDirectory || '') + 'mbw_crashlog.txt';

function write(msg){
  try{
    const line = '[' + new Date().toISOString() + '] ' + msg + '\n';
    FileSystem.readAsStringAsync(FILE)
      .then(old => FileSystem.writeAsStringAsync(FILE, old + line))
      .catch(() => FileSystem.writeAsStringAsync(FILE, line));
  }catch(e){}
}

if (global.ErrorUtils && global.ErrorUtils.setGlobalHandler) {
  global.ErrorUtils.setGlobalHandler((err, isFatal) => {
    const msg = (isFatal ? 'FATAL ' : '') + (err?.stack || err?.message || String(err));
    write(msg);
    try { setTimeout(() => Alert.alert('MBW Crash', 'Crash log saved: mbw_crashlog.txt'), 250); } catch(e) {}
    // Prevent hard-exit for many JS crashes by not rethrowing
  });
}

export async function readCrashLog(){
  try { return await FileSystem.readAsStringAsync(FILE); } catch(e){ return ''; }
}