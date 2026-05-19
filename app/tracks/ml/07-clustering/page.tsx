import LessonShell from '@/components/LessonShell';
import CodeExercise from '@/components/CodeExercise';
import { getLessonNav } from '@/lib/curriculum';

export const metadata = { title: 'Clustering — AI Academy' };

export default function Page() {
  const nav = getLessonNav('ml', '07-clustering');
  return (
    <LessonShell
      lessonId="ml/07-clustering"
      trackLabel="Machine Learning Basics"
      trackHref="/tracks/ml"
      title="Clustering"
      estMinutes={12}
      nav={nav}
    >
      <p>
        So far, every model has needed labels — a <code>y</code> column to
        predict. Clustering is unsupervised: only <code>X</code>. The task is to
        find groups in the data that share structure.
      </p>

      <h2>k-means</h2>
      <p>
        The most common clustering algorithm. You choose <em>k</em> (the number
        of clusters), and the algorithm finds <em>k</em> centers and assigns
        each point to its nearest center. The math iterates until the centers
        stop moving.
      </p>
      <p>
        Three things to know:
      </p>
      <ol>
        <li>
          <strong>You choose k.</strong> The algorithm doesn&rsquo;t decide; you
          do. We&rsquo;ll see how to choose below.
        </li>
        <li>
          <strong>Scale matters.</strong> k-means measures distance in raw
          feature units. A feature ranging 0–1 and a feature ranging 0–1,000,000
          will be dominated by the second. Standardize first (we&rsquo;ll cover
          this formally in Lesson 8).
        </li>
        <li>
          <strong>Clusters are spherical.</strong> k-means assumes round, equal-sized
          clusters. When clusters are elongated or different sizes, k-means
          struggles.
        </li>
      </ol>

      <CodeExercise
        exerciseId="ml/07/kmeans"
        packages={['scikit-learn']}
        prompt={
          <>
            Fit a <code>KMeans</code> with 3 clusters on the synthetic data.
            Store the cluster centers in <code>centers</code> (shape{' '}
            <code>(3, 2)</code>) and the per-point cluster assignments in{' '}
            <code>labels</code>.
          </>
        }
        starterCode={`import numpy as np
from sklearn.cluster import KMeans
from sklearn.datasets import make_blobs

X, _ = make_blobs(n_samples=300, centers=3, cluster_std=0.6, random_state=0)

km = KMeans(n_clusters=3, n_init=10, random_state=0)
# fit on X

centers = None  # replace
labels = None   # replace

print("centers:\\n", centers)
print("first 10 labels:", labels[:10])
`}
        tests={[
          { name: 'centers shape is (3, 2)', code: 'import numpy as np\nassert np.array(centers).shape == (3, 2)' },
          { name: 'labels length matches X', code: 'import numpy as np\nassert len(labels) == 300' },
          { name: 'labels are in {0, 1, 2}', code: 'import numpy as np\nassert set(np.unique(labels)) == {0, 1, 2}' },
        ]}
        hint={
          <>
            After <code>km.fit(X)</code>: <code>km.cluster_centers_</code> and{' '}
            <code>km.labels_</code>.
          </>
        }
        solution={`import numpy as np
from sklearn.cluster import KMeans
from sklearn.datasets import make_blobs

X, _ = make_blobs(n_samples=300, centers=3, cluster_std=0.6, random_state=0)

km = KMeans(n_clusters=3, n_init=10, random_state=0)
km.fit(X)

centers = km.cluster_centers_
labels = km.labels_

print("centers:\\n", centers)
print("first 10 labels:", labels[:10])
`}
      />

      <h2>Picking k</h2>
      <p>
        The naive approach: run k-means with different <em>k</em> values and
        plot the &ldquo;inertia&rdquo; (sum of squared distances to the nearest
        center). Inertia drops as <em>k</em> grows; you look for an{' '}
        &ldquo;elbow&rdquo; where the drop slows.
      </p>
      <p>
        In practice, the elbow is often subjective. Combine it with domain
        knowledge: do <em>k</em>=3 clusters make business sense? Are any of
        them too small to be meaningful?
      </p>

      <h2>What clustering is and isn&rsquo;t</h2>
      <p>
        Clustering is <em>exploratory</em>. It produces a hypothesis (&ldquo;there
        seem to be three groups&rdquo;) — it does not produce a fact. The
        clusters are a function of the algorithm, feature scaling, and
        randomness in initialization. Different methods can give different
        groupings on the same data, and all might be defensible.
      </p>
      <p>
        Common pitfall: presenting clusters to leadership as if they were
        natural categories the data &ldquo;reveals.&rdquo; They&rsquo;re a
        choice you made. Be honest about the choices.
      </p>

      <h2>Recap</h2>
      <ul>
        <li>k-means: pick k, find k centers, assign points to nearest.</li>
        <li>Standardize features first. Clusters are sensitive to scale.</li>
        <li>Clusters are hypotheses, not facts. Treat them accordingly.</li>
      </ul>
    </LessonShell>
  );
}
