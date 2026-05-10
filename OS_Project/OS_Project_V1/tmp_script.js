
let processes = [];

const COLORS = [
  '#00d4ff','#ff6b35','#7c3aed','#10b981','#f59e0b',
  '#ec4899','#06b6d4','#84cc16','#f43f5e','#8b5cf6',
  '#14b8a6','#f97316','#a855f7','#22c55e','#eab308'
];

function clearErrors() {
  ['Pid','AT','BT'].forEach(f => {
    document.getElementById('in'+f).classList.remove('error','ok');
    document.getElementById('err'+f).classList.remove('show');
  });
  hideAlert();
}

function showAlert(msg, type='error') {
  const el = document.getElementById('globalAlert');
  el.textContent = msg;
  el.className = 'alert ' + type;
}
function hideAlert() {
  document.getElementById('globalAlert').className = 'alert hidden';
}

function validateInputs() {
  let ok = true;
  const pid = document.getElementById('inPid').value.trim();
  const at  = document.getElementById('inAT').value.trim();
  const bt  = document.getElementById('inBT').value.trim();
  clearErrors();
  if (!pid || !/^[A-Za-z0-9_-]{1,6}$/.test(pid)) {
    document.getElementById('inPid').classList.add('error');
    document.getElementById('errPid').textContent = 'ID must be 1–6 alphanumeric chars';
    document.getElementById('errPid').classList.add('show');
    ok = false;
  } else if (processes.some(p => p.pid.toLowerCase() === pid.toLowerCase())) {
    document.getElementById('inPid').classList.add('error');
    document.getElementById('errPid').textContent = 'Duplicate Process ID';
    document.getElementById('errPid').classList.add('show');
    ok = false;
  } else {
    document.getElementById('inPid').classList.add('ok');
  }
  if (at === '' || isNaN(at) || Number(at) < 0 || !Number.isInteger(Number(at))) {
    document.getElementById('inAT').classList.add('error');
    document.getElementById('errAT').textContent = 'Must be a non-negative integer';
    document.getElementById('errAT').classList.add('show');
    ok = false;
  } else {
    document.getElementById('inAT').classList.add('ok');
  }
  if (bt === '' || isNaN(bt) || Number(bt) < 1 || !Number.isInteger(Number(bt))) {
    document.getElementById('inBT').classList.add('error');
    document.getElementById('errBT').textContent = 'Must be a positive integer ≥ 1';
    document.getElementById('errBT').classList.add('show');
    ok = false;
  } else {
    document.getElementById('inBT').classList.add('ok');
  }
  return ok;
}

function addProcess() {
  if (!validateInputs()) return;
  const pid = document.getElementById('inPid').value.trim();
  const at  = parseInt(document.getElementById('inAT').value);
  const bt  = parseInt(document.getElementById('inBT').value);
  const color = COLORS[processes.length % COLORS.length];
  processes.push({ pid, at, bt, color });
  renderProcessTable();
  document.getElementById('inPid').value = '';
  document.getElementById('inAT').value = '';
  document.getElementById('inBT').value = '';
  document.getElementById('inPid').focus();
  clearErrors();
  showAlert('✓ Process ' + pid + ' added (AT='+at+', BT='+bt+')', 'success');
  setTimeout(hideAlert, 2000);
}

function removeProcess(idx) {
  processes.splice(idx, 1);
  renderProcessTable();
  showAlert('Process removed', 'success');
  setTimeout(hideAlert, 1500);
}

function renderProcessTable() {
  const tbody = document.getElementById('procBody');
  document.getElementById('procCount').textContent = processes.length + ' process' + (processes.length!==1?'es':'');
  if (!processes.length) {
    tbody.innerHTML = '<tr><td colspan="5" class="empty-state">No processes yet</td></tr>';
    return;
  }
  tbody.innerHTML = processes.map((p,i) => `
    <tr>
      <td><span class="proc-color" style="background:${p.color};"></span></td>
      <td style="font-weight:700;color:${p.color}">${p.pid}</td>
      <td>${p.at}</td>
      <td>${p.bt}</td>
      <td><button class="btn btn-danger" onclick="removeProcess(${i})">✕</button></td>
    </tr>
  `).join('');
}

