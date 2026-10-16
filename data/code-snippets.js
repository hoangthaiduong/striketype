(function(){
  window.TS_DATA = window.TS_DATA || {};
  window.TS_DATA.codeSnippets = {
    HTML: [
      {id:"html-1",level:"easy",text:'<button class="primary">Start practice</button>'},
      {id:"html-2",level:"normal",text:'<main class="page-content">\n  <h1>My learning plan</h1>\n  <p>Practice a little every day.</p>\n</main>'},
      {id:"html-3",level:"hard",text:'<form id="profile-form" aria-labelledby="profile-title">\n  <label for="display-name">Display name</label>\n  <input id="display-name" name="displayName" required>\n  <button type="submit">Save profile</button>\n</form>'}
    ],
    CSS: [
      {id:"css-1",level:"easy",text:'.card {\n  padding: 16px;\n  border-radius: 12px;\n}'},
      {id:"css-2",level:"normal",text:'.nav-item:hover {\n  color: var(--blue);\n  background: #EFF6FF;\n  transition: background 180ms ease;\n}'},
      {id:"css-3",level:"hard",text:'@media (max-width: 720px) {\n  .layout {\n    grid-template-columns: 1fr;\n    gap: clamp(12px, 3vw, 20px);\n  }\n}' }
    ],
    JavaScript: [
      {id:"js-1",level:"easy",text:'const greeting = "Keep practicing!";\nconsole.log(greeting);'},
      {id:"js-2",level:"normal",text:'function calculateAccuracy(correct, total) {\n  if (total === 0) return 100;\n  return (correct / total) * 100;\n}'},
      {id:"js-3",level:"hard",text:'const completedTasks = tasks.filter((task) => {\n  return task.progress >= task.target && !task.rewarded;\n});\ncompletedTasks.forEach((task) => reward(task.id));'}
    ],
    Python: [
      {id:"py-1",level:"easy",text:'name = "Alex"\nprint("Hello, " + name)'},
      {id:"py-2",level:"normal",text:'def average(values):\n    if not values:\n        return 0\n    return sum(values) / len(values)'},
      {id:"py-3",level:"hard",text:'scores = {"Mia": 82, "Noah": 91, "Linh": 88}\nfor name, score in scores.items():\n    if score >= 90:\n        print(f"{name}: excellent")'}
    ]
  };
})();