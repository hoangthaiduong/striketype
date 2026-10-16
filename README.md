# TypeStrike — Type faster. Aim higher.

TypeStrike is a local-first typing practice website built with plain HTML, CSS and JavaScript. It does not need Node.js, npm, a server, an API key, a build step or an internet connection for its core features.

## Run it

1. Extract the ZIP to a normal folder.
2. Open the `TypeStrike` folder.
3. Double-click `index.html` and open it with a recent version of Chrome, Edge or Firefox.
4. Go to **Practice**, select a content type and press **Start practice**. Your progress is stored locally in the browser when browser storage is available.

No terminal or local server is needed. Keep the project files together after extraction; do not move `index.html` away from its `css`, `js` and `data` folders.

## Features

- Dashboard with honest empty states and statistics computed from sessions stored on this device.
- Sentence practice and connected English paragraphs, plus code drills for HTML, CSS, JavaScript and Python.
- 30-, 60-, 120-second and unlimited practice, adaptive difficulty, automatic full-screen Focus Mode for Practice and Battle, live WPM/accuracy, pause/resume/restart, and result summaries.
- Local daily quests, XP, levels, streaks, one exclusive monthly badge with a month-specific quest target, an earned-only badge library showing month/year, and a simulated typing race against a bot at three difficulty settings.
- SVG charts based on your actual saved activity; a spacious single-column page layout; refreshed inline SVG icon treatments; restrained hover/entrance effects; responsive layout and reduced-motion support.
- Background music from your own offline MP3 file, enabled by default at 15% volume with looping and independent Settings controls.
- `.tstrike` backup export/import and a confirmed progress reset.

## File map

- `index.html`: application shell and dependency-ordered classic script tags.
- `css/variables.css`, `base.css`, `layout.css`, `components.css`: design tokens, base styles, navigation and reusable UI.
- `css/dashboard.css`, `practice.css`, `focus-mode.css`, `battle.css`, `quests.css`, `achievements.css`, `statistics.css`: page-specific UI.
- `css/modals.css`, `animations.css`, `responsive.css`, `ux-overrides.css`, `design-refresh.css`, `viewport-fit.css`, `monthly-polish.css`, `background-music.css`: dialogs and notifications, shared transitions, responsive breakpoints, single-column design, viewport sizing, monthly-badge effects and background-music setup styling.
- `js/icon-library.js`: offline inline SVG icon library.
- `js/storage.js`: versioned local data, safe fallbacks and import/export validation.
- `js/content-generator.js`: chooses practice material and builds sentence/paragraph exercises from local libraries.
- `js/adaptive-difficulty.js`: difficulty recommendations from recent real sessions.
- `js/typing-engine.js`, `js/focus-mode.js`, `js/typing-battle.js`: input engine, focus presentation and bot race.
- `js/daily-quests.js`, `js/achievements.js`, `js/statistics.js`: progress systems and statistics.
- `js/settings.js`, `js/sound.js`, `js/background-music.js`, `js/ui.js`: preferences, keyboard sound effects, optional local looping MP3 playback and shared UI helpers.
- `music/README.txt`: exact location and filename for the MP3 soundtrack.
- `js/navigation.js`, `js/router.js`, `js/app.js`: route navigation and view rendering.
- `data/vocabulary.js`, `sentence-templates.js`, `paragraph-library.js`, `code-snippets.js`, `quest-config.js`: editable practice and quest content.

## Add practice content

**Sentences:** add objects to `TS_DATA.sentenceTemplates` in `data/sentence-templates.js`, each with a unique `id`, a `topic`, a `level` (`easy`, `normal`, or `hard`) and a complete `text` string. Existing sentences are manually written to favor grammatical quality. The small rule-based generator can also combine the vocabulary in `data/vocabulary.js`; generated combinations are not guaranteed to sound natural, so prefer reviewed sentence templates when expanding the collection.

**Paragraphs:** add objects to `TS_DATA.paragraphs` in `data/paragraph-library.js`. Give each paragraph a unique `id`, topic, level and coherent text. The length setting chooses among authored material and may combine distinct paragraphs for a longer exercise.

**Code:** add snippets under the relevant language array in `data/code-snippets.js`. Preserve spaces and line breaks in the JavaScript string. The language keys must be `HTML`, `CSS`, `JavaScript` or `Python`.

All these files are loaded by ordinary `<script defer>` tags; they are not fetched as JSON. Keep that approach if `file://` operation is important.

## Adjust XP, quests and badges

