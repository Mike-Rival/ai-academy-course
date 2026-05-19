import LessonShell from '@/components/LessonShell';
import CodeExercise from '@/components/CodeExercise';
import { getLessonNav } from '@/lib/curriculum';

export const metadata = { title: 'Mini Project — AI Academy' };

export default function Page() {
  const nav = getLessonNav('python', '10-mini-project');
  return (
    <LessonShell
      lessonId="python/10-mini-project"
      trackLabel="Python Basics"
      trackHref="/tracks/python"
      title="Mini Project: Sales Summary"
      estMinutes={25}
      nav={nav}
    >
      <p>
        A small end-to-end task. You have a CSV of sales records. Your job: load it,
        clean it, and answer two questions. We&rsquo;ll guide you through each step,
        but each exercise asks you to write the code yourself.
      </p>

      <p>The data:</p>
      <pre><code>{`product,region,units,price
apple,East,10,1.50
apple,West,8,1.50
banana,East,30,0.30
banana,West,25,0.30
cherry,East,5,2.00
cherry,West,12,2.00`}</code></pre>

      <h2>Step 1 — Load it</h2>

      <CodeExercise
        exerciseId="python/10-mini-project/step1"
        packages={['pandas']}
        prompt={
          <>
            Load the CSV into a DataFrame called <code>df</code>. Add a column called{' '}
            <code>revenue</code> equal to <code>units * price</code>.
          </>
        }
        starterCode={`import pandas as pd
from io import StringIO

CSV = """product,region,units,price
apple,East,10,1.50
apple,West,8,1.50
banana,East,30,0.30
banana,West,25,0.30
cherry,East,5,2.00
cherry,West,12,2.00"""

df = None  # load CSV
# add revenue column

print(df)
`}
        tests={[
          { name: 'df is a DataFrame with 6 rows', code: 'import pandas as pd\nassert isinstance(df, pd.DataFrame) and len(df) == 6' },
          { name: 'has a revenue column', code: 'assert "revenue" in df.columns' },
          { name: 'revenue == units * price', code: 'assert (df["revenue"] == df["units"] * df["price"]).all()' },
        ]}
        hint={
          <>
            <code>df = pd.read_csv(StringIO(CSV))</code> and then{' '}
            <code>df[&quot;revenue&quot;] = df[&quot;units&quot;] * df[&quot;price&quot;]</code>.
          </>
        }
        solution={`import pandas as pd
from io import StringIO

CSV = """product,region,units,price
apple,East,10,1.50
apple,West,8,1.50
banana,East,30,0.30
banana,West,25,0.30
cherry,East,5,2.00
cherry,West,12,2.00"""

df = pd.read_csv(StringIO(CSV))
df["revenue"] = df["units"] * df["price"]

print(df)
`}
      />

      <h2>Step 2 — Which product had the highest total revenue?</h2>

      <CodeExercise
        exerciseId="python/10-mini-project/step2"
        packages={['pandas']}
        prompt={
          <>
            Compute total revenue per product. Set <code>top_product</code> to the
            name of the product with the highest total.
          </>
        }
        starterCode={`import pandas as pd
from io import StringIO

CSV = """product,region,units,price
apple,East,10,1.50
apple,West,8,1.50
banana,East,30,0.30
banana,West,25,0.30
cherry,East,5,2.00
cherry,West,12,2.00"""

df = pd.read_csv(StringIO(CSV))
df["revenue"] = df["units"] * df["price"]

# compute revenue per product
top_product = ""  # replace

print(top_product)
`}
        tests={[
          { name: 'top_product is the highest-revenue product', code: 'assert top_product == "cherry"' },
        ]}
        hint={
          <>
            <code>df.groupby(&quot;product&quot;)[&quot;revenue&quot;].sum()</code> gives
            you a Series. Use <code>.idxmax()</code> to get the index (product name)
            of the largest value.
          </>
        }
        solution={`import pandas as pd
from io import StringIO

CSV = """product,region,units,price
apple,East,10,1.50
apple,West,8,1.50
banana,East,30,0.30
banana,West,25,0.30
cherry,East,5,2.00
cherry,West,12,2.00"""

df = pd.read_csv(StringIO(CSV))
df["revenue"] = df["units"] * df["price"]

per_product = df.groupby("product")["revenue"].sum()
top_product = per_product.idxmax()

print(per_product)
print("top:", top_product)
`}
      />

      <h2>Step 3 — Region breakdown</h2>

      <CodeExercise
        exerciseId="python/10-mini-project/step3"
        packages={['pandas']}
        prompt={
          <>
            Compute total revenue per region. Set <code>east_total</code> and{' '}
            <code>west_total</code> accordingly.
          </>
        }
        starterCode={`import pandas as pd
from io import StringIO

CSV = """product,region,units,price
apple,East,10,1.50
apple,West,8,1.50
banana,East,30,0.30
banana,West,25,0.30
cherry,East,5,2.00
cherry,West,12,2.00"""

df = pd.read_csv(StringIO(CSV))
df["revenue"] = df["units"] * df["price"]

east_total = 0  # replace
west_total = 0  # replace

print("East:", east_total, "West:", west_total)
`}
        tests={[
          { name: 'East total is 34.0', code: 'assert abs(east_total - 34.0) < 1e-6, f"got {east_total}"' },
          { name: 'West total is 43.5', code: 'assert abs(west_total - 43.5) < 1e-6, f"got {west_total}"' },
        ]}
        hint={
          <>
            Same pattern as step 2 — group by region, sum revenue, index by region
            name.
          </>
        }
        solution={`import pandas as pd
from io import StringIO

CSV = """product,region,units,price
apple,East,10,1.50
apple,West,8,1.50
banana,East,30,0.30
banana,West,25,0.30
cherry,East,5,2.00
cherry,West,12,2.00"""

df = pd.read_csv(StringIO(CSV))
df["revenue"] = df["units"] * df["price"]

per_region = df.groupby("region")["revenue"].sum()
east_total = per_region["East"]
west_total = per_region["West"]

print("East:", east_total, "West:", west_total)
`}
      />

      <h2>What you just did</h2>
      <ul>
        <li>Loaded a CSV from a string into a DataFrame.</li>
        <li>Added a derived column with elementwise arithmetic.</li>
        <li>Used <code>groupby</code> + an aggregate to answer two business questions.</li>
      </ul>
      <p>
        That&rsquo;s the shape of nearly every small data-analysis task. Real
        datasets are bigger and messier, but the moves are the same.
      </p>
      <p>
        You&rsquo;re ready for the ML track. Or, if you&rsquo;d rather understand AI
        tools before training your own model, jump to the LLM Literacy track.
      </p>
    </LessonShell>
  );
}
