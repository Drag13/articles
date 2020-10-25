# Writing your first website with GitHub pages

## Prerequisites

- Create an account at [https://github.com/](https://github.com/)
- Install git from [https://git-scm.com/downloads](https://git-scm.com/downloads)
- Install VsCode from [https://code.visualstudio.com/](https://code.visualstudio.com/)
- Install Node.JS (LTS) [https://nodejs.org/en/](https://nodejs.org/en/)

## Very Basic Site

- Create repo named `(username).github.io` where username equals to your user name
- Clone repo to local machine
- Add basic HTML: `echo "hello world" > index.html`
- Push to the master

## Content

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>My Personal Site</title>
  </head>

  <body>
    <main>
      <article>
        <div><img src="./img/me.png" /></div>

      </article>
    </main>
  </body>
</html>
```

### Markup - content of the site

Add some content:

Create new img folder, put there any image named me.png

Install web server for chrome [https://chrome.google.com/webstore/detail/web-server-for-chrome/ofhbbkphhbklhfoeikjpcbhemlocgigb](https://chrome.google.com/webstore/detail/web-server-for-chrome/ofhbbkphhbklhfoeikjpcbhemlocgigb)

Run it

### Styles - how does content looks

Create new folder - styles

Add inside `main.css` file with next content

```css
.about {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
}
.bio {
  font-size: 6rem;
}
```

Add class to the markup:

```html
<article class="about">
  <div><img src="./img/me.png" /></div>
  <div class="article">I am just a developer</div>
</article>
```

Connect styles to the page:

```html
<link href="./styles/main.css" rel="stylesheet" />
```

Add reseting:

```css
.html,
body {
  padding: 0;
  margin: 0;
}
```

### JavaScript - interacting with site

Working site

Update markup:

```html
<div class="bio">I am just a developer <span id="like">&hearts;</span></div>
```

Create new folder - js, put there index.js file with next content

```js
const $like = document.querySelector("#like");

if ($like) {
  $like.addEventListener("click", () => {
    $like.classList.toggle("liked");
  });
}
```

```js
(function () {
  const $like = document.querySelector("#like");

  if ($like) {
    $like.addEventListener("click", () => {
      $like.classList.toggle("liked");
    });
  }
})();
```

This code might not work

Update styles

```css
#like {
  color: gray;
  cursor: pointer;
  user-select: none;
}

#like.liked {
  color: red;
}
```

- html:5

## Converting to the project

- npm init
- npm install gh-pages -D
- create `.gitignore` with `node_modules`
- create new publish.js file:

```javascript
const gh = require("gh-pages");
gh.publish("dist", () => console.log("done"));
```

add new script - release to the package json:

```json
...
"release": "node publish.js"
```

Tips:

Config git

- `git config user.name NAME`
- `git config user.email YOUR@EMAIL.COM`
- `git reset HEAD~`

Semantic markup

- [Semantic markup](https://www.freecodecamp.org/news/semantic-html5-elements/#:~:text=Semantic%20HTML%20elements%20are%20those,content%20that%20is%20inside%20them)
