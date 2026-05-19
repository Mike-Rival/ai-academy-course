import LessonShell from '@/components/LessonShell';
import CodeExercise from '@/components/CodeExercise';
import { getLessonNav } from '@/lib/curriculum';

export const metadata = { title: 'Lists and Dictionaries — AI Academy' };

export default function Page() {
  const nav = getLessonNav('python', '06-lists-and-dicts');
  return (
    <LessonShell
      lessonId="python/06-lists-and-dicts"
      trackLabel="Python Basics"
      trackHref="/tracks/python"
      title="Lists and Dictionaries"
      estMinutes={15}
      nav={nav}
    >
      <h2>Lists: ordered sequences</h2>
      <p>
        A list is an ordered collection of values. Square brackets, commas between
        items, anything inside.
      </p>
      <pre><code>{`fruits = ["apple", "banana", "cherry"]
fruits[0]              # "apple"
fruits[-1]             # "cherry" (negative indices count from the end)
len(fruits)            # 3
fruits.append("date")  # adds to the end
fruits[1:3]            # ["banana", "cherry"] — slice from 1 up to (not incl) 3`}</code></pre>

      <CodeExercise
        exerciseId="python/06-lists-and-dicts/positives"
        prompt={
          <>
            Write a function <code>positives(nums)</code> that returns a new list
            containing only the positive numbers from <code>nums</code>.
          </>
        }
        starterCode={`def positives(nums):
    result = []
    # your loop here
    return result

print(positives([3, -1, 0, 7, -5, 2]))
`}
        tests={[
          { name: 'keeps positives', code: 'assert positives([3, -1, 0, 7, -5, 2]) == [3, 7, 2]' },
          { name: '0 is not positive', code: 'assert positives([0, 0, 1]) == [1]' },
          { name: 'all negative → empty list', code: 'assert positives([-1, -2]) == []' },
        ]}
        hint={
          <>
            Loop with <code>for x in nums:</code>, check <code>x &gt; 0</code>, and{' '}
            <code>append</code> to <code>result</code>.
          </>
        }
        solution={`def positives(nums):
    result = []
    for x in nums:
        if x > 0:
            result.append(x)
    return result

print(positives([3, -1, 0, 7, -5, 2]))
`}
      />

      <h2>Dictionaries: lookup by key</h2>
      <p>
        Dictionaries map <em>keys</em> to <em>values</em>. Use them when you need to
        look something up by name rather than by position.
      </p>
      <pre><code>{`prices = {"apple": 1.50, "banana": 0.30}
prices["apple"]               # 1.5
prices["cherry"] = 2.00       # add a new key
"banana" in prices            # True
prices.get("grape", 0)        # 0 — default if key missing
for k, v in prices.items():
    print(k, v)`}</code></pre>

      <CodeExercise
        exerciseId="python/06-lists-and-dicts/word-count"
        prompt={
          <>
            Write <code>word_count(text)</code> that returns a dict mapping each word
            to the number of times it appears. Split on whitespace; words are case
            sensitive.
          </>
        }
        starterCode={`def word_count(text):
    counts = {}
    # your code
    return counts

print(word_count("a b a c b a"))
`}
        tests={[
          { name: 'counts repeated words', code: 'assert word_count("a b a c b a") == {"a": 3, "b": 2, "c": 1}' },
          { name: 'empty string → empty dict', code: 'assert word_count("") == {}' },
          { name: 'single word', code: 'assert word_count("hello") == {"hello": 1}' },
        ]}
        hint={
          <>
            <code>text.split()</code> gives the words. For each word, increment
            <code>counts[word]</code>, defaulting to 0 when the key is missing — use
            <code>counts.get(word, 0)</code>.
          </>
        }
        solution={`def word_count(text):
    counts = {}
    for word in text.split():
        counts[word] = counts.get(word, 0) + 1
    return counts

print(word_count("a b a c b a"))
`}
      />

      <h2>Recap</h2>
      <ul>
        <li>Lists: ordered, indexed by position. Use <code>append</code>, slicing, <code>len</code>.</li>
        <li>Dicts: unordered (mostly), indexed by key. Use <code>[key]</code>, <code>.get</code>, <code>.items()</code>.</li>
        <li>These two cover ~90% of real-world Python data wrangling.</li>
      </ul>
    </LessonShell>
  );
}