const SCENARIOS = {
  A: { q:3, procs:[
    {pid:'P1',at:0,bt:6},{pid:'P2',at:1,bt:4},{pid:'P3',at:2,bt:8},
    {pid:'P4',at:3,bt:3},{pid:'P5',at:4,bt:5}
  ]},
  B: { q:2, procs:[
    {pid:'P1',at:0,bt:2},{pid:'P2',at:0,bt:1},{pid:'P3',at:1,bt:3},
    {pid:'P4',at:1,bt:1},{pid:'P5',at:2,bt:2},{pid:'P6',at:3,bt:1}
  ]},
  C: { q:4, procs:[
    {pid:'P1',at:0,bt:10},{pid:'P2',at:0,bt:10},{pid:'P3',at:0,bt:10},
    {pid:'P4',at:0,bt:10}
  ]},
  D: { q:3, procs:[
    {pid:'P1',at:0,bt:20},{pid:'P2',at:1,bt:2},{pid:'P3',at:2,bt:3},
    {pid:'P4',at:3,bt:1},{pid:'P5',at:4,bt:2}
  ]}
};

function loadScenario(key) {
  const s = SCENARIOS[key];
  processes = s.procs.map((p,i) => ({...p, color: COLORS[i%COLORS.length]}));
  document.getElementById('inQ').value = s.q;
  renderProcessTable();
  hideAlert();
  showAlert('✓ Scenario ' + key + ' loaded — ' + processes.length + ' processes, Q='+s.q, 'success');
  setTimeout(hideAlert, 2000);
}

function runRR(procs, quantum) {
  const n = procs.length;
  const remaining = procs.map(p => p.bt);
  const ft = new Array(n).fill(0);
  const firstResp = new Array(n).fill(-1);

 
const gantt = [];
  const queueLog = [];
  let time = 0;
  let done = 0;
  let queue = [];
  const inQueue = new Array(n).fill(false);
  procs.forEach((p,i) => { if (p.at <= time) { queue.push(i); inQueue[i]=true; } });
  while (done < n) {
    if (!queue.length) {
      const nextArrival = Math.min(...procs.map((p,i) => (!inQueue[i] && remaining[i]>0) ? p.at : Infinity));
      if (nextArrival === Infinity) break;
      gantt.push({pid:'IDLE', color:'#1f2d42', start:time, end:nextArrival});
      time = nextArrival;
      procs.forEach((p,i) => { if (!inQueue[i] && p.at<=time && remaining[i]>0){ queue.push(i); inQueue[i]=true; } });
      continue;
    }
    const idx = queue.shift();
    if (firstResp[idx] === -1) firstResp[idx] = time;
    const exec = Math.min(quantum, remaining[idx]);
    const start = time;
    time += exec;
    remaining[idx] -= exec;
    gantt.push({pid: procs[idx].pid, color: procs[idx].color, start, end: time});
    procs.forEach((p,i) => { if (!inQueue[i] && p.at<=time && remaining[i]>0){ queue.push(i); inQueue[i]=true; } });
    if (remaining[idx] > 0) {
      queue.push(idx);
    } else {
      ft[idx] = time;
      done++;
    }
    queueLog.push({ time: start, running: procs[idx].pid, queue: queue.map(i=>procs[i].pid) });
  }
  const metrics = procs.map((p,i) => {
    const tat = ft[i] - p.at;
    const wt  = tat - p.bt;
    const rt  = firstResp[i] - p.at;
    return { pid:p.pid, color:p.color, at:p.at, bt:p.bt, ft:ft[i], tat, wt, rt };
  });
  return { gantt, metrics, queueLog };
}

