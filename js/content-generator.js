(function(){
  window.TS=window.TS||{};
  const levelRank={easy:0,normal:1,hard:2};
  function random(list){return list[Math.floor(Math.random()*list.length)];}
  function recent(){return window.TS.Storage.get().recentContent||[];}
  function markRecent(ids){const s=window.TS.Storage.get();s.recentContent=(s.recentContent||[]).concat(ids).slice(-30);window.TS.Storage.save();}
  function chooseUnique(items,count){const old=recent();let pool=items.filter(x=>!old.includes(x.id));if(pool.length<count)pool=items.slice();const chosen=[];while(pool.length&&chosen.length<count){const item=random(pool);chosen.push(item);pool=pool.filter(x=>x.id!==item.id);}return chosen;}
  function levelPool(items,level){const target=levelRank[level]??1;let direct=items.filter(x=>x.level===level);if(direct.length)return direct;return items.slice().sort((a,b)=>Math.abs(levelRank[a.level]-target)-Math.abs(levelRank[b.level]-target));}
  function matchesTopic(item,topic){return !topic||topic==='All topics'||item.topic===topic||item.topic==='General';}
  function vocabularyFallback(level){const v=window.TS_DATA.vocabulary;const s=random(v.subjects),verb=random(v.verbs),obj=random(v.objects),place=random(v.places);const pattern=random(['{subject} can {verb} {object} {place}.','Every learner should {verb} {object} {place}.','A careful team can {verb} {object} {place}.']);return pattern.replace('{subject}',s).replace('{verb}',verb).replace('{object}',obj).replace('{place}',place);}
  function generate(config){config=config||{};const type=config.contentType||'sentences',level=config.difficulty||'normal',topic=config.topic||'All topics',length=config.length||'medium';let text='',contentIds=[];
    if(type==='code'){const language=config.language||'JavaScript';const snippets=(window.TS_DATA.codeSnippets[language]||window.TS_DATA.codeSnippets.JavaScript);const pool=levelPool(snippets,level);const picked=chooseUnique(pool,1)[0]||random(snippets);text=picked.text;contentIds=[picked.id];}
    else if(type==='paragraphs'){let pool=window.TS_DATA.paragraphs.filter(p=>matchesTopic(p,topic));pool=levelPool(pool,level);const count=length==='long'?2:1;const picks=chooseUnique(pool,count);if(!picks.length) picks=[random(window.TS_DATA.paragraphs)];contentIds=picks.map(p=>p.id);if(length==='short'){const sentences=picks[0].text.match(/[^.!?]+[.!?]+|[^.!?]+$/g)||[picks[0].text];text=sentences.slice(0,2).join(' ').trim();}else text=picks.map(p=>p.text).join(' ');}
    else {let pool=window.TS_DATA.sentenceTemplates.filter(p=>matchesTopic(p,topic));pool=levelPool(pool,level);const count=length==='short'?1:length==='long'?4:2;const picks=chooseUnique(pool,count);if(!picks.length){text=vocabularyFallback(level);contentIds=['vocabulary-'+Date.now()];}else{const sentenceList=picks.map(p=>p.text);if(length!=='short'&&sentenceList.length<count)sentenceList.push(vocabularyFallback(level));text=sentenceList.join(' ');contentIds=picks.map(p=>p.id);}}
    markRecent(contentIds);return {text:text,ids:contentIds,type:type,language:config.language||'English',topic:topic,difficulty:level,length:length};
  }
  function sample(){return 'A clear goal makes it easier to begin. Small steps can build a strong habit over time.';}
  window.TS.ContentGenerator={generate:generate,sample:sample,vocabularyFallback:vocabularyFallback};
})();