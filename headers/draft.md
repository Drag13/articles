# Security headers

## Content-Security-Policy

One of the most important security header. It was created to prevent the usage of any resource from an untrusted source.

Let's go to the quick example:

Evil Bob found XSS vulnerability on your site. He decides to inject the script into your application to steal some customer data. He put this script tag into your page

html
<script src="https://my-evilt-site.org/very-evil-script.js"></script>


and waits for the results. Luckily, you already set Content-Security-Policy header to:


Content-Security-Policy: default-src 'self'


Now, a browser already knows, that scripts from not your domain are untrusted, and injected script will be ignored without any additional actions from your side. CSP supports not only JS, but also styles, media, images, fonts, and frames. You can even deny eval and inline scripting, so when Evil Bob will insert pure script into your page it also will fail!


### Pitfalls

 Some times people use (wildcards) for the CSP header. Don't do that as far as it ruins the essence of the CSP header.
* If you will try to set up the CSP-header for modern SPA application (React, Angular) you may find that they require eval and will not work without it.

### Support

CSP header supported by almost all browsers including IE (but with a special name - X-Content-Security-Policy). Some of the directives may not be supported across different browsers but this will not ruin it.

### Code example:

ttt

This is a complex header that covers lots of different options so I would recommend visiting [CSP-Cheat-Sheet](https://scotthelme.co.uk/csp-cheat-sheet/) for more information about CSP header options.


## Feature-Policy

This header is designed to turn off features that you don't expect to be used.

Alice has has nice and shiny site with a big audience. Evil Bob found XSS and decided to use her site for spying using users web camera. So he injects malicious code and waits for the dozen of the new videos.

But, fortunately, Alice already set Feature-Policy header to: ```Feature-Policy: camera 'none'```

Now, browsers know, that using a camera is not permitted and Bob's attempt fails. Of course, you can turn off not only a camera but also autoplay (useful when you are showing some ads from 3rd party vendors), microphone and very much more. If you don't want to turn it of for all, you can allow to use it only for code from your domain.

### Support

Not supported by IE and partially supported by all other browsers


### Code example
* Disabling sensetive features: Feature-Policy: camera 'none' microphone 'none' geolocation 'none' autoplay 'self'

More information can be found [here](https://developer.mozilla.org/ru/docs/Web/HTTP/Feature_Policy) and [here](https://developer.mozilla.org/en-US/docs/Web/HTTP/Feature_Policy/Using_Feature_Policy)

## Strict-Transport-Security

The very simple header, that tells the browser to use an only HTTPS connection, even if the user is trying to use HTTP.

Let's imaging that you are sitting in the public place and use public WiFi. Evil Bob is sitting not very far from you and trying to sniff all non-encrypted traffic. You decide to visit your bank's web page and use old and good URL link like www://my-example-bank.com. Evil Bob see your request (it's not encrypted) and starts recording your activity hoping to get your credit card data. But, after the first request, your bank returns STS header:

Strict-Transport-Security: max-age=31536000; includeSubDomains

and now you automatically switched (redirected) to HTTPS connection. From now, Evil Bob sees only encrypted traffic and can't steal your data.

One more nice thing about this header is that you can specify a max-age time to let the browser know, how much time he should automatically use HTTPS connection without asking the server.

## Support

Supported by all browser including IE

## Code Exanple

* Long-term sts header with subdomains: Strict-Transport-Security: max-age=31536000; includeSubDomains


## X-Content-Type-Options

This is a bit tricky header but it works very well with CSP, so it worth mentioning.

nice header designed to prevent browsers, from guessing the type of the resource. Nowadays, browsers are smart and try to help you as much as possible. So, in some conditions, they may treat the resources marked as text like javascript and try to execute it.

Example: Evil Bob found XSS on your site and tried to put the script in it. But you already protect your Site with CSP, so his attempt to download javascript from untrusted resources failed. But Evil Bob is smart, so he changes the script into the link with type "text/plain". This is not protected by CSP, so the browser will load this text. After loading, the browser will see that it contains something like a javascript. So he may (this named sniffing and this behavior vary on the browser) treat provided type as a mistake, and execute it. But, we already setup

X-Content-Type-Options nosniff

And now browser will not do this in any case!

### Support

Supported by all browsers except Safari.

### Code Example
* Only one option is available: X-Content-Type-Options nosniff

More information

## Referrer-Policy

Controls how much of the referer information is send withing the request.

Short example:

You have a forum about cats with lot's of links to other resources. When your user clicks on the link, he is navigated to another web page, and this web page can gather some information about the source of the navigation. You value privacy of your users, and want to keep this information in secret. So you

Referrer-Policy: same-origin

That tells the browser not to send referer data for anyone, except yourself. One more nice thing is that you can implement this header with pure html. Just add meta tag to your page and this part is done!

html
<meta name="referrer" content="same-origin">


## Support
* Not supported by the IE and Safari IOS

Usefull links:

[CSP Cheat-shit](https://scotthelme.co.uk/csp-cheat-sheet/)