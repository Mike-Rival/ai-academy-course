import LessonShell from '@/components/LessonShell';
import CodeExercise from '@/components/CodeExercise';
import { getLessonNav } from '@/lib/curriculum';

export const metadata = { title: 'Pipelines — Credence AI Academy' };

export default function Page() {
  const nav = getLessonNav('ml', '08-pipelines');
  return (
    <LessonShell
      lessonId="ml/08-pipelines"
      trackLabel="Machine Learning Basics"
      trackHref="/tracks/ml"
      title="Pipelines"
      estMinutes={15}
      nav={nav}
    >
      <p>
        A real ML workflow has preprocessing steps before the model: scale
        features, encode categories, impute missing values. Pipelines bundle
        those steps with the model into one object you can fit, predict, and
        save.
      </p>

      <h2>Why bundle them?</h2>
      <p>
        Three reasons:
      </p>
      <ol>
        <li>
          <strong>Avoids data leakage.</strong> If you scale features on the
          whole dataset before train/test splitting, information from the test
          set leaks into training. Inside a pipeline, scaling is fit on training
          only and applied to test — automatically correct.
        </li>
        <li>
          <strong>Cross-validation does the right thing.</strong> CV with a
          pipeline refits each preprocessing step on each fold. Without the
          pipeline you have to remember to do this yourself, and people forget.
        </li>
        <li>
          <strong>One object to serialize and deploy.</strong> Save the pipeline
          with <code>joblib.dump</code> and load it elsewhere — preprocessing
          and all.
        </li>
      </ol>

      <h2>The basic pattern</h2>
      <pre><code>{`from sklearn.pipeline import Pipeline
from sklearn.preprocessing import StandardScaler
from sklearn.linear_model import LogisticRegression

pipe = Pipeline([
    ("scaler", StandardScaler()),
    ("clf", LogisticRegression(max_iter=1000)),
])

pipe.fit(X_train, y_train)
pipe.score(X_test, y_test)`}</code></pre>

      <CodeExercise
        exerciseId="ml/08/pipeline"
        packages={['scikit-learn']}
        prompt={
          <>
            Build a pipeline with <code>StandardScaler</code> followed by{' '}
            <code>LogisticRegression</code>. Fit on training data, store test
            accuracy in <code>test_acc</code>. Run 5-fold cross-validation on
            the pipeline; store the mean CV score in <code>cv_mean</code>.
          </>
        }
        starterCode={`import numpy as np
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import StandardScaler
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import train_test_split, cross_val_score
from sklearn.datasets import make_classification

X, y = make_classification(n_samples=400, n_features=8, random_state=0)
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.3, random_state=42)

pipe = None  # build the pipeline

test_acc = 0
cv_mean = 0

print("test_acc:", test_acc, "cv_mean:", cv_mean)
`}
        tests={[
          { name: 'pipe is a sklearn Pipeline', code: 'from sklearn.pipeline import Pipeline\nassert isinstance(pipe, Pipeline)' },
          { name: 'test_acc > 0.7', code: 'assert test_acc > 0.7' },
          { name: 'cv_mean > 0.7', code: 'assert cv_mean > 0.7' },
        ]}
        hint={
          <>
            <code>{`pipe = Pipeline([("scaler", StandardScaler()), ("clf", LogisticRegression(max_iter=1000))])`}</code>
            ; <code>pipe.fit(X_train, y_train)</code>;{' '}
            <code>test_acc = pipe.score(X_test, y_test)</code>;{' '}
            <code>cv_mean = cross_val_score(pipe, X, y, cv=5).mean()</code>.
          </>
        }
        solution={`import numpy as np
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import StandardScaler
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import train_test_split, cross_val_score
from sklearn.datasets import make_classification

X, y = make_classification(n_samples=400, n_features=8, random_state=0)
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.3, random_state=42)

pipe = Pipeline([
    ("scaler", StandardScaler()),
    ("clf", LogisticRegression(max_iter=1000)),
])

pipe.fit(X_train, y_train)
test_acc = pipe.score(X_test, y_test)
cv_mean = cross_val_score(pipe, X, y, cv=5).mean()

print("test_acc:", test_acc, "cv_mean:", cv_mean)
`}
      />

      <h2>Column-wise preprocessing</h2>
      <p>
        Real datasets usually have mixed types: some numeric columns, some
        categorical. Use <code>ColumnTransformer</code> to apply different
        steps to different columns within the same pipeline.
      </p>
      <pre><code>{`from sklearn.compose import ColumnTransformer
from sklearn.preprocessing import StandardScaler, OneHotEncoder

preprocessor = ColumnTransformer([
    ("num", StandardScaler(), ["age", "income"]),
    ("cat", OneHotEncoder(handle_unknown="ignore"), ["region"]),
])

pipe = Pipeline([("pre", preprocessor), ("clf", LogisticRegression())])`}</code></pre>

      <h2>Recap</h2>
      <ul>
        <li>Pipelines bundle preprocessing with the model.</li>
        <li>They prevent data leakage and make CV correct by default.</li>
        <li>Use <code>ColumnTransformer</code> for mixed-type data.</li>
      </ul>
    </LessonShell>
  );
}
