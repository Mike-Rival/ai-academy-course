import LessonShell from '@/components/LessonShell';
import CodeExercise from '@/components/CodeExercise';
import { getLessonNav } from '@/lib/curriculum';

export const metadata = { title: 'Feature Engineering — Credence AI Academy' };

export default function Page() {
  const nav = getLessonNav('ml', '09-feature-engineering');
  return (
    <LessonShell
      lessonId="ml/09-feature-engineering"
      trackLabel="Machine Learning Basics"
      trackHref="/tracks/ml"
      title="Feature Engineering"
      estMinutes={18}
      nav={nav}
    >
      <p>
        Most ML wins in practice come from the features, not the model. A
        modest model on great features beats a fancy model on raw inputs. This
        lesson covers the standard moves.
      </p>

      <h2>Scaling numeric features</h2>
      <p>
        Many models (linear, k-NN, SVMs, neural nets) are sensitive to the
        scale of features. A feature in the range 0–1 will be ignored next to a
        feature in the range 0–1,000,000.
      </p>
      <ul>
        <li>
          <strong>StandardScaler</strong>: subtract mean, divide by std.
          Centers at 0, scales to unit variance. Default choice.
        </li>
        <li>
          <strong>MinMaxScaler</strong>: scale to [0, 1]. Useful when you need
          bounded inputs.
        </li>
        <li>
          <strong>RobustScaler</strong>: uses median and IQR instead of mean
          and std. Better when there are outliers.
        </li>
      </ul>

      <h2>Encoding categorical features</h2>
      <p>
        Models work on numbers. Categories like &ldquo;red, green, blue&rdquo;
        need to be turned into numbers in a way that doesn&rsquo;t imply a
        false ordering.
      </p>
      <ul>
        <li>
          <strong>One-hot encoding</strong>: one new binary column per
          category. The standard move for low-cardinality features. Use{' '}
          <code>OneHotEncoder(handle_unknown=&quot;ignore&quot;)</code> so new
          values at predict time don&rsquo;t crash.
        </li>
        <li>
          <strong>Ordinal encoding</strong>: assign integers in a meaningful
          order (small=0, medium=1, large=2). Only when the order is real.
        </li>
        <li>
          <strong>Target encoding</strong>: replace each category with the
          average of <code>y</code> for that category. Powerful but leaks
          information if done outside cross-validation.
        </li>
      </ul>

      <CodeExercise
        exerciseId="ml/09/encode"
        packages={['scikit-learn']}
        prompt={
          <>
            Apply <code>OneHotEncoder</code> to a column of categories. Store
            the resulting dense matrix in <code>X_enc</code> (shape{' '}
            <code>(5, 3)</code> for three categories).
          </>
        }
        starterCode={`import numpy as np
from sklearn.preprocessing import OneHotEncoder

X = np.array([["red"], ["green"], ["blue"], ["red"], ["green"]])

enc = OneHotEncoder(sparse_output=False)
# fit and transform

X_enc = None

print(X_enc)
`}
        tests={[
          { name: 'X_enc shape (5, 3)', code: 'import numpy as np\nassert np.array(X_enc).shape == (5, 3)' },
          { name: 'each row sums to 1', code: 'import numpy as np\nassert np.allclose(np.array(X_enc).sum(axis=1), 1)' },
        ]}
        hint={<><code>X_enc = enc.fit_transform(X)</code>.</>}
        solution={`import numpy as np
from sklearn.preprocessing import OneHotEncoder

X = np.array([["red"], ["green"], ["blue"], ["red"], ["green"]])

enc = OneHotEncoder(sparse_output=False)
X_enc = enc.fit_transform(X)

print(X_enc)
print("categories:", enc.categories_)
`}
      />

      <h2>Handling missing values</h2>
      <p>
        Real data has missing values. Two common moves:
      </p>
      <ul>
        <li>
          <strong>Drop rows</strong> with missing values. Fine if you have
          plenty of data and the missingness is random.
        </li>
        <li>
          <strong>Impute</strong> with a value (mean, median, mode, or a model-based
          prediction). Use <code>SimpleImputer</code>. Often add a binary
          &ldquo;was missing&rdquo; flag column — the fact that a value was
          missing can itself be predictive.
        </li>
      </ul>

      <h2>Creating derived features</h2>
      <p>
        Often the model can&rsquo;t learn a relationship that&rsquo;s easy to
        compute by hand. Examples:
      </p>
      <ul>
        <li>Date-of-birth → age, day-of-week, is_weekend.</li>
        <li>Two location columns → distance.</li>
        <li>Two related numeric columns → ratio or difference.</li>
        <li>Text → length, number of words, presence of specific tokens.</li>
      </ul>
      <p>
        Domain knowledge is the biggest lever here. The person who knows the
        business knows which derived features matter; the data scientist alone
        rarely does.
      </p>

      <h2>The leakage trap</h2>
      <p>
        A feature based on information you wouldn&rsquo;t actually have at
        prediction time is a leakage trap. Classic example: predicting
        churn from a feature like &ldquo;number of support calls in the last 30
        days&rdquo; — except in your training data, some of those calls
        happened <em>after</em> the customer churned. Your model looks great
        offline and fails in production.
      </p>
      <p>
        Defense: think about the <strong>timeline</strong>. At the moment you
        make the prediction in production, which features are available? Use
        only those.
      </p>

      <h2>Recap</h2>
      <ul>
        <li>Scale numeric features. One-hot categorical features.</li>
        <li>Impute missing values; consider a &ldquo;was missing&rdquo; flag.</li>
        <li>Derive features from domain knowledge. This is usually where the wins are.</li>
        <li>Watch for leakage: nothing in the feature set should depend on the target or on the future.</li>
      </ul>
    </LessonShell>
  );
}
