# @northfoxgroup/node-utils

`@northfoxgroup/node-utils` is a utility package designed for handling JWT (JSON Web Tokens) in Node.js applications. It provides a straightforward way to manage JWTs, including setting up secret tokens and custom functions for authorization checks.

## Installation

To install the package, use npm or yarn:

```bash
npm install @northfoxgroup/node-utils
# or
yarn add @northfoxgroup/node-utils
```

### Usage

##### Basic Setup

You can set up the JWT secret token with the setup function:

```ts
import { jwtChecker } from "@northfoxgroup/node-utils";

jwtChecker.setup(() => "your-secret-token");
```


### Custom Function
You can also define a custom function to perform additional checks during JWT validation. This function should return true to allow access and false to deny it:

```ts
import { jwtChecker } from "@northfoxgroup/node-utils";

const customFunction = async (user) => {
  if (user.email === "prince2@yopmail.com") {
    return true;
  } else {
    return false;
  }
};

jwtChecker.setupCustomFunction(customFunction);
```

### Middleware Usage
Use the checker middleware to protect routes and ensure valid JWTs:

```ts
import express from "express";
import { jwtChecker } from "@northfoxgroup/node-utils";

const router = express.Router();

router.get("/secure-route", jwtChecker.checker, (req, res) => {
  // This route is protected by JWT validation
  res.json({ message: "You have access!" });
});

export default router;
```

## API Reference

##### `setup(getSecretCallback: () => string)`

- This function sets the JWT secret token.

##### `getSecret()`

- Retrieves the JWT secret token.

##### `setupCustomFunction(customFunc: any)`

- Sets a custom function for additional authorization checks.

##### `checker(req, res, next)`

- Middleware for protecting routes with JWT validation.

##### License

This package is distributed under the MIT License. See the [LICENSE](./LICENSE) file for details.

---

Feel free to customize this documentation to better match your package's specific use case and features. Additionally, you can add more details, examples, or any other information relevant to your users.