function runSJF(procs) {
  const n = procs.length;
  const done = new Array(n).fill(false);
  const ft = new Array(n).fill(0);
  const firstResp = new Array(n).fill(-1);
  const gantt = [];
  let time = 0;
  let completed = 0;
  while (completed < n) {
    const available = procs.map((p,i) => (!done[i] && p.at <= time) ? i : -1).filter(i=>i>=0);
    if (!available.length) {
      const next = Math.min(...procs.map((p,i) => !done[i] ? p.at : Infinity));
      gantt.push({pid:'IDLE', color:'#1f2d42', start:time, end:next});
      time = next;
      continue;
    }
    available.sort((a,b) => procs[a].bt !== procs[b].bt ? procs[a].bt-procs[b].bt : procs[a].at-procs[b].at);
    const idx = available[0];
    firstResp[idx] = time;
    const start = time;
    time += procs[idx].bt;
    ft[idx] = time;
    done[idx] = true;
    completed++;
    gantt.push({pid: procs[idx].pid, color: procs[idx].color, start, end: time});
  }
  const metrics = procs.map((p,i) => {
    const tat = ft[i] - p.at;
    const wt  = tat - p.bt;
    const rt  = firstResp[i] - p.at;
    return { pid:p.pid, color:p.color, at:p.at, bt:p.bt, ft:ft[i], tat, wt, rt };
  });
  return { gantt, metrics };
}

function runSimulation() {
  hideAlert();
  if (!processes.length) { showAlert('⚠ Add at least one process before running.'); return; }
  if (processes.length < 2) { showAlert('⚠ Add at least 2 processes for meaningful comparison.'); return; }
  const qVal = document.getElementById('inQ').value.trim();
  if (!qVal || isNaN(qVal) || parseInt(qVal) < 1) {
    showAlert('⚠ Time Quantum must be a positive integer ≥ 1.');
    document.getElementById('inQ').classList.add('error');
    return;
  }
  const quantum = parseInt(qVal);
  const sorted = [...processes].sort((a,b)=>a.at-b.at || a.pid.localeCompare(b.pid));
  const rrResult  = runRR([...sorted], quantum);
  const sjfResult = runSJF([...sorted]);
  renderResults(rrResult, sjfResult, quantum, sorted);
  document.getElementById('legendPanel').style.display='block';
  renderLegend(sorted);
}

function avg(arr, key) {
  return arr.reduce((s,x)=>s+x[key],0)/arr.length;
}

