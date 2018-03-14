# Npm install -g is evil

This title sounds quite provocative, but let me explain my opinion. In a short term, global dependencies make our lives much easier.

## Pros

* Install once - use forever.
* Usage becomes simpler - just print *ng* or *tsc* or something else and you are ready to go.
* Updating is also easier - update it and use with all code.

But if you try to go deeper, you will find reasons to avoid this.

## Cons

* Local repository conflict. Let’s say I have two repositories with typescript projects and typescript installed globally. Time flows and I decide to update my tsc to get all the best from a new version. And what do I see? My second repo is broken. Now I have to fix it (but this isn’t what I want to do right now) or rollback to the oldest tsc version. Global dependencies make our code dependent and not flexible.

* Team conflict. I work with EsLint version 1.5 and my college Yevgen works with EsLint 1.9. For both of us linter works just fine. Until we decide to commit the code. And then the problem rises. There is no guarantee that my code working properly on my machine will be also fine on Yevgen’s machine. It is like a very annoying ping-pong game. I commit – he fixes. He commits – I fix. Ping-pong, yeah?

* And my favorite one. Build machine conflict. Sooner or later we will go to the production. May be even with continues integration. Let’s imagine that our global dependencies differ from dependencies on a build machine. What does it mean? It means that behavior of our code becomes non-deterministic. Not predictable. Locally everything works fine. But it fails on the production. There will be a very non-trivial task to find the problem.

Ok, we have defined the problem. How to fix it? Fortunately it's quite simple:

* Install your dependency locally

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

As a conclusion. Is global flag absolutely evil? No. It works pretty fine with fire and forget approach – like project generators. When you need to do something only once like create a basic project or something else – global flag is perfect. So, do yourself and your teammates a favor. Use -g wisely.