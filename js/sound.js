(function(){
  window.TS=window.TS||{};
  let context=null,lastAt=0;
  function play(kind){const state=window.TS.Storage.get();if(!state.settings.sound||!window.AudioContext&&!window.webkitAudioContext)return;const now=Date.now();if(kind==='key'&&now-lastAt<22)return;lastAt=now;try{const Ctx=window.AudioContext||window.webkitAudioContext;if(!context)context=new Ctx();if(context.state==='suspended')context.resume();const osc=context.createOscillator(),gain=context.createGain(),volume=(state.settings.volume||0)/100;osc.type='sine';osc.frequency.value=kind==='error'?170:kind==='complete'?760:kind==='click'?520:430;gain.gain.setValueAtTime(Math.max(.0001,volume*(kind==='key'?.022:.04)),context.currentTime);gain.gain.exponentialRampToValueAtTime(.0001,context.currentTime+.055);osc.connect(gain);gain.connect(context.destination);osc.start();osc.stop(context.currentTime+.06);}catch(e){/* Sound is optional; blocked audio must not affect practice. */}}
  window.TS.Sound={play:play};
})();