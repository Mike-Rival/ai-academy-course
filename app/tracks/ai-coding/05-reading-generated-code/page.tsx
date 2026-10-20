import LessonShell from '@/components/LessonShell';
import CodeExercise from '@/components/CodeExercise';
import { getLessonNav } from '@/lib/curriculum';

export const metadata = {
  title: 'Reading Generated Code: The Failure Catalog — AI Academy',
};

export default function Page() {
  const nav = getLessonNav('ai-coding', '05-reading-generated-code');
  return (
    <LessonShell
      lessonId="ai-coding/05-reading-generated-code"
      trackLabel="Coding with AI Assistants"
      trackHref="/tracks/ai-coding"
      title="Reading Generated Code: The Failure Catalog"
      estMinutes={18}
      nav={nav}
    >
      <p>
        Generated code fails in recognizable ways. Once you know the catalog,
        you read differently: instead of &ldquo;does this look right?&rdquo;
        you ask &ldquo;which of the usual seven is hiding here?&rdquo; This
        lesson lists them, then gives you three clean-looking functions to
        find the bug in.
      </p>
      <p>
        None of these are exotic. They are the mistakes a competent but hurried
        human makes, produced at scale, wrapped in confident formatting.
      </p>

      <h2>The catalog</h2>

      <h3>1. Hallucinated APIs and packages</h3>
      <p>
        A method that does not exist on that class. A keyword argument the
        library never had. An import of a package that sounds right and is
        not on the index (or worse, is on the index because someone registered
        the name the models keep inventing; Lesson 9 covers that). The tell:
        the call reads naturally and you cannot remember ever using it. Check
        the docs or the source, not your memory.
      </p>

      <h3>2. Plausible-but-wrong formulas</h3>
      <p>
        The shape of the calculation is right and one term is off. Standard
        deviation with <code>n</code> instead of <code>n-1</code> when the
        spec wanted the sample version. Percentage change computed against
        the new value instead of the old. Compound interest with the rate
        applied once. These pass every test that only checks &ldquo;returns
        a number.&rdquo;
      </p>

      <h3>3. Off-by-one and boundary errors</h3>
      <p>
        <code>range(1, n)</code> when <code>n</code> should be included.
        <code>&lt;</code> where <code>&lt;=</code> was meant. Slicing that
        drops the last element. Pagination that produces one page too many or
        too few at an exact multiple. These are the single most common bug
        class in generated code, and they are invisible on happy-path inputs.
      </p>

      <h3>4. Swallowed exceptions</h3>
      <p>
        <code>except Exception: pass</code>, or a <code>try</code> that
        catches too broadly and returns a default. The code &ldquo;never
        crashes,&rdquo; which the model may even present as a feature. It also
        never tells you when something went wrong. If you see a broad except,
        ask what specific error it is meant for, and whether silence is really
        the right response.
      </p>

      <h3>5. Stale idioms</h3>
      <p>
        Training data has a long tail of old code. You will see
        <code> os.path</code> where <code>pathlib</code> is the project
        convention, <code>%</code>-formatting, deprecated library calls that
        still work with a warning, Python 2 habits in Python 3 code. Not
        always wrong, but often a sign the model is pattern-matching to an
        older corpus than your codebase.
      </p>

      <h3>6. Mutable default arguments</h3>
      <p>
        <code>def add(item, items=[])</code>. The list is created once and
        shared across calls. The function works the first time and accumulates
        state after that. This one is famous and the models still produce it.
      </p>

      <h3>7. Unit, timezone, and type mistakes</h3>
      <p>
        Milliseconds passed to something expecting seconds. A naive datetime
        compared to an aware one. Cents stored as a float. A string
        <code> &ldquo;10&rdquo;</code> compared to the integer 10. The code
        type-checks (or Python does not care) and the result is wrong by a
        factor of 1000, or by five hours, or by a rounding error that
        compounds.
      </p>

      <h2>How to read with the catalog</h2>
      <p>
        For each function in a diff, run down the list. Most entries take a
        second to rule out. The ones that take longer are the ones to test.
        Concretely:
      </p>
      <ul>
        <li>Any call you do not recognize: look it up. (1)</li>
        <li>Any arithmetic: derive the expected value for one input by hand. (2)</li>
        <li>Any loop, slice, or comparison: try the boundary. (3)</li>
        <li>Any <code>except</code>: ask what it is for. (4)</li>
        <li>Any default argument that is a list, dict, or set: flag it. (6)</li>
        <li>Any time, money, or size value: check the unit at both ends. (7)</li>
      </ul>

      <h2>Three functions to find the bug in</h2>
      <p>
        Each of the following was generated from a reasonable prompt. Each
        looks clean, has a docstring, and runs without error on simple inputs.
        Each has one bug from the catalog. Find it, fix it, and make the hidden
        checks pass. Resist the urge to rewrite from scratch; the point is to
        <em> read</em>.
      </p>

      <CodeExercise
        exerciseId="ai-coding/05/median"
        prompt={
          <>
            <strong>Function 1.</strong> <code>median(values)</code> should
            return the median of a non-empty list of numbers. It is correct for
            odd-length lists. Find and fix the bug.
          </>
        }
        starterCode={`def median(values):
    """Return the median of a non-empty list of numbers."""
    s = sorted(values)
    n = len(s)
    mid = n // 2
    if n % 2 == 1:
        return s[mid]
    return (s[mid] + s[mid + 1]) / 2

print(median([3, 1, 2]))
print(median([1, 2, 3, 4]))
`}
        tests={[
          { name: 'Odd length: median([3,1,2]) == 2', code: 'assert median([3,1,2]) == 2' },
          { name: 'Single element: median([7]) == 7', code: 'assert median([7]) == 7' },
          { name: 'Even length: median([1,2,3,4]) == 2.5', code: 'assert median([1,2,3,4]) == 2.5' },
          { name: 'Even length, unsorted: median([10,2,8,4]) == 6', code: 'assert median([10,2,8,4]) == 6' },
          { name: 'Two elements: median([1,3]) == 2', code: 'assert median([1,3]) == 2' },
          { name: 'Does not mutate its input', code: 'v=[3,1,2]; median(v); assert v == [3,1,2]' },
        ]}
        hint={
          <>
            Catalog entry 3. For an even-length list of 4, <code>mid</code> is
            2. Which two indices are the middle pair: 1 and 2, or 2 and 3?
          </>
        }
        solution={`def median(values):
    """Return the median of a non-empty list of numbers."""
    s = sorted(values)
    n = len(s)
    mid = n // 2
    if n % 2 == 1:
        return s[mid]
    return (s[mid - 1] + s[mid]) / 2

print(median([3, 1, 2]))
print(median([1, 2, 3, 4]))
`}
      />

      <CodeExercise
        exerciseId="ai-coding/05/days-between"
        prompt={
          <>
            <strong>Function 2.</strong> <code>days_between(start, end)</code>{' '}
            should return every date from <code>start</code> to{' '}
            <code>end</code>, <em>inclusive of both</em>, as a list, and an
            empty list if <code>end</code> is before <code>start</code>. Find
            and fix the bug.
          </>
        }
        starterCode={`from datetime import date, timedelta

def days_between(start, end):
    """Return every date from start to end, inclusive of both, as a list.
    If end is before start, return an empty list."""
    if end < start:
        return []
    out = []
    current = start
    while current < end:
        out.append(current)
        current += timedelta(days=1)
    return out

print(days_between(date(2024, 1, 1), date(2024, 1, 3)))
`}
        tests={[
          { name: 'Three-day span returns 3 dates', code: 'assert len(days_between(date(2024,1,1), date(2024,1,3))) == 3' },
          { name: 'Last element is the end date', code: 'assert days_between(date(2024,1,1), date(2024,1,3))[-1] == date(2024,1,3)' },
          { name: 'Same day returns exactly one date', code: 'assert days_between(date(2024,3,5), date(2024,3,5)) == [date(2024,3,5)]' },
          { name: 'End before start -> []', code: 'assert days_between(date(2024,3,6), date(2024,3,5)) == []' },
          { name: 'Crosses a month boundary correctly', code: 'r = days_between(date(2024,1,30), date(2024,2,2)); assert r == [date(2024,1,30), date(2024,1,31), date(2024,2,1), date(2024,2,2)]' },
        ]}
        hint={
          <>
            Catalog entry 3 again, the other direction. The docstring says
            inclusive. The loop condition says otherwise.
          </>
        }
        solution={`from datetime import date, timedelta

def days_between(start, end):
    """Return every date from start to end, inclusive of both, as a list.
    If end is before start, return an empty list."""
    if end < start:
        return []
    out = []
    current = start
    while current <= end:
        out.append(current)
        current += timedelta(days=1)
    return out

print(days_between(date(2024, 1, 1), date(2024, 1, 3)))
`}
      />

      <CodeExercise
        exerciseId="ai-coding/05/page-count"
        prompt={
          <>
            <strong>Function 3.</strong> <code>page_count(total_items, page_size)</code>{' '}
            should return how many pages are needed to show{' '}
            <code>total_items</code> at <code>page_size</code> per page. Zero
            items means zero pages. It is correct for 23 items at 10 per page.
            Find and fix the bug.
          </>
        }
        starterCode={`def page_count(total_items, page_size):
    """Number of pages needed to show total_items at page_size per page.
    0 items -> 0 pages. page_size must be >= 1 (raise ValueError otherwise)."""
    if page_size < 1:
        raise ValueError("page_size must be >= 1")
    return total_items // page_size + 1

print(page_count(23, 10))
print(page_count(20, 10))
`}
        tests={[
          { name: '23 items, 10 per page -> 3', code: 'assert page_count(23, 10) == 3' },
          { name: 'Exact multiple: 20 items, 10 per page -> 2', code: 'assert page_count(20, 10) == 2' },
          { name: 'Fewer than one page: 3 items, 10 per page -> 1', code: 'assert page_count(3, 10) == 1' },
          { name: 'Zero items -> 0 pages', code: 'assert page_count(0, 10) == 0' },
          { name: 'page_size 0 raises ValueError', code: 'try:\n    page_count(5, 0)\n    assert False, "no error raised"\nexcept ValueError:\n    pass' },
          { name: '1 item, 1 per page -> 1', code: 'assert page_count(1, 1) == 1' },
        ]}
        hint={
          <>
            Catalog entry 2 and 3 together: the formula is the common
            &ldquo;add one&rdquo; approximation of ceiling division, and it is
            wrong at every exact multiple. Integer ceiling division is{' '}
            <code>(a + b - 1) // b</code>.
          </>
        }
        solution={`def page_count(total_items, page_size):
    """Number of pages needed to show total_items at page_size per page.
    0 items -> 0 pages. page_size must be >= 1 (raise ValueError otherwise)."""
    if page_size < 1:
        raise ValueError("page_size must be >= 1")
    return (total_items + page_size - 1) // page_size

print(page_count(23, 10))
print(page_count(20, 10))
`}
      />

      <h2>What the three have in common</h2>
      <p>
        Each function was right on the input the generating prompt probably
        had in mind and wrong at a boundary nobody mentioned. Each had a
        docstring that described the correct behavior, which is the most
        misleading part: the docstring was generated by the same process as
        the bug, and reading it tells you what the code is <em>supposed</em>
        to do, not what it does. Read the code against the docstring, not
        the docstring instead of the code.
      </p>

      <h2>Recap</h2>
      <ul>
        <li>Seven families: hallucinated APIs, wrong formulas, boundaries, swallowed exceptions, stale idioms, mutable defaults, unit/timezone/type.</li>
        <li>Read generated code by running down the catalog, not by asking whether it looks right. It always looks right.</li>
        <li>Docstrings and comments describe intent. They are generated by the same process as the bug. Verify the code, not the comment.</li>
        <li>Every bug above would have been caught by one boundary test from Lesson 4.</li>
      </ul>

      <p className="text-sm text-slate-500 mt-8">
        Up next: debugging with an assistant without being led in circles.
      </p>
    </LessonShell>
  );
}
