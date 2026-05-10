# C5 — Round Robin vs SJF Comparison Project

**Operating Systems Course · Helwan University · Faculty of Computer Science & AI**

A web-based simulator that implements **Round Robin (RR)** and **non-preemptive Shortest Job First (SJF)** on the same workload, compares waiting time, turnaround time, response time, and fairness, and summarizes results with Gantt charts, metrics tables, and automated analysis — aligned with the **C5** project specification (RR vs SJF only; **no SRTF**).

## Live simulator

**[Open the simulator (GitHub Pages)](https://plankygo.github.io/Operating-system-project/cpu_scheduler.html)**

*(Use the local `cpu_scheduler.html` if your fork uses a different Pages URL.)*

---

## What it does (spec checklist)

| Requirement | Implementation |
|---------------|----------------|
| RR + non-preemptive SJF | Both algorithms run on the same sorted process list |
| Time quantum | User sets **Q** for RR only; invalid **Q** is rejected |
| Dynamic processes | Add/remove processes at runtime |
| Input validation | PID, AT, BT, quantum, minimum process count |
| RR correctness | Queue rotation, arrivals, remaining burst |
| SJF correctness | Non-preemptive; shortest burst among **arrived** jobs |
| Gantt charts | Separate charts for RR and SJF |
| Metrics | Per-process **WT**, **TAT**, **RT** and averages |
| Ready queue | **Ready Queue Tracker** after RR Gantt |
| Comparison | Head-to-head table + bar charts |
| Conclusion | Q&A block covering waiting/response times, fairness, quantum effect, recommendation |

---

## Five test scenarios

| Scenario | Purpose |
|----------|---------|
| **A** | Basic mixed workload |
| **B** | Short-job–heavy (highlights SJF) |
| **C** | Fairness / balanced bursts (highlights RR) |
| **D** | Long-job sensitivity vs short jobs |
| **E** | **Validation** — loads two processes with **Q = 0**. Click **RUN SIMULATION** to see quantum rejection; then set **Q ≥ 1** to run normally |

---

## Technology

- **HTML, CSS, JavaScript** (vanilla; no build step)
- Open **`cpu_scheduler.html`** in a modern browser

---

## How to run locally

1. Clone or download this repository  
2. Open **`cpu_scheduler.html`** in Chrome, Firefox, or Edge  
3. Add processes manually or load scenarios **A–E**  
4. Set **Time Quantum** for RR  
5. Click **RUN SIMULATION**

---

## Repository layout (typical)

```
├── cpu_scheduler.html          # Single-file app (UI + logic)
├── README.md
├── Scenario_*_*.docx           # Scenario write-ups (if present)
├── RR_vs_SJF_Scheduling_Report.docx
└── screenshots/
```

---

## Input validation (summary)

Simulation is blocked when:

- Fewer than **2** processes  
- **Time quantum** empty, non-integer, or less than **1**  
- Invalid process fields when adding a row (handled on **Add Process**)

Scenario **E** deliberately sets **Q = 0** so you can demonstrate handling of an invalid quantum.

---

## Team members

| Name | ID |
|------|-----|
| Hussein Walid Hussein Awad *(Team Leader)* | 20240305 |
| Ezzeldeen Mohamed Rabie Mohamed | 20240595 |
| Amr Ahmed Mahmoud Ahmed | 20241200 |
| Mohamed Ali Ahmed Fathy | 20240859 |
| Abdelrahman Mohamed Abdullah Hussein Ahmed | 20240555 |
| Omar Walid Abdelgawad Abdelghany | 20240659 |
| Amr Mohamed Ashour Abdelnaby | 20240672 |

---

## Course information

- **University:** Helwan University  
- **Faculty:** Computer Science & Artificial Intelligence  
- **Course:** Operating Systems  
- **Year:** 2025–2026  