function stdev(arr) {
  const m = arr.reduce((a,b)=>a+b,0)/arr.length;
  return Math.sqrt(arr.reduce((s,x)=>s+(x-m)**2,0)/arr.length);
}

 
function renderResults(rr, sjf, quantum, procs) {
  const area = document.getElementById('resultsArea');
  area.innerHTML = '';
  area.classList.add('fade-in');
  const rrAvgWT=avg(rr.metrics,'wt'), rrAvgTAT=avg(rr.metrics,'tat'), rrAvgRT=avg(rr.metrics,'rt');
  const sjfAvgWT=avg(sjf.metrics,'wt'), sjfAvgTAT=avg(sjf.metrics,'tat'), sjfAvgRT=avg(sjf.metrics,'rt');

  area.innerHTML += `
  <div class="panel fade-in">
    <div class="panel-header">
      <div class="dot" style="background:var(--yellow);box-shadow:0 0 8px var(--yellow);"></div>
      <h2>Simulation Summary</h2>
    </div>
    <div class="panel-body">
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;">
        <div>
          <div style="font-size:11px;color:var(--rr-color);font-family:'JetBrains Mono',monospace;margin-bottom:8px;font-weight:700;">◈ ROUND ROBIN (Q=${quantum})</div>
          <div class="stats-row">
            <div class="stat-pill rr-stat"><div class="sv">${rrAvgWT.toFixed(2)}</div><div class="sk">Avg WT</div></div>
            <div class="stat-pill rr-stat"><div class="sv">${rrAvgTAT.toFixed(2)}</div><div class="sk">Avg TAT</div></div>
            <div class="stat-pill rr-stat"><div class="sv">${rrAvgRT.toFixed(2)}</div><div class="sk">Avg RT</div></div>
          </div>
        </div>
        <div>
          <div style="font-size:11px;color:var(--sjf-color);font-family:'JetBrains Mono',monospace;margin-bottom:8px;font-weight:700;">◈ SHORTEST JOB FIRST</div>
          <div class="stats-row">
            <div class="stat-pill sjf-stat"><div class="sv">${sjfAvgWT.toFixed(2)}</div><div class="sk">Avg WT</div></div>
            <div class="stat-pill sjf-stat"><div class="sv">${sjfAvgTAT.toFixed(2)}</div><div class="sk">Avg TAT</div></div>
            <div class="stat-pill sjf-stat"><div class="sv">${sjfAvgRT.toFixed(2)}</div><div class="sk">Avg RT</div></div>
          </div>
        </div>
      </div>
    </div>
  </div>`;

  area.innerHTML += buildGanttPanel(rr.gantt,'ROUND ROBIN','rr',quantum);
  area.innerHTML += buildQueuePanel(rr.queueLog, procs);
  area.innerHTML += buildGanttPanel(sjf.gantt,'SHORTEST JOB FIRST','sjf');

  area.innerHTML += `
  <div class="panel fade-in">
    <div class="panel-header">
      <div class="dot" style="background:var(--green);box-shadow:0 0 8px var(--green);"></div>
      <h2>Performance Metrics</h2>
    </div>
    <div style="padding:0;">
      <div class="tab-row">
        <button class="tab-btn active" onclick="switchTab(this,'tabRRMetrics')">Round Robin</button>
        <button class="tab-btn sjf-tab" onclick="switchTab(this,'tabSJFMetrics')">SJF</button>
      </div>
      <div id="tabRRMetrics" class="tab-content active">
        ${buildMetricsTable(rr.metrics,rrAvgWT,rrAvgTAT,rrAvgRT,sjf.metrics,'rr')}
      </div>
      <div id="tabSJFMetrics" class="tab-content">
        ${buildMetricsTable(sjf.metrics,sjfAvgWT,sjfAvgTAT,sjfAvgRT,rr.metrics,'sjf')}
      </div>
    </div>
  </div>`;

  area.innerHTML += buildComparison(rrAvgWT,rrAvgTAT,rrAvgRT,sjfAvgWT,sjfAvgTAT,sjfAvgRT,rr,sjf,quantum);
  area.innerHTML += buildConclusion(rrAvgWT,rrAvgTAT,rrAvgRT,sjfAvgWT,sjfAvgTAT,sjfAvgRT,rr,sjf,quantum,procs);
}

function buildGanttPanel(gantt, title, cls, quantum) {
  const total = gantt[gantt.length-1]?.end || 1;
  const scale = Math.max(600, gantt.length * 30);
  let blocks = gantt.map(b => {
    const w = Math.max(24, ((b.end-b.start)/total*scale));
    return `<div class="gantt-block ${b.pid==='IDLE'?'idle':''}" style="width:${w}px;background:${b.pid==='IDLE'?'var(--surface3)':b.color};" title="${b.pid} [${b.start}–${b.end}]"><span>${b.pid==='IDLE'?'_':b.pid}</span></div>`;
  }).join('');
  const keyTimes = [...new Set(gantt.flatMap(b=>[b.start,b.end]))].sort((a,b)=>a-b);
  let ticks = keyTimes.map((t,i) => {
    const prev = i>0?keyTimes[i-1]:0;
    const w = i===0?0:Math.max(24,((t-prev)/total*scale));
    return `<span class="gantt-tick" style="width:${w}px;display:inline-block;text-align:right;">${t}</span>`;
  }).join('');
  return `
  <div class="gantt-section panel fade-in">
    <div class="gantt-header">
      <span class="gantt-title ${cls}">⬛ Gantt Chart — ${title}${quantum?' (Q='+quantum+')':''}</span>
      <span style="font-size:11px;color:var(--text3);font-family:'JetBrains Mono',monospace;">Total: ${total} units</span>
    </div>
    <div class="gantt-body">
      <div class="gantt-track-label">EXECUTION TIMELINE</div>
      <div class="gantt-track" style="min-width:${scale}px;">${blocks}</div>
      <div class="gantt-ticks" style="min-width:${scale}px;">${ticks}</div>
    </div>
  </div>`;
}

