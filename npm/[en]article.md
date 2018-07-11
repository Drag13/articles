# How to create good npm package for your team

When you work alone, you can write in any manner you want. But let's say you need to create a good npm package that will be easy to deal with. With codestyle, testing, documentation and so on. And of course you don't wont to do this manually. It's is not hard but some points may be a bit tricky. This topic helps you to build your own typescript project ready to publish to npm.

Let's decide what exactly we want to achive

* Text formatting - indention size, indention type, etc.
* Code style - single qoute or double qoute, using semicolumn, etc.
* Tests - with codecoverage and treshold
* Commit style - same commit style for all
* Documentation - only from the code, no manual work (allmost :))
* Commit checks automtion - no more manual checks
* Publish automation - lets automate publish routine

If you think this is too complicated, don't worry. There is nothing hard here and I will explain step by step.

## Text formatting

## Code style

As far as we decided to use TypeScript we will use tslint to keep codestyle green. Install tslint locally and initialize it

```cmd
npm i tslint -D
./node_modules/.bin/tslint init
```

Then next command to the package.json to lint the code

```json
"lint":"./node_modules/.bin/tslint"
```

## Tests

I am sure you already know how to setup testing so we will go very short. Install karma, jasmine and related stuff:

```cmd
npm i -D karma ...
```

Add karma command to the package.json

```json
"karma":"./node_modules/.bin/karma"
```

And initialize karma.config

```cmd
npm rum karma -- init
```

Karma reporter can be setup like this:

```json
{}
```

Karma treshold can be setup like this:

```json
{}
```

Don't forget to setup typescript...

## Commit style

To keep commits in a same manner we will take commitizen. It will prompt you with a few question and then generate commit message. Commitizen supports open-doc format so, later we can generate changelog just from your commit messages!

## Documentation

There are lot's of tools that can generate documentation from the javascript. But for typescripts only few are present. Typedoc is on of them. It's opensource and very easy to use.

Install it

```cmd
```

And add a new command to the package.json file

```json
    "doc":""
```

## Commit checks automation

Ok, the most part already finished. We created bunch of different scripts but should we use them manually? No! Lets automate everyting.

Main idea is to keep our repository clean from the failing or wrong code. So, we can use git hooks to check the code just before pushing it (or commiting). But here is a problem - git hooks are not shareable across the team. And that's why husky appears. This package wrap the git push and commit commands and executes your custom scripts. If they will fail, commit will not be done. Quite nice I think, lets try!

Install husky

And add prepush script to the package.json

Now, whenever you will try to push smth to remote, your prepush command will be executed

## Automate publish

Last but not list point is to automate publish. This is not critical part but it can make your life much easier end ensure that you will not forget update documentation, tag and so on.

To achive the goal, we will use npm hooks - preversion, version, postversion and prepublishOnly

Update your script section with folowing code:

All is done. Now, your package.json should looks like something like this:

TextFormatting (prettier)
CodeStyle (tslint)
Testing (karma)
Documentation (typedoc)

CommitStyle
CommitCheck automation
Publish automation
