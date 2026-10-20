import LessonShell from '@/components/LessonShell';
import CodeExercise from '@/components/CodeExercise';
import { Reflection } from '@/components/NonCodeExercise';
import { getLessonNav } from '@/lib/curriculum';

export const metadata = {
  title: 'Capstone: Ship a Small Feature With a Verification Log — AI Academy',
};

export default function Page() {
  const nav = getLessonNav('ai-coding', '10-capstone');
  return (
    <LessonShell
      lessonId="ai-coding/10-capstone"
      trackLabel="Coding with AI Assistants"
      trackHref="/tracks/ai-coding"
      title="Capstone: Ship a Small Feature With a Verification Log"
      estMinutes={25}
      nav={nav}
    >
      <p>
        This capstone walks one small feature through the whole method: write
        the spec, derive the tests, implement with an assistant, review the
        result, and record what was verified and how. You will do the spec,
        tests, and review here in the browser. For the implementation step,
        use whatever assistant you normally use, or do it by hand if you
        prefer; the point is the process around it, not the tool.
      </p>
      <p>
        The feature is deliberately small. If the method feels heavyweight
        for a thirty-line function, that is partly true and partly the point:
        on a small feature you can see every step; on a large one, the steps
        you skip are the ones that hurt.
      </p>

      <h2>The feature</h2>
      <p>
        A checkout needs a discount function. The product owner&rsquo;s
        description, verbatim:
      </p>
      <blockquote>
        &ldquo;Apply the discount code to the subtotal. We have two codes right
        now: SAVE10 takes ten percent off, FLAT500 takes five dollars off.
        Unknown codes should just not apply. Don&rsquo;t let the total go
        negative.&rdquo;
      </blockquote>
      <p>
        That is a typical starting point: clear intent, several unresolved
        details. Your first job is to find them.
      </p>

      <h2>Step 1: Write the spec</h2>

      <Reflection
        exerciseId="ai-coding/10/step1-spec"
        prompt={
          <>
            Using the six parts from Lesson 2 (inputs, outputs, constraints,
            examples, done-criteria, non-goals), write the spec for{' '}
            <code>apply_discount(subtotal_cents, code)</code>. In particular,
            decide: what unit is money in? What type is returned? What
            happens with <code>None</code> as the code, with surrounding
            whitespace, with different casing? How does ten percent of an odd
            number of cents round? What happens with a negative subtotal? List
            at least three things the product owner&rsquo;s description left
            undecided and your decision for each.
          </>
        }
        modelAnswer={
          <>
            <p>One defensible spec:</p>
            <pre><code>{`apply_discount(subtotal_cents, code) -> int

Inputs:  subtotal_cents is a non-negative int (cents, never float).
         code is a str or None.
Output:  int cents, never a float, never negative.

Rules:
1. subtotal_cents negative or not an int -> raise ValueError.
2. code None -> return subtotal_cents unchanged.
3. Normalize code: strip whitespace, uppercase.
4. "SAVE10"  -> subtract subtotal_cents // 10 (discount rounds down,
               so the customer pays slightly more, never less).
5. "FLAT500" -> subtract 500, floored at 0.
6. Any other code -> return subtotal_cents unchanged. No error.

Examples:
  (1000, None)       -> 1000
  (1000, "SAVE10")   -> 900
  (1005, "SAVE10")   -> 905      # 100.5 cents off rounds to 100
  (1000, " save10 ") -> 900
  (1200, "FLAT500")  -> 700
  (300,  "FLAT500")  -> 0
  (1000, "BOGUS")    -> 1000
  (-1,   None)       -> ValueError

Non-goals: no stacking of codes; no expiry dates; no per-customer
           eligibility. Do not change the function signature.`}</code></pre>
            <p>
              The undecided details were: the unit (cents, to avoid float
              money, catalog entry 7); rounding direction on SAVE10 (down,
              and stated); case and whitespace handling (normalize); whether
              unknown codes raise (no, per the description, but it had to be
              said); and the negative-subtotal case (raise, because it is a
              caller bug, not a discount question). Your decisions may differ.
              What matters is that each one is written down.
            </p>
          </>
        }
      />

      <h2>Step 2: Derive the tests</h2>
      <p>
        Before any implementation, turn the spec into assertions. Lesson 4:
        expected values come from the spec, not from running code. Lesson 4
        again: include the adversarial families. For this function that
        means at least: no code, unknown code, each known code on a normal
        amount, the rounding case, the floor-at-zero case, the normalization
        case, the invalid-input case, and a check that the return type is
        int.
      </p>

      <Reflection
        exerciseId="ai-coding/10/step2-tests"
        prompt={
          <>
            Write the test list as one-line assertions, one per spec rule or
            example. Then answer: which single test would you expect a
            careless implementation to fail first, and why?
          </>
        }
        modelAnswer={
          <>
            <p>
              The nine checks in the exercise below are one answer; they map
              one-to-one onto the spec&rsquo;s rules and examples. The two
              most likely to catch a careless implementation are the rounding
              case (<code>1005</code> with SAVE10) and the return-type check.
              A natural first draft computes{' '}
              <code>subtotal * 0.9</code>, which returns a float, and a float
              of 904.5 is wrong in both type and value. The other common miss
              is the floor at zero, which the product owner mentioned and
              which the implementation forgets anyway.
            </p>
          </>
        }
      />

      <h2>Step 3: Implement with an assistant</h2>
      <p>
        Now hand the spec to your assistant. Give it the spec text, the test
        list, and the non-goals. Ask for the implementation only. Then paste
        what it produced into the exercise below, or write it yourself, and
        run the checks. The checks are the tests from Step 2.
      </p>
      <p>
        If the assistant&rsquo;s version fails a check, do not ask it to
        &ldquo;fix the test.&rdquo; Read which rule the failing check
        corresponds to, and either the implementation or the spec is wrong.
        Decide which, then fix that one.
      </p>

      <CodeExercise
        exerciseId="ai-coding/10/apply-discount"
        prompt={
          <>
            Implement <code>apply_discount(subtotal_cents, code)</code> to the
            spec from Step 1. Each check names the rule it enforces.
          </>
        }
        starterCode={`def apply_discount(subtotal_cents, code):
    pass  # replace with your (or your assistant's) implementation

print(apply_discount(1005, "SAVE10"))
print(apply_discount(300, "FLAT500"))
`}
        tests={[
          { name: 'Rule 2: no code -> unchanged', code: 'assert apply_discount(1000, None) == 1000' },
          { name: 'Rule 6: unknown code -> unchanged, no error', code: 'assert apply_discount(1000, "BOGUS") == 1000' },
          { name: 'Rule 4: SAVE10 on 1000 -> 900', code: 'assert apply_discount(1000, "SAVE10") == 900' },
          { name: 'Rule 4: SAVE10 rounds the discount down: 1005 -> 905', code: 'assert apply_discount(1005, "SAVE10") == 905' },
          { name: 'Rule 3: codes are case-insensitive and trimmed', code: 'assert apply_discount(1000, "  save10 ") == 900' },
          { name: 'Rule 5: FLAT500 on 1200 -> 700', code: 'assert apply_discount(1200, "FLAT500") == 700' },
          { name: 'Rule 5: FLAT500 never goes below zero: 300 -> 0', code: 'assert apply_discount(300, "FLAT500") == 0' },
          { name: 'Rule 1: negative subtotal raises ValueError', code: 'try:\n    apply_discount(-1, None)\n    assert False, "no error raised"\nexcept ValueError:\n    pass' },
          { name: 'Output: result is an int (cents), never a float', code: 'assert type(apply_discount(1005, "SAVE10")) is int' },
        ]}
        hint={
          <>
            Integer arithmetic only: <code>subtotal_cents // 10</code> for the
            ten percent, <code>max(..., 0)</code> for the floor. Normalize the
            code with <code>.strip().upper()</code> after the{' '}
            <code>None</code> check.
          </>
        }
        solution={`def apply_discount(subtotal_cents, code):
    if not isinstance(subtotal_cents, int) or subtotal_cents < 0:
        raise ValueError("subtotal_cents must be a non-negative int")
    if code is None:
        return subtotal_cents
    c = code.strip().upper()
    if c == "SAVE10":
        return subtotal_cents - subtotal_cents // 10
    if c == "FLAT500":
        return max(subtotal_cents - 500, 0)
    return subtotal_cents

print(apply_discount(1005, "SAVE10"))
print(apply_discount(300, "FLAT500"))
`}
      />

      <h2>Step 4: Review the result</h2>

      <Reflection
        exerciseId="ai-coding/10/step4-review"
        prompt={
          <>
            Read the implementation (yours or the assistant&rsquo;s) against
            the Lesson 5 catalog. For each of the seven entries, write one
            line: either &ldquo;not applicable here&rdquo; or what you checked
            and what you found. Then: did the implementation do anything the
            spec did not ask for?
          </>
        }
        modelAnswer={
          <>
            <ul>
              <li>Hallucinated APIs: none; standard library only, and only <code>str</code> methods and <code>max</code>.</li>
              <li>Wrong formula: checked ten percent is <code>// 10</code> of the subtotal, not of something else; checked by hand on 1005.</li>
              <li>Boundary: 300 with FLAT500 hits the floor exactly; 500 with FLAT500 should give 0, worth a manual run.</li>
              <li>Swallowed exceptions: none; invalid input raises as specified.</li>
              <li>Stale idioms: not applicable at this size.</li>
              <li>Mutable defaults: no default arguments.</li>
              <li>Unit/type: integer cents throughout; the return-type test enforces it.</li>
            </ul>
            <p>
              Common unrequested additions from assistants on this task: a
              dictionary of codes with a comment inviting more, a percentage
              parameter, or stacking logic. Each one is a non-goal from the
              spec, and each one is more code to review and maintain.
              Remove them.
            </p>
          </>
        }
      />

      <h2>Step 5: The verification log</h2>
      <p>
        The last step is the one that makes the others stick. Write down what
        was verified and how. Not for ceremony: so that the next person (or
        you, in a month, when a customer reports a discount of 904.5) can see
        what was checked and what was not. A log that fits in a pull request
        description is plenty.
      </p>

      <Reflection
        exerciseId="ai-coding/10/step5-log"
        prompt={
          <>
            Write the verification log for this change. Include: what the
            spec was, which tests encode it, which tests were run and the
            result, what you checked by reading, what you ran by hand beyond
            the tests, what you consciously did <em>not</em> verify, and
            whether an assistant was used for which steps.
          </>
        }
        modelAnswer={
          <>
            <pre><code>{`Change: add apply_discount(subtotal_cents, code)

Spec: see docstring / PR description. Decisions made beyond the
      product owner's note: integer cents; SAVE10 rounds the discount
      down; codes normalized (strip, upper); unknown codes are a no-op;
      negative subtotal raises.

Tests: 9 assertions, one per rule/example, written from the spec
       before implementation. All pass locally.

Read:  implementation reviewed against the failure catalog; no broad
       excepts, no defaults, integer arithmetic only. Removed an
       unrequested CODES dict the assistant added.

Ran by hand: apply_discount(500, "FLAT500") -> 0 (exact floor);
             apply_discount(9, "SAVE10") -> 9 (discount rounds to 0).

Not verified: behavior under concurrent code changes; integration
              with the checkout total (separate change); any locale
              or currency other than cents.

Assistant used for: first-draft implementation and a list of edge
                    cases. Not used for: spec decisions, test expected
                    values, review.`}</code></pre>
            <p>
              The &ldquo;not verified&rdquo; section is the most valuable
              part and the one most often omitted. It is where honest
              uncertainty lives, and it is what the next person needs when
              something goes wrong.
            </p>
          </>
        }
      />

      <h2>You&rsquo;ve completed the track</h2>
      <p>
        The track was built around one shift: from treating the assistant as
        an oracle whose output you accept or reject, to treating it as a fast,
        well-read collaborator whose output you <em>verify</em>, with a method
        for doing that cheaply. Precise specs so the model cannot misread.
        Small units so the diff is readable. Tests written from the spec so
        the check is external. The failure catalog so you know what to look
        for. Hypotheses before fixes so debugging converges. Standing context
        in a file so sessions start informed. Plan before implement so the
        early check is cheap. And a healthy suspicion of anything the agent
        reads, installs, or runs.
      </p>
      <p>
        If you took one thing from the track:{' '}
        <strong>clean, confident code is the weakest evidence that code is
        right. Evidence comes from tests you wrote, inputs you chose, and
        lines you read.</strong>
      </p>
      <p>
        From here, the Working with LLMs track covers the same ideas for
        non-code work and goes deeper on why models fail the way they do. The
        AI &amp; Deep Learning track explains what is happening inside the
        model when it generates the code you just reviewed. Or take the
        verification log template back to your next pull request. That works
        too.
      </p>
    </LessonShell>
  );
}