function buildQueuePanel(queueLog, procs) {
  if (!queueLog.length) return '';
  const pMap = {};
  procs.forEach(p => pMap[p.pid]=p.color);
  const rows = queueLog.map(entry => {
    const qItems = entry.queue.map(pid => `<span class="queue-item" style="background:${pMap[pid]||'#666'}">${pid}</span>`).join('');
    return `<div class="queue-row">
      <span class="queue-time">t=${entry.time}</span>
      <span class="queue-label">Running: </span>
      <span class="queue-item" style="background:${pMap[entry.running]||'#666'};margin-right:8px;">${entry.running}</span>
      <span class="queue-label">→ Queue: </span>
      <div class="queue-items">${qItems||'<span style="color:var(--text3);font-size:11px;font-family:JetBrains Mono,monospace">empty</span>'}</div>
    </div>`;
  }).join('');
  return `
  <div class="panel fade-in">
    <div class="panel-header">
      <div class="dot" style="background:var(--rr-color);box-shadow:0 0 8px var(--rr-color);"></div>
      <h2>Ready Queue Tracker — Round Robin</h2>
    </div>
    <div class="panel-body">
      <div class="section-title">Queue state at each dispatch</div>
      <div style="max-height:260px;overflow-y:auto;">${rows}</div>
    </div>
  </div>`;
}

function buildMetricsTable(metrics, avgWT, avgTAT, avgRT, otherMetrics, cls) {
  const otherMap = {};
  otherMetrics.forEach(m => otherMap[m.pid]=m);
  const rows = metrics.map(m => {
    const oWT=otherMap[m.pid]?.wt, oTAT=otherMap[m.pid]?.tat, oRT=otherMap[m.pid]?.rt;
    const wtB=oWT!==undefined?(m.wt<=oWT?'best':''):'';
    const tatB=oTAT!==undefined?(m.tat<=oTAT?'best':''):'';
    const rtB=oRT!==undefined?(m.rt<=oRT?'best':''):'';
    return `<tr>
      <td><span class="proc-color" style="background:${m.color}"></span></td>
      <td style="font-weight:700;color:${m.color}">${m.pid}</td>
      <td>${m.at}</td><td>${m.bt}</td><td>${m.ft}</td>
      <td class="metric-val ${wtB}">${m.wt}</td>
      <td class="metric-val ${tatB}">${m.tat}</td>
      <td class="metric-val ${rtB}">${m.rt}</td>
    </tr>`;
  }).join('');
  return `<div class="metrics-table-wrap">
    <table class="metrics-table ${cls==='sjf'?'sjf-table':''}">
      <thead><tr><th></th><th>PID</th><th>AT</th><th>BT</th><th>FT</th><th>WT</th><th>TAT</th><th>RT</th></tr></thead>
      <tbody>${rows}
        <tr class="avg-row"><td colspan="5">AVERAGES</td><td>${avgWT.toFixed(2)}</td><td>${avgTAT.toFixed(2)}</td><td>${avgRT.toFixed(2)}</td></tr>
      </tbody>
    </table>
    <div style="font-size:10px;color:var(--green);margin-top:6px;font-family:'JetBrains Mono',monospace;">🟢 Green = better than the other algorithm</div>
  </div>`;
}


