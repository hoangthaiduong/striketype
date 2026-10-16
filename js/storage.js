(function(){
  window.TS=window.TS||{};
  const KEY='typestrike:local-data';
  let memoryState=null, persistent=true;
  function defaults(){return {version:1,profile:{xp:0,currentStreak:0,longestStreak:0,lastPracticeDate:null},settings:{focusMode:true,adaptiveDifficulty:true,defaultDuration:'60',defaultContentType:'sentences',sound:true,volume:35,backgroundMusic:true,backgroundMusicVolume:15,backgroundMusicSettingsVersion:2,fontSize:22,reducedMotion:false},sessions:[],battles:[],questDays:{},unlockedBadges:[],recentContent:[],playerName:'Player'};}
  function safeNumber(n,fallback){return Number.isFinite(Number(n))?Number(n):fallback;}
  function normalize(input){
    const base=defaults(); if(!input||typeof input!=='object') return base;
    const profile=input.profile&&typeof input.profile==='object'?input.profile:{};
    const settings=input.settings&&typeof input.settings==='object'?input.settings:{};
    const clean={version:1,profile:{xp:Math.max(0,safeNumber(profile.xp,0)),currentStreak:Math.max(0,safeNumber(profile.currentStreak,0)),longestStreak:Math.max(0,safeNumber(profile.longestStreak,0)),lastPracticeDate:typeof profile.lastPracticeDate==='string'?profile.lastPracticeDate:null},settings:Object.assign({},base.settings,settings),sessions:Array.isArray(input.sessions)?input.sessions.filter(isSession).slice(-2000):[],battles:Array.isArray(input.battles)?input.battles.filter(isBattle).slice(-1000):[],questDays:input.questDays&&typeof input.questDays==='object'&&!Array.isArray(input.questDays)?input.questDays:{},unlockedBadges:Array.isArray(input.unlockedBadges)?input.unlockedBadges.filter(x=>x&&typeof x.id==='string'&&typeof x.month==='string') :[],recentContent:Array.isArray(input.recentContent)?input.recentContent.filter(x=>typeof x==='string').slice(-80):[],playerName:typeof input.playerName==='string'?input.playerName.slice(0,32):'Player'};
    clean.settings.focusMode=clean.settings.focusMode!==false;clean.settings.adaptiveDifficulty=clean.settings.adaptiveDifficulty!==false;clean.settings.sound=clean.settings.sound!==false;clean.settings.volume=Math.max(0,Math.min(100,safeNumber(clean.settings.volume,35)));
    // One-time migration: old versions defaulted background music OFF at 25% volume.
    // Apply the new requested defaults once, then preserve future user choices.
    const musicSettingsVersion=safeNumber(settings.backgroundMusicSettingsVersion,0);
    if(musicSettingsVersion<2){clean.settings.backgroundMusic=true;clean.settings.backgroundMusicVolume=safeNumber(settings.backgroundMusicVolume,25)===25?15:Math.max(0,Math.min(100,safeNumber(settings.backgroundMusicVolume,15)));clean.settings.backgroundMusicSettingsVersion=2;}
    clean.settings.backgroundMusic=clean.settings.backgroundMusic!==false;clean.settings.backgroundMusicVolume=Math.max(0,Math.min(100,safeNumber(clean.settings.backgroundMusicVolume,15)));clean.settings.backgroundMusicSettingsVersion=2;clean.settings.fontSize=Math.max(16,Math.min(32,safeNumber(clean.settings.fontSize,22)));clean.settings.defaultDuration=['30','60','120','unlimited'].includes(String(clean.settings.defaultDuration))?String(clean.settings.defaultDuration):'60';clean.settings.defaultContentType=['sentences','paragraphs','code'].includes(clean.settings.defaultContentType)?clean.settings.defaultContentType:'sentences';
    Object.keys(clean.questDays).forEach(k=>{if(!/^\d{4}-\d{2}-\d{2}$/.test(k)||!Array.isArray(clean.questDays[k])) delete clean.questDays[k];else clean.questDays[k]=clean.questDays[k].filter(q=>q&&typeof q.id==='string').map(q=>({id:q.id,progress:Math.max(0,safeNumber(q.progress,0)),target:Math.max(1,safeNumber(q.target,1)),completed:!!q.completed,completedAt:typeof q.completedAt==='string'?q.completedAt:null,bonusCompleted:!!q.bonusCompleted}));});
    return clean;
  }
  function isSession(x){return !!x&&typeof x==='object'&&typeof x.id==='string'&&Number.isFinite(Number(x.wpm))&&Number.isFinite(Number(x.accuracy))&&typeof x.date==='string';}
  function isBattle(x){return !!x&&typeof x==='object'&&typeof x.id==='string'&&typeof x.date==='string'&&['win','loss','draw'].includes(x.outcome);}
  function load(){try{const raw=window.localStorage.getItem(KEY);if(raw){const parsed=JSON.parse(raw);const musicNeedsMigration=!parsed||!parsed.settings||safeNumber(parsed.settings.backgroundMusicSettingsVersion,0)<2;memoryState=normalize(parsed);persistent=true;if(musicNeedsMigration)save();}else{memoryState=defaults();persistent=true;}return memoryState;}catch(e){persistent=false;if(!memoryState)memoryState=defaults();return memoryState;}}
  function get(){if(!memoryState) return load();return memoryState;}
  function save(){if(!memoryState)memoryState=defaults();try{window.localStorage.setItem(KEY,JSON.stringify(memoryState));persistent=true;}catch(e){persistent=false;}return persistent;}
  function reset(){memoryState=defaults();try{window.localStorage.removeItem(KEY);persistent=true;}catch(e){persistent=false;}save();return memoryState;}
  function importObject(obj){if(!obj||typeof obj!=='object'||Array.isArray(obj)||![1].includes(Number(obj.version)))throw new Error('This file is not a supported TypeStrike backup.');if(!Array.isArray(obj.sessions)||!Array.isArray(obj.battles)||!obj.profile||typeof obj.profile!=='object')throw new Error('The backup is missing required data.');memoryState=normalize(obj);save();return memoryState;}
  function getLevelInfo(totalXp){let xp=Math.max(0,Math.floor(safeNumber(totalXp,0))),level=1,spent=0,need=100;while(xp-spent>=need&&level<999){spent+=need;level++;need=100+(level-1)*50;}return {level,xpInLevel:xp-spent,xpForNext:need,progress:Math.min(100,((xp-spent)/need)*100),totalXp:xp};}
  function todayKey(date){const d=date||new Date();return [d.getFullYear(),String(d.getMonth()+1).padStart(2,'0'),String(d.getDate()).padStart(2,'0')].join('-');}
  function monthKey(date){const d=date||new Date();return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0');}
  window.TS.Storage={key:KEY,defaults:defaults,normalize:normalize,get:get,save:save,reset:reset,load:load,importObject:importObject,isPersistent:()=>persistent,getLevelInfo:getLevelInfo,todayKey:todayKey,monthKey:monthKey};
})();