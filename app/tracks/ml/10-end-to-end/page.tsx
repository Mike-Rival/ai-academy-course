import LessonShell from '@/components/LessonShell';
import CodeExercise from '@/components/CodeExercise';
import { getLessonNav } from '@/lib/curriculum';

export const metadata = { title: 'End-to-End Project — Credence AI Academy' };

export default function Page() {
  const nav = getLessonNav('ml', '10-end-to-end');
  return (
    <LessonShell
      lessonId="ml/10-end-to-end"
      trackLabel="Machine Learning Basics"
      trackHref="/tracks/ml"
      title="End-to-End Project"
      estMinutes={30}
      nav={nav}
    >
      <p>
        A full pipeline from raw data to evaluated model. Three short exercises;
        the last one ties everything together.
      </p>

      <h2>The data</h2>
      <p>
        Synthetic loan-application data. Features: applicant age, income, debt,
        and employment region. Target: whether the loan was repaid
        (<code>1</code> = repaid, <code>0</code> = not).
      </p>

      <h2>Step 1: Load and split</h2>

      <CodeExercise
        exerciseId="ml/10/step1"
        packages={['scikit-learn', 'pandas']}
        prompt={
          <>
            Load the data into a DataFrame, separate features (<code>X</code>)
            and target (<code>y</code>), and split 75/25. Store the four
            resulting variables.
          </>
        }
        starterCode={`import pandas as pd
import numpy as np
from io import StringIO
from sklearn.model_selection import train_test_split

CSV = """age,income,debt,region,repaid
35,55000,15000,East,1
22,32000,12000,East,0
48,98000,18000,West,1
29,41000,22000,West,0
55,72000,8000,East,1
41,60000,11000,East,1
38,45000,25000,West,0
27,28000,5000,West,1
60,120000,30000,East,1
33,38000,19000,West,0
46,82000,14000,East,1
31,50000,21000,West,0
52,95000,9000,East,1
24,30000,17000,West,0
44,68000,12000,East,1
36,42000,23000,West,0
50,110000,16000,East,1
28,35000,8000,East,1
39,58000,28000,West,0
57,130000,22000,East,1"""

df = pd.read_csv(StringIO(CSV))

X = None
y = None
X_train, X_test, y_train, y_test = None, None, None, None

print(X.shape if X is not None else None)
`}
        tests={[
          { name: 'X has 4 columns', code: 'assert X.shape[1] == 4' },
          { name: 'y has 20 values', code: 'assert len(y) == 20' },
          { name: 'X_train + X_test = 20 rows', code: 'assert len(X_train) + len(X_test) == 20' },
        ]}
        hint={
          <>
            <code>X = df.drop(columns=[&quot;repaid&quot;])</code>;{' '}
            <code>y = df[&quot;repaid&quot;]</code>; then{' '}
            <code>train_test_split(X, y, test_size=0.25, random_state=0)</code>.
          </>
        }
        solution={`import pandas as pd
import numpy as np
from io import StringIO
from sklearn.model_selection import train_test_split

CSV = """age,income,debt,region,repaid
35,55000,15000,East,1
22,32000,12000,East,0
48,98000,18000,West,1
29,41000,22000,West,0
55,72000,8000,East,1
41,60000,11000,East,1
38,45000,25000,West,0
27,28000,5000,West,1
60,120000,30000,East,1
33,38000,19000,West,0
46,82000,14000,East,1
31,50000,21000,West,0
52,95000,9000,East,1
24,30000,17000,West,0
44,68000,12000,East,1
36,42000,23000,West,0
50,110000,16000,East,1
28,35000,8000,East,1
39,58000,28000,West,0
57,130000,22000,East,1"""

df = pd.read_csv(StringIO(CSV))

X = df.drop(columns=["repaid"])
y = df["repaid"]

X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.25, random_state=0
)

print(X.shape, X_train.shape, X_test.shape)
`}
      />

      <h2>Step 2: Build a pipeline</h2>

      <CodeExercise
        exerciseId="ml/10/step2"
        packages={['scikit-learn', 'pandas']}
        prompt={
          <>
            Build a pipeline that one-hot encodes <code>region</code>, scales
            the numeric features, and fits a <code>LogisticRegression</code>.
            Fit it and report the test accuracy.
          </>
        }
        starterCode={`import pandas as pd
from io import StringIO
from sklearn.model_selection import train_test_split
from sklearn.pipeline import Pipeline
from sklearn.compose import ColumnTransformer
from sklearn.preprocessing import StandardScaler, OneHotEncoder
from sklearn.linear_model import LogisticRegression

CSV = """age,income,debt,region,repaid
35,55000,15000,East,1
22,32000,12000,East,0
48,98000,18000,West,1
29,41000,22000,West,0
55,72000,8000,East,1
41,60000,11000,East,1
38,45000,25000,West,0
27,28000,5000,West,1
60,120000,30000,East,1
33,38000,19000,West,0
46,82000,14000,East,1
31,50000,21000,West,0
52,95000,9000,East,1
24,30000,17000,West,0
44,68000,12000,East,1
36,42000,23000,West,0
50,110000,16000,East,1
28,35000,8000,East,1
39,58000,28000,West,0
57,130000,22000,East,1"""

df = pd.read_csv(StringIO(CSV))
X = df.drop(columns=["repaid"])
y = df["repaid"]
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.25, random_state=0)

pre = ColumnTransformer([
    ("num", StandardScaler(), ["age", "income", "debt"]),
    ("cat", OneHotEncoder(handle_unknown="ignore"), ["region"]),
])

pipe = None  # build the pipeline

test_acc = 0

print("test_acc:", test_acc)
`}
        tests={[
          { name: 'pipe is fitted', code: 'assert hasattr(pipe, "named_steps")' },
          { name: 'test_acc > 0.5', code: 'assert test_acc > 0.5' },
        ]}
        hint={
          <>
            <code>{`pipe = Pipeline([("pre", pre), ("clf", LogisticRegression(max_iter=1000))])`}</code>
            ; fit on <code>X_train, y_train</code>; score on{' '}
            <code>X_test, y_test</code>.
          </>
        }
        solution={`import pandas as pd
from io import StringIO
from sklearn.model_selection import train_test_split
from sklearn.pipeline import Pipeline
from sklearn.compose import ColumnTransformer
from sklearn.preprocessing import StandardScaler, OneHotEncoder
from sklearn.linear_model import LogisticRegression

CSV = """age,income,debt,region,repaid
35,55000,15000,East,1
22,32000,12000,East,0
48,98000,18000,West,1
29,41000,22000,West,0
55,72000,8000,East,1
41,60000,11000,East,1
38,45000,25000,West,0
27,28000,5000,West,1
60,120000,30000,East,1
33,38000,19000,West,0
46,82000,14000,East,1
31,50000,21000,West,0
52,95000,9000,East,1
24,30000,17000,West,0
44,68000,12000,East,1
36,42000,23000,West,0
50,110000,16000,East,1
28,35000,8000,East,1
39,58000,28000,West,0
57,130000,22000,East,1"""

df = pd.read_csv(StringIO(CSV))
X = df.drop(columns=["repaid"])
y = df["repaid"]
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.25, random_state=0)

pre = ColumnTransformer([
    ("num", StandardScaler(), ["age", "income", "debt"]),
    ("cat", OneHotEncoder(handle_unknown="ignore"), ["region"]),
])

pipe = Pipeline([("pre", pre), ("clf", LogisticRegression(max_iter=1000))])
pipe.fit(X_train, y_train)

test_acc = pipe.score(X_test, y_test)

print("test_acc:", test_acc)
`}
      />

      <h2>Step 3: Cross-validate and compare to a forest</h2>

      <CodeExercise
        exerciseId="ml/10/step3"
        packages={['scikit-learn', 'pandas']}
        prompt={
          <>
            Run 5-fold cross-validation on the logistic-regression pipeline.
            Then do the same with a random-forest pipeline. Store the two mean
            CV scores in <code>lr_cv</code> and <code>rf_cv</code>. Which is
            better on this tiny dataset?
          </>
        }
        starterCode={`import pandas as pd
from io import StringIO
from sklearn.pipeline import Pipeline
from sklearn.compose import ColumnTransformer
from sklearn.preprocessing import StandardScaler, OneHotEncoder
from sklearn.linear_model import LogisticRegression
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import cross_val_score

CSV = """age,income,debt,region,repaid
35,55000,15000,East,1
22,32000,12000,East,0
48,98000,18000,West,1
29,41000,22000,West,0
55,72000,8000,East,1
41,60000,11000,East,1
38,45000,25000,West,0
27,28000,5000,West,1
60,120000,30000,East,1
33,38000,19000,West,0
46,82000,14000,East,1
31,50000,21000,West,0
52,95000,9000,East,1
24,30000,17000,West,0
44,68000,12000,East,1
36,42000,23000,West,0
50,110000,16000,East,1
28,35000,8000,East,1
39,58000,28000,West,0
57,130000,22000,East,1"""

df = pd.read_csv(StringIO(CSV))
X = df.drop(columns=["repaid"])
y = df["repaid"]

pre = ColumnTransformer([
    ("num", StandardScaler(), ["age", "income", "debt"]),
    ("cat", OneHotEncoder(handle_unknown="ignore"), ["region"]),
])

lr_pipe = Pipeline([("pre", pre), ("clf", LogisticRegression(max_iter=1000))])
rf_pipe = Pipeline([("pre", pre), ("clf", RandomForestClassifier(n_estimators=100, random_state=0))])

lr_cv = 0
rf_cv = 0

print("LR:", lr_cv, "RF:", rf_cv)
`}
        tests={[
          { name: 'lr_cv > 0', code: 'assert lr_cv > 0' },
          { name: 'rf_cv > 0', code: 'assert rf_cv > 0' },
        ]}
        hint={
          <>
            <code>cross_val_score(lr_pipe, X, y, cv=5).mean()</code> — same for{' '}
            <code>rf_pipe</code>.
          </>
        }
        solution={`# (same imports and setup as above)

lr_cv = cross_val_score(lr_pipe, X, y, cv=5).mean()
rf_cv = cross_val_score(rf_pipe, X, y, cv=5).mean()

print("LR:", lr_cv, "RF:", rf_cv)
`}
      />

      <h2>Reflection</h2>
      <p>
        With only 20 rows the CV scores will swing wildly between runs and the
        choice between LR and RF is essentially noise. That&rsquo;s the lesson:
        on small data, model comparison is hard. Real projects need either
        more data, a held-out test set kept untouched until the very end, or
        explicit acknowledgment that you don&rsquo;t have enough evidence to
        choose.
      </p>
      <p>
        You&rsquo;ve now done the standard sklearn workflow end to end. Real
        projects spend the bulk of their time on data quality, feature
        engineering, and evaluation discipline — not on the model line of code.
      </p>
    </LessonShell>
  );
}
