#!/usr/bin/env python3
from pathlib import Path
import argparse, json, re, subprocess, hashlib, os

GROUP1_FILES = [
  'constitution/MBW_GOLDEN_GLOBAL_CONSTITUTION_V2_LOCK.json',
  'constitution/MBW_GOLDEN_GLOBAL_CONSTITUTION_V2_LOCK.md',
  'App.js','index.js','app.json','eas.json','package.json','package-lock.json',
  'app/golden/MBWGoldenMasterScreens.js','app/golden/MBWGoldenMasterStore.js',
  'app/golden/MBWGoldenMasterNavigator.js','app/golden/MBWGoldenMasterRegistry.js',
  'app/golden/MBWOneVisualSurface.js','app/golden/MBWReleaseContracts.js',
  'app/production/MBWProductionConfig.js','app/production/MBWSupabaseClient.js',
  'app/production/MBWProductionRepository.js','app/production/MBWProductionProvider.js',
  'app/production/MBWProductionErrorBoundary.js','app/production/MBWBillingClient.js',
  'backend/supabase/migrations/202607190001_mbw_golden_global_core.sql',
  'backend/supabase/functions/bootstrap/index.ts','backend/supabase/functions/billing-verify/index.ts',
  'backend/supabase/functions/sovereign-exchange/index.ts',
  'android/gradle.properties','android/app/src/main/AndroidManifest.xml','android/app/proguard-rules.pro',
  '.easignore'
]

BANNED_ACTIVE = [
  'APK CERTIFICATION','NO PAYMENT SETTLEMENT CLAIM','TIER_SELECTED_FOR_CERTIFICATION',
  'LOCAL_CERTIFICATION_ONLY','ORDERED_CERTIFICATION_NO_SETTLEMENT_CLAIM',
  'RESERVED_CERTIFICATION_NO_CONTRACT','MBW_GATE_HASHES',
]

ACTIVE_TEXT_FILES = [
  'App.js','index.js','app.json','eas.json','package.json',
  'app/golden/MBWGoldenMasterScreens.js','app/golden/MBWGoldenMasterStore.js',
  'app/golden/MBWReleaseContracts.js','app/production/MBWProductionConfig.js',
  'app/production/MBWProductionProvider.js','app/production/MBWBillingClient.js',
]

PARSE_FILES = [
  'App.js','index.js','app/golden/MBWGoldenMasterScreens.js',
  'app/golden/MBWGoldenMasterStore.js','app/golden/MBWGoldenMasterNavigator.js',
  'app/golden/MBWGoldenMasterRegistry.js','app/golden/MBWOneVisualSurface.js',
  'app/golden/MBWReleaseContracts.js','app/production/MBWProductionConfig.js',
  'app/production/MBWSupabaseClient.js','app/production/MBWProductionRepository.js',
  'app/production/MBWProductionProvider.js','app/production/MBWProductionErrorBoundary.js',
  'app/production/MBWBillingClient.js',
]

ROUTES = [
'CinematicIntro','GateLocked','GateOpen','PathSelection','SubscriptionSignup','MainHub',
'MasterOfLife','Matchmaking','Games','MasterOfGames','MasterOfCoins','TravelLocal',
'TravelOverseas','Merchandise','Kamashastra','LiveLounge','MensLounge','Nearby',
'AIPoster','Settings','ProfilePoster','MatchChat','GameRoom','TravelBooking',
'CommerceReceipt','Privacy','Terms','Safety','AccountControl','SeedProfile','Consent'
]

MAIN_LABELS = [
'MASTER OF LIFE','MATCHMAKING','MASTER OF GAMES','MASTER OF COINS','TRAVEL LOCAL',
'TRAVEL OVERSEAS','MERCHANDISE','KAMASHASTRA','LIVE LOUNGE','MEN’S LOUNGE',
'NEARBY','AI POSTER','SETTINGS'
]

def resolve_relative(source: Path, spec: str):
    base=(source.parent/spec).resolve()
    candidates=[base]
    for ext in ['.js','.jsx','.ts','.tsx','.json']:
        candidates.append(Path(str(base)+ext))
    for ext in ['.js','.jsx','.ts','.tsx','.json']:
        candidates.append(base/f'index{ext}')
    return next((p for p in candidates if p.is_file()), None)

def sha(path: Path):
    h=hashlib.sha256()
    with path.open('rb') as f:
        for chunk in iter(lambda:f.read(1024*1024),b''):h.update(chunk)
    return h.hexdigest()

