import React, { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react';
import * as Crypto from 'expo-crypto';
import { MBWProductionRepository } from './MBWProductionRepository';
import { mbwProductionConfigStatus } from './MBWProductionConfig';
import { mbwPurchaseTier, mbwRestorePurchases } from './MBWBillingClient';
import { useMBWGoldenMaster } from './sovereign/MBWGoldenMasterStore';
const Context = createContext(null);
function badge(tier) { return ['444','555'].includes(tier) ? 'MAROON' : tier === '333' ? 'GOLDEN' : 'BLACK'; }
export function MBWProductionProvider({ children }) {
  const { state, dispatch } = useMBWGoldenMaster();
  const [remote, setRemote] = useState({ booting:true,ready:false,session:null,profile:null,entitlement:null,health:null,error:null });
  const booted = useRef(false);
  const syncEntitlement = async () => {
    const entitlement = await MBWProductionRepository.entitlement(); setRemote(old => ({...old,entitlement}));
    if (entitlement && ['ACTIVE','GRACE','SOVEREIGN'].includes(entitlement.state)) dispatch({type:'REMOTE_ENTITLEMENT',tier:entitlement.tier,status:entitlement.state,badge:badge(entitlement.tier),expiresAt:entitlement.expires_at||null});
    else dispatch({type:'REMOTE_ENTITLEMENT_REVOKED',status:entitlement?.state||'NONE'});
    return entitlement;
  };
  useEffect(() => {
    if (booted.current) return; booted.current = true; let live = true;
    (async () => { try { const config=mbwProductionConfigStatus(); if(!config.ready)throw new Error(`PRODUCTION_CONFIG_MISSING:${config.missing.join(',')}`); const health=await MBWProductionRepository.health(); const session=await MBWProductionRepository.ensureSession(); const entitlement=await syncEntitlement(); if(live)setRemote(old=>({...old,booting:false,ready:true,health,session,entitlement,error:null})); } catch(error){ if(live)setRemote(old=>({...old,booting:false,ready:false,error:String(error?.message||error)})); } })();
    return () => { live = false; };
  }, []);
  const api = useMemo(() => ({ ...remote,
    createProfile: async payload => { const data=await MBWProductionRepository.bootstrap(payload); setRemote(old=>({...old,profile:data.profile,entitlement:data.entitlement})); dispatch({type:'REMOTE_PROFILE',profile:data.profile}); return data; },
    acceptLegal: async version => { await MBWProductionRepository.acceptLegal(version); dispatch({type:'REMOTE_LEGAL_ACCEPTED',version}); },
    purchaseTier: async (tier,offerToken) => { const result=await mbwPurchaseTier(tier,offerToken); await syncEntitlement(); return result; },
    restorePurchases: async () => { const result=await mbwRestorePurchases(); await syncEntitlement(); return result; },
    sovereignAccess: async password => { const deviceHash=await Crypto.digestStringAsync(Crypto.CryptoDigestAlgorithm.SHA256,`${state.userSeed.id}:${state.lifecycle.createdAt}`); const result=await MBWProductionRepository.sovereignExchange(password,deviceHash); await syncEntitlement(); return result; },
    repository:MBWProductionRepository,refreshEntitlement:syncEntitlement,
  }), [remote,state.userSeed.id,state.lifecycle.createdAt]);
  return <Context.Provider value={api}>{children}</Context.Provider>;
}
export function useMBWProduction() { const value=useContext(Context); if(!value)throw new Error('MBWProductionProvider missing'); return value; }
