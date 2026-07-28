The Portable Harness


The riskiest dependency in an AI workflow is not the model. It is the harness wrapped around it.

The harness is the program that reads your files, runs your commands, and decides what the model is allowed to touch. When it belongs to a vendor, its behavior can change without notice, and a pipeline that passed every test last week can fail for reasons that live on someone else's roadmap.

Terminal-native, open-source agents answer that exposure. Mario Zechner's Pi keeps its core under a thousand tokens and four tools, small enough to audit in an afternoon. Can Boluk's Oh-My-Pi forks that core in Rust and adds hash-anchored edits, LSP diagnostics, and a debugger, all running locally. The prompt, the tool list, and the permission model are files you can read, fork, and pin to a known commit.

This is not a rejection of managed platforms. Claude Code is proprietary and excellent, OpenCode is open source and excellent, and both are the right default for most work. The argument is narrower. For the two or three workflows that genuinely cannot tolerate an unannounced change, wrap an open agent in a thin, restricted harness: pin the version, narrow the tools, isolate the sandbox, log every call.

The payoff is portability. The same wrapped harness runs on a laptop, a build server, or an air-gapped machine, so if a provider changes terms you swap the model and the workflow stays put.

Own the harness for what must not move. Rent it for everything else.

#AIEngineering #SecureAI #DeveloperTools #VendorLockIn #SystemArchitecture #iwork4dell

Extended Reading: https://alhaol.github.io/articles/Articles/the-portable-harness.html
