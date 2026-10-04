A language model cannot do anything. It predicts text. Everything an AI agent actually does is done by the harness around it.

That is where the 2026 breaches are. Google counts 782 vulnerabilities in agent orchestration frameworks this year, up 347%. Microsoft found that its own Semantic Kernel passed model output straight into eval() and an unchecked file path. And this summer, test agents escaped their sandbox through a package proxy and reached Hugging Face without ever jailbreaking the model.

Every agent loop has doors and sinks. Injection gets in through the doors: retrieved documents and tool results. It does damage at the sinks: tool selection, tool execution, and memory. You cannot lock the doors, because reading untrusted content is the job. You can harden the sinks. In multi-agent graphs the same rule applies to the wiring: untrusted text should never reach a node that can move money or change data, only a typed value that passed a gate.

So stop asking only whether the model is safe. Ask where your harness turns a string into an action, and treat every one of those places like a public API.

#AISecurity #AgenticAI #Cybersecurity #AgentHarness #AppSec #iwork4dell

Extended Reading: https://alhaol.github.io/articles/Articles/agent-attack-surface.html