function buildComparison(rrWT,rrTAT,rrRT,sjfWT,sjfTAT,sjfRT,rr,sjf,quantum) {
  const rrStdev=stdev(rr.metrics.map(m=>m.wt));
  const sjfStdev=stdev(sjf.metrics.map(m=>m.wt));
  const overallRR=[rrWT<=sjfWT,rrTAT<=sjfTAT,rrRT<=sjfRT,rrStdev<=sjfStdev].filter(Boolean).length;
  const overallWin=overallRR>=2?'Round Robin':'SJF';
  const overallColor=overallWin==='Round Robin'?'var(--rr-color)':'var(--sjf-color)';
  const maxVal=Math.max(rrWT,rrTAT,rrRT,sjfWT,sjfTAT,sjfRT,1);

  function row(label,rrV,sjfV) {
    const win=rrV<=sjfV?'RR':'SJF';
    return `<tr>
      <td class="comp-key">${label}</td>
      <td class="comp-val ${win==='RR'?'win':'lose'}" style="text-align:right">${typeof rrV==='number'?rrV.toFixed(2):rrV}${win==='RR'?' ✓':''}</td>
      <td class="comp-val ${win==='SJF'?'win':'lose'}" style="text-align:right">${typeof sjfV==='number'?sjfV.toFixed(2):sjfV}${win==='SJF'?' ✓':''}</td>
    </tr>`;
  }

  return `
  <div class="panel fade-in">
    <div class="panel-header">
      <div class="dot" style="background:var(--accent3);box-shadow:0 0 8px var(--accent3);"></div>
      <h2>Head-to-Head Comparison</h2>
    </div>
    <div class="panel-body">
      <table style="width:100%;border-collapse:collapse;font-family:'JetBrains Mono',monospace;font-size:12px;">
        <thead>
          <tr>
            <th style="padding:8px;background:var(--surface2);color:var(--text3);text-align:left;font-size:10px;letter-spacing:1px;">METRIC</th>
            <th style="padding:8px;background:rgba(0,212,255,0.1);color:var(--rr-color);text-align:right;font-size:11px;">RR (Q=${quantum})</th>
            <th style="padding:8px;background:rgba(255,107,53,0.1);color:var(--sjf-color);text-align:right;font-size:11px;">SJF</th>
          </tr>
        </thead>
        <tbody>
          ${row('Avg Waiting Time',rrWT,sjfWT)}
          ${row('Avg Turnaround Time',rrTAT,sjfTAT)}
          ${row('Avg Response Time',rrRT,sjfRT)}
          ${row('WT Std Dev (Fairness)',rrStdev,sjfStdev)}
          ${row('Min WT',Math.min(...rr.metrics.map(m=>m.wt)),Math.min(...sjf.metrics.map(m=>m.wt)))}
          ${row('Max WT',Math.max(...rr.metrics.map(m=>m.wt)),Math.max(...sjf.metrics.map(m=>m.wt)))}
          ${row('Min TAT',Math.min(...rr.metrics.map(m=>m.tat)),Math.min(...sjf.metrics.map(m=>m.tat)))}
          ${row('Max TAT',Math.max(...rr.metrics.map(m=>m.tat)),Math.max(...sjf.metrics.map(m=>m.tat)))}
        </tbody>
      </table>
      <div style="height:1px;background:var(--border);margin:16px 0;"></div>
      <div class="section-title">Visual Comparison</div>
      <div class="bar-compare">
        ${barRow('Avg Waiting Time',rrWT,sjfWT,maxVal)}
        ${barRow('Avg Turnaround Time',rrTAT,sjfTAT,maxVal)}
        ${barRow('Avg Response Time',rrRT,sjfRT,maxVal)}
      </div>
      <div style="margin-top:16px;padding:16px;border-radius:10px;background:rgba(16,185,129,0.08);border:1px solid rgba(16,185,129,0.2);text-align:center;">
        <div style="font-size:12px;color:var(--text3);margin-bottom:4px;font-family:'JetBrains Mono',monospace;">OVERALL WINNER</div>
        <div style="font-size:22px;font-weight:800;color:${overallColor};">${overallWin}</div>
        <div style="font-size:11px;color:var(--text2);margin-top:4px;font-family:'JetBrains Mono',monospace;">Won ${Math.max(overallRR,4-overallRR)} of 4 comparison metrics</div>
      </div>
    </div>
  </div>`;
}


