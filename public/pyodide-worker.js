// Pyodide Web Worker. Runs Python (incl. numpy/pandas/scikit-learn/matplotlib)
// in the browser via WebAssembly. Loaded as a classic worker so it can
// importScripts() Pyodide from the CDN.

const PYODIDE_VERSION = '0.28.0';
const PYODIDE_BASE = `https://cdn.jsdelivr.net/pyodide/v${PYODIDE_VERSION}/full/`;

self.importScripts(`${PYODIDE_BASE}pyodide.js`);

let pyodideReady = null;
let loadedPackages = new Set();

async function ensurePyodide() {
  if (!pyodideReady) {
    pyodideReady = self
      .loadPyodide({ indexURL: PYODIDE_BASE })
      .then((py) => {
        self.pyodide = py;
        return py;
      });
  }
  return pyodideReady;
}

async function ensurePackages(packages) {
  if (!packages || packages.length === 0) return;
  const py = await ensurePyodide();
  const missing = packages.filter((p) => !loadedPackages.has(p));
  if (missing.length === 0) return;
  await py.loadPackage(missing);
  missing.forEach((p) => loadedPackages.add(p));
}

// Runs `code` in a fresh-ish namespace, captures stdout/stderr.
// If `tests` is provided, runs them after and reports pass/fail per test.
async function runCode({ code, tests, packages, id }) {
  try {
    const py = await ensurePyodide();
    await ensurePackages(packages || []);

    let stdout = '';
    let stderr = '';
    py.setStdout({ batched: (s) => { stdout += s + '\n'; } });
    py.setStderr({ batched: (s) => { stderr += s + '\n'; } });

    // Run student code in a fresh namespace so prior runs don't leak.
    // We also stash the student's source as `_user_code` so tests can re-run
    // the user's code with different inputs via `exec(_user_code)`.
    const ns = py.toPy({ _user_code: code });
    let runError = null;
    try {
      await py.runPythonAsync(code, { globals: ns });
    } catch (e) {
      runError = String(e?.message || e);
    }

    let testResults = null;
    if (tests && tests.length > 0 && !runError) {
      testResults = [];
      for (const t of tests) {
        try {
          await py.runPythonAsync(t.code, { globals: ns });
          testResults.push({ name: t.name, passed: true });
        } catch (e) {
          testResults.push({
            name: t.name,
            passed: false,
            message: t.hint || String(e?.message || e),
          });
        }
      }
    }

    ns.destroy();

    return {
      id,
      ok: !runError,
      stdout,
      stderr,
      error: runError,
      testResults,
    };
  } catch (e) {
    return { id, ok: false, error: String(e?.message || e), stdout: '', stderr: '' };
  }
}

self.onmessage = async (ev) => {
  const msg = ev.data;
  if (msg.type === 'run') {
    const result = await runCode(msg.payload);
    self.postMessage({ type: 'result', ...result });
  } else if (msg.type === 'preload') {
    await ensurePyodide();
    if (msg.payload?.packages) await ensurePackages(msg.payload.packages);
    self.postMessage({ type: 'preloaded', id: msg.payload?.id });
  }
};
