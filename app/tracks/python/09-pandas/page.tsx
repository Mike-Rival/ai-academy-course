import LessonShell from '@/components/LessonShell';
import CodeExercise from '@/components/CodeExercise';
import { getLessonNav } from '@/lib/curriculum';

export const metadata = { title: 'Pandas DataFrames — Credence AI Academy' };

export default function Page() {
  const nav = getLessonNav('python', '09-pandas');
  return (
    <LessonShell
      lessonId="python/09-pandas"
      trackLabel="Python Basics"
      trackHref="/tracks/python"
      title="Pandas DataFrames"
      estMinutes={18}
      nav={nav}
    >
      <p>
        Pandas gives you a <strong>DataFrame</strong>: a two-dimensional table with
        named columns and an index. Most data analysis in Python touches Pandas at
        some point.
      </p>

      <p>
        Pyodide ships Pandas. The first run on this page may take a few seconds while
        the package loads.
      </p>

      <pre><code>{`import pandas as pd
from io import StringIO

csv = """name,score,team
Ana,88,A
Ben,72,A
Cara,95,B
Dan,60,B"""

df = pd.read_csv(StringIO(csv))
df.head()         # show first rows
df.shape          # (4, 3)
df["score"]       # access one column
df.describe()     # quick numeric summary`}</code></pre>

      <h2>Filtering</h2>
      <pre><code>{`df[df["score"] >= 80]          # rows where score >= 80
df[df["team"] == "A"]          # rows on team A`}</code></pre>

      <CodeExercise
        exerciseId="python/09-pandas/filter"
        packages={['pandas']}
        prompt={
          <>
            Given the DataFrame <code>df</code>, set <code>passing</code> to a new
            DataFrame containing only rows with <code>score &gt;= 80</code>. Then set{' '}
            <code>n_pass</code> to the number of such rows.
          </>
        }
        starterCode={`import pandas as pd
from io import StringIO

csv = """name,score,team
Ana,88,A
Ben,72,A
Cara,95,B
Dan,60,B"""

df = pd.read_csv(StringIO(csv))

passing = df  # replace
n_pass = 0    # replace

print(passing)
print("count:", n_pass)
`}
        tests={[
          { name: 'passing has 2 rows', code: 'assert len(passing) == 2' },
          { name: 'all rows in passing have score >= 80', code: 'assert (passing["score"] >= 80).all()' },
          { name: 'n_pass == 2', code: 'assert n_pass == 2' },
        ]}
        hint={
          <>
            <code>passing = df[df[&quot;score&quot;] &gt;= 80]</code>, then{' '}
            <code>n_pass = len(passing)</code>.
          </>
        }
        solution={`import pandas as pd
from io import StringIO

csv = """name,score,team
Ana,88,A
Ben,72,A
Cara,95,B
Dan,60,B"""

df = pd.read_csv(StringIO(csv))

passing = df[df["score"] >= 80]
n_pass = len(passing)

print(passing)
print("count:", n_pass)
`}
      />

      <h2>Grouping</h2>
      <p>
        <code>groupby</code> is Pandas&rsquo; killer feature. Group rows by a column,
        then aggregate.
      </p>
      <pre><code>{`df.groupby("team")["score"].mean()    # mean score per team
df.groupby("team").size()             # row count per team`}</code></pre>

      <CodeExercise
        exerciseId="python/09-pandas/groupby"
        packages={['pandas']}
        prompt={
          <>
            Compute the mean score per team. Store the result in{' '}
            <code>team_means</code>. It should be a Series indexed by team name.
          </>
        }
        starterCode={`import pandas as pd
from io import StringIO

csv = """name,score,team
Ana,88,A
Ben,72,A
Cara,95,B
Dan,60,B"""

df = pd.read_csv(StringIO(csv))

team_means = None  # replace

print(team_means)
`}
        tests={[
          { name: 'team A mean is 80', code: 'assert abs(team_means["A"] - 80.0) < 1e-9' },
          { name: 'team B mean is 77.5', code: 'assert abs(team_means["B"] - 77.5) < 1e-9' },
        ]}
        hint={<>Use <code>df.groupby(&quot;team&quot;)[&quot;score&quot;].mean()</code>.</>}
        solution={`import pandas as pd
from io import StringIO

csv = """name,score,team
Ana,88,A
Ben,72,A
Cara,95,B
Dan,60,B"""

df = pd.read_csv(StringIO(csv))

team_means = df.groupby("team")["score"].mean()

print(team_means)
`}
      />

      <h2>Recap</h2>
      <ul>
        <li>A DataFrame is a labeled 2D table. Columns are accessed by name.</li>
        <li>Filter with boolean expressions: <code>df[df[&quot;col&quot;] &gt; x]</code>.</li>
        <li>Aggregate with <code>groupby</code>. Most analytics queries reduce to this.</li>
      </ul>
    </LessonShell>
  );
}
