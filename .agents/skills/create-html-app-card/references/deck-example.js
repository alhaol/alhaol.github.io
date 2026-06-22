// =============================================================================
// DECK_DATA worked example  —  this is exactly what {{DECK_DATA}} gets replaced
// with in references/template.html. It is a single `const DECK = {...};` block.
//
// This example is the "9 Micro-Habits" deck (the habit-cards app) re-expressed
// in the general schema, so you can see how real content maps onto the fields.
// Copy the SHAPE, not the content.
// =============================================================================

const DECK = {
  // Reset-key for localStorage. MUST be unique per app — use the slug.
  stateKey: "cardDeck_micro-habits_v1",

  // Shown inside the root node of the Map + Graph (the count is added automatically).
  // Keep it SHORT and ALL-CAPS — it is the name of the whole system.
  rootName: "MICRO-HABITS",

  // The taxonomy buckets. 2–5 groups is the sweet spot. Each needs a label and a
  // distinct hex color (these three are the site's standard trio; reuse or pick
  // your own that read well on the dark background).
  groups: {
    attention: { label: "Attention", color: "#60a5fa" },  // sky blue
    energy:    { label: "Energy",    color: "#fbbf24" },  // gold
    happiness: { label: "Happiness", color: "#a78bfa" }   // violet
  },

  // One card per idea. 6–15 cards is ideal; more than ~20 makes the graph dense.
  //   id      : short unique slug (a-z, no spaces) — also used in `cross`.
  //   group   : MUST be a key of `groups` above.
  //   name    : the idea's title (card heading).
  //   key     : SHORT uppercase recall keyword — the mnemonic hook you memorize.
  //             One vivid word is best (CATCH, SHRINK, SKY). This is what makes
  //             the deck stick: the Map shows these as the "keyword spine".
  //   gist    : 3–6 word compression shown on the map leaf.
  //   cue     : the question on the FRONT of the flashcard (prompts recall).
  //   back    : the full lesson on the BACK (2–4 sentences, plain language).
  //   example : one concrete, specific instance of the idea in action.
  cards: [
    { id:"click", group:"attention", name:"Correct After the Click", key:"CATCH",
      gist:"Slip happens → attach a good action right after",
      cue:"What do you do the moment you catch yourself slipping into a bad habit?",
      back:"Stop trying to block the reflex before it fires. The instant you notice you have already acted (opened the app, grabbed the snack), attach one small good action right after: stand up, drink a glass of water, take three breaths. You interrupt the interruption.",
      example:"You open Instagram on autopilot, notice it, close it, and refill your water bottle." },
    { id:"input", group:"attention", name:"Control Your Input", key:"BATCH",
      gist:"Batch inputs into windows; touch once (4D)",
      cue:"How do you stop email and messages from draining your attention all day?",
      back:"Batch inputs into a few fixed windows (for example 9am, 1pm, 4:30pm). Touch each item once with the 4D rule: Do it, Delegate it, Date it, or Delete it. Open loops keep draining you in the background until they are closed.",
      example:"Check email only at set times; every message gets one of Do / Delegate / Date / Delete." },
    { id:"write", group:"attention", name:"Write to Think", key:"INK",
      gist:"Hand-write 3 questions before any hard call",
      cue:"What is the fastest way to clear a foggy decision?",
      back:"Write by hand before any hard conversation or decision. Answer three questions: What do I know? What am I assuming? What is the next honest action? Handwriting forces one thought to connect to the next.",
      example:"Stuck on a choice: hand-write the three questions before you decide." },

    { id:"quantize", group:"energy", name:"Quantize the Action", key:"SHRINK",
      gist:"Shrink it to the smallest possible start",
      cue:"What is the trick to actually starting a habit?",
      back:"Shrink it to its smallest possible packet, because the hardest part of any habit is starting. Write one line, do half a push-up, walk for one minute. Reduce the force required to begin and consistency follows.",
      example:"Want to write a book? Commit to one sentence." },
    { id:"caffeine", group:"energy", name:"Cut Caffeine 6 Hours Before Bed", key:"CUTOFF",
      gist:"Last coffee ≥ 6h before bed",
      cue:"Why does your 4pm coffee wreck your sleep?",
      back:"Caffeine has a half-life of about six hours, so a cup at 4pm still leaves roughly a quarter of the dose in your system near midnight. Set a hard caffeine cutoff at least six hours before bed to protect deep sleep.",
      example:"Bed at 10pm means last coffee by 4pm." },
    { id:"waves", group:"energy", name:"Ride the Waves", key:"WAVE",
      gist:"Focus ~90m, then a real no-input break",
      cue:"What should you do when the 3:30pm crash hits?",
      back:"Your brain runs in 80 to 120 minute ultradian cycles of focus and fatigue. The crash is a signal, not a failure. Take a real recovery break with no new input, then ride the next wave.",
      example:"90-minute focus block, then a 15-minute break with no screen, then the next block." },

    { id:"lookup", group:"happiness", name:"Look Up (Awe)", key:"SKY",
      gist:"Look up at the night sky → awe",
      cue:"The tiny habit for when life feels heavy?",
      back:"Go outside at night and look up. The light from many of those stars left them thousands of years ago, and some are already gone. You are surrounded by millions of miracles. This produces awe.",
      example:"Heavy day: step outside and look at the night sky for a minute." },
    { id:"mirror", group:"happiness", name:"Look in the Mirror (Gratitude)", key:"MIRROR",
      gist:"Look in the mirror → gratitude",
      cue:"After awe, where do you point that same attention?",
      back:"Really look at yourself. The same atoms that made the stars made you, and there is exactly one version of you. You are one of those miracles. This produces gratitude.",
      example:"Look in the mirror and name one thing you are grateful to be or have." },
    { id:"forgive", group:"happiness", name:"Forgive Yourself", key:"FORGIVE",
      gist:"Streak breaks? Note it, no shame spiral",
      cue:"What is the habit for the days when every other habit breaks?",
      back:"Your systems will break, and that is inevitable. Do not spiral into shame, because self-prosecution is more exhausting than a missed habit. You do not have to be your best self on your worst day.",
      example:"Missed your routine? Note it, forgive yourself, restart tomorrow. No spiral." }
  ],

  // OPTIONAL but recommended: named conceptual links BETWEEN cards, drawn as the
  // dashed teal edges in the Graph view. This is the "knowledge" layer — it shows
  // how ideas relate even across groups. Each is [cardIdA, cardIdB, "short label"].
  // Aim for 3–8. Both ids must exist in `cards`.
  cross: [
    ["click","quantize","smallest action"],
    ["caffeine","waves","protect energy"],
    ["lookup","mirror","awe → gratitude"],
    ["input","write","manage the signal"],
    ["forgive","waves","recover, don't force"],
    ["mirror","forgive","self-compassion"]
  ]
};
