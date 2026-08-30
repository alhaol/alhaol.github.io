A robot policy can tell you which object on the table is the glass. Ask it what happens when the glass goes over the edge and it is guessing.

That gap is not about model size. It is about ancestry.

A vision-language-action model is a vision-language model with an action head bolted on. Almost every parameter in it earned its weights learning how pictures relate to captions, so the system inherits a deep grasp of nouns and categories and close to nothing about how things move. An image-text corpus is a catalogue of things that exist. A video corpus is a record of things happening. Only one of them contains the fact that a poured liquid falls.

NVIDIA's DreamZero starts somewhere else. It is built on a video generation backbone and denoises future frames and future motor actions together, then runs closed-loop at 7 Hz. On ten tasks it had never seen, it completed 39.5 percent of task progress against 16.3 percent for the strongest pretrained baseline. The row that should stop you is the next one down: the same architectures trained from scratch, with no pretraining at all, score under 1 percent. The demonstrations are a thin adaptation layer. The backbone is the product.

One caution, because the popular version of this claim has outrun the evidence. You will read that video models spontaneously learn gravity and friction by predicting frames. The paper does not say that. NVIDIA's own write-up offers it as a hedged hypothesis. What is measured is that a video backbone transfers better than a language backbone. Why it transfers better is still inference, and the difference matters when you are writing a contract.

Ask your robotics vendor what their policy was pretrained on before it ever saw a robot. A vague answer is the answer.

#PhysicalAI #Robotics #WorldModels #NVIDIA #MachineLearning #iwork4dell

Extended Reading: https://alhaol.github.io/articles/Articles/verbs-not-nouns.html
