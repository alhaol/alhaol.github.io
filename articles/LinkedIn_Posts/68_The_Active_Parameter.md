The biggest number on a model card is not the one that sets your bill per token. It is the one that sets your bill before the first token.

Two releases last week made the split hard to miss. Reflection's Beam has 501 billion parameters and runs 23 billion of them per token. Mistral Large 4 has about a trillion and runs 52 billion.

Both are sparse mixture-of-experts models: many specialist blocks, a router that picks a few for each token, the rest idle. The small number is your compute per token, and it is why the API price looks like a mid-sized model. The big number is what you must hold in GPU memory before anything runs, because you cannot know which experts the next token will need. Beam at 16-bit is about a terabyte of weights. Large 4 is about two.

If you buy through an API you only ever see the small price. If you host the weights yourself, which is the point of an open release, you pay the big price first and earn the discount only when the machine is busy.

Read the card in order: total times precision for memory, active times two for compute, then context. One model, two sizes, and neither one is the price.

#AI #MixtureOfExperts #OpenWeights #AIInfrastructure #LLM #iwork4dell

Extended Reading: https://alhaol.github.io/articles/Articles/the-active-parameter.html
