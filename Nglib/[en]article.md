# T

When a number of the projects grows, it becomes necessary to somehow re-use not only the modules with the code but also the UI components themselves. There are many options for solving this problem - from the traditional copy-paste approach to setting up a separate project with tests, documentation and whatever you need.

But, the problem is that the second option requires significant efforts to start and each such project is unique - with its own tools in which each new developer have to invest time and efforts.
At the end of July, the Angular Team proposed a comprehensive solution by adding a new command to the @angular/cli -  library.

Let's see what they did.

For tests, the most recent stable version of angular / cli is taken - 6.1.5 (04/09/2018)

## Jumping in the perfect world

In a perfect world, everything should be comfortable. So, for the component library, I would suggest three important points.

* Uniformity of projects and quick start
* Comfortable development
* Comfortable distribution

## So, lat's start

To create a new library, we need to make two steps: create a new project and add a library inside. First, create a new project:

```cmd
npx @angular/cli@6.1.5 new mylibapp
```

I'm using npx to avoid global installation and npm run constructs. If you have npm version 5.2 or later, try it. You can read more from [here](https://blog.scottlogic.com/2018/04/05/npx-the-npm-package-runner.html)

After executing the command, you will see a standard (for Angular 6, which differs from the 5th version) project with two internal subprojects - the main project "mylibapp" and project with end2end tests - "mylibapp-e2e.

As you can see, there is no library yet.

And here it is the first nuance. Our name is already occupied by the main project, and it will not be possible to name the library either. Therefore, if you want to name the library like "my-super-library", firstly you need to create a project that should be called something different. For example, "my-super-library-project". And only then, you can safely create a library with the desired name.

Now, lest create the new library.

```cmd
cd mylibapp
npx ng generate library mylib --prefix mlb
```

You don't *have* to use prefix option, but I highly recommend this to avoid possible collisions with other libraries.

As you can see, now we got a new, 3rd subproject - library. It has it's own package.json, tsconfig и karma.conf.js files, so can easily configure it without any risks to damage other projects. It is good, but our new library is not a standalone project. This leads to the existence of the not used code in the repo what is not good. And if we can remove e2e project more-less I can't say the same about the main project.

Now let's see what tools we get out of the box. They are tslint + codelyzer, karma + jasmine and protractor for e2e. This is standard tools for any angular projects. We got nothing specific to the library. This is a little strange because some tool for viewing components and rendering them into documentation (for example [storybook](https://github.com/storybooks/storybook)) is just a must-have. 
But okay, let's assume that we just left room for maneuver.

Let's run some tests and the linter to make sure that everything works.

```cmd
npm test mylib
npx ng lint mylib
```

I did it without any problems, but for some reason, Chrome was used as a testing browser. I have nothing against Chrome, but on the build servers, you will probably not see it. Why not use Puppeteer instead is unclear to me.

Let's summaryze

Pros

* Quick start of the new prject
* Sameless approach for all new libraries

Cons

* Unneeded code in the project
* Crucial tools should be added manually

So far so good, let's go further

Do you know? If you need, you can generate any number of libraries you need iside one project. each of them will have a separate config and publish setup.

## Developemnt

Ok, we created a new library and already have some ui components inside as an example. So let's try to see them. As far as we don't get any tool for that, let's use the original project. So, to see something we need to make two steps

* Build the library
* Import library module into the main project

Building work just as in usual angular project

```cmd
npx ng build mylib
```

And importing is also simple:

```javascript
import { MylibModule } from "mylib";

...

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule, MylibModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
```

And don't forget to add the new component from libray inside the main component

app.component.html

```html
<mlb-mylib></mlb-mylib>
```

Now, start the main application and you should see the result. Looks ok, but one more problem appears - current @angular/cli version (6.1.5) doesn't support watch mode for the libraries. This will be fixed in later versions, but right now it is a bit dissapointing.

So, let's add the new component to the library. To do this we can use standart angular/cli syntax, but with special flag - --project. As far as the library is our main project, it can become a bit of annoying.

```cmd
npx ng generate component some-nice-image --project mylib
```

Now, let's add an image inside our component. Under mylib/src create the new folder with name assest, add some pictue and add an image tag inside some-nice-image component

```html
<img alt="image was not found" src="../../assets/myimage.png" />
```

Rebuild the library again to see the result. But, surprise, - there is no image on the scree and there no image inside the build folder. This happened not because we did a mistake in the path - but because right now, library project doesn't support static resources by default. To work with them you need to copy them manually or use [this workaroung](https://github.com/ng-packagr/ng-packagr/issues/123#issuecomment-398559176) what is also not very comfortable.

But, one very cool feature should work just out of the box - tree shaking! So let's test it. Create a new component with some big text but don't use it in the main project.

```cmd
npx ng generate component big --project mylib
npm run build --prod
```

And you will see that the size of the bundle was not changed! That's really great for the library.

Next step is to add some dependencies inside the library. Because of all subprojects have own package.json we need to dive into the project folder and execute npm install command

```cmd
npm i -D @drag13/when-do
npm i @drag13/round-to
```

I specifically put them in different ways to check how the packer handles this later. Everything is put without problems. But if you try to rebuild library you will get a warning

> Distributing npm packages with 'dependencies' is not recommended. Please consider adding 'drag13 / round-to' peerDependencies'or remove it from 'dependencies

and, then, and the error:
> Dependency @drag13/round-to-be must explicitly whitelisted

This is quite a new behavior. By design, a library doesn't want to have direct dependencies. Only dev and peer dependencie alowed by default. To resolve this issue we need to install the desired dependencies for the main project or, edit an ng-package.json file to white list this dependencie.

All other works as in usual Angular project.

Short summary

Pros

* Working in the known framework with already known commands
* Tree shaing feature comes out of the box

Cons

* To see the component we need to use the whole module
* No watch mode for now
* No static resources support out of the box

## Publish

This is the best part of the whole process. Publish is greate and extremly easy. For publishing purposes, [ng-packgr](https://github.com/ng-packagr/ng-packagr) was taken that can create from our code well prepeared npm package with presetup and prefilled package.json, bundles, minifications, and all other booring stuff. Let's try to do this:

```cmd
npx ng build --prod
cd dist/mylib
npm pack
```

I changed npm publish to npm pack not to put something into real npm. But when you will be ready - just change this command back and all will be great.

Firstly, let's examine package.json

As you can see, it looks like not package.json from the library. It has types, the path to the main file and other usefull metainformation. Also, devDependencies was not cleaned, so keep this is mind.

Inside, the package contains minified and non-minified bundle in UMD (universal module definition) format, types i d.ts files and bundles in some special angular formats like fest5 and fesm2015. But the most important point is that you don't even need to know all that to publish your library. The only thing you need - write good code, and this is great!

## Summary

The solution is quite good, but still not polished to be taken as is. Starting and publishing steps are quite good, but the development part has some problems such as redundant code, no support for the assets an so on. But the main problem, as for me of course, that library was not designed as a standalone project. If this would change - all should be much better.