import LessonShell from '@/components/LessonShell';
import { MultipleChoice, Reflection } from '@/components/NonCodeExercise';
import { getLessonNav } from '@/lib/curriculum';

export const metadata = {
  title: 'Privacy and Data Handling — Credence AI Academy',
};

export default function Page() {
  const nav = getLessonNav('llm-literacy', '12-privacy');
  return (
    <LessonShell
      lessonId="llm-literacy/12-privacy"
      trackLabel="Working with LLMs"
      trackHref="/tracks/llm-literacy"
      title="Privacy and Data Handling"
      estMinutes={10}
      nav={nav}
    >
      <p>
        When you paste something into a chatbot, you are sending it to a server
        somewhere. That obvious fact deserves more attention than it gets.
      </p>

      <h2>The basic shape of the risk</h2>
      <p>
        Depending on the product and your account settings, content you paste
        into an LLM may be:
      </p>
      <ul>
        <li>Logged and stored for a period of time on the provider&rsquo;s servers.</li>
        <li>Used to train future models (in some consumer products by default; opt-out usually exists but is not always obvious).</li>
        <li>Reviewed by humans for safety and quality (this is standard at major providers, including for content you would consider sensitive).</li>
        <li>Subject to subpoena or legal hold in the provider&rsquo;s jurisdiction.</li>
        <li>Exposed in the event of a breach.</li>
      </ul>
      <p>
        Enterprise plans (e.g., the &ldquo;business&rdquo; or &ldquo;team&rdquo;
        tier from major providers) often offer stronger data handling — no
        training on your data by default, shorter retention, contractual
        protections. <strong>The protections only apply if you&rsquo;re actually
        using the enterprise account, not the personal one you signed up for on
        your phone.</strong>
      </p>

      <h2>Categories of data to think about</h2>

      <h3>Always-no</h3>
      <ul>
        <li>Personally identifiable information (PII) about customers, employees, or third parties — names paired with sensitive context, SSNs, financial accounts, health information.</li>
        <li>Anything covered by HIPAA, PCI, GDPR special categories, or similar regulatory frameworks.</li>
        <li>Trade secrets, unreleased product details, M&amp;A material, anything under NDA from a third party.</li>
        <li>Credentials, API keys, passwords, private keys, signed tokens.</li>
        <li>Source code for proprietary systems if your organization classifies it as confidential.</li>
      </ul>

      <h3>Carefully-only</h3>
      <ul>
        <li>Internal documents that are confidential but not regulated — typically OK on the enterprise tier with logging off, not on personal accounts.</li>
        <li>Customer-derived data after meaningful de-identification (names removed, IDs stripped, context generalized).</li>
        <li>Drafts of customer-facing content (consider whether the draft itself contains anything sensitive).</li>
      </ul>

      <h3>Usually fine</h3>
      <ul>
        <li>Public information you could share anywhere.</li>
        <li>Generic technical questions with no organizational identifiers attached.</li>
        <li>Synthetic or example data you constructed for the question.</li>
      </ul>

      <h2>The pattern to develop</h2>
      <p>
        Before pasting, ask: <strong>if a screenshot of this prompt and its
        response were leaked tomorrow, what would it cost?</strong> That covers
        most cases:
      </p>
      <ul>
        <li>If the answer is &ldquo;nothing&rdquo; — paste.</li>
        <li>If the answer is &ldquo;some embarrassment&rdquo; — consider de-identifying or using the enterprise tier.</li>
        <li>If the answer is &ldquo;regulatory exposure, customer harm, lost trust, lost contract&rdquo; — don&rsquo;t paste, full stop.</li>
      </ul>

      <h2>A common failure pattern</h2>
      <p>
        The dangerous combination is: a sensitive task, time pressure, and a
        personal chatbot account that&rsquo;s already open. Someone pastes a
        customer email into ChatGPT for help drafting a response, the email
        contains the customer&rsquo;s account number, and now that data is in a
        consumer chat history retained by default.
      </p>
      <p>
        The fix is not &ldquo;remember to be careful.&rdquo; The fix is workflow
        design: use the enterprise tier provisioned for your role; de-identify
        before pasting if you&rsquo;re not sure; have a clear, short list of
        things that must never go in.
      </p>

      <h2>What your organization probably has</h2>
      <p>
        Credence (and most organizations) likely has a published AI usage policy,
        an approved tool list, and possibly an enterprise tenant for one or more
        AI products with specific data handling terms. Check that policy before
        applying anything in this lesson — your org&rsquo;s rules supersede
        general advice.
      </p>
      <p className="text-sm text-slate-500">
        (Replace this paragraph with your organization&rsquo;s specific guidance
        before deploying the course.)
      </p>

      <MultipleChoice
        exerciseId="llm-literacy/12/quiz-1"
        prompt={
          <>
            You need to draft a reply to a customer complaint. The customer&rsquo;s
            email contains their full name, account number, and a description of
            a billing issue. You have access to your company&rsquo;s
            enterprise-tier AI account. What&rsquo;s the most appropriate move?
          </>
        }
        options={[
          {
            id: 'a',
            text: 'Paste the email verbatim into your personal ChatGPT account; you need the response fast.',
            rationale:
              'Personal account = consumer terms, including default retention and (depending on settings) training. Customer PII does not belong here.',
          },
          {
            id: 'b',
            text: 'Use the enterprise account, paste the email after removing the name and account number, write the response, and add identifying details back yourself.',
            correct: true,
            rationale:
              'Right. Enterprise tier has stronger handling, and de-identifying the prompt removes the load-bearing risk entirely.',
          },
          {
            id: 'c',
            text: 'Use the enterprise account and paste everything — that is what the enterprise account is for.',
            rationale:
              'The enterprise tier reduces some risks but does not make every category of data appropriate to send. PII may still be subject to internal rules even on enterprise tier — check your org policy.',
          },
          {
            id: 'd',
            text: 'Skip the AI and write it manually.',
            rationale:
              'A defensible choice, but not the best when a safer workflow (B) is available and faster.',
          },
        ]}
      />

      <MultipleChoice
        exerciseId="llm-literacy/12/quiz-2"
        prompt={
          <>
            A colleague tells you: &ldquo;Don&rsquo;t worry, the chat history is
            private — only I can see it.&rdquo; What&rsquo;s the most useful
            correction?
          </>
        }
        options={[
          {
            id: 'a',
            text: '"Private" in a SaaS context typically means "not visible to other end users." It does not mean the provider has no access, no retention, no human review, and no breach exposure.',
            correct: true,
            rationale:
              'Right. "Private" is a UI-level concept. The provider, their staff, and their systems still have access under the terms.',
          },
          {
            id: 'b',
            text: '"They are right; private accounts on major AI products are end-to-end encrypted."',
            rationale:
              'No — major consumer AI products are not end-to-end encrypted. The provider has access to your conversations.',
          },
          {
            id: 'c',
            text: '"They are wrong; nothing is ever private online."',
            rationale:
              'Too sweeping — different products and tiers have meaningfully different protections. The right answer is calibration, not nihilism.',
          },
          {
            id: 'd',
            text: '"They are right unless you opted in to training data sharing."',
            rationale:
              'Better but still incomplete. Opt-out from training data does not address retention, human review, or breach risk.',
          },
        ]}
      />

      <Reflection
        exerciseId="llm-literacy/12/reflection"
        prompt={
          <>
            Think about the last AI tool you used at work. What account were you
            signed in to — personal or company-provisioned? If you don&rsquo;t
            know, that&rsquo;s the most useful thing to find out this week. What
            should your workflow look like for the kinds of sensitive content you
            handle?
          </>
        }
        modelAnswer={
          <>
            <p>
              Most people, when they audit honestly, find at least one workflow
              that pastes content into a personal account that probably
              shouldn&rsquo;t go there. The fix is rarely dramatic — switch
              accounts, develop a habit of de-identifying first, know which
              categories of data are off-limits regardless of tier.
            </p>
            <p>
              The hardest part is making this <em>automatic</em>, not effortful.
              Effortful checks fail under time pressure, which is exactly when
              the sensitive paste happens.
            </p>
          </>
        }
      />

      <p className="text-sm text-slate-500 mt-8">
        Up next: prompting hygiene without overpromising.
      </p>
    </LessonShell>
  );
}
