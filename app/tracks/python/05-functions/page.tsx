import LessonShell from '@/components/LessonShell';
import CodeExercise from '@/components/CodeExercise';
import { getLessonNav } from '@/lib/curriculum';

export const metadata = { title: 'Functions — AI Academy' };

export default function Page() {
  const nav = getLessonNav('python', '05-functions');
  return (
    <LessonShell
      lessonId="python/05-functions"
      trackLabel="Python Basics"
      trackHref="/tracks/python"
      title="Functions"
      estMinutes={15}
      nav={nav}
    >
      <p>
        A function is a named block of code you can run with different inputs.
        Functions let you write a piece of logic once and reuse it.
      </p>

      <pre><code>{`def greet(name):
    return "Hello, " + name + "!"

print(greet("Maria"))   # Hello, Maria!`}</code></pre>

      <ul>
        <li><code>def</code> introduces a function.</li>
        <li>Parameters in the parentheses are the inputs.</li>
        <li><code>return</code> sends back a value. Without it, the function returns <code>None</code>.</li>
      </ul>

      <CodeExercise
        exerciseId="python/05-functions/circle-area"
        prompt={
          <>
            Write a function <code>circle_area(r)</code> that returns the area of a
            circle with radius <code>r</code>. Use 3.14159 as π.
          </>
        }
        starterCode={`def circle_area(r):
    pass  # replace

# quick sanity print
print(circle_area(2))
`}
        tests={[
          { name: 'circle_area(0) == 0', code: 'assert abs(circle_area(0)) < 1e-9' },
          { name: 'circle_area(1) ≈ 3.14159', code: 'assert abs(circle_area(1) - 3.14159) < 1e-6' },
          { name: 'circle_area(2) ≈ 12.56636', code: 'assert abs(circle_area(2) - 12.56636) < 1e-3' },
        ]}
        hint={<>Return <code>3.14159 * r * r</code>.</>}
        solution={`def circle_area(r):
    return 3.14159 * r * r

print(circle_area(2))
`}
      />

      <h2>Default arguments</h2>
      <p>
        You can give parameters defaults. Callers can override them or skip them.
      </p>
      <pre><code>{`def greet(name, greeting="Hello"):
    return greeting + ", " + name + "!"

greet("Maria")               # "Hello, Maria!"
greet("Maria", "Hi")         # "Hi, Maria!"`}</code></pre>

      <CodeExercise
        exerciseId="python/05-functions/mean"
        prompt={
          <>
            Write a function <code>mean(values)</code> that returns the arithmetic
            mean of a list of numbers. If the list is empty, return <code>0</code>.
          </>
        }
        starterCode={`def mean(values):
    pass  # replace

print(mean([1, 2, 3, 4]))
print(mean([]))
`}
        tests={[
          { name: 'mean of 1..4 is 2.5', code: 'assert mean([1,2,3,4]) == 2.5' },
          { name: 'mean of [10] is 10', code: 'assert mean([10]) == 10' },
          { name: 'mean of [] is 0', code: 'assert mean([]) == 0' },
        ]}
        hint={
          <>
            Use <code>sum()</code> and <code>len()</code>. Guard against division by
            zero with an early return when the list is empty.
          </>
        }
        solution={`def mean(values):
    if len(values) == 0:
        return 0
    return sum(values) / len(values)

print(mean([1, 2, 3, 4]))
print(mean([]))
`}
      />

      <h2>Scope, briefly</h2>
      <p>
        Variables you create inside a function are <em>local</em> to it — they
        don&rsquo;t exist outside. This is intentional; it prevents functions from
        stepping on each other&rsquo;s state.
      </p>

      <h2>Recap</h2>
      <ul>
        <li><code>def</code> defines a function. <code>return</code> sends back a value.</li>
        <li>Defaults let parameters be optional.</li>
        <li>Local variables stay local. Pass data in and out via parameters and return.</li>
      </ul>
    </LessonShell>
  );
}
