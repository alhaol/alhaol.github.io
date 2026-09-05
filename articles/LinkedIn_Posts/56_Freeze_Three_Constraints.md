A vague requirement used to cost you once.

Someone built the wrong thing. Review caught it. You fixed it, and it stayed fixed, because a person had read the code.

Now an agent rebuilds that module and reads the same vague requirement again. It decides for itself what you meant. On the next run it may decide differently. Birgitta Böckeler tested this last October and found the same specification producing different output run after run.

So being unclear is no longer a one-time cost. You pay it every time you generate.

Most specs written for agents describe behavior. What the feature does. What the user sees. That part is easy, and the tools handle it well. The part nobody writes down is what must never change, and that part is your architecture.

It used to be safe because rewriting it was too expensive to bother. It is not expensive anymore. Ask an agent to add a field and it will restructure your schema, and the diff will look fine.

You do not need to make the whole architecture executable. Three checks cover most of what agents actually break. A data boundary. A module dependency rule. A degradation requirement.

That is an afternoon of work. After it, breaking your architecture means failing a build.

A rule in a wiki is advice. The same rule in your test suite is a specification.

#SpecDrivenDevelopment #SoftwareArchitecture #AIEngineering #TechnicalLeadership #iwork4dell

Extended Reading: https://alhaol.github.io/articles/Articles/freeze-three-constraints.html
