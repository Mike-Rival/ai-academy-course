import LessonShell from '@/components/LessonShell';
import CodeExercise from '@/components/CodeExercise';
import { getLessonNav } from '@/lib/curriculum';

export const metadata = { title: 'Trees and Forests — Credence AI Academy' };

export default function Page() {
  const nav = getLessonNav('ml', '06-trees-and-forests');
  return (
    <LessonShell
      lessonId="ml/06-trees-and-forests"
      trackLabel="Machine Learning Basics"
      trackHref="/tracks/ml"
      title="Trees and Forests"
      estMinutes={18}
      nav={nav}
    >
      <p>
        Linear models split classes with straight lines. Many real datasets
        aren&rsquo;t linearly separable. Decision trees and their ensemble,
        random forests, are the standard non-linear baseline.
      </p>

      <h2>Decision trees</h2>
      <p>
        A decision tree asks a series of yes/no questions about features.
        &ldquo;Is age &gt; 30? If yes, is income &gt; 50k? If yes, predict
        class A.&rdquo; The tree is built by repeatedly choosing the
        feature-and-threshold that best splits the data into purer subsets.
      </p>
      <p>
        Trees are easy to interpret (you can read the splits) and can capture
        non-linear and interaction effects naturally. Their weakness: they
        overfit. A deep tree memorizes training data and generalizes poorly.
      </p>

      <CodeExercise
        exerciseId="ml/06/tree"
        packages={['scikit-learn']}
        prompt={
          <>
            Train a <code>DecisionTreeClassifier</code> (default settings) on
            the synthetic dataset and score it on the test set. Store the test
            accuracy in <code>tree_test_acc</code>. Also fit a tree with{' '}
            <code>max_depth=3</code> and store its test accuracy in{' '}
            <code>shallow_test_acc</code>.
          </>
        }
        starterCode={`import numpy as np
from sklearn.tree import DecisionTreeClassifier
from sklearn.model_selection import train_test_split
from sklearn.datasets import make_classification

X, y = make_classification(n_samples=400, n_features=10, random_state=0)
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.3, random_state=42)

tree = DecisionTreeClassifier(random_state=0)
# fit and score

tree_test_acc = 0     # replace
shallow_test_acc = 0  # replace

print("tree:", tree_test_acc, "shallow:", shallow_test_acc)
`}
        tests={[
          { name: 'tree_test_acc > 0.6', code: 'assert tree_test_acc > 0.6' },
          { name: 'shallow_test_acc > 0.6', code: 'assert shallow_test_acc > 0.6' },
        ]}
        hint={
          <>
            Fit two trees: one default, one with{' '}
            <code>DecisionTreeClassifier(max_depth=3, random_state=0)</code>.
          </>
        }
        solution={`import numpy as np
from sklearn.tree import DecisionTreeClassifier
from sklearn.model_selection import train_test_split
from sklearn.datasets import make_classification

X, y = make_classification(n_samples=400, n_features=10, random_state=0)
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.3, random_state=42)

tree = DecisionTreeClassifier(random_state=0).fit(X_train, y_train)
shallow = DecisionTreeClassifier(max_depth=3, random_state=0).fit(X_train, y_train)

tree_test_acc = tree.score(X_test, y_test)
shallow_test_acc = shallow.score(X_test, y_test)

print("tree:", tree_test_acc, "shallow:", shallow_test_acc)
print("tree train:", tree.score(X_train, y_train))
print("shallow train:", shallow.score(X_train, y_train))
`}
      />

      <p>
        Try printing both the training and test scores in your solution. The
        deep default tree typically gets 100% on training and middling on
        test — classic overfitting. The shallow tree does worse on training
        but often <em>better</em> on test.
      </p>

      <h2>Random forests</h2>
      <p>
        A random forest trains many decision trees on different random subsets
        of the data and features, then averages their predictions. The
        averaging cancels out the noise that individual trees pick up. The
        result is a model that retains the non-linearity of trees while
        generalizing much better.
      </p>

      <CodeExercise
        exerciseId="ml/06/forest"
        packages={['scikit-learn']}
        prompt={
          <>
            Train a <code>RandomForestClassifier</code> with 100 trees on the
            same dataset. Compare its test accuracy to the single trees from
            the previous exercise. Store it in <code>forest_test_acc</code>.
          </>
        }
        starterCode={`import numpy as np
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.datasets import make_classification

X, y = make_classification(n_samples=400, n_features=10, random_state=0)
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.3, random_state=42)

forest = RandomForestClassifier(n_estimators=100, random_state=0)
# fit and score

forest_test_acc = 0  # replace

print("forest:", forest_test_acc)
`}
        tests={[
          { name: 'forest_test_acc > 0.75', code: 'assert forest_test_acc > 0.75' },
        ]}
        hint={
          <>
            <code>forest.fit(X_train, y_train)</code>, then{' '}
            <code>forest_test_acc = forest.score(X_test, y_test)</code>.
          </>
        }
        solution={`import numpy as np
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.datasets import make_classification

X, y = make_classification(n_samples=400, n_features=10, random_state=0)
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.3, random_state=42)

forest = RandomForestClassifier(n_estimators=100, random_state=0)
forest.fit(X_train, y_train)

forest_test_acc = forest.score(X_test, y_test)

print("forest:", forest_test_acc)
print("feature importances:", forest.feature_importances_)
`}
      />

      <h2>Feature importance</h2>
      <p>
        Forests give you an easy estimate of which features mattered most.{' '}
        <code>model.feature_importances_</code> returns a number per feature.
        Higher = the model used that feature more for splits. Useful for sanity
        checks (&ldquo;wait, why is the customer ID column important?&rdquo; is
        usually the right alarm to raise).
      </p>

      <h2>When to reach for trees vs. linear</h2>
      <ul>
        <li>
          <strong>Linear models</strong>: interpretable, fast, great when the
          relationship really is approximately linear, useful as a baseline you
          must beat.
        </li>
        <li>
          <strong>Trees / forests</strong>: handle non-linearity and
          interactions without feature engineering, robust to feature scale,
          give importance estimates.
        </li>
        <li>
          <strong>Gradient boosting</strong> (XGBoost, LightGBM, sklearn&rsquo;s{' '}
          <code>HistGradientBoostingClassifier</code>): often the strongest
          tabular model. We&rsquo;re not covering them here, but know they
          exist and are usually the next thing to try.
        </li>
      </ul>

      <h2>Recap</h2>
      <ul>
        <li>Trees split feature space recursively. They overfit on their own.</li>
        <li>Random forests average many trees. Robust default for tabular data.</li>
        <li>Feature importances are a useful sanity check, but not a causal claim.</li>
      </ul>
    </LessonShell>
  );
}
