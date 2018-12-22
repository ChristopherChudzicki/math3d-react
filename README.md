# Math3d-React [![Build Status](https://travis-ci.com/ChristopherChudzicki/math3d-react.svg?branch=master)](https://travis-ci.com/ChristopherChudzicki/math3d-react)

Live at [math3d.org](https://www.math3d.org)

## To Install

This repository has two `package.json` files; as such, there are two places to run `npm` commands:

- `/package.json`: configuration for the express server
- `/react-ui/package.json`: configuration the user interface. *Most of the app is here.*

First, install server dependencies:
```bash
> npm install
```

Next, install `mongodb`, which is our database. This is not installed by `npm`: you'll need to install it yourself. On a Mac, `brew install mongodb` will do.

Now start the database:
```bash
> npm run start-db
```
and in a new terminal window, start the server:
```bash
> npm start
```

Finally, in a new terminal window, install ui dependencies and start the app:
```bash
> cd react-ui
> npm install
> npm start
```

The math3d-react app is now being served on `http://localhost:3000/`.
