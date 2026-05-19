import LessonShell from '@/components/LessonShell';
import CodeExercise from '@/components/CodeExercise';
import { getLessonNav } from '@/lib/curriculum';

export const metadata = { title: 'Train/Test Split — Credence AI Academy' };

export default function Page() {
  const nav = getLessonNav('ml', '04-train-test-split');
  return (
    <LessonShell
      lessonId="ml/04-train-test-split"
      trackLabel="Machine Learning Basics"
      trackHref="/tracks/ml"
      title="Train/Test Split"
      estMinutes={12}
      nav={nav}
    >
      <p>
        Evaluating a model on the same data you trained on is like grading a
        test the student took with the answer key. It tells you the model can
        memorize. It does not tell you whether it generalizes.
      </p>

      <h2>The fix</h2>
      <p>
        Split your data into two pieces: a <strong>training set</strong> the
        model sees, and a <strong>test set</strong> the model never sees during
        training. Evaluate on the test set. That number tells you how well the
        model is likely to do on genuinely new data.
      </p>

      <pre><code>{`from sklearn.model_selection import train_test_split

X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)`}</code></pre>

      <p>
        <code>test_size=0.2</code> means 20% goes to test, 80% to train.{' '}
        <code>random_state=42</code> fixes the random seed so the split is
        reproducible — useful for debugging.
      </p>

      <CodeExercise
        exerciseId="ml/04/split-and-score"
        packages={['scikit-learn']}
        prompt={
          <>
            Split the dataset 70/30 (test size 0.3), train a{' '}
            <code>LogisticRegression</code> on the training portion, and score
            it on both <code>X_train</code> and <code>X_test</code>. Store the
            two scores in <code>train_acc</code> and <code>test_acc</code>.
          </>
        }
        starterCode={`import numpy as np
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import train_test_split
from sklearn.datasets import make_classification

X, y = make_classification(
    n_samples=200, n_features=4, n_informative=3, n_redundant=0, random_state=0
)

X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.3, random_state=42
)

model = LogisticRegression(max_iter=1000)
# fit on training data

train_acc = 0  # replace
test_acc = 0   # replace

print("train_acc:", train_acc, "test_acc:", test_acc)
`}
        tests={[
          { name: 'train_acc > 0.7', code: 'assert train_acc > 0.7' },
          { name: 'test_acc > 0.6', code: 'assert test_acc > 0.6' },
          { name: 'train_acc and test_acc are different', code: 'assert train_acc != test_acc' },
        ]}
        hint={
          <>
            After <code>model.fit(X_train, y_train)</code>:{' '}
            <code>train_acc = model.score(X_train, y_train)</code>;{' '}
            <code>test_acc = model.score(X_test, y_test)</code>.
          </>
        }
        solution={`import numpy as np
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import train_test_split
from sklearn.datasets import make_classification

X, y = make_classification(
    n_samples=200, n_features=4, n_informative=3, n_redundant=0, random_state=0
)

X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.3, random_state=42
)

model = LogisticRegression(max_iter=1000)
model.fit(X_train, y_train)

train_acc = model.score(X_train, y_train)
test_acc = model.score(X_test, y_test)

print("train_acc:", train_acc, "test_acc:", test_acc)
`}
      />

      <h2>Reading the gap</h2>
      <p>
        The relationship between training accuracy and test accuracy tells you
        a lot:
      </p>
      <ul>
        <li>
          <strong>Both high, similar</strong>: good news. The model is
          learning, and it generalizes.
        </li>
        <li>
          <strong>Training high, test much lower</strong>: <em>overfitting</em>.
          The model memorized training data, including its noise, and
          can&rsquo;t do better on new data. Common with complex models on
          small datasets.
        </li>
        <li>
          <strong>Both low</strong>: <em>underfitting</em>. The model is too
          simple or features too weak to capture the pattern.
        </li>
        <li>
          <strong>Test higher than training</strong>: rare, usually a sign that
          your split was unlucky or your test set is somehow easier. Worth
          investigating.
        </li>
      </ul>

      <h2>The lurking problem</h2>
      <p>
        A single train/test split is one sample of a noisy quantity. If you
        had split differently, you&rsquo;d get a different test accuracy. With
        small datasets the variance across splits can be large. The next lesson
        — cross-validation — addresses this.
      </p>

      <h2>Recap</h2>
      <ul>
        <li>Never evaluate on training data. The number lies.</li>
        <li><code>train_test_split</code> is the basic move. <code>random_state</code> makes it reproducible.</li>
        <li>Compare training and test scores to diagnose over/underfitting.</li>
      </ul>
    </LessonShell>
  );
}
