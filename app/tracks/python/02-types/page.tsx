import LessonShell from '@/components/LessonShell';
import CodeExercise from '@/components/CodeExercise';
import { getLessonNav } from '@/lib/curriculum';

export const metadata = { title: 'Types and Conversions — Credence AI Academy' };

export default function Page() {
  const nav = getLessonNav('python', '02-types');
  return (
    <LessonShell
      lessonId="python/02-types"
      trackLabel="Python Basics"
      trackHref="/tracks/python"
      title="Types and Conversions"
      estMinutes={10}
      nav={nav}
    >
      <p>
        Every value in Python has a <strong>type</strong>. The type determines what
        operations make sense. <code>3 + 4</code> works because both sides are numbers.
        <code>{` "hello" + 4 `}</code> doesn&rsquo;t, because Python won&rsquo;t guess
        what you meant.
      </p>

      <h2>The four types you&rsquo;ll see all the time</h2>
      <ul>
        <li><code>int</code> — whole numbers: <code>0</code>, <code>42</code>, <code>-7</code></li>
        <li><code>float</code> — decimals: <code>3.14</code>, <code>-0.5</code></li>
        <li><code>str</code> — text in quotes: <code>{`"hello"`}</code></li>
        <li><code>bool</code> — <code>True</code> or <code>False</code></li>
      </ul>

      <p>
        Check a type with <code>type(x)</code>:
      </p>
      <pre><code>{`type(42)        # <class 'int'>
type("hi")      # <class 'str'>
type(3.14)      # <class 'float'>`}</code></pre>

      <h2>Converting between types</h2>
      <p>
        Use the type name as a function: <code>int(&quot;42&quot;)</code>,{' '}
        <code>str(7)</code>, <code>float(&quot;3.14&quot;)</code>. Conversions can
        fail — <code>int(&quot;hello&quot;)</code> raises an error because there is
        no number to extract.
      </p>

      <CodeExercise
        exerciseId="python/02-types/total"
        prompt={
          <>
            <code>price</code> and <code>quantity</code> are given as strings (this is
            what happens when you read user input). Convert them to numbers and
            compute the total. Store it in <code>total</code>.
          </>
        }
        starterCode={`price = "12.50"
quantity = "3"

# convert and compute
total = 0

print(total)
`}
        tests={[
          {
            name: 'total is approximately 37.50',
            code: 'assert abs(total - 37.5) < 1e-9, f"expected 37.5, got {total}"',
            hint: 'Convert price with float() and quantity with int(), then multiply.',
          },
        ]}
        hint={
          <>
            <code>float(&quot;12.50&quot;)</code> gives you a number you can multiply.
          </>
        }
        solution={`price = "12.50"
quantity = "3"

total = float(price) * int(quantity)

print(total)
`}
      />

      <h2>Truthiness</h2>
      <p>
        Booleans appear everywhere — every <code>if</code> statement uses them. Beyond{' '}
        <code>True</code> and <code>False</code>, Python treats other values as
        &ldquo;truthy&rdquo; or &ldquo;falsy&rdquo;:
      </p>
      <ul>
        <li>Falsy: <code>0</code>, <code>0.0</code>, <code>{`""`}</code>, <code>None</code>, empty list <code>[]</code></li>
        <li>Truthy: everything else</li>
      </ul>

      <CodeExercise
        exerciseId="python/02-types/truthy"
        prompt={
          <>
            Set <code>has_balance</code> to <code>True</code> if <code>balance</code>{' '}
            is not zero, and <code>False</code> otherwise. Do it in one line using{' '}
            <code>bool()</code>.
          </>
        }
        starterCode={`balance = 0

has_balance = None  # replace

print(has_balance)
`}
        tests={[
          {
            name: 'has_balance is False when balance is 0',
            code: 'assert has_balance is False, f"expected False, got {has_balance!r}"',
            hint: 'bool(0) is False because 0 is falsy.',
          },
        ]}
        hint={<>Wrap <code>balance</code> in <code>bool(...)</code>.</>}
        solution={`balance = 0

has_balance = bool(balance)

print(has_balance)
`}
      />

      <h2>Recap</h2>
      <ul>
        <li>Types control what operations are allowed.</li>
        <li>Convert deliberately: <code>int()</code>, <code>float()</code>, <code>str()</code>, <code>bool()</code>.</li>
        <li>Empty / zero / None values are falsy. Everything else is truthy.</li>
      </ul>
    </LessonShell>
  );
}
