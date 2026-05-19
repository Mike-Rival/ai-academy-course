import LessonShell from '@/components/LessonShell';
import CodeExercise from '@/components/CodeExercise';
import { getLessonNav } from '@/lib/curriculum';

export const metadata = { title: 'Cross-Validation — Credence AI Academy' };

export default function Page() {
  const nav = getLessonNav('ml', '05-cross-validation');
  return (
    <LessonShell
      lessonId="ml/05-cross-validation"
      trackLabel="Machine Learning Basics"
      trackHref="/tracks/ml"
      title="Cross-Validation"
      estMinutes={12}
      nav={nav}
    >
      <p>
        A single train/test split gives you one number. That number has noise.
        Cross-validation gives you many numbers from the same dataset, which
        lets you estimate both the typical performance and its variability.
      </p>

      <h2>k-fold cross-validation</h2>
      <p>
        Split the dataset into <em>k</em> equal-size pieces (&ldquo;folds&rdquo;).
        For each fold:
      </p>
      <ol>
        <li>Hold that fold out as the test set.</li>
        <li>Train on the other k-1 folds.</li>
        <li>Score on the held-out fold.</li>
      </ol>
      <p>
        After k rounds, you have k scores. Their mean is your estimate of
        performance; their spread tells you how confident to be in that
        estimate.
      </p>

      <CodeExercise
        exerciseId="ml/05/cross-val"
        packages={['scikit-learn']}
        prompt={
          <>
            Run 5-fold cross-validation on a <code>LogisticRegression</code>{' '}
            using <code>cross_val_score</code>. Store the array of fold scores in{' '}
            <code>scores</code>, the mean in <code>mean_score</code>, and the
            standard deviation in <code>std_score</code>.
          </>
        }
        starterCode={`import numpy as np
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import cross_val_score
from sklearn.datasets import make_classification

X, y = make_classification(n_samples=300, n_features=5, random_state=0)

model = LogisticRegression(max_iter=1000)

scores = None       # replace
mean_score = 0.0    # replace
std_score = 0.0     # replace

print("scores:", scores)
print(f"{mean_score:.3f} ± {std_score:.3f}")
`}
        tests={[
          { name: 'scores has 5 elements', code: 'assert len(scores) == 5' },
          { name: 'mean_score is the mean of scores', code: 'import numpy as np\nassert abs(mean_score - np.mean(scores)) < 1e-9' },
          { name: 'std_score is the std of scores', code: 'import numpy as np\nassert abs(std_score - np.std(scores)) < 1e-9' },
        ]}
        hint={
          <>
            <code>scores = cross_val_score(model, X, y, cv=5)</code>, then{' '}
            <code>scores.mean()</code> and <code>scores.std()</code>.
          </>
        }
        solution={`import numpy as np
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import cross_val_score
from sklearn.datasets import make_classification

X, y = make_classification(n_samples=300, n_features=5, random_state=0)

model = LogisticRegression(max_iter=1000)
scores = cross_val_score(model, X, y, cv=5)

mean_score = scores.mean()
std_score = scores.std()

print("scores:", scores)
print(f"{mean_score:.3f} ± {std_score:.3f}")
`}
      />

      <h2>Reading the result</h2>
      <p>
        Treat the result as <code>mean ± std</code>. Two models with means of
        0.85 and 0.87 might look like one is clearly better — but if the
        standard deviations are 0.05, the difference is within noise. You
        haven&rsquo;t learned much.
      </p>

      <h2>When not to use it</h2>
      <ul>
        <li>
          <strong>Time-series data.</strong> Random k-fold leaks future
          information into the past. Use <code>TimeSeriesSplit</code> or a
          forward-walking validation instead.
        </li>
        <li>
          <strong>Grouped data</strong>, where many rows come from the same
          unit (e.g. patient, customer). If a single patient&rsquo;s rows are
          in both train and test, you&rsquo;ll see optimistic scores. Use
          <code> GroupKFold</code>.
        </li>
        <li>
          <strong>Very small datasets</strong>, where every fold is too small
          to evaluate reliably. Consider leave-one-out or just be honest about
          the limits.
        </li>
      </ul>

      <h2>Recap</h2>
      <ul>
        <li>k-fold CV gives a more honest performance estimate than one split.</li>
        <li>Report mean and spread, not just mean.</li>
        <li>Random folds aren&rsquo;t always right — time and group structure matter.</li>
      </ul>
    </LessonShell>
  );
}
