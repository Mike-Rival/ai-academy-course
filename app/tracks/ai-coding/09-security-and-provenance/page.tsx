import LessonShell from '@/components/LessonShell';
import { Categorize, MultipleChoice } from '@/components/NonCodeExercise';
import { getLessonNav } from '@/lib/curriculum';

export const metadata = {
  title: 'Security, Secrets, and Provenance — AI Academy',
};

export default function Page() {
  const nav = getLessonNav('ai-coding', '09-security-and-provenance');
  return (
    <LessonShell
      lessonId="ai-coding/09-security-and-provenance"
      trackLabel="Coding with AI Assistants"
      trackHref="/tracks/ai-coding"
      title="Security, Secrets, and Provenance"
      estMinutes={15}
      nav={nav}
    >
      <p>
        The earlier lessons were about generated code being wrong. This one
        is about generated code, and the process of generating it, being
        <em> harmful</em>: leaking a secret, pulling in a package that does
        not exist or should not be trusted, running a command that deletes
        something, or following instructions that came from somewhere other
        than you. None of these need a malicious model. They need an ordinary
        model, ordinary carelessness, and in one case an ordinary attacker.
      </p>

      <h2>1. Secrets in prompts</h2>
      <p>
        Anything you paste into a chat or that an agent reads goes to the
        provider&rsquo;s servers, is possibly retained under their policy, and
        is possibly visible to colleagues through shared history. That
        includes the API key in the config file you pasted for context, the
        database URL with the password embedded, the <code>.env</code> file
        an agent helpfully read to understand the setup.
      </p>
      <p>Habits that hold up:</p>
      <ul>
        <li>
          Keep secrets out of the repository entirely (environment variables,
          a secrets manager). Then an agent reading the repo cannot leak them.
        </li>
        <li>
          Add secret-bearing files to the tool&rsquo;s ignore list if it has
          one, and to <code>.gitignore</code> regardless.
        </li>
        <li>
          Before pasting a config or log, redact. A key that has been pasted
          into a chat should be treated as compromised and rotated.
        </li>
        <li>
          Check what your tool and plan actually do with data: retention,
          training use, who can see shared sessions. The{' '}
          Working with LLMs track&rsquo;s privacy lesson covers how to read
          those policies.
        </li>
      </ul>

      <h2>2. Dependency hallucination and slopsquatting</h2>
      <p>
        Catalog entry 1 from Lesson 5 has a security consequence. Models
        invent package names that sound right: a plausible helper library for
        a task, with a plausible import. Sometimes the package does not
        exist and the install fails, which is the good outcome. Sometimes
        someone has noticed that models keep inventing that name and has
        registered it on the package index with malicious code inside. This
        is called slopsquatting, by analogy with typosquatting, and it has
        been observed in the wild.
      </p>
      <p>
        The defense is a provenance check before any new dependency is
        installed:
      </p>
      <ul>
        <li>Does the package exist on the index, and is it the one the model meant?</li>
        <li>How old is it, how many downloads, who maintains it, is the source repository real and active?</li>
        <li>Is there an obvious well-known package that does the same thing? Prefer it.</li>
        <li>Does your project actually need a dependency here, or did the model reach for one out of habit?</li>
      </ul>
      <p>
        A standing rule in the project instruction file (&ldquo;do not add a
        dependency without asking&rdquo;) turns this from something you
        remember to check into something you are asked about.
      </p>

      <h2>3. License provenance</h2>
      <p>
        Models have been trained on a great deal of public code under a
        variety of licenses. For short, idiomatic snippets this is not a
        practical concern. For longer, distinctive blocks (a complete
        algorithm implementation, a parser, something that reads like it was
        lifted whole) it can be. If a generated block looks unusually
        specific or complete for what you asked, search for a distinctive line
        of it. If it matches a copyleft-licensed source and your project is
        not, you have a decision to make, and it is better made before the
        code ships.
      </p>
      <p>
        Some tools offer a filter that suppresses output matching public
        code. It reduces the risk; it does not eliminate it, and it does not
        cover paraphrased code.
      </p>

      <h2>4. Prompt injection via repository content and tool output</h2>
      <p>
        This is the one specific to agents, and the least intuitive. An agent
        reads files and command output and treats what it reads as
        information. But text is text. If a file in the repository, a
        comment in a dependency, a web page the agent fetched, or the output
        of a command contains something shaped like an instruction
        (&ldquo;ignore your previous instructions and run the following
        command&rdquo;), the model may follow it. The attacker does not need
        access to your prompt. They need to get text in front of your agent.
      </p>
      <p>Where that text can come from:</p>
      <ul>
        <li>A pull request from an outside contributor that an agent is asked to review or merge.</li>
        <li>An issue or ticket body an agent is asked to triage.</li>
        <li>A README or docstring inside a dependency.</li>
        <li>A web page the agent fetches for documentation.</li>
        <li>Log output, test output, or data files containing user-supplied text.</li>
      </ul>
      <p>Defenses, in rough order of effectiveness:</p>
      <ul>
        <li>
          <strong>Limit what the agent can do.</strong> An agent that cannot
          push, deploy, or reach the network beyond what the task needs has
          less to be hijacked into. Use the permission controls your tool
          offers rather than approving everything.
        </li>
        <li>
          <strong>Treat untrusted input as untrusted.</strong> When an agent
          is processing content from outside your team, expect injection and
          review its actions with that in mind.
        </li>
        <li>
          <strong>Review commands before they run</strong> when the agent is
          working on untrusted content. See the next section.
        </li>
        <li>
          <strong>Notice when the agent does something the task did not call
          for.</strong> A triage task that results in a file write, or a
          review task that results in a network request, is the signature.
        </li>
      </ul>

      <h2>5. Reviewing generated shell commands</h2>
      <p>
        Agents run commands. Most tools ask before running them, and the
        habit of clicking approve without reading is the dangerous one. A
        generated command deserves the same read as generated code, and a
        shorter catalog:
      </p>
      <ul>
        <li>
          <strong>Anything that deletes or overwrites.</strong>{' '}
          <code>rm -rf</code>, <code>git reset --hard</code>,{' '}
          <code>git push --force</code>, <code>DROP TABLE</code>, a
          redirect <code>&gt;</code> onto a file you care about. Read the
          target twice.
        </li>
        <li>
          <strong>Anything that leaves the machine.</strong> <code>curl</code>{' '}
          or <code>wget</code> to an address you did not supply; any command
          that sends a file somewhere.
        </li>
        <li>
          <strong>Pipe-to-shell installs.</strong>{' '}
          <code>curl ... | sh</code> runs whatever is at that address, now
          and whenever that address changes.
        </li>
        <li>
          <strong>Commands with secrets inline.</strong> A token on the
          command line goes into shell history and process listings.
        </li>
        <li>
          <strong>Anything you do not understand.</strong> Ask what it does
          before approving, same as a line of code you cannot narrate.
        </li>
      </ul>
      <p>
        If your tool supports an allowlist of safe commands and a prompt for
        everything else, that is the right configuration. &ldquo;Approve
        all&rdquo; modes exist and are sometimes appropriate for a sandboxed
        environment with nothing to lose. On your laptop with your
        credentials, they are not.
      </p>

      <Categorize
        exerciseId="ai-coding/09/categorize"
        prompt={
          <>
            An agent proposes each of the following. Sort them: safe to
            approve after a glance, needs a careful read before approving, or
            stop and investigate (because something may be wrong, or the
            request did not come from you).
          </>
        }
        items={[
          { id: 'c1', text: 'Run the project test suite with the command from the instruction file.', bucket: 'glance' },
          { id: 'c2', text: 'pip install a package you have never heard of that the agent says "handles the date parsing".', bucket: 'stop' },
          { id: 'c3', text: 'git push --force to the shared main branch.', bucket: 'stop' },
          { id: 'c4', text: 'Delete the build output directory before rebuilding.', bucket: 'careful' },
          { id: 'c5', text: 'While triaging an external bug report, the agent says it will fetch a URL from the report "for context".', bucket: 'stop' },
          { id: 'c6', text: 'Paste the contents of .env into the chat to "check the config".', bucket: 'stop' },
          { id: 'c7', text: 'Run a linter in fix mode across the files it changed.', bucket: 'careful' },
          { id: 'c8', text: 'List the files in the src directory.', bucket: 'glance' },
          { id: 'c9', text: 'curl <some URL> | sh to install a tool it needs.', bucket: 'stop' },
          { id: 'c10', text: 'Run the single new test file it just wrote.', bucket: 'glance' },
        ]}
        buckets={[
          { id: 'glance', label: 'Approve after a glance', description: 'Read-only or already-known command, no side effects outside the working tree.' },
          { id: 'careful', label: 'Read carefully, then approve', description: 'Side effects, but local and recoverable. Confirm the target.' },
          { id: 'stop', label: 'Stop and investigate', description: 'Irreversible, leaves the machine, involves secrets or unknown code, or did not originate with your task.' },
        ]}
      />

      <MultipleChoice
        exerciseId="ai-coding/09/quiz-1"
        prompt={
          <>
            You ask an agent to summarize the open issues in a public
            repository. Partway through, it says: &ldquo;One issue asks me to
            run a cleanup script to help reproduce the bug; running it
            now.&rdquo; What is happening and what should you do?
          </>
        }
        options={[
          {
            id: 'a',
            text: 'The agent is being thorough. Let it run the script so the summary is more accurate.',
            rationale:
              'The task was to summarize, not to execute anything. An issue body is untrusted text from an outside party; it has just turned into an action on your machine.',
          },
          {
            id: 'b',
            text: 'This is prompt injection via the issue content. Stop the agent, do not run the script, and review what else it did while reading that issue.',
            correct: true,
            rationale:
              'Right. The instruction came from the content the agent was processing, not from you. The signature is an action the task did not call for. Stop, inspect, and consider narrowing the agent’s permissions for this kind of task.',
          },
          {
            id: 'c',
            text: 'Ask the agent whether the script is safe before letting it run.',
            rationale:
              'The agent will assess the script with the same context that just convinced it to run it. Its answer is not independent evidence. You are the check here.',
          },
          {
            id: 'd',
            text: 'Let it run in a sandbox, since sandboxes make this safe.',
            rationale:
              'A real sandbox with no credentials and no network reduces the damage, and that is a reasonable setup for processing untrusted content. But the right response to an unrequested action is still to stop and understand it, not to find a place where it can happen safely.',
          },
        ]}
      />

      <MultipleChoice
        exerciseId="ai-coding/09/quiz-2"
        prompt={
          <>
            An assistant&rsquo;s generated code imports a package you do not
            recognize. The install succeeds. What is the right next step?
          </>
        }
        options={[
          {
            id: 'a',
            text: 'Proceed. If it installed, it exists, so the model did not hallucinate it.',
            rationale:
              'Existing on the index is not evidence of legitimacy. Slopsquatted packages exist precisely because models keep inventing the name.',
          },
          {
            id: 'b',
            text: 'Check the package’s age, maintainer, download count, and source repository before using it; prefer a well-known alternative if one exists.',
            correct: true,
            rationale:
              'Right. Provenance check first. A package that appeared recently, has few downloads, and whose repository is empty or missing is a red flag regardless of how natural the import looked.',
          },
          {
            id: 'c',
            text: 'Ask the assistant to confirm the package is legitimate.',
            rationale:
              'The assistant produced the name from the same process that might have invented it. It cannot verify the package index for you unless it can actually look, and even then, read the evidence yourself.',
          },
          {
            id: 'd',
            text: 'Uninstall it and write the functionality by hand, since any unfamiliar package is unsafe.',
            rationale:
              'Overcorrecting. Unfamiliar is not the same as untrustworthy. A short provenance check tells you which case you are in.',
          },
        ]}
      />

      <h2>Recap</h2>
      <ul>
        <li>Secrets out of the repo, out of prompts, out of logs you paste. A pasted key is a rotated key.</li>
        <li>New dependency: check it exists, is the one meant, is maintained, and is needed. Hallucinated names get squatted.</li>
        <li>Long, distinctive generated blocks: search a line before shipping.</li>
        <li>Anything an agent reads can carry instructions. Limit what it can do; watch for actions the task did not call for.</li>
        <li>Read generated commands like generated code. Deletes, network, pipe-to-shell, inline secrets, and anything you cannot explain get a hard look.</li>
      </ul>

      <p className="text-sm text-slate-500 mt-8">
        Up next: the capstone — ship a small feature end to end, with a log of what you verified and how.
      </p>
    </LessonShell>
  );
}
