import LessonShell from '@/components/LessonShell';
import CodeExercise from '@/components/CodeExercise';
import { getLessonNav } from '@/lib/curriculum';

export const metadata = { title: 'Files and Strings — Credence AI Academy' };

export default function Page() {
  const nav = getLessonNav('python', '07-files-and-strings');
  return (
    <LessonShell
      lessonId="python/07-files-and-strings"
      trackLabel="Python Basics"
      trackHref="/tracks/python"
      title="Files and Strings"
      estMinutes={12}
      nav={nav}
    >
      <p>
        In the real world most data arrives as text. This lesson covers the string
        methods you&rsquo;ll use constantly.
      </p>

      <h2>The methods you&rsquo;ll use every day</h2>
      <ul>
        <li><code>{`s.split(sep)`}</code> — break into a list. Default splits on whitespace.</li>
        <li><code>{`s.strip()`}</code> — remove leading/trailing whitespace.</li>
        <li><code>{`s.lower()`}</code> / <code>{`s.upper()`}</code> — change case.</li>
        <li><code>{`s.replace(a, b)`}</code> — substitute substrings.</li>
        <li><code>{`sep.join(list_of_strs)`}</code> — the opposite of split.</li>
        <li><code>{`"x" in s`}</code> — substring check.</li>
        <li><code>{`s.startswith(prefix)`}</code>, <code>{`s.endswith(suffix)`}</code></li>
      </ul>

      <h2>f-strings: the modern way to format</h2>
      <pre><code>{`name = "Maria"
age = 30
print(f"{name} is {age} years old.")
print(f"Half age: {age / 2:.1f}")    # 15.0`}</code></pre>

      <CodeExercise
        exerciseId="python/07-files-and-strings/parse-name"
        prompt={
          <>
            Write <code>parse_full_name(full)</code> that splits a string like
            <code> &quot; Maria Garcia &quot;</code> on whitespace, strips extra
            spaces, and returns a tuple <code>(first, last)</code>. If the input has
            fewer than two parts, return <code>(&quot;&quot;, &quot;&quot;)</code>.
          </>
        }
        starterCode={`def parse_full_name(full):
    pass  # replace

print(parse_full_name("  Maria Garcia  "))
print(parse_full_name(""))
`}
        tests={[
          { name: 'basic case', code: 'assert parse_full_name("  Maria Garcia  ") == ("Maria", "Garcia")' },
          { name: 'extra spaces between', code: 'assert parse_full_name("Ana   Lee") == ("Ana", "Lee")' },
          { name: 'empty string', code: 'assert parse_full_name("") == ("", "")' },
          { name: 'single name', code: 'assert parse_full_name("Solo") == ("", "")' },
        ]}
        hint={
          <>
            Use <code>.split()</code> (no argument — splits on any whitespace and
            collapses runs). Check the length before returning.
          </>
        }
        solution={`def parse_full_name(full):
    parts = full.split()
    if len(parts) < 2:
        return ("", "")
    return (parts[0], parts[-1])

print(parse_full_name("  Maria Garcia  "))
print(parse_full_name(""))
`}
      />

      <h2>Reading CSV-like data</h2>
      <p>
        In the browser there&rsquo;s no easy &ldquo;open this file from your disk.&rdquo;
        Instead, paste data into a multi-line string. That covers nearly every
        teaching use case.
      </p>

      <CodeExercise
        exerciseId="python/07-files-and-strings/csv-rows"
        prompt={
          <>
            <code>data</code> is a CSV-like string with a header row. Write code that
            sets <code>names</code> to a list of names from the second column, in
            order, skipping the header.
          </>
        }
        starterCode={`data = """name,score
Ana,88
Ben,72
Cara,95"""

names = []

# parse data into names
for line in data.strip().split("\\n")[1:]:
    pass  # your code

print(names)
`}
        tests={[
          { name: 'names list matches', code: 'assert names == ["Ana", "Ben", "Cara"]' },
        ]}
        hint={
          <>
            For each line, split on <code>&quot;,&quot;</code> and append the first
            field to <code>names</code>.
          </>
        }
        solution={`data = """name,score
Ana,88
Ben,72
Cara,95"""

names = []

for line in data.strip().split("\\n")[1:]:
    fields = line.split(",")
    names.append(fields[0])

print(names)
`}
      />

      <h2>Recap</h2>
      <ul>
        <li>String methods chain naturally — <code>{`s.strip().lower().split(",")`}</code>.</li>
        <li>f-strings are the cleanest way to format output.</li>
        <li>Real data is messy. <code>strip</code> and explicit error handling matter.</li>
      </ul>
    </LessonShell>
  );
}