function barRow(label,rrV,sjfV,maxV) {
  const rrW=(rrV/maxV*100).toFixed(1), sjfW=(sjfV/maxV*100).toFixed(1);
  return `<div class="bar-item">
    <div class="bar-label"><span>${label}</span><span style="color:var(--text3);">RR: ${rrV.toFixed(2)} | SJF: ${sjfV.toFixed(2)}</span></div>
    <div style="display:flex;flex-direction:column;gap:3px;">
      <div style="display:flex;align-items:center;gap:8px;">
        <span style="font-size:10px;color:var(--rr-color);width:24px;font-family:'JetBrains Mono',monospace;">RR</span>
        <div class="bar-track" style="flex:1;"><div class="bar-fill rr" style="width:${rrW}%"></div></div>
      </div>
      <div style="display:flex;align-items:center;gap:8px;">
        <span style="font-size:10px;color:var(--sjf-color);width:24px;font-family:'JetBrains Mono',monospace;">SJF</span>
        <div class="bar-track" style="flex:1;"><div class="bar-fill sjf" style="width:${sjfW}%"></div></div>
      </div>
    </div>
  </div>`;
}

 
function buildConclusion(rrWT,rrTAT,rrRT,sjfWT,sjfTAT,sjfRT,rr,sjf,quantum,procs) {
  const rrStdev=stdev(rr.metrics.map(m=>m.wt));
  const sjfStdev=stdev(sjf.metrics.map(m=>m.wt));
  const wtWin=rrWT<=sjfWT?'Round Robin':'SJF';
  const rtWin=rrRT<=sjfRT?'Round Robin':'SJF';
  const shortJobPids=procs.filter(p=>p.bt<=3).map(p=>p.pid).join(', ')||'none';
  const overallRR=[rrWT<=sjfWT,rrTAT<=sjfTAT,rrRT<=sjfRT,rrStdev<=sjfStdev].filter(Boolean).length;
  const recommend=overallRR>=2?'Round Robin':'SJF';
  const recommendReason=recommend==='Round Robin'?'provides fairer distribution and better response times (Q='+quantum+')':'minimizes waiting time and turnaround time, especially for short jobs';

  return `
  <div class="conclusion-panel panel fade-in">
    <div class="panel-header">
      <div class="dot" style="background:var(--yellow);box-shadow:0 0 8px var(--yellow);"></div>
      <h2>Analysis & Conclusion</h2>
    </div>
    <div class="panel-body">
      <div class="q-item">
        <div class="q-question">Q1. Which algorithm gave lower average waiting time?</div>
        <div class="q-answer">${wtWin} — WT: RR=${rrWT.toFixed(2)}, SJF=${sjfWT.toFixed(2)}</div>
      </div>
      <div class="q-item ${rtWin==='SJF'?'sjf-q':''}">
        <div class="q-question">Q2. Which algorithm gave lower average response time?</div>
        <div class="q-answer">${rtWin} — RT: RR=${rrRT.toFixed(2)}, SJF=${sjfRT.toFixed(2)}</div>
      </div>
      <div class="q-item">
        <div class="q-question">Q3. Did Round Robin appear fairer across all processes?</div>
        <div class="q-answer">${rrStdev<=sjfStdev?'Yes — RR WT std dev ('+rrStdev.toFixed(2)+') < SJF ('+sjfStdev.toFixed(2)+'), indicating more balanced service':'Not in this case — SJF std dev ('+sjfStdev.toFixed(2)+') < RR ('+rrStdev.toFixed(2)+') for this workload'}</div>
      </div>
      <div class="q-item sjf-q">
        <div class="q-question">Q4. Did SJF complete short jobs more efficiently?</div>
        <div class="q-answer">Yes — SJF always picks the shortest available job. Short processes (${shortJobPids}) get priority, achieving lower individual TAT compared to RR.</div>
      </div>
      <div class="q-item">
        <div class="q-question">Q5. How did the chosen quantum (Q=${quantum}) affect Round Robin?</div>
        <div class="q-answer">${quantum<=2?'Q='+quantum+' is small — high context-switch overhead, very responsive. Good for interactive systems.':quantum<=5?'Q='+quantum+' is moderate — balanced responsiveness and overhead. Suitable for general-purpose workloads.':'Q='+quantum+' is large — RR behaves closer to FCFS, reducing fairness benefits but lowering context-switch overhead.'}</div>
      </div>
      <div class="q-item ${recommend==='SJF'?'sjf-q':''}">
        <div class="q-question">Q6. Which algorithm would you recommend for this workload?</div>
        <div class="q-answer">▶ ${recommend} — it ${recommendReason}. Score: RR won ${overallRR}/4 metrics, SJF won ${4-overallRR}/4.</div>
      </div>
      <div style="height:1px;background:var(--border);margin:16px 0;"></div>
      <div class="section-title">Required Conclusion Statements</div>
      <div style="display:flex;flex-direction:column;gap:8px;font-size:12px;font-family:'JetBrains Mono',monospace;color:var(--text2);">
        <div>• <strong style="color:var(--text)">Avg WT:</strong> ${rrWT<=sjfWT?'Round Robin':'SJF'} performed better (${Math.min(rrWT,sjfWT).toFixed(2)} vs ${Math.max(rrWT,sjfWT).toFixed(2)})</div>
        <div>• <strong style="color:var(--text)">Avg TAT:</strong> ${rrTAT<=sjfTAT?'Round Robin':'SJF'} performed better (${Math.min(rrTAT,sjfTAT).toFixed(2)} vs ${Math.max(rrTAT,sjfTAT).toFixed(2)})</div>
        <div>• <strong style="color:var(--text)">Avg RT:</strong> ${rrRT<=sjfRT?'Round Robin':'SJF'} performed better (${Math.min(rrRT,sjfRT).toFixed(2)} vs ${Math.max(rrRT,sjfRT).toFixed(2)})</div>
        <div>• <strong style="color:var(--text)">Balance:</strong> Round Robin ${rrStdev<=sjfStdev?'appeared more balanced (lower WT std dev)':'showed less balance than SJF in this case'}</div>
        <div>• <strong style="color:var(--text)">Efficiency:</strong> SJF appeared more efficient for shortest jobs</div>
        <div>• <strong style="color:var(--text)">Quantum effect:</strong> Q=${quantum} resulted in RR avg RT=${rrRT.toFixed(2)}</div>
      </div>
    </div>
  </div>`;
}

