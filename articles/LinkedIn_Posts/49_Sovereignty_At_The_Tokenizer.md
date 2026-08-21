The most expensive decision in an Arabic AI program is usually made before anyone picks a model, by people who do not speak Arabic. It is made in the tokenizer.

Sovereign AI gets sold as geography: data stays in country, GPUs sit in a national facility, a minister cuts a ribbon. That is the easy half.

A tokenizer is the lookup table that turns text into the pieces a model actually consumes, and it was trained on somebody else's corpus. Petrov and colleagues showed at NeurIPS that the same passage translated across languages can differ by up to fifteen times in token count, before the model runs at all. Arabic sits badly on that curve, because prepositions, the article and possessive pronouns attach directly to the word. One written Arabic word carries what English spreads over five, and an English-first vocabulary shatters it into fragments that line up with nothing.

You pay for that three times. In price, since inference is metered per token. In latency, since output is produced one token at a time. And in context, since a fixed window holds fewer Arabic words than English ones. The third is the one that breaks systems rather than budgets: a retrieval pipeline sized for English quietly truncates Arabic documents and never throws an error.

The good news is that the layers got cheaper to own. Jais, ALLaM and Fanar are documented Arabic-first open models, and Fanar Prime was built by continuing training on top of open weights rather than starting from zero. That is the pattern to copy. Take open weights, extend the vocabulary so your language stops being fragmented, train on your own corpus, own the result.

Then build the one thing no vendor can sell you: a few hundred evaluation items in your dialect, on your tasks, graded by your own people. Own the evaluation and every layer beneath it becomes swappable.

#SovereignAI #ArabicNLP #SmallLanguageModels #AIStrategy #Tokenization #iwork4dell

Extended Reading: https://alhaol.github.io/articles/Articles/sovereignty-at-the-tokenizer.html
