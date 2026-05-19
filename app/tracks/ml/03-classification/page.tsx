import LessonShell from '@/components/LessonShell';
import CodeExercise from '@/components/CodeExercise';
import { getLessonNav } from '@/lib/curriculum';

export const metadata = { title: 'Classification — Credence AI Academy' };

export default function Page() {
  const nav = getLessonNav('ml', '03-classification');
  return (
    <LessonShell
      lessonId="ml/03-classification"
      trackLabel="Machine Learning Basics"
      trackHref="/tracks/ml"
      title="Classification"
      estMinutes={15}
      nav={nav}
    >
      <p>
        Classification predicts categories. The simplest interesting model is{' '}
        <strong>logistic regression</strong> — despite the name, it&rsquo;s a
        classifier, not a regressor.
      </p>

      <h2>From regression to classification</h2>
      <p>
        Linear regression outputs an unbounded number. For classification we
        want a probability between 0 and 1. Logistic regression takes a linear
        combination of the features and squashes it through a sigmoid function:
      </p>
      <pre><code>{`z = w · x + b
p(y = 1) = 1 / (1 + exp(-z))`}</code></pre>
      <p>
        At inference, you typically threshold at 0.5: predict class 1 if{' '}
        <code>p &gt; 0.5</code>, else class 0.
      </p>

      <CodeExercise
        exerciseId="ml/03/logistic"
        packages={['scikit-learn']}
        prompt={
          <>
            Fit a <code>LogisticRegression</code> to the toy dataset below
            (two features, binary label). Predict the class for the test point{' '}
            <code>[2.5, 2.5]</code>. Store the prediction in{' '}
            <code>pred</code> (it will be 0 or 1).
          </>
        }
        starterCode={`import numpy as np
from sklearn.linear_model import LogisticRegression

X = np.array([
    [1, 1], [1, 2], [2, 1], [2, 2],   # class 0
    [4, 4], [4, 5], [5, 4], [5, 5],   # class 1
])
y = np.array([0, 0, 0, 0, 1, 1, 1, 1])

model = LogisticRegression()
# fit

pred = -1  # replace with predicted class for [2.5, 2.5]

print("pred:", pred)
`}
        tests={[
          { name: 'pred is 0 or 1', code: 'assert pred in (0, 1)' },
          { name: 'pred for (2.5, 2.5) is 0', code: 'assert pred == 0, f"expected 0, got {pred}"' },
        ]}
        hint={<>After <code>model.fit(X, y)</code>, use <code>model.predict([[2.5, 2.5]])[0]</code>.</>}
        solution={`import numpy as np
from sklearn.linear_model import LogisticRegression

X = np.array([
    [1, 1], [1, 2], [2, 1], [2, 2],
    [4, 4], [4, 5], [5, 4], [5, 5],
])
y = np.array([0, 0, 0, 0, 1, 1, 1, 1])

model = LogisticRegression()
model.fit(X, y)

pred = int(model.predict([[2.5, 2.5]])[0])

print("pred:", pred)
print("probabilities:", model.predict_proba([[2.5, 2.5]])[0])
`}
      />

      <h2>Decision boundaries</h2>
      <p>
        Logistic regression in 2D draws a <em>straight line</em> separating the
        classes. Anything on one side is class 0; the other, class 1. That&rsquo;s
        a strong assumption — many real problems aren&rsquo;t linearly
        separable. We&rsquo;ll get to non-linear models in Lesson 6.
      </p>

      <h2>Accuracy, and why it&rsquo;s often misleading</h2>
      <p>
        Accuracy = fraction of predictions that were correct. It&rsquo;s the
        natural first metric, and it&rsquo;s often the wrong one.
      </p>
      <p>
        Imagine 99% of emails are not-spam. A model that predicts
        &ldquo;not-spam&rdquo; for everything gets 99% accuracy. It also catches
        zero spam, which is the entire reason you built the model. For
        imbalanced classes, accuracy is misleading.
      </p>
      <p>
        Better metrics for imbalanced cases:
      </p>
      <ul>
        <li>
          <strong>Precision</strong> = of the things you predicted positive, what
          fraction were actually positive?
        </li>
        <li>
          <strong>Recall</strong> = of the things that are actually positive,
          what fraction did you catch?
        </li>
        <li>
          <strong>F1</strong> = harmonic mean of precision and recall. Single
          number that balances both.
        </li>
      </ul>

      <CodeExercise
        exerciseId="ml/03/metrics"
        packages={['scikit-learn']}
        prompt={
          <>
            Given the actual labels <code>y_true</code> and the model&rsquo;s
            predictions <code>y_pred</code>, compute accuracy, precision, recall,
            and F1. Use <code>sklearn.metrics</code>.
          </>
        }
        starterCode={`from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score

y_true = [0, 0, 0, 0, 1, 1, 1, 1, 1, 1]
y_pred = [0, 0, 0, 1, 1, 1, 1, 1, 0, 0]

acc = 0
prec = 0
rec = 0
f1 = 0

print("acc:", acc, "prec:", prec, "rec:", rec, "f1:", f1)
`}
        tests={[
          { name: 'accuracy = 0.7', code: 'assert abs(acc - 0.7) < 1e-9' },
          { name: 'precision = 0.8', code: 'assert abs(prec - 0.8) < 1e-9' },
          { name: 'recall ≈ 0.667', code: 'assert abs(rec - 4/6) < 1e-6' },
        ]}
        hint={
          <>
            Each function takes <code>(y_true, y_pred)</code>. Default behavior
            is for binary classification.
          </>
        }
        solution={`from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score

y_true = [0, 0, 0, 0, 1, 1, 1, 1, 1, 1]
y_pred = [0, 0, 0, 1, 1, 1, 1, 1, 0, 0]

acc = accuracy_score(y_true, y_pred)
prec = precision_score(y_true, y_pred)
rec = recall_score(y_true, y_pred)
f1 = f1_score(y_true, y_pred)

print("acc:", acc, "prec:", prec, "rec:", rec, "f1:", f1)
`}
      />

      <h2>Recap</h2>
      <ul>
        <li>Logistic regression is the classification analog of linear regression.</li>
        <li>Its decision boundary is linear in feature space.</li>
        <li>Accuracy lies on imbalanced classes; precision, recall, and F1 are usually more honest.</li>
      </ul>
    </LessonShell>
  );
}
