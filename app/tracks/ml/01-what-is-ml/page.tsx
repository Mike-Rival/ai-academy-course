import LessonShell from '@/components/LessonShell';
import CodeExercise from '@/components/CodeExercise';
import { MultipleChoice } from '@/components/NonCodeExercise';
import { getLessonNav } from '@/lib/curriculum';

export const metadata = { title: 'What is Machine Learning? — AI Academy' };

export default function Page() {
  const nav = getLessonNav('ml', '01-what-is-ml');
  return (
    <LessonShell
      lessonId="ml/01-what-is-ml"
      trackLabel="Machine Learning Basics"
      trackHref="/tracks/ml"
      title="What is Machine Learning?"
      estMinutes={10}
      nav={nav}
    >
      <p>
        Machine learning is a way of writing programs by example. Instead of
        spelling out every rule, you show the computer many input-output pairs and
        let it find a function that fits.
      </p>

      <h2>The basic shape</h2>
      <p>
        Most of supervised ML — the kind we&rsquo;ll focus on — has the same
        structure:
      </p>
      <ul>
        <li><strong>Features</strong>, usually called <code>X</code>: the inputs. A matrix where each row is an example and each column is a measured property.</li>
        <li><strong>Labels</strong>, usually called <code>y</code>: the outputs you want to predict. One value per row.</li>
        <li><strong>A model</strong>: a function that takes <code>X</code> and produces a guess at <code>y</code>.</li>
        <li><strong>Training</strong>: adjusting the model so its guesses get close to the real <code>y</code>.</li>
        <li><strong>Prediction</strong>: using the trained model on new rows where you don&rsquo;t know <code>y</code>.</li>
      </ul>

      <h2>Two flavors</h2>
      <ul>
        <li>
          <strong>Regression</strong> — <code>y</code> is a number. Predict house
          price, customer lifetime value, tomorrow&rsquo;s temperature.
        </li>
        <li>
          <strong>Classification</strong> — <code>y</code> is a category. Predict
          spam/not-spam, will-churn/won&rsquo;t-churn, which of 10 product
          categories.
        </li>
      </ul>
      <p>
        There&rsquo;s a third class — <strong>unsupervised</strong> — where you
        only have <code>X</code> and the task is to find structure. Clustering
        falls here. We&rsquo;ll cover it in Lesson 7.
      </p>

      <h2>A tiny worked example</h2>
      <p>
        Let&rsquo;s say you have data on five houses: square footage and price.
        You want to predict price for a sixth house. Eyeball-fit a line through
        the points, and that&rsquo;s essentially what linear regression does
        — but with math doing the eyeballing.
      </p>

      <CodeExercise
        exerciseId="ml/01-what-is-ml/intro"
        packages={['scikit-learn']}
        prompt={
          <>
            We have square footage (<code>X</code>) and prices (<code>y</code>) for
            five houses. Fit a <code>LinearRegression</code> to them and predict
            the price for a 2000-sqft house. Store the prediction in{' '}
            <code>predicted_price</code>.
            <br />
            <br />
            <em>First run on this lesson loads scikit-learn (~10 MB) — give it a
            moment.</em>
          </>
        }
        starterCode={`import numpy as np
from sklearn.linear_model import LinearRegression

X = np.array([[800], [1200], [1500], [1800], [2200]])
y = np.array([220_000, 310_000, 380_000, 440_000, 530_000])

model = LinearRegression()
# fit the model

predicted_price = 0  # replace with model's prediction for 2000 sqft

print("predicted:", predicted_price)
`}
        tests={[
          {
            name: 'predicted_price is reasonable (400k–550k)',
            code: 'assert 400_000 < float(predicted_price) < 550_000, f"got {predicted_price}"',
            hint: 'After fitting, call model.predict on a 2D array — e.g. [[2000]] — and grab the first element.',
          },
        ]}
        hint={
          <>
            <code>model.fit(X, y)</code>, then{' '}
            <code>model.predict([[2000]])[0]</code>.
          </>
        }
        solution={`import numpy as np
from sklearn.linear_model import LinearRegression

X = np.array([[800], [1200], [1500], [1800], [2200]])
y = np.array([220_000, 310_000, 380_000, 440_000, 530_000])

model = LinearRegression()
model.fit(X, y)

predicted_price = model.predict([[2000]])[0]

print("predicted:", predicted_price)
print("slope:", model.coef_)
print("intercept:", model.intercept_)
`}
      />

      <h2>What the model actually learned</h2>
      <p>
        The fitted model is essentially a line: <code>price ≈ slope × sqft +
        intercept</code>. The training step picked the slope and intercept that
        minimize the average squared error across your five rows.
      </p>
      <p>
        Most of ML, from this point on, is variations on this theme: a function
        shape, a way to measure error, and a way to minimize it.
      </p>

      <MultipleChoice
        exerciseId="ml/01/quiz"
        prompt={<>Which of these is a <em>classification</em> problem?</>}
        options={[
          { id: 'a', text: 'Predict the number of bikes rented per day from weather data.', rationale: 'Output is a count — that is regression.' },
          { id: 'b', text: 'Predict whether an email is spam.', correct: true, rationale: 'Two categories: spam / not-spam. Classification.' },
          { id: 'c', text: 'Predict tomorrow\u2019s closing stock price.', rationale: 'Output is a real number. Regression.' },
          { id: 'd', text: 'Find natural groups of customers based on their behavior.', rationale: 'No labels given; you are finding structure. Unsupervised — specifically clustering.' },
        ]}
      />

      <p className="text-sm text-slate-500 mt-6">
        Up next: linear regression in more depth — fit, predict, and how to read
        residuals.
      </p>
    </LessonShell>
  );
}
