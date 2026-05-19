import LessonShell from '@/components/LessonShell';
import CodeExercise from '@/components/CodeExercise';
import { getLessonNav } from '@/lib/curriculum';

export const metadata = { title: 'Control Flow — AI Academy' };

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

      <p>
        For exercises that need to be tested against several inputs, we&rsquo;ll
        wrap the logic in a function. You&rsquo;ll see <code>def</code> formally
        in the next lesson — for now, treat <code>def name(arg):</code> as
        &ldquo;a named block of code I can call with different values.&rdquo;
      </p>

      <CodeExercise
        exerciseId="python/03-control-flow/grade"
        prompt={
          <>
            Complete the function <code>letter_grade(score)</code>. Given a
            score from 0 to 100, return:
            <br />
            <code>&quot;A&quot;</code> if 90+, <code>&quot;B&quot;</code> if 80–89,{' '}
            <code>&quot;C&quot;</code> if 70–79, <code>&quot;D&quot;</code> if 60–69,
            otherwise <code>&quot;F&quot;</code>.
          </>
        }
        starterCode={`def letter_grade(score):
    pass  # replace this with your if/elif/else logic

# quick check
print(letter_grade(84))
print(letter_grade(72))
print(letter_grade(45))
`}
        tests={[
          { name: '84 → B', code: 'assert letter_grade(84) == "B"', hint: "Make sure your conditions cover 80 through 89 inclusive." },
          { name: '72 → C', code: 'assert letter_grade(72) == "C"' },
          { name: '45 → F', code: 'assert letter_grade(45) == "F"' },
          { name: '90 → A (edge case)', code: 'assert letter_grade(90) == "A"' },
          { name: '60 → D (edge case)', code: 'assert letter_grade(60) == "D"' },
        ]}
        hint={
          <>
            Inside the function: a chain of <code>if</code> / <code>elif</code>{' '}
            checks, each returning the right letter. Don&rsquo;t forget to{' '}
            <code>return</code> from each branch.
          </>
        }
        solution={`def letter_grade(score):
    if score >= 90:
        return "A"
    elif score >= 80:
        return "B"
    elif score >= 70:
        return "C"
    elif score >= 60:
        return "D"
    else:
        return "F"

print(letter_grade(84))
print(letter_grade(72))
print(letter_grade(45))
`}
      />

      <CodeExercise
        exerciseId="python/03-control-flow/leap-year"
        prompt={
          <>
            Complete <code>is_leap(year)</code>. Return <code>True</code> if{' '}
            <code>year</code> is a leap year. Rule: divisible by 4, except
            centuries which must be divisible by 400. So 2000 is leap, 1900 is
            not, 2024 is.
          </>
        }
        starterCode={`def is_leap(year):
    pass  # return True or False

print(is_leap(2024))
print(is_leap(1900))
print(is_leap(2000))
`}
        tests={[
          { name: '2024 is leap', code: 'assert is_leap(2024) is True' },
          { name: '1900 is not leap', code: 'assert is_leap(1900) is False' },
          { name: '2000 is leap', code: 'assert is_leap(2000) is True' },
          { name: '2023 is not leap', code: 'assert is_leap(2023) is False' },
        ]}
        hint={
          <>
            <code>(divisible by 4 and not divisible by 100) or (divisible by 400)</code>.
            Use <code>%</code> for &ldquo;remainder.&rdquo; A number is divisible by
            <em> n</em> when <code>x % n == 0</code>.
          </>
        }
        solution={`def is_leap(year):
    return (year % 4 == 0 and year % 100 != 0) or (year % 400 == 0)

print(is_leap(2024))
print(is_leap(1900))
print(is_leap(2000))
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
