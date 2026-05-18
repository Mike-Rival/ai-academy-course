import LessonShell from '@/components/LessonShell';
import CodeExercise from '@/components/CodeExercise';
import { getLessonNav } from '@/lib/curriculum';

export const metadata = { title: 'Loops — Credence AI Academy' };

export default function Page() {
  const nav = getLessonNav('python', '04-loops');
  return (
    <LessonShell
      lessonId="python/04-loops"
      trackLabel="Python Basics"
      trackHref="/tracks/python"
      title="Loops"
      estMinutes={12}
      nav={nav}
    >
      <p>
        Loops let you repeat work. Python has two flavors. <code>for</code> walks
        through a known sequence; <code>while</code> keeps going until a condition
        becomes false.
      </p>

      <pre><code>{`for i in range(5):       # 0, 1, 2, 3, 4
    print(i)

n = 10
while n > 0:
    print(n)
    n = n - 1`}</code></pre>

      <p>
        <code>range(start, stop)</code> generates numbers from <code>start</code> up
        to but <em>not including</em> <code>stop</code>. <code>range(5)</code> is
        shorthand for <code>range(0, 5)</code>.
      </p>

      <CodeExercise
        exerciseId="python/04-loops/sum-1-100"
        prompt={
          <>
            Compute the sum of the integers from 1 to 100 (inclusive). Store the
            result in <code>total</code>.
          </>
        }
        starterCode={`total = 0

# your loop here

print(total)
`}
        tests={[
          {
            name: 'total == 5050',
            code: 'assert total == 5050, f"expected 5050, got {total}"',
            hint: 'range(1, 101) gives you 1..100. Add each one to total.',
          },
        ]}
        hint={
          <>
            <code>for i in range(1, 101):</code> then <code>total += i</code>.
          </>
        }
        solution={`total = 0

for i in range(1, 101):
    total += i

print(total)
`}
      />

      <h2>Iterating over things other than numbers</h2>
      <p>
        <code>for</code> can walk through strings (one character at a time) or lists
        (one element at a time):
      </p>
      <pre><code>{`for char in "hello":
    print(char)

for name in ["Ana", "Ben", "Cara"]:
    print(name)`}</code></pre>

      <h2><code>break</code> and <code>continue</code></h2>
      <p>
        <code>break</code> exits the loop entirely. <code>continue</code> skips to the
        next iteration.
      </p>

      <CodeExercise
        exerciseId="python/04-loops/first-multiple"
        prompt={
          <>
            Find the first integer greater than <code>1000</code> that is divisible by
            both 7 and 11. Store it in <code>answer</code>.
          </>
        }
        starterCode={`answer = None

# search starting from 1001
for n in range(1001, 100000):
    pass  # your code here

print(answer)
`}
        tests={[
          {
            name: 'answer is 1001..100000 and divisible by 7 and 11',
            code: 'assert answer is not None and answer > 1000 and answer % 7 == 0 and answer % 11 == 0',
          },
          { name: 'answer == 1001 + (77 - 1001 % 77) % 77', code: 'expected = 1001 + (77 - 1001 % 77) % 77\nassert answer == expected, f"expected {expected}, got {answer}"' },
        ]}
        hint={
          <>
            Inside the loop, check both conditions with <code>and</code>. When the
            check passes, set <code>answer = n</code> and <code>break</code>.
          </>
        }
        solution={`answer = None

for n in range(1001, 100000):
    if n % 7 == 0 and n % 11 == 0:
        answer = n
        break

print(answer)
`}
      />

      <h2>Recap</h2>
      <ul>
        <li><code>for x in iterable</code> walks one item at a time.</li>
        <li><code>while condition</code> keeps going until the condition is false.</li>
        <li><code>break</code> exits; <code>continue</code> skips to the next round.</li>
      </ul>
    </LessonShell>
  );
}
