(function () {
  window.TS = window.TS || {};

  /*
   * One limited badge is available per calendar month. Unlocking it rolls one
   * generous reward: 150–250 XP, or 10–25 daily quests pre-completed in the
   * following month. Missed badges are never added to the collection.
   */
  const monthlyThemes = [
    { key: 'fresh-start', name: 'Fresh Start Spark', icon: 'sparkles', level: 'blue', threshold: 24, description: 'Build momentum at the start of the year and collect a limited monthly badge.' },
    { key: 'steady-heart', name: 'Steady Heart', icon: 'target', level: 'rose', threshold: 26, description: 'Show up consistently and make small wins count toward a limited monthly badge.' },
    { key: 'spring-striker', name: 'Spring Striker', icon: 'zap', level: 'purple', threshold: 28, description: 'Keep your practice blooming with regular, focused sessions.' },
    { key: 'precision-bloom', name: 'Precision Bloom', icon: 'target', level: 'green', threshold: 30, description: 'Grow accuracy through a steady practice routine.' },
    { key: 'momentum-medal', name: 'Momentum Medal', icon: 'medal', level: 'amber', threshold: 32, description: 'Keep your momentum alive by turning daily goals into real progress.' },
    { key: 'summer-sprint', name: 'Summer Sprint', icon: 'gauge', level: 'blue', threshold: 34, description: 'Keep moving toward your personal best with a little practice every day.' },
    { key: 'focus-flame', name: 'Focus Flame', icon: 'flame', level: 'rose', threshold: 36, description: 'Protect your focus and build a stronger typing habit.' },
    { key: 'back-to-school', name: 'Back-to-School Ace', icon: 'book-open', level: 'purple', threshold: 38, description: 'Make learning part of your routine and collect a seasonal badge.' },
    { key: 'skill-builder', name: 'Skill Builder', icon: 'keyboard', level: 'teal', threshold: 40, description: 'Stack up small wins and turn them into lasting skill.' },
    { key: 'autumn-aim', name: 'Autumn Aim', icon: 'target', level: 'amber', threshold: 42, description: 'Stay on target and keep your routine moving through the season.' },
    { key: 'consistency-crown', name: 'Consistency Crown', icon: 'crown', level: 'purple', threshold: 44, description: 'Let consistency lead the way toward a lasting milestone.' },
    { key: 'year-end-champion', name: 'Year-End Champion', icon: 'trophy', level: 'amber', threshold: 46, description: 'Finish the year with purpose and celebrate your consistency.' }
  ];

  const rewardRules = { xpMin: 150, xpMax: 250, questMin: 10, questMax: 25 };

  // Older achievements remain visible in the library when upgrading existing saves.
  const legacyBadges = {
    bronze: { name: 'Bronze Finisher', icon: 'medal', level: 'bronze', threshold: 30 },
    silver: { name: 'Silver Achiever', icon: 'medal', level: 'silver', threshold: 60 },
    gold: { name: 'Gold Champion', icon: 'trophy', level: 'gold', threshold: 100 }
  };

  function currentMonthKey() { return window.TS.Storage.monthKey(); }
  function validMonthKey(month) { return typeof month === 'string' && /^\d{4}-(0[1-9]|1[0-2])$/.test(month); }
  function formatMonth(month) {
    const key = validMonthKey(month) ? month : currentMonthKey();
    const parts = key.split('-').map(Number);
    return new Date(parts[0], parts[1] - 1, 1).toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  }
  function offsetMonth(month, offset) {
    const key = validMonthKey(month) ? month : currentMonthKey();
    const parts = key.split('-').map(Number);
    const date = new Date(parts[0], parts[1] - 1 + offset, 1);
    return date.getFullYear() + '-' + String(date.getMonth() + 1).padStart(2, '0');
  }
  function randomInt(min, max) { return min + Math.floor(Math.random() * (max - min + 1)); }

  function getBadgeForMonth(month) {
    const key = validMonthKey(month) ? month : currentMonthKey();
    const theme = monthlyThemes[Number(key.slice(5, 7)) - 1];
    return Object.assign({}, theme, rewardRules, {
      id: 'monthly-' + key,
      month: key,
      monthLabel: formatMonth(key),
      reward: rewardRules.xpMin,
      rewardXpMin: rewardRules.xpMin,
      rewardXpMax: rewardRules.xpMax,
      bonusQuestMin: rewardRules.questMin,
      bonusQuestMax: rewardRules.questMax,
      rewardPreview: '150–250 XP or 10–25 daily quests completed ahead next month',
      description: 'Complete ' + theme.threshold + ' daily quests during ' + formatMonth(key) + ' to earn this limited monthly badge.'
    });
  }

  function progress(month) {
    const key = validMonthKey(month) ? month : currentMonthKey();
    return window.TS.DailyQuests.countCompletedInMonth(key);
  }
  function getRecord(id) {
    return window.TS.Storage.get().unlockedBadges.find(function (badge) { return badge && badge.id === id; }) || null;
  }
  function hasBadge(id) { return !!getRecord(id); }

  function earnedRewardShort(record) {
    if (!record) return '';
    if (record.rewardType === 'quest-completions') return '+' + (Number(record.questCompletions) || 0) + ' quests';
    const xp = Number(record.rewardXp != null ? record.rewardXp : record.reward) || 0;
    return '+' + xp + ' XP';
  }
  function earnedRewardText(record) {
    if (!record) return '';
    if (record.rewardType === 'quest-completions') {
      const count = Number(record.questCompletions) || 0;
      const target = validMonthKey(record.rewardMonth) ? formatMonth(record.rewardMonth) : 'next month';
      return count + ' daily quests were marked complete in advance for ' + target + '.';
    }
    const xp = Number(record.rewardXp != null ? record.rewardXp : record.reward) || 0;
    return '+' + xp + ' XP added to your profile.';
  }

  function getCurrent(month) {
    const key = validMonthKey(month) ? month : currentMonthKey();
    const badge = getBadgeForMonth(key);
    const count = progress(key);
    const record = getRecord(badge.id);
    return Object.assign({}, badge, {
      progress: Math.min(count, badge.threshold),
      rawProgress: count,
      unlocked: !!record,
      percent: Math.min(100, Math.round((count / badge.threshold) * 100)),
      remaining: Math.max(0, badge.threshold - count),
      earnedRewardShort: record ? earnedRewardShort(record) : '',
      earnedRewardText: record ? earnedRewardText(record) : '',
      rewardType: record && record.rewardType || '',
      questCompletions: record ? Number(record.questCompletions) || 0 : 0,
      rewardMonth: record && record.rewardMonth || null,
      rewardXp: record ? Number(record.rewardXp != null ? record.rewardXp : (record.rewardType ? 0 : record.reward)) || 0 : 0
    });
  }

  function check(month, count) {
    const key = validMonthKey(month) ? month : currentMonthKey();
    // A past month's missed badge must never unlock retroactively.
    if (key !== currentMonthKey()) return false;

    const badge = getBadgeForMonth(key);
    const completed = Math.max(0, Number(count == null ? progress(key) : count) || 0);
    if (completed < badge.threshold || hasBadge(badge.id)) return false;

    const state = window.TS.Storage.get();
    const now = new Date().toISOString();
    let rewardRecord;
    if (Math.random() < 0.5) {
      const xp = randomInt(rewardRules.xpMin, rewardRules.xpMax);
      rewardRecord = { rewardType: 'xp', reward: xp, rewardXp: xp, questCompletions: 0, rewardMonth: null };
      state.profile.xp += xp;
    } else {
      const targetMonth = offsetMonth(key, 1);
      const requested = randomInt(rewardRules.questMin, rewardRules.questMax);
      let granted = requested;
      try {
        granted = window.TS.DailyQuests.grantBonusCompletions(targetMonth, requested);
      } catch (error) {
        // A backup/browser edge case should not make the completed badge disappear.
        const xp = randomInt(rewardRules.xpMin, rewardRules.xpMax);
        state.profile.xp += xp;
        rewardRecord = { rewardType: 'xp', reward: xp, rewardXp: xp, questCompletions: 0, rewardMonth: null };
      }
      if (!rewardRecord) rewardRecord = { rewardType: 'quest-completions', reward: 0, rewardXp: 0, questCompletions: granted, rewardMonth: targetMonth };
    }

    const entry = Object.assign({
      id: badge.id,
      month: key,
      name: badge.name,
      icon: badge.icon,
      level: badge.level,
      themeKey: badge.key,
      threshold: badge.threshold,
      completedCount: completed,
      unlockedAt: now
    }, rewardRecord);
    state.unlockedBadges.push(entry);
    window.TS.Storage.save();

    const message = entry.rewardType === 'quest-completions'
      ? '+' + entry.questCompletions + ' pre-completed daily quests for ' + formatMonth(entry.rewardMonth) + '!'
      : '+' + entry.rewardXp + ' XP added to your profile!';
    window.TS.UI.toast('Monthly badge earned!', badge.name + ' · ' + message, 'success');
    return true;
  }

  function all() { return [getCurrent()]; }

  function history() {
    const state = window.TS.Storage.get();
    return state.unlockedBadges.map(function (record) {
      const item = Object.assign({}, record);
      const legacy = legacyBadges[item.id];
      const monthBadge = validMonthKey(item.month) ? getBadgeForMonth(item.month) : null;
      item.name = item.name || (legacy && legacy.name) || (monthBadge && monthBadge.name) || item.id;
      item.icon = item.icon || (legacy && legacy.icon) || (monthBadge && monthBadge.icon) || 'medal';
      item.level = item.level || (legacy && legacy.level) || (monthBadge && monthBadge.level) || 'blue';
      item.threshold = Number(item.threshold) || (legacy && legacy.threshold) || (monthBadge && monthBadge.threshold) || 0;
      item.monthLabel = formatMonth(item.month);
      item.rewardSummaryShort = earnedRewardShort(item);
      item.rewardSummary = earnedRewardText(item) || 'Reward from an earlier TypeStrike version.';
      return item;
    }).sort(function (a, b) {
      return String(b.month).localeCompare(String(a.month)) || String(b.unlockedAt).localeCompare(String(a.unlockedAt));
    });
  }

  window.TS.Achievements = {
    definitions: monthlyThemes,
    rewardRules: rewardRules,
    legacyDefinitions: legacyBadges,
    check: check,
    all: all,
    current: getCurrent,
    getCurrent: getCurrent,
    getBadgeForMonth: getBadgeForMonth,
    history: history,
    progress: progress,
    formatMonth: formatMonth,
    offsetMonth: offsetMonth
  };
})();
