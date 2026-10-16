(function () {
  window.TS = window.TS || {};

  function dayKey() { return window.TS.Storage.todayKey(); }
  function hash(str) {
    let h = 2166136261;
    for (let i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = Math.imul(h, 16777619); }
    return h >>> 0;
  }
  function chooseForDay(date) {
    const all = window.TS_DATA.questConfig.slice();
    let seed = hash(date), pool = all.slice(), out = [];
    while (pool.length && out.length < 5) {
      seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
      const idx = seed % pool.length;
      out.push(pool.splice(idx, 1)[0]);
    }
    return out;
  }
  function freshRecords(date) {
    return chooseForDay(date).map(q => ({
      id: q.id, progress: 0, target: q.target, completed: false,
      completedAt: null, bonusCompleted: false
    }));
  }
  function ensureDay(state, date) {
    if (!Array.isArray(state.questDays[date])) state.questDays[date] = freshRecords(date);
    return state.questDays[date];
  }
  function ensureToday() {
    const state = window.TS.Storage.get(), date = dayKey();
    ensureDay(state, date);
    window.TS.Storage.save();
    return state.questDays[date];
  }
  function getToday() {
    const records = ensureToday();
    return records.map(r => Object.assign({}, window.TS_DATA.questConfig.find(q => q.id === r.id) || {}, r));
  }

  function countCompletedInMonth(month) {
    const state = window.TS.Storage.get();
    let count = 0;
    Object.keys(state.questDays).forEach(day => {
      if (day.slice(0, 7) === month) count += (state.questDays[day] || []).filter(q => q.completed).length;
    });
    return count;
  }
  function countBonusCompletionsInMonth(month) {
    const state = window.TS.Storage.get();
    let count = 0;
    Object.keys(state.questDays).forEach(day => {
      if (day.slice(0, 7) === month) count += (state.questDays[day] || []).filter(q => q.completed && q.bonusCompleted).length;
    });
    return count;
  }
  function completedTotal() {
    const state = window.TS.Storage.get();
    return Object.values(state.questDays).reduce((n, arr) => n + (Array.isArray(arr) ? arr.filter(q => q.completed).length : 0), 0);
  }

  /* Mark real, date-specific daily quest records complete ahead of time. These
     entries grant no extra daily-quest XP; the badge reward itself is the gift. */
  function grantBonusCompletions(month, requestedCount) {
    if (typeof month !== 'string' || !/^\d{4}-(0[1-9]|1[0-2])$/.test(month)) throw new Error('Invalid bonus month.');
    const count = Math.max(0, Math.min(25, Math.floor(Number(requestedCount) || 0)));
    if (!count) return 0;
    const [year, monthNumber] = month.split('-').map(Number);
    const daysInMonth = new Date(year, monthNumber, 0).getDate();
    const state = window.TS.Storage.get();
    const candidates = [];

    for (let day = 1; day <= daysInMonth; day++) {
      const date = year + '-' + String(monthNumber).padStart(2, '0') + '-' + String(day).padStart(2, '0');
      const records = ensureDay(state, date);
      records.forEach(record => {
        if (record && typeof record.id === 'string' && !record.completed && window.TS_DATA.questConfig.some(q => q.id === record.id)) {
          candidates.push(record);
        }
      });
    }

    // Shuffle the available future quests, so bonus completions are spread
    // across the month rather than always appearing on its first few days.
    for (let i = candidates.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [candidates[i], candidates[j]] = [candidates[j], candidates[i]];
    }
    const granted = Math.min(count, candidates.length);
    const timestamp = new Date().toISOString();
    candidates.slice(0, granted).forEach(record => {
      record.progress = record.target;
      record.completed = true;
      record.completedAt = timestamp;
      record.bonusCompleted = true;
    });
    window.TS.Storage.save();
    return granted;
  }

  function progress(id, value, mode) {
    const state = window.TS.Storage.get(), date = dayKey(), records = ensureToday();
    let changed = false;
    records.forEach(record => {
      if (record.id !== id || record.completed) return;
      const def = window.TS_DATA.questConfig.find(q => q.id === id);
      if (!def) return;
      let next = record.progress;
      if (mode === 'max') next = Math.max(next, Number(value) || 0);
      else next += Number(value) || 0;
      next = Math.min(def.target, next);
      if (next !== record.progress) { record.progress = next; changed = true; }
      if (record.progress >= def.target && !record.completed) {
        record.completed = true;
        record.completedAt = new Date().toISOString();
        record.bonusCompleted = false;
        changed = true;
        state.profile.xp += def.xp;
        const completedCount = countCompletedInMonth(date.slice(0, 7));
        if (window.TS.Achievements) window.TS.Achievements.check(date.slice(0, 7), completedCount);
        window.TS.UI.toast('Quest complete!', def.title + ' · +' + def.xp + ' XP', 'success');
      }
    });
    if (changed) window.TS.Storage.save();
    return changed;
  }

  function updateForSession(session) {
    const records = getToday();
    const sessionsQ = records.find(q => q.type === 'sessions');
    if (sessionsQ) progress(sessionsQ.id, 1, 'add');
    const wpm = records.find(q => q.type === 'wpm');
    if (wpm) progress(wpm.id, session.wpm, 'max');
    const accuracy = records.find(q => q.type === 'accuracy');
    if (accuracy) progress(accuracy.id, session.accuracy, 'max');
    const code = records.find(q => q.type === 'code');
    if (code && session.type === 'code') progress(code.id, 1, 'add');
    const minutes = records.find(q => q.type === 'minutes');
    if (minutes) progress(minutes.id, session.elapsedSeconds, 'add');
    window.TS.Storage.save();
  }
  function updateForBattle(battle) {
    const quest = getToday().find(q => q.type === 'battle');
    if (quest) progress(quest.id, 1, 'add');
    window.TS.Storage.save();
  }
  function getNavCount() { return getToday().filter(x => !x.completed).length; }

  window.TS.DailyQuests = {
    ensureToday: ensureToday,
    getToday: getToday,
    updateForSession: updateForSession,
    updateForBattle: updateForBattle,
    countCompletedInMonth: countCompletedInMonth,
    countBonusCompletionsInMonth: countBonusCompletionsInMonth,
    grantBonusCompletions: grantBonusCompletions,
    completedTotal: completedTotal,
    getNavCount: getNavCount
  };
})();
