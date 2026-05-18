import LessonShell from '@/components/LessonShell';
import CodeExercise from '@/components/CodeExercise';
import { getLessonNav } from '@/lib/curriculum';

export const metadata = { title: 'Variables and Printing — Credence AI Academy' };

export default function Page() {
  const nav = getLessonNav('python', '01-variables');
  return (
    <LessonShell
      lessonId="python/01-variables"
      trackLabel="Python Basics"
      trackHref="/tracks/python"
      title="Variables and Printing"
      estMinutes={8}
      nav={nav}
    >
      <p>
        A <strong>variable</strong> is a name that holds a value. Python doesn&rsquo;t
        require you to declare what kind of value — you just assign and go.
      </p>

      <pre><code>{`age = 30
name = "Maria"
pi = 3.14159`}</code></pre>

      <p>
        The <code>=</code> sign here is not a math equation. Read it left-to-right:
        &ldquo;the name on the left now refers to the value on the right.&rdquo;
      </p>

      <p>
        To see a value, use <code>print()</code>. You can pass it multiple things and it
        will join them with spaces:
      </p>

      <pre><code>{`print("hello")
print(age, "years old")`}</code></pre>

      <h2>Try it</h2>
      <p>
        Below is a real Python interpreter running in your browser. Edit the code, hit{' '}
        <em>Run &amp; Check</em>, and the checks will tell you whether your output
        matches what we&rsquo;re looking for. If you get stuck, use the <em>Hint</em>{' '}
        button.
      </p>

      <CodeExercise
        exerciseId="python/01-variables/print-name"
        prompt={
          <>
            Create two variables, <code>first_name</code> and <code>last_name</code>,
            holding your first and last name as strings. Then print them on one line
            with a space between, like <code>Maria Garcia</code>.
          </>
        }
        starterCode={`# Your code here
first_name = ""
last_name = ""

print(first_name, last_name)
`}
        tests={[
          {
            name: 'first_name is a non-empty string',
            code: 'assert isinstance(first_name, str) and len(first_name) > 0, "first_name must be a non-empty string"',
            hint: 'Set first_name = "something" — replace the empty quotes with text.',
          },
          {
            name: 'last_name is a non-empty string',
            code: 'assert isinstance(last_name, str) and len(last_name) > 0, "last_name must be a non-empty string"',
            hint: 'Same for last_name — give it a value.',
          },
        ]}
        hint={
          <>
            Replace the empty strings <code>&quot;&quot;</code> with text in quotes,
            like <code>first_name = &quot;Sam&quot;</code>.
          </>
        }
        solution={`first_name = "Maria"
last_name = "Garcia"

print(first_name, last_name)
`}
      />

      <h2>Numbers, too</h2>
      <p>
        Variables can hold numbers as well as text. Python has two main number types:
        whole numbers (<code>int</code>) and decimals (<code>float</code>). You can do
        arithmetic with <code>+</code>, <code>-</code>, <code>*</code>, <code>/</code>.
      </p>

      <CodeExercise
        exerciseId="python/01-variables/area"
        prompt={
          <>
            A rectangle has a width of <code>7</code> and a height of <code>4</code>.
            Compute the area and store it in a variable called <code>area</code>. Then
            print it.
          </>
        }
        starterCode={`width = 7
height = 4

# compute area below
area = 0

print(area)
`}
        tests={[
          {
            name: 'area equals 28',
            code: 'assert area == 28, f"expected 28, got {area}"',
            hint: 'Area of a rectangle is width times height. The operator in Python is *.',
          },
        ]}
        hint={
          <>
            Multiply with <code>*</code>: <code>area = width * height</code>.
          </>
        }
        solution={`width = 7
height = 4

area = width * height

print(area)
`}
      />

      <h2>What you just learned</h2>
      <ul>
        <li>A variable is a name pointing to a value.</li>
        <li>
          Assignment uses <code>=</code> — left side is the name, right side is the value.
        </li>
        <li><code>print()</code> shows you what a value is right now.</li>
        <li>Numbers and strings are different types; you can do math with numbers.</li>
      </ul>

      <p className="text-sm text-slate-500">
        Up next: types and conversions — what happens when a number meets a string, and
        how to deliberately move between them.
      </p>
    </LessonShell>
  );
}
