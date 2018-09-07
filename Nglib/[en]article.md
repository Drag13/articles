# T

When number of the projects grows, it becomes necessary to somehow re-use not only the modules with the code, but also the UI components themselves. There are many options for solving this problem - from the traditional copy-paste approach, to setting up a separate project with tests, documentation and whatever you need.

But, the problem is that the second option requires significant efforts to start and each such project is unique - with its own tools in which each new developer have to invest time and efforts.
At the end of July, the Angular Team proposed a comprehensive solution by adding a new command to the @angular/cli -  library.

Let's see what they did.

For tests, the most recent stable version of angular / cli is taken - 6.1.5 (04/09/2018)

## Jumping into perfect world

In an perfect world, everything should be comfortable. So, for the component library, I would suggest three important points.

* Uniformity of projects and quick start
* Comfortable development
* Comfortable distribution

## So, lat's start

To create new library, we need to make two steps: create a new project and add a library inside. First, create a new project:

```cmd
npx @angular/cli@6.1.5 new mylibapp
```

I'm using npx to avoid globall installation and npm run constructs. If you have npm version 5.2 or later, try it. You can read more from [here](https://blog.scottlogic.com/2018/04/05/npx-the-npm-package-runner.html)

After executing the command, you will see a standard (for 6 angulary, which differs from the 5th version) project with two internal subprojects - the main project "mylibapp" and project with end2end tests - "mylibapp-e2e.

As you can see, there is no library yet.

And here it is the first nuance. Our name is already occupied by the main project, and it will not be possible to name the library either. Therefore, if you want to name the library like "my-super-library", firstly you need to create a project that should be called something different. For example, "my-super-library-project". And only then, you can safely create a library with the desired name.

Now, lest create new library.

```cmd
cd mylibapp
npx ng generate library mylib --prefix mlb
```

You don't *have* to use prefix option, but I highly reccomend this to avoid possible collisions with other libraries.

As you can see, now we got new, 3rd subproject with library. It has it's own package.json, tsconfig и karma.conf.js files, so can easily configure it without any risks to damage other projects. It is good, but our new library is not standalone project. This leads to the existance of the not used code in the repo what is not good. And if we can remve e2e project more-less I can't say the same about main project.

Now let's see what tools we get out of the box. They are: tslint + codelyzer, karma + jasmine and protractor for e2e. This are standart tools for any angular projects. We got nothing specific to the library. This is a little strange, because some tool for viewing components and rendering them into documentation (for example [storybook](https://github.com/storybooks/storybook)) is just a must have. 
But okay, let's assume that we just left room for maneuver.

Let's run some tests and the linter to make sure that everything works.

```cmd
npm test mylib
npx ng lint mylib
```

I did it without any problems, but for some reason Chrome was used as testing browser. I have nothing against Chrome, but on the build servers you will probably not see it. Why not use Puppeteer instead is unclear for me.

Do you know? If you need, you can generate any number of libraries you need iside one project. each of them will have separate config and publish setup. This is cool option, but