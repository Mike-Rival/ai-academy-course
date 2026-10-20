import LessonShell from '@/components/LessonShell';
import { Categorize, MultipleChoice } from '@/components/NonCodeExercise';
import { getLessonNav } from '@/lib/curriculum';

export const metadata = { title: 'Turning Text Into Tables and Back — AI Academy' };

export default function Page() {
  const nav = getLessonNav('llm-workflows', '06-structured-data');
  return (
    <LessonShell
      lessonId="llm-workflows/06-structured-data"
      trackLabel="Getting Work Done with LLMs"
      trackHref="/tracks/llm-workflows"
      title="Turning Text Into Tables and Back"
      estMinutes={14}
      nav={nav}
    >
      <p>
        A surprising share of office work is moving information between
        shapes: a pile of emails into a tracking sheet, a spreadsheet into a
        paragraph for the board, a list of requirements into a table someone
        can sort. LLMs are good at this. It is also the category with the
        best verification story in the whole track, because the thing that
        consumes the output can often check it for you.
      </p>

      <h2>Why this is a strong use case</h2>
      <p>
        The literacy track listed format conversion among the places LLMs
        reliably help, with a condition: the output structure must be
        verifiable at a glance. Structured data meets that condition better
        than prose does. A table has a fixed number of columns. A JSON
        record either parses or it does not. A total either matches the
        sum of the rows or it does not. These checks are mechanical, cheap,
        and do not depend on your judgment or your attention on a bad day.
      </p>
      <p>
        The failure modes are also specific, which makes them easier to
        design against:
      </p>
      <ul>
        <li><strong>Silent loss:</strong> an input item that does not appear in the output. Forty emails in, thirty-eight rows out.</li>
        <li><strong>Silent invention:</strong> a cell filled with a plausible value the source did not contain. A missing invoice date becomes &ldquo;2026-01-15.&rdquo;</li>
        <li><strong>Type drift:</strong> &ldquo;$1,200&rdquo; in one row and &ldquo;1200 USD&rdquo; in the next, so the column will not sum.</li>
        <li><strong>Wrong-column:</strong> the shipping cost lands under &ldquo;tax&rdquo; for one row out of fifty.</li>
      </ul>

      <h2>Text to table</h2>
      <p>
        The template for extraction into a table builds the checks in:
      </p>
      <pre><code>{`Extract one row per invoice from the emails below.
Columns: Vendor | Invoice number | Date (YYYY-MM-DD) | Amount (number
only, no currency symbol) | Source (the email subject line).

Rules:
- If a field is not present in the email, write NOT FOUND. Never guess.
- Output the row count at the end: "Rows: N".
- Output as a tab-separated table I can paste into a spreadsheet.`}</code></pre>
      <p>
        Each rule maps to a failure mode. &ldquo;NOT FOUND&rdquo; blocks
        invention. The fixed date and number formats block type drift. The
        source column lets you trace any row back to its email. The row count
        at the end is the first thing you check: if you pasted forty emails
        and the model says &ldquo;Rows: 38,&rdquo; you have found silent loss
        before you looked at a single cell.
      </p>

      <h2>Let the downstream system verify</h2>
      <p>
        This is the central idea of the lesson. Whatever you are producing
        the data <em>for</em> usually has its own rules, and violating them
        is visible. Use that.
      </p>
      <ul>
        <li><strong>Does it parse?</strong> Paste the table into the spreadsheet. If a column that should be numbers shows some cells left-aligned as text, those are the type-drift rows. If JSON is the target, run it through any validator; a parse error is a free, exact bug report.</li>
        <li><strong>Do the totals reconcile?</strong> Sum the amount column and compare it to a figure you already trust: last month&rsquo;s total, the number on the bank statement, the count in the original system. A mismatch tells you something was lost, invented, or mis-typed, and roughly how much.</li>
        <li><strong>Do the counts match?</strong> Items in, rows out. Count the inputs yourself (or let the spreadsheet count them) rather than trusting the model&rsquo;s own &ldquo;Rows: N.&rdquo; The model&rsquo;s count is a hint; your count is the check.</li>
        <li><strong>Do the lookups succeed?</strong> If the table has invoice numbers, look a few up in the system of record. A number that does not exist is an invention.</li>
      </ul>
      <p>
        None of these checks require reading the rows. They require running
        the thing the rows were going into and watching for complaints.
        That is why this workflow scales: verification cost stays flat as the
        table gets longer.
      </p>

      <h2>Formulas and transformations</h2>
      <p>
        Asking a model to write a spreadsheet formula is the same shape as
        asking it to write a small function, which the literacy track called
        a reliable use when there is a deterministic test. The test here is
        two or three rows where you already know the right answer. Put the
        formula in, compare the result to the known values, and include at
        least one edge case: an empty cell, a zero, a negative number. A
        formula that handles the normal rows and breaks on the blank one is
        the common failure, and it is only visible if you try the blank one.
      </p>

      <h2>Table to text</h2>
      <p>
        The reverse direction, turning a table into a paragraph for a report,
        has a different risk: the model will round, smooth, and editorialize.
        &ldquo;Revenue grew 4.2%&rdquo; becomes &ldquo;revenue grew
        strongly.&rdquo; The constraint that helps is &ldquo;every number in
        the prose must appear exactly as it does in the table; do not round
        or characterize.&rdquo; The check is to read the paragraph with the
        table beside it and confirm each number. Paragraphs are short. This
        is cheap.
      </p>

      <h2>Silent-loss checks, generalized</h2>
      <p>
        Whenever a workflow maps N things to M things, count both ends. It
        sounds obvious. It is skipped constantly, because the output looks
        complete: a table with thirty-eight tidy rows does not announce that
        it should have had forty. Make counting a line in the checklist, and
        make the count come from something other than the model.
      </p>

      <blockquote>
        <strong>Structure is a verification gift. Fix the formats, forbid
        guessing, count both ends, and let the spreadsheet or the parser tell
        you what went wrong.</strong>
      </blockquote>

      <Categorize
        exerciseId="llm-workflows/06/categorize"
        prompt={
          <>
            Each check below catches one failure mode best. Sort them.
          </>
        }
        items={[
          { id: 'c1', text: 'Count the input emails yourself and compare to the number of output rows', bucket: 'loss' },
          { id: 'c2', text: 'Require NOT FOUND for missing fields and scan for suspiciously complete rows', bucket: 'invention' },
          { id: 'c3', text: 'Paste into the spreadsheet and look for number cells that show as text', bucket: 'drift' },
          { id: 'c4', text: 'Sum the amount column and compare to the bank statement total', bucket: 'loss' },
          { id: 'c5', text: 'Look up three invoice numbers in the system of record', bucket: 'invention' },
          { id: 'c6', text: 'Specify "YYYY-MM-DD" and "number only" in the template', bucket: 'drift' },
        ]}
        buckets={[
          { id: 'loss', label: 'Silent loss', description: 'Items in the input that never made it out.' },
          { id: 'invention', label: 'Silent invention', description: 'Values in the output the source never contained.' },
          { id: 'drift', label: 'Type drift', description: 'Inconsistent formats that break sorting and sums.' },
        ]}
      />

      <p className="text-sm text-slate-500">
        A sum that comes up short (c4) usually means a row was lost, though
        a mis-typed amount can also cause it. A row count is the cleaner
        loss check; the total is the one that tells you whether the loss
        matters.
      </p>

      <MultipleChoice
        exerciseId="llm-workflows/06/quiz-1"
        prompt={
          <>
            The model extracted a 60-row expense table from a stack of
            receipts and reported &ldquo;Rows: 60&rdquo; at the end. You
            pasted 60 receipts. Is the silent-loss check done?
          </>
        }
        options={[
          {
            id: 'a',
            text: 'Yes. Input count matches output count.',
            rationale:
              'You have the model’s count of its own output, not yours. The model can miscount the same way it can mis-extract. The check needs a number that did not come from the model.',
          },
          {
            id: 'b',
            text: 'Not yet. Let the spreadsheet count the rows, and sum the amounts against a total you trust from elsewhere.',
            correct: true,
            rationale:
              'Right. The spreadsheet’s row count is independent of the model. The total against an external figure catches the case where a row exists but its amount was lost or mis-typed, which a count alone cannot see.',
          },
          {
            id: 'c',
            text: 'Not yet. Read all 60 rows against the receipts.',
            rationale:
              'This works and it is what the mechanical checks are there to avoid. Reading 60 rows is the verification cost that erases the time saved. Count and reconcile first; read rows only where those checks flag a problem.',
          },
          {
            id: 'd',
            text: 'Ask the model to double-check its own extraction.',
            rationale:
              'A second pass by the same model is not independent verification. It may fix some errors and introduce others, and you still have no external check.',
          },
        ]}
      />

      <MultipleChoice
        exerciseId="llm-workflows/06/quiz-2"
        prompt={
          <>
            You asked for a formula that flags any row where the invoice is
            more than 30 days past due. It works on the five rows you tried.
            What is the one more thing to try before trusting it across the
            sheet?
          </>
        }
        options={[
          {
            id: 'a',
            text: 'Five more normal rows.',
            rationale:
              'More of the same kind of input gives you more of the same kind of evidence. The failures live at the edges.',
          },
          {
            id: 'b',
            text: 'A row with an empty due-date cell, and a row due exactly 30 days ago.',
            correct: true,
            rationale:
              'Right. The blank cell is where formulas most often error or silently return the wrong flag, and the boundary case tells you whether "more than 30" was implemented as > or >=. These two rows take a minute and catch the common failures.',
          },
          {
            id: 'c',
            text: 'Ask the model to explain the formula.',
            rationale:
              'The explanation will be fluent whether or not the formula is right. Running it on an edge case is the test; the explanation is not.',
          },
          {
            id: 'd',
            text: 'Nothing. Five passing rows is enough.',
            rationale:
              'Five normal rows tell you it handles normal rows. The sheet has blanks and boundaries in it, and so should your test.',
          },
        ]}
      />

      <p className="text-sm text-slate-500 mt-8">
        Up next: custom instructions, projects, and memory. What persistent
        context helps with, and how it goes stale.
      </p>
    </LessonShell>
  );
}
