import LessonShell from '@/components/LessonShell';
import CodeExercise from '@/components/CodeExercise';
import { getLessonNav } from '@/lib/curriculum';

export const metadata = { title: 'NumPy Arrays — AI Academy' };

export default function Page() {
  const nav = getLessonNav('python', '08-numpy');
  return (
    <LessonShell
      lessonId="python/08-numpy"
      trackLabel="Python Basics"
      trackHref="/tracks/python"
      title="NumPy Arrays"
      estMinutes={15}
      nav={nav}
    >
      <p>
        NumPy is the foundation of numerical work in Python. Its core object is the
        <code> ndarray</code>: a typed, fixed-size, possibly multi-dimensional array.
        It exists because Python lists are slow for math at scale and don&rsquo;t
        vectorize.
      </p>

      <p>
        Pyodide ships NumPy. The first run on this page will fetch the package; later
        runs are instant.
      </p>

      <pre><code>{`import numpy as np

a = np.array([1, 2, 3, 4])
a * 2                # array([2, 4, 6, 8])  — vectorized, no loop
a + a                # array([2, 4, 6, 8])
a.mean()             # 2.5
a.sum()              # 10
a.shape              # (4,)`}</code></pre>

      <p>
        The big idea: operations apply <em>elementwise</em>. You write <code>a * 2</code>{' '}
        instead of a loop, and NumPy does it efficiently under the hood.
      </p>

      <CodeExercise
        exerciseId="python/08-numpy/normalize"
        packages={['numpy']}
        prompt={
          <>
            Given an array <code>x</code>, set <code>y</code> to the
            zero-mean-unit-variance normalized version: subtract the mean, divide by
            the standard deviation. (This is the same transformation
            scikit-learn&rsquo;s <code>StandardScaler</code> applies.)
          </>
        }
        starterCode={`import numpy as np

x = np.array([10.0, 20.0, 30.0, 40.0, 50.0])

y = x  # replace

print(y)
print("mean:", y.mean(), "std:", y.std())
`}
        tests={[
          {
            name: 'y has mean ≈ 0',
            code: 'import numpy as np\nassert abs(np.array(y).mean()) < 1e-9',
            hint: 'Subtract x.mean() first, then divide.',
          },
          {
            name: 'y has std ≈ 1',
            code: 'import numpy as np\nassert abs(np.array(y).std() - 1.0) < 1e-9',
          },
        ]}
        hint={<>The pattern is <code>(x - x.mean()) / x.std()</code>.</>}
        solution={`import numpy as np

x = np.array([10.0, 20.0, 30.0, 40.0, 50.0])

y = (x - x.mean()) / x.std()

print(y)
print("mean:", y.mean(), "std:", y.std())
`}
      />

      <h2>Indexing and slicing</h2>
      <pre><code>{`a = np.array([10, 20, 30, 40, 50])
a[0]            # 10
a[-1]           # 50
a[1:4]          # array([20, 30, 40])
a[a > 25]       # array([30, 40, 50])  — boolean mask`}</code></pre>

      <p>
        The boolean-mask form is one of NumPy&rsquo;s most useful tricks. You can
        filter without a loop:
      </p>

      <CodeExercise
        exerciseId="python/08-numpy/count-above"
        packages={['numpy']}
        prompt={
          <>
            Write <code>count_above(arr, threshold)</code> that returns how many
            elements of <code>arr</code> are strictly greater than{' '}
            <code>threshold</code>. Use a boolean mask, no Python loop.
          </>
        }
        starterCode={`import numpy as np

def count_above(arr, threshold):
    pass  # one line, no for loop

print(count_above(np.array([1, 5, 3, 8, 2, 7]), 4))
`}
        tests={[
          { name: 'basic count', code: 'import numpy as np\nassert count_above(np.array([1, 5, 3, 8, 2, 7]), 4) == 3' },
          { name: 'none above', code: 'import numpy as np\nassert count_above(np.array([1, 2, 3]), 10) == 0' },
          { name: 'all above', code: 'import numpy as np\nassert count_above(np.array([5, 6, 7]), 0) == 3' },
        ]}
        hint={
          <>
            <code>arr &gt; threshold</code> gives an array of <code>True</code>/<code>False</code>.
            Summing booleans counts the trues — <code>(arr &gt; threshold).sum()</code>.
          </>
        }
        solution={`import numpy as np

def count_above(arr, threshold):
    return int((arr > threshold).sum())

print(count_above(np.array([1, 5, 3, 8, 2, 7]), 4))
`}
      />

      <h2>Recap</h2>
      <ul>
        <li>NumPy gives you fast, vectorized numeric operations on typed arrays.</li>
        <li>Operations apply elementwise. <code>a + b</code>, <code>a * 2</code>, <code>a.mean()</code> — no loops.</li>
        <li>Boolean masks like <code>arr[arr &gt; 0]</code> are the idiomatic way to filter.</li>
      </ul>
    </LessonShell>
  );
}
