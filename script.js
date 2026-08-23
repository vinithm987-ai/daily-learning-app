const lessons=[
["Study Smarter","Learn one small topic at a time. Set a clear target, remove distractions, practise actively, and review later.","Choose one small target instead of trying to learn everything at once."],
["English Speaking","Speak slowly and use short sentences. Listen, repeat, record yourself, and try again. Mistakes are part of learning.","Practise speaking for 10 minutes every day."],
["Financial Management","Financial management is the planning, obtaining, using and controlling of money in a business. Main decisions include investment, financing and dividend decisions.","Remember: investment + financing + dividend."],
["Interview Preparation","An interview self-introduction should briefly cover your name, education, skills, interests and career goal.","Practise your introduction aloud before an interview."]
];
const words=[
["Accurate","AK-yuh-rət","adjective","Correct and free from mistakes","Please provide accurate information.","B1"],
["Adapt","uh-DAPT","verb","To change to suit a new situation","Students must adapt to new learning methods.","B1"],
["Benefit","BEN-uh-fit","noun","An advantage","Reading daily has many benefits.","B1"],
["Confident","KON-fi-dənt","adjective","Sure about your ability","I feel confident about my interview.","B1"],
["Efficient","ih-FISH-ənt","adjective","Working well without wasting time","This is an efficient study method.","B2"],
["Evaluate","ih-VAL-yoo-ayt","verb","To judge or assess","We evaluate the investment before deciding.","B2"],
["Relevant","REL-uh-vənt","adjective","Connected with the topic","Give only relevant information.","B2"],
["Sustainable","suh-STAY-nuh-bəl","adjective","Able to continue for a long time","The company needs a sustainable strategy.","B2"],
["Resilient","ri-ZIL-yənt","adjective","Able to recover after difficulty","A resilient learner keeps trying.","B2"],
["Improve","im-PROOV","verb","To make better","I want to improve my communication.","A2"]
];
const quiz=[
["What is financial management?",["Planning and controlling business money","Only advertising","Only hiring staff","Only selling"],0,"It involves planning, obtaining, using and controlling business funds."],
["Which habit improves speaking?",["Never speaking","Regular speaking practice","Only reading grammar","Avoiding mistakes"],1,"Regular speaking practice builds fluency and confidence."],
["What does accurate mean?",["Correct and without mistakes","Very expensive","Very fast","Difficult"],0,"Accurate means correct and free from mistakes."],
["What does sustainable mean?",["Temporary","Able to continue for a long time","Incorrect","Unrelated"],1,"Sustainable means able to continue over a long period."],
["Which is a good study method?",["One small target every day","No revision","Study once a month","Never practise"],0,"Small, regular targets make learning consistent."]
];
const S={page:"home",lesson:0,word:0,q:0,score:0,answered:false,done:+localStorage.getItem("dl_done")||0,seen:+localStorage.getItem("dl_seen")||0,theme:localStorage.getItem("dl_theme")||"light",name:localStorage.getItem("dl_name")||"Student",flash:0,tasks:JSON.parse(localStorage.getItem("dl_tasks")||"[false,false,false]"),note:localStorage.getItem("dl_note")||"",goals:JSON.parse(localStorage.getItem("dl_goals")||"[false,false,false,false]"),xp:+localStorage.getItem("dl_xp")||0,timer:25*60,aiKey:localStorage.getItem("dl_ai_key")||"",aiModel:localStorage.getItem("dl_ai_model")||"gemini-3.7-flash",aiMode:localStorage.getItem("dl_ai_mode")||"deep",aiSearch:localStorage.getItem("dl_ai_search")!=="false",aiHistory:JSON.parse(localStorage.getItem("dl_ai_history")||"[]")};
const app=document.getElementById("app"),modal=document.getElementById("modal");
function save(){localStorage.setItem("dl_done",S.done);localStorage.setItem("dl_seen",S.seen);localStorage.setItem("dl_theme",S.theme);localStorage.setItem("dl_name",S.name);localStorage.setItem("dl_tasks",JSON.stringify(S.tasks));localStorage.setItem("dl_note",S.note);localStorage.setItem("dl_goals",JSON.stringify(S.goals));localStorage.setItem("dl_xp",S.xp)}
function toast(t){let x=document.getElementById("toast");x.textContent=t;x.classList.add("show");setTimeout(()=>x.classList.remove("show"),2200)}
function speak(t){if(!("speechSynthesis"in window)){toast("Speech is not supported.");return}speechSynthesis.cancel();speechSynthesis.speak(new SpeechSynthesisUtterance(t))}
function head(a,b){return `<div class="head"><h2>${a}</h2><p class="muted">${b}</p></div>`}
function feature(i,t,d,p){return `<button class="card feature" data-page="${p}"><div class="ico">${i}</div><h3>${t}</h3><p class="muted">${d}</p></button>`}
function home(){let pct=Math.round(S.done/lessons.length*100);return `<section class="hero"><div><span class="eyebrow">YOUR DAILY STUDY SPACE</span><h1>Learn something useful every day.</h1><p>Build English, academic knowledge and confidence with short lessons, vocabulary, speaking practice, grammar and quizzes.</p><div class="row"><button class="btn primary" data-action="start">Start learning →</button><button class="btn secondary" data-page="ai">Ask AI Tutor</button></div></div><div class="hero-card"><p class="muted">Today's progress</p><div class="big">${pct}%</div><div class="progress"><i style="width:${pct}%"></i></div><p class="muted">${S.done}/${lessons.length} lessons completed</p></div></section><div class="stats"><div class="stat">🔥 Streak<strong>1 day</strong><span class="muted">Keep learning.</span></div><div class="stat">🧠 Words<strong>${S.seen}</strong><span class="muted">Vocabulary practice.</span></div><div class="stat">🏆 Quiz<strong>${S.score}/${quiz.length}</strong><span class="muted">This session.</span></div></div><section class="section"><h2>Learn today</h2><p class="muted">All sections are inside this one website—no missing pages.</p><div class="grid">${feature("📚","Lessons","Short lessons for English, finance and study skills.","lessons")}${feature("🧠","Vocabulary","Useful words with meaning, examples and audio.","vocabulary")}${feature("🗣️","Speaking","Practise useful English sentences aloud.","speaking")}${feature("✍️","Grammar","Fix common English mistakes.","grammar")}${feature("❓","Quiz","Answer questions and see explanations.","quiz")}${feature("🤖","AI Tutor","Ask study questions. Works without an API key.","ai")}</div></section>`}
function lessonsPage(){let l=lessons[S.lesson];return `${head("Daily Lessons","Short lessons you can complete one by one.")}<div class="lesson"><article class="card lesson-main"><span class="eyebrow">LESSON ${S.lesson+1}/${lessons.length}</span><h2>${l[0]}</h2><p>${l[1]}</p><div class="tip">💡 <strong>Key idea:</strong> ${l[2]}</div><div class="row"><button class="btn secondary" data-action="prevLesson">← Previous</button><button class="btn primary" data-action="complete">Mark complete ✓</button><button class="btn secondary" data-action="nextLesson">Next →</button></div></article><aside class="card"><h3>Lessons</h3>${lessons.map((x,i)=>`<button class="btn ${i===S.lesson?"primary":"secondary"}" style="width:100%;margin-top:8px;text-align:left" data-lesson="${i}">${i+1}. ${x[0]}</button>`).join("")}</aside></div>`}
function vocabularyPage(){let w=words[S.word];return `${head("Vocabulary","Learn useful words and hear pronunciation.")}<div class="card word"><span class="eyebrow">${w[5]} • ${w[2]}</span><h1>${w[0]}</h1><div class="phonetic">/${w[1]}/</div><p><strong>Meaning:</strong> ${w[3]}</p><div class="example"><strong>Example:</strong> ${w[4]}</div><div class="row" style="justify-content:center"><button class="btn secondary" data-action="wordSpeak">🔊 Listen</button><button class="btn primary" data-action="nextWord">Next word →</button></div></div><div class="section"><h3>Useful words</h3><div class="grid">${words.slice(0,6).map(w=>`<div class="card"><strong>${w[0]}</strong><p class="muted">${w[3]}</p></div>`).join("")}</div></div>`}
function speakingPage(){let a=["My name is Vinith.","I am studying MBA in Finance.","I want to improve my communication skills.","I practise English every day.","I am preparing for a corporate career."],i=+(localStorage.getItem("dl_speak")||0);return `${head("English Speaking Practice","Listen, repeat, and practise with confidence.")}<div class="card" style="max-width:800px;margin:auto;text-align:center"><span class="eyebrow">SENTENCE ${i+1}/${a.length}</span><h2 style="margin:18px 0">${a[i]}</h2><p class="muted">Say it aloud three times.</p><div class="row" style="justify-content:center"><button class="btn primary" data-action="sentenceSpeak">🔊 Listen</button><button class="btn secondary" data-action="nextSentence">Next sentence</button></div><div class="tip" style="text-align:left">🎯 Speak slowly. Clear English is more important than speaking very fast.</div></div>`}
function grammarPage(){return `${head("Grammar Practice","Choose the correct sentence.")}<div class="card"><h3>Which sentence is correct?</h3><div class="options"><button class="option" data-grammar="0">She go to college every day.</button><button class="option" data-grammar="1">She goes to college every day.</button></div><p id="grammarFeedback" class="muted">Choose an answer.</p></div><div class="card" style="margin-top:16px"><h3>Quick rule</h3><p>With <strong>he, she, it</strong> in the simple present, the verb usually takes <strong>-s</strong> or <strong>-es</strong>.</p></div>`}
function quizPage(){let q=quiz[S.q];return `${head("Daily Quiz","Choose an answer and get an instant explanation.")}<div class="card" style="max-width:800px;margin:auto"><span class="eyebrow">QUESTION ${S.q+1}/${quiz.length}</span><h2>${q[0]}</h2><div class="options">${q[1].map((x,i)=>`<button class="option" data-option="${i}">${String.fromCharCode(65+i)}. ${x}</button>`).join("")}</div><p id="quizFeedback" class="muted">Choose an answer.</p><button class="btn primary" data-action="nextQuiz">Next question →</button></div>`}
function flashcardsPage(){let w=words[S.flash%words.length];return `${head("Flashcards","Flip your memory: see the word, then reveal the meaning.")}<div class="card flash"><div><span class="eyebrow">CARD ${S.flash%words.length+1}/${words.length}</span><div id="flashFront"><div class="flash-word">${w[0]}</div><div class="phonetic">/${w[1]}/</div><p class="muted">Tap Reveal to check the meaning.</p></div><div id="flashBack" class="hidden"><h2>${w[3]}</h2><p><strong>Example:</strong> ${w[4]}</p><p class="badge">${w[5]} • ${w[2]}</p></div><div class="row" style="justify-content:center;margin-top:18px"><button class="btn secondary" data-action="revealFlash">👁️ Reveal</button><button class="btn primary" data-action="knowFlash">I know it ✓</button><button class="btn secondary" data-action="nextFlash">Next →</button></div></div></div>`}
function plannerPage(){let d=new Date(),days=["Sun","Mon","Tue","Wed","Thu","Fri","Sat"],checks=S.tasks;return `${head("Study Planner","A simple daily plan. Your checklist is saved automatically.")}<div class="dashboard-grid"><div class="card" style="padding:22px"><h3>Today's 3 tasks</h3><div class="checklist">${["10 minutes English speaking","Learn 5 vocabulary words","Complete 1 lesson or quiz"].map((x,i)=>`<label class="check"><input type="checkbox" data-task="${i}" ${checks[i]?"checked":""}> <span>${x}</span></label>`).join("")}</div><div class="tip">🎯 Finish all three to earn <strong>30 XP</strong>.</div></div><div class="card" style="padding:22px"><h3>${d.toLocaleString('en',{month:'long'})}</h3><div class="mini-calendar">${days.map(x=>`<div class="day"><strong>${x}</strong></div>`).join("")}${Array.from({length:31},(_,i)=>`<div class="day ${i+1===d.getDate()?"today":""}">${i+1}</div>`).join("")}</div></div></div><div class="card timer" style="margin-top:18px"><h3>Focus Timer</h3><div id="timerNum" class="timer-num">25:00</div><div class="row" style="justify-content:center"><button class="btn primary" data-action="timerStart">Start</button><button class="btn secondary" data-action="timerPause">Pause</button><button class="btn secondary" data-action="timerReset">Reset</button></div></div>`}
function notesPage(){return `${head("My Notes","Write your study notes. They are stored in your browser.")}<div class="card" style="padding:20px"><textarea id="noteArea" class="note-area" placeholder="Write today's notes here...">${S.note.replace(/</g,"&lt;")}</textarea><div class="row" style="margin-top:10px"><button class="btn primary" data-action="saveNote">Save notes</button><button class="btn secondary" data-action="clearNote">Clear</button></div></div>`}
function goalsPage(){let gs=["Speak English for 10 minutes","Learn 5 new words","Finish one lesson","Take one quiz"];return `${head("Goals & Achievements","Complete small goals and build your learning habit.")}<div class="card">${gs.map((g,i)=>`<label class="goal"><input type="checkbox" data-goal="${i}" ${S.goals[i]?"checked":""}> <span style="flex:1">${g}</span>${S.goals[i]?"🏅":"◻️"}</label>`).join("")}</div><div class="stats" style="margin-top:18px"><div class="stat">⭐ XP<strong>${S.xp}</strong><span class="muted">Keep going.</span></div><div class="stat">🏅 Goals<strong>${S.goals.filter(Boolean).length}/4</strong><span class="muted">Completed.</span></div><div class="stat">🔥 Streak<strong>1 day</strong><span class="muted">Return tomorrow.</span></div></div><section class="section"><div class="card" style="padding:20px"><h3>Achievements</h3><p>🏆 <strong>First Step</strong> — complete a lesson</p><p>🧠 <strong>Word Builder</strong> — learn vocabulary</p><p>🎯 <strong>Goal Setter</strong> — complete all four goals</p></div></section>`}
function dashboardPage(){return `${head("Learning Dashboard","Everything you need in one place.")}<div class="dashboard-grid"><div class="card" style="padding:24px"><h2>Welcome back, ${S.name} 👋</h2><p class="muted">Choose one small activity today. Consistency matters more than studying for many hours once.</p><div class="row"><button class="btn primary" data-page="planner">Start today's plan</button><button class="btn secondary" data-page="vocabulary">Learn words</button></div></div><div class="card" style="padding:24px"><span class="eyebrow">XP</span><div class="big">${S.xp}</div><p class="muted">Your learning points</p></div></div><section class="section"><h2>Quick actions</h2><div class="grid">${feature("🗓️","Planner","Today's checklist and focus timer.","planner")}${feature("🃏","Flashcards","Remember useful vocabulary.","flashcards")}${feature("📝","Notes","Save your own study notes.","notes")}</div></section>`}
function aiPage(){
let history=S.aiHistory||[];
return `${head("AI Tutor — Gemini","Ask a full question, not just a word. The tutor can explain topics deeply, give examples, formulas, exam answers, interview answers, corrections and follow-up questions.")}<div class="ai-shell">
<div class="card" style="padding:16px;margin-bottom:14px">
  <div class="ai-toolbar">
    <button class="ai-chip ${S.aiMode==="simple"?"active":""}" data-ai-mode="simple">Simple</button>
    <button class="ai-chip ${S.aiMode==="deep"?"active":""}" data-ai-mode="deep">Deep Study</button>
    <button class="ai-chip ${S.aiMode==="exam"?"active":""}" data-ai-mode="exam">Exam Answer</button>
    <button class="ai-chip ${S.aiMode==="interview"?"active":""}" data-ai-mode="interview">Interview</button>
    <button class="ai-chip ${S.aiMode==="english"?"active":""}" data-ai-mode="english">English Coach</button>
    <button class="btn secondary" data-action="aiSettings">⚙️ AI Settings</button>
    <span class="ai-status">${S.aiKey?"🟢 Gemini connected":"🟡 Demo mode — add Gemini API key"}</span>
  </div>
</div>
<div class="card chat">
  <div id="messages" class="messages">${history.length?history.map(m=>`<div class="msg ${m.role==="user"?"user":"bot"}">${m.role==="user"?escapeHTML(m.text):renderAIText(m.text)}</div>`).join(""):`<div class="msg bot">Hello ${escapeHTML(S.name)}! 👋<br><br><strong>I am ready to teach you.</strong><br>Ask: “Explain capital structure in depth with an example” or “Correct my English paragraph and explain every mistake.”</div>`}</div>
  <div class="quick">
    <button data-query="Explain financial management in depth with meaning, objectives, functions, decisions, formula if any, example, advantages, limitations, exam answer and interview answer.">Financial Management — full explanation</button>
    <button data-query="Explain capital structure in depth with theories, components, formula, example, advantages, limitations and a simple MBA exam answer.">Capital Structure — MBA</button>
    <button data-query="Teach me English speaking from beginner to confident level with a daily 10-minute plan and examples.">English Speaking — complete plan</button>
    <button data-query="Explain working capital with formula, types, operating cycle, example and practical business use.">Working Capital — complete</button>
  </div>
  <div class="chatbar"><input id="aiInput" placeholder="Ask anything: topic, sentence, PDF text, finance, English, coding, science..."><button class="btn secondary" data-action="voice">🎙️</button><button class="btn primary" data-action="ask">Send</button></div>
  <div class="row" style="margin-top:10px"><button class="btn secondary" data-action="clearChat">Clear chat</button><button class="btn secondary" data-action="readLast">🔊 Read last</button><button class="btn secondary" data-action="aiSettings">⚙️ Settings</button></div>
  <div class="tip"><strong>Deep-answer format:</strong> direct answer → definition → detailed explanation → key points → steps/components → examples → formula/calculation when relevant → advantages & limitations → common mistakes → exam answer → interview answer → quick revision → follow-up questions.</div>
</div></div>`;
}
function escapeHTML(s){return String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]))}
function renderAIText(t){
let e=escapeHTML(t);
e=e.replace(/```([\s\S]*?)```/g,'<pre>$1</pre>');
e=e.replace(/^### (.*)$/gm,'<h3>$1</h3>').replace(/^## (.*)$/gm,'<h2>$1</h2>').replace(/^# (.*)$/gm,'<h1>$1</h1>');
e=e.replace(/\*\*(.*?)\*\*/g,'<strong>$1</strong>').replace(/\*(.*?)\*/g,'<em>$1</em>');
e=e.replace(/^\- (.*)$/gm,'• $1').replace(/\n/g,'<br>');
return `<div class="ai-answer">${e}</div>`;
}
function aiSettings(){
modal.classList.remove("hidden");
modal.innerHTML=`<div class="modal-box"><h2>Gemini AI Settings</h2>
<p class="ai-note">For a GitHub Pages demo, the API key is stored in this browser. Do not use a private production key in public website code. For a real public app, put Gemini behind a secure backend.</p>
<div class="ai-config">
<div class="full"><label>Gemini API key</label><input id="aiKey" class="field ai-key" type="password" value="${escapeHTML(S.aiKey)}" placeholder="Paste your Gemini API key"></div>
<div><label>Model</label><select id="aiModel" class="field"><option value="gemini-3.7-flash">Gemini 3.7 Flash</option><option value="gemini-3.6-flash">Gemini 3.6 Flash</option><option value="gemini-3.5-flash">Gemini 3.5 Flash</option></select></div>
<div><label>Web search</label><select id="aiSearch" class="field"><option value="true">On — current information</option><option value="false">Off — model only</option></select></div>
</div>
<p class="ai-note">Web search can make current answers more useful. Google documents Gemini grounding with Google Search and structured outputs for predictable application responses. </p>
<div class="row" style="margin-top:10px"><button class="btn primary" data-action="saveAISettings">Save & Test</button><button class="btn secondary" data-action="closeModal">Close</button></div></div>`;
document.getElementById("aiModel").value=S.aiModel;
document.getElementById("aiSearch").value=String(S.aiSearch);
modal.querySelector("[data-action=closeModal]").onclick=()=>modal.classList.add("hidden");
modal.querySelector("[data-action=saveAISettings]").onclick=async()=>{
S.aiKey=document.getElementById("aiKey").value.trim();S.aiModel=document.getElementById("aiModel").value;S.aiSearch=document.getElementById("aiSearch").value==="true";save();modal.classList.add("hidden");toast(S.aiKey?"Gemini settings saved.":"Demo mode enabled.");render()
};
}
function buildAIPrompt(q){
const modes={
simple:"Explain in very simple English. Use short sentences and everyday examples. Do not assume prior knowledge.",
deep:"Teach this like a patient expert teacher. Give a complete, deep but understandable explanation. Do not answer with only a definition.",
exam:"Give an MBA/student exam-ready answer. Include definition, headings, key points, example, formula if relevant, conclusion, and a short 5-mark answer.",
interview:"Explain the topic and then give a strong interview response, likely follow-up questions, and simple examples.",
english:"Act as an English coach. If the user gives a sentence or paragraph, correct it, explain every important mistake, give the natural version, vocabulary, pronunciation tips, and 3 practice sentences."
};
return `You are the Daily Learning AI Tutor. The user is a student and wants to understand, not merely receive a short answer.
Mode: ${modes[S.aiMode]||modes.deep}
User question: ${q}

Rules:
1. Answer the actual question first.
2. Give enough depth to understand the topic completely, but use clear simple language.
3. For academic topics include: meaning, purpose/objectives, components/types, how it works, step-by-step process, practical example, advantages, limitations, common mistakes, and quick revision.
4. For finance/accounting include formulas, define every variable, and show a small calculation when relevant.
5. For English include corrected sentences, meaning, grammar rule, natural alternatives, pronunciation tips when useful, and practice sentences.
6. If the question asks for a comparison, use a clear table.
7. If the question is current or asks for latest information and web search is enabled, use grounded search information.
8. Never invent sources or facts. If uncertain, say what is uncertain.
9. End with: “Quick revision” and 3 useful follow-up questions.
10. Do not ask the student to repeat a question just because it is broad; make a reasonable interpretation and answer it.`;
}
async function callGemini(q){
if(!S.aiKey)return null;
const url=`https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(S.aiModel)}:generateContent`;
const body={contents:[{role:"user",parts:[{text:buildAIPrompt(q)}]}]};
if(S.aiSearch)body.tools=[{google_search:{}}];
body.generationConfig={thinkingConfig:{thinkingLevel:S.aiMode==="deep"?"high":"medium"}};
const r=await fetch(url,{method:"POST",headers:{"Content-Type":"application/json","x-goog-api-key":S.aiKey},body:JSON.stringify(body)});
const data=await r.json();
if(!r.ok)throw new Error(data?.error?.message||"Gemini request failed.");
const text=data?.candidates?.[0]?.content?.parts?.map(p=>p.text||"").join("")||"";
if(!text)throw new Error("Gemini returned an empty answer.");
return {text,sources:extractSources(data)};
}
function extractSources(data){
const chunks=data?.candidates?.[0]?.groundingMetadata?.groundingChunks||[];
return chunks.map(c=>c?.web).filter(x=>x?.uri).slice(0,8);
}
function demoDeep(q){
return `# ${q}

## Direct answer
I can explain this topic in depth. **Gemini mode is not connected yet** because no API key has been added.

## What you should do
1. Open **AI Settings**.
2. Paste your Gemini API key.
3. Select **Gemini 3.7 Flash**.
4. Turn **Web search** on when you want current information.
5. Save and ask the question again.

## What the connected tutor will provide
- Definition and meaning
- Detailed explanation
- Objectives and importance
- Types/components
- Step-by-step process
- Formula and calculation when relevant
- Real-life and business examples
- Advantages and limitations
- Common mistakes
- MBA exam-ready answer
- Interview-ready answer
- Quick revision
- Follow-up questions

## Quick revision
The goal is not to give you only a word or one sentence. The new tutor prompt asks Gemini to teach the complete topic in a structured way.`;
}
function addMsg(t,w){
let m=document.getElementById("messages");if(!m)return;
let d=document.createElement("div");d.className="msg "+w;
d.innerHTML=w==="user"?escapeHTML(t):renderAIText(t);m.appendChild(d);m.scrollTop=m.scrollHeight;
}
async function askAI(){
let i=document.getElementById("aiInput");if(!i)return;
let q=i.value.trim();if(!q){toast("Type a question first.");return}
addMsg(q,"user");S.aiHistory.push({role:"user",text:q});i.value="";
let typing=document.createElement("div");typing.className="msg bot";typing.id="aiTyping";typing.textContent="Thinking…";document.getElementById("messages").appendChild(typing);
try{
let result=await callGemini(q);typing.remove();
let answer=result?.text||demoDeep(q);
if(result?.sources?.length)answer+="\n\n## Sources\n"+result.sources.map(s=>`- ${s.title||"Source"}: ${s.uri}`).join("\n");
addMsg(answer,"bot");S.aiHistory.push({role:"model",text:answer});save();
}catch(err){typing.remove();let fallback=`I couldn't reach Gemini.\n\n**Reason:** ${err.message}\n\nCheck your API key in **AI Settings** and try again. The website itself is still working.`;addMsg(fallback,"bot");S.aiHistory.push({role:"model",text:fallback});save()}
}
function progressPage(){let pct=Math.round(S.done/lessons.length*100);return `${head("My Progress","Your progress is saved in this browser.")}<div class="stats"><div class="stat">📚 Lessons<strong>${S.done}/${lessons.length}</strong></div><div class="stat">🧠 Words<strong>${S.seen}</strong></div><div class="stat">🏆 Quiz<strong>${S.score}/${quiz.length}</strong></div></div><div class="card" style="margin-top:18px"><h3>Lesson completion</h3><div class="progress" style="margin:14px 0"><i style="width:${pct}%"></i></div><p>${pct}% complete.</p><button class="btn danger" data-action="reset">Reset progress</button></div>`}
function localAI(q){let x=q.toLowerCase();if(x.includes("financial management")||x.includes("finance"))return"Financial management means planning, obtaining, using and controlling money in a business. The main decisions are: 1) investment—where to invest, 2) financing—how to raise money, and 3) dividend—how much profit to distribute. Example: a company compares projects before investing.";if(x.includes("working capital"))return"Working capital is the money available for day-to-day operations. Formula: Current Assets − Current Liabilities. Example: ₹5 lakh current assets − ₹3 lakh current liabilities = ₹2 lakh working capital.";if(x.includes("go to college")||x.includes("grammar")||x.includes("correct"))return"Correct sentence: “She goes to college every day.” Rule: with he, she or it in the simple present, the verb usually takes -s or -es.";if(x.includes("resilient"))return"Resilient means able to recover from difficulties and continue trying. Example: A resilient student learns from mistakes and keeps practising.";if(x.includes("confident"))return"Confident means feeling sure about your ability. Example: I feel confident before my interview.";if(x.includes("tally"))return"TallyPrime is accounting and business-management software used for transactions, ledgers, invoices, inventory and financial reports.";if(x.includes("english")||x.includes("speaking"))return"To improve English speaking: practise 10 minutes daily, learn 5 useful words, speak short sentences, listen and repeat, record yourself, and review one mistake at a time.";if(x.includes("mba"))return"MBA means Master of Business Administration. Common areas include finance, marketing, HR, operations and strategy. A good answer gives the definition, key points and an example.";if(x.includes("capital structure"))return"Capital structure is the mix of debt and equity used to finance a company's assets and operations. Example: bank loans plus shareholders' equity.";if(x.includes("hello")||x.includes("hi"))return"Hello! 👋 What would you like to learn today? Ask about English, MBA, finance, accounting, interviews, vocabulary, grammar or study skills.";return"I can help you learn. Try: “What is working capital?”, “Explain capital structure simply”, “Correct my English sentence”, “What is TallyPrime?”, or “Explain this MBA topic with an example.”"}
function addMsg(t,w){let m=document.getElementById("messages");if(!m)return;let d=document.createElement("div");d.className="msg "+w;d.textContent=t;m.appendChild(d);m.scrollTop=m.scrollHeight}
function askAI(){let i=document.getElementById("aiInput");if(!i)return;let q=i.value.trim();if(!q){toast("Type a question first.");return}addMsg(q,"user");i.value="";setTimeout(()=>addMsg(localAI(q),"bot"),200)}
function quizAnswer(i,b){if(S.answered)return;S.answered=true;let q=quiz[S.q];document.querySelectorAll("[data-option]").forEach((x,n)=>{if(n===q[2])x.classList.add("correct")});if(i===q[2]){S.score++;document.getElementById("quizFeedback").innerHTML='<span style="color:var(--green);font-weight:800">Correct ✓</span> '+q[3]}else{b.classList.add("wrong");document.getElementById("quizFeedback").textContent="Not quite. "+q[3]}save()}
function startVoice(){let R=window.SpeechRecognition||window.webkitSpeechRecognition;if(!R){toast("Voice input is not supported in this browser.");return}let r=new R();r.lang="en-IN";r.onresult=e=>{let i=document.getElementById("aiInput");if(i)i.value=e.results[0][0].transcript};r.onerror=()=>toast("Voice input could not start.");r.start()}
function profile(){modal.classList.remove("hidden");modal.innerHTML=`<div class="modal-box"><h2>Your Profile</h2><p class="muted">Name is stored only in this browser.</p><input class="field" id="nameInput" value="${S.name.replace(/"/g,"&quot;")}" placeholder="Your name"><button class="btn primary" style="width:100%" data-action="saveName">Save</button><button class="btn secondary" style="width:100%;margin-top:8px" data-action="closeModal">Close</button></div>`;modal.querySelector("[data-action=closeModal]").onclick=()=>modal.classList.add("hidden");modal.querySelector("[data-action=saveName]").onclick=()=>{let n=document.getElementById("nameInput").value.trim();if(n){S.name=n;save();modal.classList.add("hidden");toast("Profile saved.");render()}}}
let timerInterval=null;function updateTimer(){let n=Math.max(0,S.timer),m=Math.floor(n/60),sec=n%60,x=document.getElementById("timerNum");if(x)x.textContent=String(m).padStart(2,"0")+":"+String(sec).padStart(2,"0");if(n===0){clearInterval(timerInterval);timerInterval=null;toast("Focus session complete! +10 XP 🎉");S.xp+=10;save()}}function startTimer(){if(timerInterval)return;timerInterval=setInterval(()=>{S.timer--;updateTimer()},1000);toast("Focus timer started") }function pauseTimer(){clearInterval(timerInterval);timerInterval=null;toast("Timer paused")}function resetTimer(){clearInterval(timerInterval);timerInterval=null;S.timer=25*60;updateTimer()}function bind(){
document.querySelectorAll("[data-page]").forEach(b=>b.onclick=e=>{e.preventDefault();S.page=b.dataset.page;document.getElementById("mobileNav").classList.remove("open");render()});
document.querySelectorAll("[data-lesson]").forEach(b=>b.onclick=()=>{S.lesson=+b.dataset.lesson;render()});
document.querySelectorAll("[data-option]").forEach(b=>b.onclick=()=>quizAnswer(+b.dataset.option,b));
document.querySelectorAll("[data-grammar]").forEach(b=>b.onclick=()=>{document.getElementById("grammarFeedback").innerHTML=b.dataset.grammar==="1"?'<span style="color:var(--green);font-weight:800">Correct ✓</span> “She goes to college every day.”':'<span style="color:var(--red);font-weight:800">Not correct.</span> Use “goes” with she.'});
document.querySelectorAll("[data-query]").forEach(b=>b.onclick=()=>{let i=document.getElementById("aiInput");if(i){i.value=b.dataset.query;askAI()}});
document.querySelectorAll("[data-ai-mode]").forEach(b=>b.onclick=()=>{S.aiMode=b.dataset.aiMode;save();render()});
const A={start:()=>{S.page="lessons";render()},prevLesson:()=>{S.lesson=Math.max(0,S.lesson-1);render()},nextLesson:()=>{S.lesson=Math.min(lessons.length-1,S.lesson+1);render()},complete:()=>{S.done=Math.max(S.done,S.lesson+1);S.xp+=10;save();toast("Lesson completed ✓ +10 XP");render()},wordSpeak:()=>speak(words[S.word][0]),nextWord:()=>{S.word=(S.word+1)%words.length;S.seen++;S.xp+=2;save();render()},sentenceSpeak:()=>{let a=["My name is Vinith.","I am studying MBA in Finance.","I want to improve my communication skills.","I practise English every day.","I am preparing for a corporate career."];speak(a[+(localStorage.getItem("dl_speak")||0)])},nextSentence:()=>{let i=+(localStorage.getItem("dl_speak")||0);localStorage.setItem("dl_speak",(i+1)%5);render()},nextQuiz:()=>{S.q=(S.q+1)%quiz.length;S.answered=false;render()},ask:askAI,voice:startVoice,clearChat:()=>{S.aiHistory=[];save();render()},readLast:()=>{let a=[...document.querySelectorAll("#messages .bot")].pop();if(a)speak(a.textContent)},reset:()=>{S.done=0;S.seen=0;S.score=0;S.xp=0;S.tasks=[false,false,false];S.goals=[false,false,false,false];S.aiHistory=[];save();toast("Progress reset.");render()},revealFlash:()=>{document.getElementById("flashFront")?.classList.add("hidden");document.getElementById("flashBack")?.classList.remove("hidden")},knowFlash:()=>{S.xp+=5;S.seen++;save();toast("+5 XP 🎉");S.flash=(S.flash+1)%words.length;render()},nextFlash:()=>{S.flash=(S.flash+1)%words.length;render()},saveNote:()=>{S.note=document.getElementById("noteArea").value;save();toast("Notes saved ✓")},clearNote:()=>{S.note="";save();render()},timerStart:()=>startTimer(),timerPause:()=>pauseTimer(),timerReset:()=>resetTimer(),profile,aiSettings};
document.querySelectorAll("[data-task]").forEach(b=>b.onchange=()=>{S.tasks[+b.dataset.task]=b.checked;if(S.tasks.every(Boolean)){S.xp+=30;toast("All daily tasks complete! +30 XP 🎉")}save()});
document.querySelectorAll("[data-goal]").forEach(b=>b.onchange=()=>{S.goals[+b.dataset.goal]=b.checked;if(b.checked){S.xp+=10;toast("Goal completed! +10 XP 🏅")}save();render()});
document.querySelectorAll("[data-action]").forEach(b=>b.onclick=()=>A[b.dataset.action]?.());
let i=document.getElementById("aiInput");if(i)i.onkeydown=e=>{if(e.key==="Enter")askAI()}
}
function render(){let p={home,lessons:lessonsPage,vocabulary:vocabularyPage,speaking:speakingPage,grammar:grammarPage,quiz:quizPage,ai:aiPage,flashcards:flashcardsPage,planner:plannerPage,notes:notesPage,goals:goalsPage,dashboard:dashboardPage,progress:progressPage};app.innerHTML=(p[S.page]||home)();document.querySelectorAll(".nav button").forEach(b=>b.classList.toggle("active",b.dataset.page===S.page));bind()}
document.getElementById("themeBtn").onclick=()=>{S.theme=S.theme==="dark"?"light":"dark";document.body.classList.toggle("dark",S.theme==="dark");save();document.getElementById("themeBtn").textContent=S.theme==="dark"?"☀️":"🌙"};
document.getElementById("menuBtn").onclick=()=>document.getElementById("mobileNav").classList.toggle("open");
document.body.classList.toggle("dark",S.theme==="dark");document.getElementById("themeBtn").textContent=S.theme==="dark"?"☀️":"🌙";render();