- Edit XP logic in `js/typing-engine.js` and `js/typing-battle.js`.
- Edit quest titles, targets and XP in `data/quest-config.js`.
- Edit the twelve month-specific badge themes and quest targets in `js/achievements.js`. Each earned monthly badge randomly grants either 150–250 XP or 10–25 daily quests pre-completed in the following month. Only the current month’s badge is active; unearned badges expire without being added to the library. Earned badge records include their month/year and exact reward and remain in the library.
- Edit level thresholds in `js/storage.js` (the `getLevelInfo` function).


## Add your own background music

1. Open the `TypeStrike/music` folder.
2. Copy your MP3 music file into that folder and rename the file exactly to `background-music.mp3`. The full path must be `TypeStrike/music/background-music.mp3`.
3. Double-click `index.html`. Background music is already enabled at **15% volume**; change it or turn it off in **Settings → Background music** if needed.

No code changes are needed and no music file is bundled. The app attempts to start the local track on launch and loops it while the website is open. Browsers may block audible autoplay until you click or press a key once; TypeStrike resumes playback on that first interaction. If the MP3 file is missing, the app displays a helpful message instead of breaking other features. Use audio you have the right to use.

## Back up your progress

Open **Settings → Data management → Export data** to download a `.tstrike` backup. The file uses a TypeStrike-specific `TSTRIKE-BACKUP/1` signature and a validated data payload. Use **Import data** to restore a backup after validation; older `.json` backups are accepted for compatibility. Reset Progress deletes the locally stored progress only after confirmation. Export regularly if the progress matters to you.

## Offline and `file://` limitations

The project has no external runtime dependencies. Browser storage policies for `file://` URLs differ between browsers and can depend on the exact folder path. If storage is blocked, TypeStrike continues with an in-memory fallback but progress will not survive closing the tab; the UI indicates this condition. Browsers may treat the same folder opened via a different path or browser as a different storage area. Clearing browser data can delete progress. Use `.tstrike` export/import to make backups. File downloads and import pickers are handled by the browser and may show their own permission prompts.

The battle opponent is a local simulation, not a real online player. Adaptive difficulty and sentence generation use local rules and authored material, not a cloud AI service. Statistics contain only sessions actually recorded on this device; an empty account starts at zero.


## Bản cập nhật giao diện Viewport Fit

- Thanh điều hướng desktop được mở rộng và tăng kích thước chữ/icon để dễ đọc hơn.
- Khu vực nội dung chính sử dụng chiều rộng màn hình còn lại thay vì bị giới hạn ở 1080px.
- Các khu vực vẫn xếp dọc từng mục; bản cập nhật không đưa các nhóm thẻ trở lại bố cục nhiều cột.
- Các khối, chữ, nút, phần chọn thiết lập và biểu đồ được tăng kích thước vừa phải để phù hợp với khung nhìn lớn.
- Trên tablet/mobile, sidebar vẫn là menu trượt và nội dung sử dụng chiều rộng màn hình, có lề phù hợp.
- Các thay đổi về bố cục được tách trong `css/viewport-fit.css` để dễ tinh chỉnh mà không ảnh hưởng JavaScript.

## Monthly badge rules

- A single themed badge is active per calendar month. Each month has its own daily-quest target, configured in `js/achievements.js`.
- Completed quests count toward the badge for their calendar month. The badge is awarded once after the target is met and randomly grants either 150–250 XP or 10–25 real daily quest records pre-completed across the following month. Bonus-completed quests do not pay their daily XP again; the badge reward itself is the gift.
- When the month ends, an unearned badge is skipped and is not stored in the badge library. The following month starts its own badge and target.
- Earned badges are stored with a snapshot of their name, theme, month, target, completion count, exact reward type/value, and unlock time. The library lists the month and year and describes the reward. Previously earned Bronze/Silver/Gold badges from older TypeStrike saves remain visible as legacy collection entries.
- The background uses soft layered colour fields and the buttons use short hover/press feedback. The effects respect `prefers-reduced-motion`.


## Monthly badge rewards

Every monthly badge randomly rolls one of two generous prizes: **150–250 XP**, or **10–25 daily quests completed ahead of time for the next calendar month**. Bonus completions are stored in the normal date-specific daily quest records and show a “Bonus completed” label; they are distributed randomly across the next month and do not grant their ordinary quest XP again. The exact reward and, if applicable, target month are saved in the badge library and `.tstrike` backups.

The Typing Battle icon is an inline SVG in `js/icon-library.js`, using the local keyboard-and-battle-mark design in the Premium Blue palette. It has no network dependency.

