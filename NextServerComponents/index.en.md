NextJS and new server components - why they are needed and how to prepare
Hello everyone, my name is Vitaliy Ruban, I work at Itera, and today I will talk about a new, interesting, but rather controversial feature that appeared in the latest 13.4 update of Next.JS - server components.

Why did server components appear?
Let's start with the most important question - "Why did server components appear?"

As you probably already know, Next.JS works as follows:

The client requests the address served by the Next.JS server
Next.JS, at runtime (optimizations with caching may be present), receives the data necessary to create the page
And creates an HTML page, which, together with JS code, is sent to the client
Since the page is a regular HTML - the user sees it as it loads and, unlike SPA, does not wait for React to create it from scratch on the client
After receiving the client bundle, the hydration process takes place - transforming static HTML into a familiar React application that the user can interact with. If hydration is not done, the user simply cannot interact with the HTML page because all event listeners are added at this stage.

All this complex process is done so that your user can see the content they need as quickly as possible and not leave your website frustrated. It also simplifies the life of SEO robots and increases the chances of the page ranking higher in search results. At the same time, the developer can work in familiar and convenient React with all its advantages - a component-based approach, HMR, and a rich toolkit.

But this process has drawbacks, the biggest of which is that all dependencies used inside your component will be included in the application bundle, which increases the time it takes for your application to become interactive. There may even be a situation where the user has already loaded the page, tries to interact with it, but it does not respond because the main thread is busy parsing JavaScript or hydrating. This gives the impression that your page is not working at all and people may leave it. They may even tell their friends that your store is not working.

The second drawback is that all components, even those whose content never changes, participate in hydration and the React application lifecycle. This, accordingly, reduces the response time of your page to user actions, which is bad for the user experience.

And here server components come to the rescue, trying to solve both problems at once by:

Dependencies used in server components are not included in the bundle at all. This reduces its size and speeds up the moment when your page becomes interactive.
Server components do not participate in hydration or the lifecycle of applications (noticed a violation of SRP? You will see what it leads to), which speeds up the response time of the application (actually gives more time for other operations) and saves your phone battery.
Of course, such magic is not free, so server components have significant limitations (some of which currently make them almost unnecessary).

The first rule of server components is not to tell anyone that you are using server components server components cannot have added behavior. useState, useEffect, onClick, and other interactive features are prohibited for use in server components. And this makes sense if you remember that server components cannot be changed. If you still need behavior, you need client components. Regular functions, including fetch, are allowed. But keep in mind that server components run on the server, so they cannot access the browser API, window, and document objects. Another interesting point is that native element interactivity is allowed! Forms, checkboxes, radio buttons, links, and summaries will work great.

Also, server components cannot use context, which means that many familiar tools that are built on context, such as Redux Toolkit, Emotion, and even the popular MUI component library, do not work with server components. And this, in my opinion, is the biggest and most significant drawback of server components, which almost negates all their benefits. However, there is currently an experimental server-side context, but it is not used by third-party libraries and does not work correctly during navigation, so I do not recommend using it, at least for now.

The second rule of server components is that all components are considered server components unless otherwise specified. If you need a client component, you must add the 'use client' directive at the very beginning of the file with the components, before any imports. For example, like this:

From the first two points, it follows that by default, a Next.js application is not oriented towards interactivity, so keep this in mind when choosing a framework for your next application.

The third rule of server components is that importing a server component to the client automatically transforms it into a client component, thereby depriving it of all those advantages that I mentioned above. This point is very important, so I will emphasize it again: Any server components imported into a client component are automatically transformed into client components. Moreover, this effect is transitive - sub-components also become client components automatically, and so on to the last component in the hierarchy. As Grandfather Panas used to say - that's such a trouble\* for the kids.

The practical consequence of this is that if you add the use-client directive to your root component (for example, a page), all its imports and imports of its imports will automatically be transformed into client components. This implies that the use-client directive should be used as low as possible in the import hierarchy. Another way to solve this situation is to use children in client components, for example, like this:

Finally, the fourth rule of server components, which sweetens my slightly bitter article a little - they can be asynchronous and can fetch data directly in the component body, without any useEffect. Then this data can be processed and passed to client components, which can create context and add some interaction. And to handle errors that occur during asynchronous operations, simply add an error.jsx/tsx file. This is convenient and slightly improves the impression of all the previous limitations. But, to be honest, not by much.

In conclusion, this technology is potentially useful and can make your applications faster by reducing the output bundle size. However, the inability to use context and libraries built on it almost completely negates their usefulness in the real world. Even if your page is completely static but, for example, uses the popular CSS in JS library - Emotion for styling, you will not be able to use server components to their full extent - at most as a container for convenient data retrieval, but obviously, this is not what the developers had in mind when they added server components.

What do you think about this?

- Grandfather Panas didn't say it exactly like that.
