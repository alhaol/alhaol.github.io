The most valuable thing Hugging Face ever built was not a model. It was an agreement about what a model file looks like.

NVIDIA has reportedly agreed to buy that agreement for $12.9 billion, and the part almost nobody is talking about is robotics.

LeRobot, the open library Hugging Face published at ICLR 2026, did for robots what the Transformers library did for language: it standardized the unit of exchange. One middleware API across arms. One dataset format for episodes. That plumbing took the Hub from 1,145 robot datasets at the end of 2024 to more than 58,000 by May 2026. And the diversity came from the cheap end: a 225 euro SO-101 arm has contributed roughly fifteen times more distinct datasets than the industrial Franka Panda.

But an open format hits a wall the community cannot code around. In the paper's own benchmarks, the strongest policy, a 3.5 billion parameter vision-language-action model, fails to complete a single forward pass inside five seconds on a laptop CPU. The weights are free. The silicon that runs them is not. LeRobot commoditized the middleware, the data format and the model library, and left exactly two layers open: simulation and on-robot compute. Those two layers are NVIDIA's product line.

So the deal is not a chip company buying a model zoo. It is a chip company buying the registry where physical AI gets defined as normal, seven weeks after it already shipped Isaac GR00T and Jetson Thor into that registry.

If you build with this stack, run one test in CI: load your dataset on a CPU-only runner with no CUDA present. The day that breaks, the format has stopped being neutral.

#PhysicalAI #Robotics #OpenSource #NVIDIA #HuggingFace #LeRobot #iwork4dell

Extended Reading: https://alhaol.github.io/articles/Articles/buying-the-format.html
