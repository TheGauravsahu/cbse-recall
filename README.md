# CBSE Recall 🧠

A premium educational web application built for Class 10 CBSE students to study through **active recall** and **spaced repetition** rather than passive rote memorization. Designed with a calm, high-end minimalist interface inspired by Linear, Notion, and Apple.

👉 **GitHub Repository**: [https://github.com/TheGauravsahu/cbse-recall](https://github.com/TheGauravsahu/cbse-recall)

---

## 🚀 Key Features

* **Active Recall Learning Model**: Swap textbook reading for active quizzes that trigger critical connections in memory.
* **Spaced Repetition Scheduler**: Automatically logs correct and incorrect answers to queues. Review intervals scale progressively: 1 day $\rightarrow$ 3 days $\rightarrow$ 7 days $\rightarrow$ 15 days $\rightarrow$ 30 days based on recall confidence.
* **NCERT Study Flashcards**: Tinder-style swipe cards supporting flip actions to reveal textbook keys, awarding +5 XP for successful recalls.
* **Interactive Formula Sheet & PDF Export**: A complete trigonometric ratio grid and math sheet that prints onto a single page when clicking **Export PDF**.
* **Advanced SVG Analytics**: Zero-overhead, highly performant SVG visualizations including a GitHub-style contribution heatmap logging daily solves, an accuracy trend curve, and response speed trackers by subject.
* **PWA Offline Support**: Fully installable PWA that functions completely offline using stale-while-revalidate service workers.
* **Duolingo-style gamification**: Complete levels, maintain daily streaks, earn gold coins, unlock achievements, and practice in **Survival Mode** with 5 hearts.

---

## 🛠️ Technology Stack

* **Frontend Framework**: React.js (Vite)
* **Styling**: Tailwind CSS v4 (incorporating glassmorphism variables)
* **State Management**: Zustand (persisted state decoupled into 10 independent stores)
* **Animations**: Framer Motion & native CSS micro-animations
* **Icons**: Lucide React
* **Chimes**: Web Audio API (for weightless, offline-capable chimes)

---

## 📂 Project Architecture

```bash
quizz/
├── public/
│   ├── favicon.svg        # Theme-aligned vector branding icon
│   ├── manifest.json      # PWA application metadata config
│   └── sw.js              # Service Worker offline caching strategy
├── src/
│   ├── components/        # Layout shells (Navbar, BottomNav)
│   ├── data/              # CBSE syllabus registries and question banks
│   ├── features/          # Decoupled feature-based modules
│   │   ├── dashboard/     # Study hubs and recommendations engine
│   │   ├── revision/      # Spaced repetition lists and flashcard deck
│   │   ├── formulas/      # Formulas grids and star bookmarking
│   │   ├── profile/       # SVG Analytics heatmaps and accuracy lines
│   │   └── settings/      # Sound settings and profiles portability backups
│   ├── stores/            # Decoupled Zustand state stores
│   ├── utils/             # Native sound synthesis and confetti triggers
│   ├── App.jsx            # Routing structure
│   └── index.css          # Tailwind variables and dark theme variant classes
```

---

## 💻 Installation & Setup

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/TheGauravsahu/cbse-recall.git
   cd cbse-recall
   ```

2. **Install Dependencies**:
   ```bash
   pnpm install
   # or: npm install / yarn install
   ```

3. **Run the Development Server**:
   ```bash
   pnpm dev
   ```

4. **Compile Production Package**:
   ```bash
   pnpm build
   ```

---

## ⚖️ License

Distributed under the MIT License. See `LICENSE` for more information.
