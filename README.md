# Math3d-React [![Build Status](https://travis-ci.com/ChristopherChudzicki/math3d-react.svg?branch=master)](https://travis-ci.com/ChristopherChudzicki/math3d-react)

Live at [math3d.org](https://www.math3d.org)

## Package Anatomy

This repository has three `package.json` files:

- `math3d-react/server/package.json` server dependencies and scripts
- `math3d-react/client/package.json` client dependencies and scripts
- `math3d-react/package.json` deployment scripts


## To Install

First, `cd` to package root and install server and client dependencies.

```bash
> npm install
```

Next, install `mongodb`, which is our database. This is not installed by `npm`: you'll need to install it yourself. On a Mac, `brew install mongodb` will do.

Create a `.env` file in the `server/` directory to set local environment variables. For local development, just copy the template:
```bash
> cp server/dotenv_template server/.env
```

Now start the database:
```bash
> npm run start-db
```

then in a new terminal window, start the server:
```bash
> npm start
```

Finally, in a third terminal window, start the client app:
```bash
> cd react-ui
> npm start
```

The math3d-react app is now being served on `http://localhost:3000/`.
