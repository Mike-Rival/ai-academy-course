import LessonShell from '@/components/LessonShell';
import CodeExercise from '@/components/CodeExercise';
import { getLessonNav } from '@/lib/curriculum';

export const metadata = { title: 'Linear Regression — Credence AI Academy' };

export default function Page() {
  const nav = getLessonNav('ml', '02-linear-regression');
  return (
    <LessonShell
      lessonId="ml/02-linear-regression"
      trackLabel="Machine Learning Basics"
      trackHref="/tracks/ml"
      title="Linear Regression"
      estMinutes={15}
      nav={nav}
    >
      <p>
        Linear regression is the simplest interesting model. Take it seriously —
        it&rsquo;s the right baseline for a huge fraction of real problems, and
        if you skip understanding it you&rsquo;ll struggle to understand the rest.
      </p>

      <h2>The model</h2>
      <p>
        With one feature: <code>y ≈ a · x + b</code>. With many features:
      </p>
      <pre><code>{`y ≈ w₁ · x₁ + w₂ · x₂ + ... + wₙ · xₙ + b`}</code></pre>
      <p>
        The model has <em>weights</em> <code>w</code> (one per feature) and a{' '}
        <em>bias</em> <code>b</code>. Training picks values for these that
        minimize the mean squared error between predictions and truth.
      </p>

      <h2>Residuals: where to look</h2>
      <p>
        The residual is the difference between truth and prediction for each
        row: <code>residual = y - y_pred</code>. Looking at residuals is the
        single most useful diagnostic in regression. Patterns in residuals mean
        the model is missing structure.
      </p>

      <CodeExercise
        exerciseId="ml/02/multi-feature"
        packages={['scikit-learn']}
        prompt={
          <>
            Fit a linear regression with two features (<code>sqft</code> and{' '}
            <code>bedrooms</code>) predicting <code>price</code>. Store the
            fitted coefficients (one per feature) in <code>coefs</code>. The
            length of <code>coefs</code> should be 2.
          </>
        }
        starterCode={`import numpy as np
from sklearn.linear_model import LinearRegression

# sqft, bedrooms
X = np.array([
    [800, 2],
    [1200, 2],
    [1500, 3],
    [1800, 3],
    [2200, 4],
])
y = np.array([220_000, 310_000, 380_000, 440_000, 530_000])

model = LinearRegression()
# fit

coefs = None  # replace

print("coefs:", coefs)
print("intercept:", model.intercept_)
`}
        tests={[
          {
            name: 'model is fitted (coef_ exists)',
            code: 'assert hasattr(model, "coef_") and len(model.coef_) == 2',
          },
          {
            name: 'coefs is the model coefficients',
            code: 'import numpy as np\nassert np.allclose(coefs, model.coef_)',
          },
        ]}
        hint={<>After <code>model.fit(X, y)</code>, use <code>model.coef_</code>.</>}
        solution={`import numpy as np
from sklearn.linear_model import LinearRegression

X = np.array([
    [800, 2],
    [1200, 2],
    [1500, 3],
    [1800, 3],
    [2200, 4],
])
y = np.array([220_000, 310_000, 380_000, 440_000, 530_000])

model = LinearRegression()
model.fit(X, y)

coefs = model.coef_

print("coefs:", coefs)
print("intercept:", model.intercept_)
`}
      />

      <h2>Measuring fit: R² and MSE</h2>
      <p>
        After fitting, you want to know how well the model did:
      </p>
      <ul>
        <li>
          <strong>MSE</strong> (mean squared error): average of squared
          residuals. Same units as <code>y</code> squared. Lower is better.
        </li>
        <li>
          <strong>R²</strong> (coefficient of determination): proportion of
          variance explained. 1.0 is perfect; 0.0 is no better than predicting
          the mean every time. Negative is possible and means the model is
          actively bad.
        </li>
      </ul>

      <CodeExercise
        exerciseId="ml/02/score"
        packages={['scikit-learn']}
        prompt={
          <>
            Fit the model and compute <code>r2</code> and <code>mse</code> on
            the training data. Use <code>model.score(X, y)</code> for R² and{' '}
            <code>mean_squared_error</code> from <code>sklearn.metrics</code>{' '}
            for MSE.
          </>
        }
        starterCode={`import numpy as np
from sklearn.linear_model import LinearRegression
from sklearn.metrics import mean_squared_error

X = np.array([[800], [1200], [1500], [1800], [2200]])
y = np.array([220_000, 310_000, 380_000, 440_000, 530_000])

model = LinearRegression()
model.fit(X, y)

r2 = 0   # replace
mse = 0  # replace

print("R²:", r2)
print("MSE:", mse)
`}
        tests={[
          { name: 'r2 is between 0.9 and 1.0', code: 'assert 0.9 < r2 <= 1.0, f"got {r2}"' },
          { name: 'mse > 0', code: 'assert mse > 0, f"got {mse}"' },
        ]}
        hint={
          <>
            <code>r2 = model.score(X, y)</code>; <code>preds =
            model.predict(X)</code>; <code>mse = mean_squared_error(y, preds)</code>.
          </>
        }
        solution={`import numpy as np
from sklearn.linear_model import LinearRegression
from sklearn.metrics import mean_squared_error

X = np.array([[800], [1200], [1500], [1800], [2200]])
y = np.array([220_000, 310_000, 380_000, 440_000, 530_000])

model = LinearRegression()
model.fit(X, y)

r2 = model.score(X, y)
mse = mean_squared_error(y, model.predict(X))

print("R²:", r2)
print("MSE:", mse)
`}
      />

      <h2>A warning</h2>
      <p>
        The R² above is on the <em>same data the model was trained on</em>. That
        always overstates how well the model will do on new data. We&rsquo;ll
        fix that in Lessons 4 and 5 with train/test splits and cross-validation.
        For now, just notice: any time you see an evaluation number, ask
        immediately, &ldquo;what was it computed on?&rdquo;
      </p>

      <h2>Recap</h2>
      <ul>
        <li>Linear regression learns weights and a bias to minimize mean squared error.</li>
        <li>R² and MSE are the standard metrics; both have caveats.</li>
        <li>An R² on training data is not what you actually want — it&rsquo;s optimistic.</li>
      </ul>
    </LessonShell>
  );
}
