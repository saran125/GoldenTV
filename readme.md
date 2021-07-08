# Full Stack Development with Express

## Overview

This repository contains implementation example on common features used on Full stack development with express framework.
The project is designed to use Node 14.

To run:

```powershell
npm run test
```

To use nodemon:

```powershell
npm run dev
```

Dynamic files are accessed via the path `/dynamic/<path>`
Statics files are accessed via the path `/public/<path>`
HTML templates are placed in templates to make 1-1 resemblance to Flask.
As such you should know what to do yourself.

## Perquisites

You are expected to already have familiarity with

- Javascript ES6
- Some concepts of SQL
- Common sense to install things on your own
- Have done App Development Project from previous semester or Year

Otherwise you shouldn't be doing this module. Please repeat your Year 1.

## Disclaimer

No support would be given to Apple users. You only have yourselves to blame.


## Intellisense support

By default VSCode already have intellisense support. However, the Typescript server used for
this isn't updated for `.mjs` extensions. Do refer to
https://github.com/microsoft/TypeScript/pull/40068#issuecomment-674380499 for the fix.

This repository already contains the fix and setup using `settings.json`. It installs to
the local directory as developer dependencies.

For more support of typing intellisense, lookup `@types` and install with `-D`