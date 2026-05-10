# CPU Scheduling Simulator — Round Robin vs SJF

**Operating Systems Course | Helwan University | Faculty of Computer Science & AI**

A web-based CPU scheduling simulator that compares Round Robin (RR), Non-Preemptive Shortest Job First (SJF), and Preemptive SJF (SRTF) algorithms with interactive Gantt charts, metrics tables, and visual comparisons.

## 🚀 Live Simulator

**[▶ Click here to run the simulator](https://plankygo.github.io/Operating-system-project/cpu_scheduler.html)**

---

## Project Description

This simulator allows users to input custom processes or load prebuilt scenarios and instantly visualize how three CPU scheduling algorithms handle the same workload. It computes and compares:

- Average Waiting Time (WT)
- Average Turnaround Time (TAT)
- Average Response Time (RT)
- Fairness (WT Standard Deviation)

The project covers 5 documented scenarios:
- **Scenario A** — Basic Mixed Workload
- **Scenario B** — Short-Job Heavy Case
- **Scenario C** — Fairness Case
- **Scenario D** — Long-Job Sensitivity Case
- **Scenario E** — Input Validation Case

---

## Implementation Technology

- **Language:** HTML, CSS, JavaScript (Vanilla)
- **GUI:** Browser-based interface with interactive Gantt charts, ready queue tracker, metrics tables, and bar chart comparisons
- **No frameworks or installations required**

---

## How to Run

1. Clone or download this repository
2. Open `cpu_scheduler.html` in any modern web browser (Chrome, Firefox, Edge)
3. Add processes manually or click one of the preloaded scenario buttons (A, B, C, D)
4. Set the Time Quantum for Round Robin
5. Click **RUN SIMULATION**

That's it — no setup, no install, no server needed.

---

## Repository Structure

```
Operating-system-project/
│
├── cpu_scheduler.html          # Main simulator (source code)
├── README.md                   # Project documentation
│
├── Scenario_A_mixed.docx       # Scenario A documentation
├── Scenario_B_Short.docx       # Scenario B documentation
├── Scenario_C_Fairness.docx    # Scenario C documentation
├── Scenario_D_Long.docx        # Scenario D documentation
├── Scenario_E_Validation_Case-1.docx  # Scenario E documentation
├── RR_vs_SJF_Scheduling_Report.docx   # Full comparison report
│
└── screenshots/                # Interface and Gantt chart screenshots
```

---

## Features

- Add custom processes with validation (no negative values, no duplicates, no zero quantum)
- Preloaded Scenario buttons (A, B, C, D) for instant simulation
- Interactive color-coded Gantt charts for all three algorithms
- Ready Queue Tracker for Round Robin
- Per-process metrics table with best values highlighted in green
- Head-to-head comparison table with visual bar charts
- Auto-generated analysis answers (Q1–Q7)
- Reset button to clear all inputs

---

## Input Validation

The simulator rejects:
- Quantum ≤ 0 or non-integer
- Burst Time < 1 or negative
- Arrival Time < 0
- Duplicate Process IDs
- Less than 2 processes

---

## Team Members

| Name | ID |
|---|---|
| Hussein Walid Hussein Awad *(Team Leader)* | 20240305 |
| Ezzeldeen Mohamed Rabie Mohamed | 20240595 |
| Amr Ahmed Mahmoud Ahmed | 20241200 |
| Mohamed Ali Ahmed Fathy | 20240859 |
| Abdelrahman Mohamed Abdullah Hussein Ahmed | 20240555 |
| Omar Walid Abdelgawad Abdelghany | 20240659 |
| Amr Mohamed Ashour Abdelnaby | 20240672 |

---

## Course Information

- **University:** Helwan University
- **Faculty:** Computer Science & Artificial Intelligence
- **Course:** Operating Systems
- **Year:** 2025–2026
