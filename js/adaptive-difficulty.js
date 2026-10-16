(function(){
  window.TS=window.TS||{};
  const ranks=['easy','normal','hard'];
  function recommend(sessions,contentType){const recent=(sessions||[]).filter(s=>s&&s.type===(contentType||'sentences')).slice(-5);if(recent.length<3)return 'normal';const last=recent.slice(-3),avgAccuracy=last.reduce((n,s)=>n+s.accuracy,0)/last.length,avgWpm=last.reduce((n,s)=>n+s.wpm,0)/last.length;const threshold=contentType==='code'?24:contentType==='paragraphs'?29:34;
    if(avgAccuracy<88||last.filter(s=>s.accuracy<85).length>=2)return 'easy';
    if(avgAccuracy>=97&&avgWpm>=threshold+8&&last.every(s=>s.progress>=70))return 'hard';
    if(avgAccuracy>=94&&avgWpm>=threshold)return 'normal';
    if(avgAccuracy<92)return 'easy';return 'normal';}
  function nextAfter(result,sessions){const all=(sessions||[]).filter(s=>s.type===result.type).slice(-4);all.push(result);return recommend(all,result.type);}
  function label(level){return ({easy:'Easy',normal:'Normal',hard:'Hard'})[level]||'Normal';}
  window.TS.Adaptive={recommend:recommend,nextAfter:nextAfter,label:label,ranks:ranks};
})();