def main():
    ap=argparse.ArgumentParser(); ap.add_argument('root'); ns=ap.parse_args()
    root=Path(ns.root).resolve()
    findings=[]
    missing=[p for p in GROUP1_FILES if not (root/p).is_file()]

    json_fail=[]
    for rel in ['app.json','eas.json','package.json','package-lock.json','constitution/MBW_GOLDEN_GLOBAL_CONSTITUTION_V2_LOCK.json']:
        try: json.loads((root/rel).read_text())
        except Exception as e: json_fail.append({'file':rel,'error':str(e)})

    parser="const fs=require('fs');const p=require('@babel/parser');const f=process.argv[1];p.parse(fs.readFileSync(f,'utf8'),{sourceType:'unambiguous',plugins:['jsx','typescript','classProperties','classPrivateProperties','classPrivateMethods','decorators-legacy','dynamicImport','topLevelAwait','optionalChaining','nullishCoalescingOperator','objectRestSpread']});"
    parse_fail=[]
    parser_available=subprocess.run(['node','-e',"require('@babel/parser');"],cwd=root,capture_output=True,text=True).returncode==0
    if parser_available:
        for rel in PARSE_FILES:
            proc=subprocess.run(['node','-e',parser,str(root/rel)],cwd=root,capture_output=True,text=True)
            if proc.returncode: parse_fail.append({'file':rel,'error':proc.stderr[-1200:]})
    else:
        parse_fail.append({'file':'@babel/parser','error':'BABEL_PARSER_NOT_AVAILABLE'})

    import_fail=[]
    package=json.loads((root/'package.json').read_text()) if not json_fail else {}
    declared=set(package.get('dependencies',{}))|set(package.get('devDependencies',{}))
    import_re=re.compile(r"(?:from\s+|require\()\s*['\"]([^'\"]+)['\"]")
    for rel in PARSE_FILES:
        p=root/rel
        if not p.is_file():continue
        text=p.read_text(errors='replace')
        for spec in import_re.findall(text):
            if spec.startswith('.'):
                if not resolve_relative(p,spec):import_fail.append({'file':rel,'import':spec,'reason':'RELATIVE_TARGET_MISSING'})
            else:
                top='/'.join(spec.split('/')[:2]) if spec.startswith('@') else spec.split('/')[0]
                if top not in declared and top not in {'react','react-native'}:
                    import_fail.append({'file':rel,'import':spec,'reason':'PACKAGE_NOT_DECLARED'})

    active='\n'.join((root/p).read_text(errors='replace') for p in ACTIVE_TEXT_FILES if (root/p).is_file())
    banned_hits=[x for x in BANNED_ACTIVE if x in active]

    screens=(root/'app/golden/MBWGoldenMasterScreens.js').read_text(errors='replace')
    store=(root/'app/golden/MBWGoldenMasterStore.js').read_text(errors='replace')
    nav=(root/'app/golden/MBWGoldenMasterNavigator.js').read_text(errors='replace')
    registry=(root/'app/golden/MBWGoldenMasterRegistry.js').read_text(errors='replace')
    contracts=(root/'app/golden/MBWReleaseContracts.js').read_text(errors='replace')
    app=(root/'App.js').read_text(errors='replace')
    index=(root/'index.js').read_text(errors='replace')
    props=(root/'android/gradle.properties').read_text(errors='replace')
    eas=json.loads((root/'eas.json').read_text()) if not json_fail else {}
    appjson=json.loads((root/'app.json').read_text()) if not json_fail else {}
    lock=json.loads((root/'package-lock.json').read_text()) if not json_fail else {}

    duplicate_exports={}
    for name in ['GateLockedScreen','SubscriptionSignupScreen','GateOpenScreen','PathSelectionScreen','MainHubScreen']:
        count=len(re.findall(rf'export\s+function\s+{name}\s*\(',screens))
        if count!=1:duplicate_exports[name]=count

    route_missing=[r for r in ROUTES if r not in nav or r not in registry]
    main_missing=[label for label in MAIN_LABELS if label not in contracts and label not in registry]

    action_issues=[]
    if parser_available:
        action_script=r'''const fs=require('fs');const p=require('@babel/parser');const ast=p.parse(fs.readFileSync(process.argv[1],'utf8'),{sourceType:'unambiguous',plugins:['jsx','typescript','classProperties','classPrivateProperties','classPrivateMethods','decorators-legacy','dynamicImport','topLevelAwait','optionalChaining','nullishCoalescingOperator','objectRestSpread']});const out=[];function walk(n){if(!n||typeof n!=='object')return;if(n.type==='JSXOpeningElement'&&n.name&&n.name.type==='JSXIdentifier'&&n.name.name==='MBWActionButton'){const names=new Set((n.attributes||[]).filter(a=>a.type==='JSXAttribute'&&a.name).map(a=>a.name.name));if(!names.has('onPress')&&!names.has('disabled'))out.push({line:n.loc?.start?.line||0,attributes:[...names]});}for(const v of Object.values(n)){if(Array.isArray(v))v.forEach(walk);else if(v&&typeof v==='object')walk(v);}}walk(ast);console.log(JSON.stringify(out));'''
        proc=subprocess.run(['node','-e',action_script,str(root/'app/golden/MBWGoldenMasterScreens.js')],cwd=root,capture_output=True,text=True)
        if proc.returncode:
            action_issues=[{'line':0,'fragment':proc.stderr[-500:]}]
        else:
            try: action_issues=json.loads(proc.stdout or '[]')
            except Exception as e: action_issues=[{'line':0,'fragment':f'ACTION_JSON:{e}'}]

    deps=package.get('dependencies',{})
    lock_packages=lock.get('packages',{}) if isinstance(lock,dict) else {}
    dependency_checks={
      'supabase':deps.get('@supabase/supabase-js')=='2.84.0',
      'polyfill':deps.get('react-native-url-polyfill')=='3.0.0',
      'expo_iap':deps.get('expo-iap')=='4.5.2',
      'react_native_iap_absent':'react-native-iap' not in deps,
      'nitro_absent':'react-native-nitro-modules' not in deps,
      'lock_supabase':'node_modules/@supabase/supabase-js' in lock_packages,
      'lock_expo_iap':'node_modules/expo-iap' in lock_packages,
    }

    plugins=appjson.get('expo',{}).get('plugins',[]) if appjson else []
    plugin_names=[p if isinstance(p,str) else p[0] for p in plugins]
    blocked=appjson.get('expo',{}).get('android',{}).get('blockedPermissions',[]) if appjson else []

    checks={
      'group1_files_complete':not missing,
      'json_green':not json_fail,
      'babel_parse_green':not parse_fail,
      'imports_green':not import_fail,
      'active_preview_residue_absent':not banned_hits,
      'critical_export_owners_exact':not duplicate_exports,
      'public_visual_gate_present':"value.toUpperCase() === 'ONLYONEGOD'" in screens and "navigation.replace('GateOpen')" in screens,
      'server_sovereign_only':'production.sovereignAccess(value)' in screens and "case 'SOVEREIGN_ACCESS':" not in store and 'MBW_GATE_HASHES' not in store,
      'direct_whatsapp_profile':'placeholder="WHATSAPP NUMBER"' in screens and 'label="CREATE PROFILE"' in screens,
      'remote_entitlement_required':"['ACTIVE', 'GRACE', 'SOVEREIGN'].includes(state.subscription.status)" in screens,
      'profile_visual_obstruction_absent':'accessibilityLabel="Profile visual"' not in screens,
      'production_provider_installed':'<MBWProductionProvider>' in app and '<MBWProductionErrorBoundary>' in app,
      'url_polyfill_installed':"react-native-url-polyfill/auto" in index,
      'runtime_status_not_faked':'mbwProductionConfigStatus().status' in contracts,
      'routes_31':not route_missing,
      'mainhub_13':not main_missing,
      'button_handlers_green':not action_issues,
      'hermes':appjson.get('expo',{}).get('jsEngine')=='hermes',
      'new_arch_proved_false':appjson.get('expo',{}).get('newArchEnabled') is False,
      'four_abis':'reactNativeArchitectures=arm64-v8a,armeabi-v7a,x86,x86_64' in props,
      'r8_enabled':'android.enableMinifyInReleaseBuilds=true' in props,
      'shrink_enabled':'android.enableShrinkResourcesInReleaseBuilds=true' in props,
      'apk_profile':eas.get('build',{}).get('golden-apk',{}).get('android',{}).get('buildType')=='apk',
      'aab_profile':eas.get('build',{}).get('play-aab',{}).get('android',{}).get('buildType')=='app-bundle',
      'expo_iap_plugin':'expo-iap' in plugin_names,
      'camera_still_deferred':'android.permission.CAMERA' in blocked,
      'microphone_still_deferred':'android.permission.RECORD_AUDIO' in blocked,
      'dependency_manifest_green':all(dependency_checks.values()),
    }
    green=all(checks.values())
    report={
      'court':'MBW_GROUP_1_GOLDEN_FOUNDATION_V2',
      'group_definition':'00-05: artifact contract, boot/recovery, cinematic entry, identity/access, MainHub, visual driver source foundation',
      'checks':checks,
      'dependency_checks':dependency_checks,
      'missing_files':missing,
      'json_failures':json_fail,
      'parse_failures':parse_fail,
      'import_failures':import_fail,
      'banned_active_hits':banned_hits,
      'duplicate_exports':duplicate_exports,
      'route_missing':route_missing,
      'mainhub_missing':main_missing,
      'button_action_issues':action_issues,
      'group1_established':green,
      'build_executed':False,
      'commit_executed':False,
      'final':'MBW_GROUP_1_GOLDEN_GLOBAL_FOUNDATION_ESTABLISHED' if green else 'MBW_GROUP_1_REVIEW_REQUIRED'
    }
    print(json.dumps(report,indent=2))
    return 0 if green else 111

if __name__=='__main__': raise SystemExit(main())
