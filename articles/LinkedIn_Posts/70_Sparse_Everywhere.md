The cheapest way to make a model more capable is no longer to make all of it bigger. It is to make more of it, and run less of it.

Three releases in one October week showed the same bet at three sizes. Reflection's Beam holds 501 billion parameters and runs 23 billion per token. Mistral Large 4 holds about a trillion and runs 52 billion. Google's EmbeddingGemma 2, a thousand times smaller, ships a 270 million parameter text core with vision and audio encoders you load only if your workload needs them.

The idea is from 1991: a set of local experts and a gate that picks one. It became practical in 2017, went open with Mixtral in 2024, and since then the total parameter count of open models has grown more than twenty-fold while the active count has stayed between 5 and 52 billion. Compute per token tracks the small number. Memory tracks the big one. Labs add capacity at the price of the small number, and that trade is lopsided.

The same shape now appears at every altitude: experts inside the model, encoders at its edge, a fleet of models above it. Each time: hold more than you run, and let the input decide what runs.

For the systems you build on top, that makes the chooser the product. A router that sends everything to the biggest model has rebuilt a dense system at sparse prices.

#AI #MixtureOfExperts #AIArchitecture #LLM #OpenWeights #iwork4dell

Extended Reading: https://alhaol.github.io/articles/Articles/sparse-everywhere.html
