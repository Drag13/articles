# Npm install -g is evil

This header is quite provocative, but let me explain my opinion. In a short term, global dependencies make our lives much easier.

* Install once - use forever.
* Using becomes simpler - just print *ng* or *tsc* or something else and you are ready to go.
* Updating is also easier - update it and use with all code.

But if you try to go deeper, you will find reasons to avoid this.

* Local repository conflict. Let’s say I have two repositories with typescript projects and typescript installed globally. Time flows and I decide to update my tsc to get all the best from the new version. And what do I see? My second repo is broken. Now I must fix it (but this isn’t I want to do right now) or rollback to the oldest tsc. Global dependencies make our code dependent and not flexible.

* Team conflict. I work with EsLint version 1.5 and my college Yevgen works with EsLint 1.9. For both of us linter works just fine. Until we want to commit the code. And then the problem rises. There is no guarantee that my code working fine on my machine will be also fine at Yevgen’s machine. It is like very bad ping-pong game. I commit – he fixes. He commits – me fix. Ping -pong, yeah?

* And my favorite. Build machine conflict. Sooner or later we will go to the production. May be even with continues integration. Let’s imagine that our global dependencies are different with dependencies on build machine. What does this mean? This mean that behavior of our code becomes non-deterministic. Not predictable. Locally all is working fine. But fails on the production.  This will be very non-trivial task to find the problem.

Ok, we defined the problem. How to fix it? It's quite simple:

* Install it locally

``` javascript
npm install typescript -d
```

* Modify your script section like this

``` javascript
scripts: {
    tsc:"./node_modules/.bin/tsc"
}
```

* And use

``` javascript
npm run tsc
```

That's all. Simple, yeah?

As a conclusion. Is global flag is absolutely evil? No. It works pretty fine with fire and forget approach – like project generators. When you need to do something only once like create basic project or something else – global flag is perfect. So, do yourself and your teammates a favor. Use -g wisely.