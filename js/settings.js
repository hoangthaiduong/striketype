(function(){
  window.TS=window.TS||{};
  function get(){return window.TS.Storage.get().settings;}
  function update(key,value){const state=window.TS.Storage.get();if(!(key in state.settings))return;state.settings[key]=value;window.TS.Storage.save();apply();}
  function apply(){const settings=get();document.documentElement.style.setProperty('--practice-font-size',Math.max(16,Math.min(32,Number(settings.fontSize)||22))+'px');document.body.classList.toggle('reduce-motion',!!settings.reducedMotion);if(settings.reducedMotion)document.documentElement.style.scrollBehavior='auto';else document.documentElement.style.scrollBehavior='';if(window.TS.FocusMode&&!window.TS.TypingEngine?.getCurrent())window.TS.FocusMode.disable(true);if(window.TS.BackgroundMusic)window.TS.BackgroundMusic.applySettings();}
  window.TS.Settings={get:get,update:update,apply:apply};
})();