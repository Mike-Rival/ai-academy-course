import LessonShell from '@/components/LessonShell';
import CodeExercise from '@/components/CodeExercise';
import { getLessonNav } from '@/lib/curriculum';

export const metadata = { title: 'Control Flow — Credence AI Academy' };

export default function Page() {
  const nav = getLessonNav('python', '03-control-flow');
  return (
    <LessonShell
      lessonId="python/03-control-flow"
      trackLabel="Python Basics"
      trackHref="/tracks/python"
      title="Control Flow"
      estMinutes={12}
      nav={nav}
    >
      <p>
        Programs make decisions. <code>if</code> / <code>elif</code> /{' '}
        <code>else</code> is how you write them.
      </p>

      <pre><code>{`x = 7

if x > 10:
    print("big")
elif x > 0:
    print("small but positive")
else:
    print("zero or negative")`}</code></pre>

      <p>
        Indentation is required. The body of each branch is the indented block. Most
        Python code uses 4 spaces.
      </p>

      <h2>Comparison operators</h2>
      <ul>
        <li><code>==</code> equals (note: two equals signs — one is assignment)</li>
        <li><code>!=</code> not equals</li>
        <li><code>{`<`}</code>, <code>{`>`}</code>, <code>{`<=`}</code>, <code>{`>=`}</code></li>
      </ul>

      <h2>Boolean logic</h2>
      <p>Combine conditions with <code>and</code>, <code>or</code>, <code>not</code>:</p>
      <pre><code>{`if age >= 18 and has_id:
    print("ok")

if not is_member:
    print("please sign up")`}</code></pre>

      <CodeExercise
        exerciseId="python/03-control-flow/grade"
        prompt={
          <>
            Given a <code>score</code> from 0 to 100, set <code>grade</code> to:
            <br />
            <code>&quot;A&quot;</code> if 90+, <code>&quot;B&quot;</code> if 80–89,{' '}
            <code>&quot;C&quot;</code> if 70–79, <code>&quot;D&quot;</code> if 60–69,
            otherwise <code>&quot;F&quot;</code>.
          </>
        }
        starterCode={`score = 84

grade = ""

# your code here

print(grade)
`}
        tests={[
          {
            name: 'score=84 → B',
            code: 'score = 84\nexec(_user_code)\nassert grade == "B"',
            hint: 'Make sure your conditions cover 80 through 89 inclusive.',
          },
          {
            name: 'score=72 → C',
            code: 'score = 72\nexec(_user_code)\nassert grade == "C"',
          },
          {
            name: 'score=45 → F',
            code: 'score = 45\nexec(_user_code)\nassert grade == "F"',
          },
        ]}
        hint={<>Use a chain of <code>if</code> / <code>elif</code>, with <code>else</code> for F.</>}
        solution={`score = 84

if score >= 90:
    grade = "A"
elif score >= 80:
    grade = "B"
elif score >= 70:
    grade = "C"
elif score >= 60:
    grade = "D"
else:
    grade = "F"

print(grade)
`}
      />

      <h2>A note on the tests above</h2>
      <p>
        Those test snippets use a small trick: they re-run your code with different
        values of <code>score</code> by setting the variable and re-executing. You
        don&rsquo;t need to understand this to do the exercise — just write straight
        line code as you normally would.
      </p>

      <CodeExercise
        exerciseId="python/03-control-flow/leap-year"
        prompt={
          <>
            Set <code>is_leap</code> to <code>True</code> if <code>year</code> is a
            leap year. Rule: divisible by 4, except centuries which must be divisible
            by 400. So 2000 is leap, 1900 is not, 2024 is.
          </>
        }
        starterCode={`year = 2024

is_leap = False

# your code here

print(is_leap)
`}
        tests={[
          { name: '2024 is leap', code: 'year=2024\nexec(_user_code)\nassert is_leap is True' },
          { name: '1900 is not leap', code: 'year=1900\nexec(_user_code)\nassert is_leap is False' },
          { name: '2000 is leap', code: 'year=2000\nexec(_user_code)\nassert is_leap is True' },
          { name: '2023 is not leap', code: 'year=2023\nexec(_user_code)\nassert is_leap is False' },
        ]}
        hint={
          <>
            <code>(divisible by 4 and not divisible by 100) or (divisible by 400)</code>.
            Use <code>%</code> for &ldquo;remainder.&rdquo; A number is divisible by
            <em> n</em> when <code>x % n == 0</code>.
          </>
        }
        solution={`year = 2024

is_leap = (year % 4 == 0 and year % 100 != 0) or (year % 400 == 0)

print(is_leap)
`}
      />

      <h2>Recap</h2>
      <ul>
        <li><code>if</code>/<code>elif</code>/<code>else</code> picks one branch.</li>
        <li>Conditions are boolean expressions, often using <code>==</code>, <code>{`<`}</code>, <code>and</code>, <code>or</code>, <code>not</code>.</li>
        <li>Watch the indentation. Same level = same block.</li>
      </ul>
    </LessonShell>
  );
}
