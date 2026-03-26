import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from "react-native"
import manifest from "./routeManifest.json";
export const SAFE_START_ROUTE=manifest.SAFE_START_ROUTE||"GateOpenCinematic";
export const SAFE_HUB_ROUTE=manifest.SAFE_HUB_ROUTE||"HomeHub";
export const KNOWN_ROUTES=new Set(manifest.KNOWN_ROUTES||[]);
const reports=[];
export function secondMamReport(type,payload={}){try{const row={ts:new Date().toISOString(),type,payload};reports.unshift(row);if(reports.length>80)reports.pop();console.log("[2ND_MAM]",JSON.stringify(row));}catch{}}
export function getSecondMamReports(){return reports;}
export function sanitizeRoute(name){return KNOWN_ROUTES.has(name)?name:SAFE_HUB_ROUTE;}
export function secondMamSelfHeal(navigation,routeName,params={}){const resolved=sanitizeRoute(routeName);secondMamReport("route_self_heal",{requested:routeName,resolved,params});if(navigation?.navigate)navigation.navigate('resolved');return resolved;}
export class SecondMAMBoundary extends React.Component{
  constructor(props){super(props);this.state={hasError:false,message:""};}
  static getDerivedStateFromError(error){return{hasError:true,message:String(error?.message||error||"Unknown error")};}
  componentDidCatch(error,info){secondMamReport("render_error",{message:String(error?.message||error||"Unknown error"),stack:String(error?.stack||""),componentStack:String(info?.componentStack||"")});}
  reset=()=>this.setState({hasError:false,message:""});
  render(){if(this.state.hasError){return <ScrollView contentContainerStyle={s.wrap}><Text style={s.k}>2ND MAM ACTIVE</Text><Text style={s.t}>SAFE FALLBACK ENGAGED</Text><Text style={s.m}>{this.state.message}</Text><TouchableOpacity style={s.b} onPress={this.reset}><Text style={s.bt}>TRY CLEAN RETURN</Text></TouchableOpacity></ScrollView>;} return this.props.children;}
}
const s=StyleSheet.create({wrap:{flexGrow:1,backgroundColor:"#000",justifyContent:"center",alignItems:"center",padding:28},k:{color:"#D4AF37",fontSize:14,letterSpacing:2,textAlign:"center",marginBottom:8},t:{color:"#fff",fontSize:26,fontWeight:"800",textAlign:"center",marginBottom:12},m:{color:"#F4E7BF",fontSize:12,textAlign:"center",marginBottom:18},b:{backgroundColor:"#D4AF37",borderRadius:16,paddingVertical:14,paddingHorizontal:22},bt:{color:"#111",fontWeight:"800",letterSpacing:0.6}});