function renderLegend(procs) {
  document.getElementById('legendContainer').innerHTML = procs.map(p => `
    <div class="legend-item"><div class="legend-dot" style="background:${p.color}"></div>${p.pid} (AT:${p.at}, BT:${p.bt})</div>
  `).join('');
}

function switchTab(btn, tabId) {
  const parent = btn.closest('.panel');
  parent.querySelectorAll('.tab-btn').forEach(b=>b.classList.remove('active'));
  parent.querySelectorAll('.tab-content').forEach(t=>t.classList.remove('active'));
  btn.classList.add('active');
  document.getElementById(tabId).classList.add('active');
}

function resetAll() {
  processes = [];
  renderProcessTable();
  hideAlert();
  document.getElementById('resultsArea').innerHTML = `
    <div class="placeholder">
      <h3>⚙ Awaiting Simulation</h3>
      <p>Add processes and click RUN SIMULATION<br>to see Gantt charts, metrics, and comparison</p>
    </div>`;
  document.getElementById('legendPanel').style.display='none';
  document.getElementById('inPid').value='';
  document.getElementById('inAT').value='';
  document.getElementById('inBT').value='';
  document.getElementById('inQ').value='2';
  clearErrors();
}

document.addEventListener('keydown', e => {
  if (e.key==='Enter' && ['inPid','inAT','inBT'].includes(document.activeElement.id)) addProcess();
});

