(function(){
  window.TS=window.TS||{};
  let enabled=false,mode=null;
  function enable(nextMode){
    enabled=true;mode=nextMode==='battle'?'battle':'practice';
    document.body.classList.remove('session-active-practice','session-active-battle','session-result-practice','session-result-battle');
    document.body.classList.add('focus-mode');
    document.body.classList.toggle('focus-mode-battle',mode==='battle');
    document.body.classList.toggle('focus-mode-practice',mode==='practice');
    document.body.dataset.focusType=mode;
    const toastRegion=document.getElementById('toast-region');
    if(toastRegion)toastRegion.replaceChildren();
    const input=document.getElementById('typing-input');
    if(input)input.focus({preventScroll:true});
    if(window.TS.FocusMode&&typeof window.TS.FocusMode.keepCurrentVisible==='function')window.TS.FocusMode.keepCurrentVisible();
  }
  function disable(silent){
    const was=enabled,previousMode=mode;enabled=false;mode=null;
    document.body.classList.remove('focus-mode','focus-mode-battle','focus-mode-practice','session-active-practice','session-active-battle');
    delete document.body.dataset.focusType;
    if(was&&!silent&&previousMode){
      document.body.classList.add(previousMode==='battle'?'session-active-battle':'session-active-practice');
      if(window.TS.UI)window.TS.UI.toast('Focus Mode off','Your typing progress is unchanged.','info');
    }
  }
  function active(){return enabled;}
  function keepCurrentVisible(){
    if(!enabled)return;
    const area=document.getElementById('typing-text'),cursor=area&&area.querySelector('.char-current');
    if(!area||!cursor)return;
    const bounds=area.getBoundingClientRect(),caret=cursor.getBoundingClientRect(),margin=Math.max(32,bounds.height*.2);
    if(caret.top<bounds.top+margin||caret.bottom>bounds.bottom-margin){
      const userReduced=window.TS.Storage&&window.TS.Storage.get().settings.reducedMotion;
      const systemReduced=window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      const reduced=!!userReduced||!!systemReduced;
      cursor.scrollIntoView({block:'center',inline:'nearest',behavior:reduced?'auto':'smooth'});
    }
  }
  window.TS.FocusMode={enable:enable,disable:disable,active:active,mode:()=>mode,keepCurrentVisible:keepCurrentVisible};
})();
