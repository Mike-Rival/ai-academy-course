# ai-academy

Interactive, browser-based course covering Python, ML (scikit-learn), AI (transformers), and LLM literacy for the workplace. Runs real Python and real model inference directly in the user's browser — no server-side execution, no logins, no data leaves the device.

## Status

**All 44 lessons authored** across four tracks:

- **Python Basics** (10): variables → types → control flow → loops → functions → lists/dicts → files/strings → numpy → pandas → mini project.
- **Machine Learning Basics** (10): what-is-ML → linear regression → classification → train/test split → cross-validation → trees & forests → clustering → pipelines → feature engineering → end-to-end project.
- **AI & Deep Learning** (10): tokenization → embeddings → attention → transformer architecture → pre-trained models → fine-tuning concepts → prompting → RAG basics → evaluation → capstone.
- **Working with LLMs** (14, no coding required): how LLMs work → trust calibration → hallucinations → conversation rot → citations → unverifiability trap → self-judgment → validation framework → mitigations → reading claims critically → where they help → privacy → prompting hygiene → capstone.

Each lesson is fully interactive: code lessons run real Python in the browser with auto-graded exercises; non-code lessons use multiple choice, categorize, and reflection components.

The home page features **Working with LLMs** as the "start here" track (it needs no coding and has the broadest audience); the three coding tracks are grouped beneath it. Which track is featured is controlled by the `featured`, `badge`, and `highlights` fields in [`lib/curriculum.ts`](./lib/curriculum.ts).

## Stack

| Layer | Choice | Why |
|---|---|---|
| Framework | Next.js 15 (App Router) | Static export = deploy-agnostic |
| Language | TypeScript, strict | Catch issues at build |
| Styling | Tailwind CSS | No CSS file sprawl |
| Editor | Monaco (`@monaco-editor/react`) | Same editor as VS Code |
| Python | Pyodide 0.28 in a Web Worker | Real CPython + numpy/pandas/sklearn in browser |
| AI/DL | (Track 3, planned) transformers.js for inference; "Open in Colab" for training | Pyodide can't run PyTorch |
| Progress | `localStorage` | No backend; trivial to swap later |
| Content | TSX page-per-lesson | Embeds exercises as React components |

## Run locally

```bash
npm install
npm run dev
# → http://localhost:3000
```

## Build a static site

```bash
npm run build
# → ./out/ is a fully static site
```

Serve `./out/` from any static host: Azure Static Web Apps, Cloudflare Pages, GitHub Pages, Vercel, S3+CloudFront, an internal Nginx, anything. No Node runtime needed in production.

## Recommended hosting

Deploy targets the build supports:

- **GitHub Pages** — what this repo is currently set up for. See the workflow at `.github/workflows/deploy.yml`. Public.
- **Cloudflare Pages** — drop-in, free, can be gated behind SSO via Cloudflare Access.
- **Azure Static Web Apps** — best fit for M365 orgs (Entra ID auth out of the box).
- **Vercel / Netlify / S3+CloudFront / any static host** — works.

Why not SharePoint: SharePoint static-file serving rewrites MIME types and blocks the cross-origin headers Pyodide needs for some features. Don't fight it.

## Architecture notes

### Pyodide in a Web Worker

`public/pyodide-worker.js` is a classic Web Worker. It loads Pyodide from the jsDelivr CDN on first use and keeps the runtime warm across exercises on the same page. Student code runs in a fresh namespace per call so prior runs don't leak state. After student code runs, optional test assertions execute against that namespace; failures surface as inline check results.

The worker is loaded by [`lib/pyodide-client.ts`](./lib/pyodide-client.ts), which exposes `preloadPyodide()` and `runPython()`. `CodeExercise` calls `preloadPyodide()` on mount so the runtime is ready when the user hits "Run & Check".

**On large packages** (numpy ~7MB, pandas ~20MB, scikit-learn ~10MB): these are loaded on demand via the `packages` prop on each `CodeExercise`. First load on a sklearn lesson will take a few seconds; subsequent runs are instant.

**Cross-origin headers:** Pyodide's basic usage (single-threaded) does not require COOP/COEP. If you later enable threaded packages, set:
- `Cross-Origin-Opener-Policy: same-origin`
- `Cross-Origin-Embedder-Policy: require-corp`

on the host. (`next.config.mjs` does not set these because they're ignored under `output: 'export'` — apply them at the host instead.)

### Exercise authoring

A code exercise:

```tsx
<CodeExercise
  exerciseId="python/03-control-flow/fizzbuzz"
  prompt={<>Print the numbers 1–15 with FizzBuzz rules.</>}
  starterCode={`for i in range(1, 16):\n    pass  # your code`}
  tests={[
    { name: "Prints 15 lines", code: "..." },
    { name: "Replaces multiples of 3", code: "..." },
  ]}
  packages={['numpy']}   // optional; omit if not needed
  hint={<>Use modulo (<code>%</code>) to test divisibility.</>}
  solution={`...`}
/>
```

Tests are Python assertion strings run against the student's namespace via Pyodide. `hint` and `solution` are both optional but encouraged. On all-passing, the exercise is marked complete in `localStorage`.

A non-code exercise (Track 4):

```tsx
<MultipleChoice
  exerciseId="..."
  prompt={<>...</>}
  options={[
    { id: 'a', text: '...', correct: true, rationale: '...' },
    { id: 'b', text: '...', rationale: 'Why this is wrong.' },
  ]}
/>
```

Rationale is shown for **every option after submission**, not just the correct one. The point of Track 4 is risk literacy, so explaining *why* the wrong answer is wrong matters as much as confirming the right one.

### Track 4 pedagogy (read before writing lessons in this track)

The LLM literacy track teaches **risk literacy, not prescriptions**. Every lesson should:

1. Show concrete bad examples, not abstract warnings.
2. Walk through downstream cost when the bad output is acted on.
3. End with a verification strategy or a "decline to use as ground truth" call.

See [`memory/feedback_llm_rigor.md`](../../.claude/projects/-Users-mcaiola-MLXQD49MGW-code-MLcourse/memory/feedback_llm_rigor.md) for the full principles list and the rationale.

## Adding a new lesson

1. Add an entry to the right track in `lib/curriculum.ts` and set `status: 'available'`.
2. Create `app/tracks/<track-slug>/<lesson-slug>/page.tsx`.
3. Import `LessonShell`, `getLessonNav`, and the exercise components you need.
4. Pattern your file after `app/tracks/python/01-variables/page.tsx` (code track) or `app/tracks/llm-literacy/01-what-llms-actually-do/page.tsx` (non-code track).
5. `npm run dev` and check the lesson.

## Roadmap

- [ ] Authoring sweep: Python lessons 2–10.
- [ ] Add `matplotlib` rendering inside `CodeExercise` (Pyodide → base64 PNG).
- [ ] Authoring sweep: ML lessons 1–10 (uses `scikit-learn`).
- [ ] Wire up `transformers.js` for AI track inference demos.
- [ ] Add "Open in Colab" buttons for AI training notebooks.
- [ ] Authoring sweep: AI lessons 1–10.
- [ ] Authoring sweep: LLM literacy lessons 2–14.
- [ ] Progress dashboard (per-track completion %, resume button).
- [ ] Optional auth + cross-device progress (post-v1).
