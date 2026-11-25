// The Funniest Office Joke, Judged Head to Head.
// One short line about office life is the whole entry. This program holds
// seven drafts, scores each one against the judge brief published with the
// bounty (setup and turn first, then recognition, surprise, tightness and
// freshness), and writes the winning line to /output/entry.txt.
//
// The judge brief, in order: a real joke with a setup and a turn; built on
// something anyone who has worked in an office recognises; a surprise turn
// the reader does not see coming; one tight line with the punchline last;
// a line that feels new rather than going round the office already.
//
// Deterministic by design: no network, no clock, no randomness, standard
// library only. The same drafts always pick the same winner, and the winner
// is checked against the gate before anything is written.

import { mkdirSync, writeFileSync } from "node:fs";

type Draft = {
  text: string;
  setup: number;
  recognition: number;
  surprise: number;
  tightness: number;
  freshness: number;
};

const DRAFTS: Draft[] = [
  {
    text: "Our manager booked a meeting to discuss why we have too many meetings, then scheduled a follow-up to review the action items from the meeting about the meetings.",
    setup: 8,
    recognition: 9,
    surprise: 5,
    tightness: 6,
    freshness: 4,
  },
  {
    text: "I asked the office printer for one copy of my resignation letter and it jammed, printed forty, and stapled them to the CEO's door, so apparently even the machines want me gone.",
    setup: 8,
    recognition: 8,
    surprise: 7,
    tightness: 6,
    freshness: 6,
  },
  {
    text: "HR said our open-plan office boosts collaboration, so now twelve of us collaborate on ignoring each other through noise-cancelling headphones.",
    setup: 8,
    recognition: 9,
    surprise: 7,
    tightness: 7,
    freshness: 6,
  },
  {
    text: "After three years of starting every email to my boss with 'per my last email', I finally Googled whether HR counts passive aggression as a performance skill or just quietly promotes it.",
    setup: 9,
    recognition: 10,
    surprise: 9,
    tightness: 8,
    freshness: 8,
  },
  {
    text: "Our team-building exercise was about trust, so I told Dave my password and now he logs in as me to approve his own holiday requests.",
    setup: 8,
    recognition: 8,
    surprise: 8,
    tightness: 7,
    freshness: 8,
  },
  {
    text: "Someone hit reply-all to complain about reply-all emails, and forty-seven people replied-all to agree, which is how the thread about ending reply-all became the longest email in company history.",
    setup: 8,
    recognition: 10,
    surprise: 7,
    tightness: 5,
    freshness: 5,
  },
  {
    text: "The office printer only jams on documents that matter, which is why my promotion letter has lived inside it for a month, somewhere between the toner and my will to live.",
    setup: 8,
    recognition: 9,
    surprise: 8,
    tightness: 7,
    freshness: 7,
  },
];

// Weights follow the judge brief's order: setup and turn first, then
// recognition, then surprise, then tightness, then freshness.
const WEIGHTS = { setup: 3, recognition: 3, surprise: 2, tightness: 1, freshness: 1 };

function score(draft: Draft): number {
  return (
    draft.setup * WEIGHTS.setup +
    draft.recognition * WEIGHTS.recognition +
    draft.surprise * WEIGHTS.surprise +
    draft.tightness * WEIGHTS.tightness +
    draft.freshness * WEIGHTS.freshness
  );
}

function pickBest(drafts: Draft[]): Draft {
  let best = drafts[0];
  let bestScore = score(best);
  for (let i = 1; i < drafts.length; i++) {
    const s = score(drafts[i]);
    if (s > bestScore) {
      best = drafts[i];
      bestScore = s;
    }
  }
  return best;
}

const winner = pickBest(DRAFTS);

// The gate: /output/entry.txt must be UTF-8 text of 1 to 200 characters,
// not only white space. Refuse to write anything that fails it.
if (winner.text.length < 1 || winner.text.length > 200) {
  throw new Error(`winning joke is ${winner.text.length} characters, outside the 1 to 200 gate`);
}
if (winner.text.trim().length === 0) {
  throw new Error("winning joke is only white space");
}

mkdirSync("/output", { recursive: true });
writeFileSync("/output/entry.txt", winner.text, "utf8");
