import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

interface AuthenticatedRequest extends Request {
  user?: any; // Replace 'any' with the actual type of 'user' if you have a specific type
}

let secretToken: string | undefined;
let customFunction: any;

export const setup = (getSecretCallback: () => string) => {
  secretToken = getSecretCallback();
};

export const getSecret = () => {
  if (!secretToken) {
    throw new Error(
      "JWT secret is not set. Call the 'setup' function to set it."
    );
  }
  return secretToken;
};

export const setupCustomFunction = (customFunc: any) => {
  customFunction = customFunc;
};

export const checker = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<any> => {
  const token = req.headers["authorization"];

  if (!token) {
    return res.status(500).json({ error: true, message: "Token Required..." });
  }

  const auth = token.substring(7, token.length);

  try {
    const decode: any = jwt.verify(auth, secretToken!); // Pass the secretToken
    req.user = decode.user;

    if (customFunction) {
      const userExists = await customFunction(decode.user);
      if (!userExists) {
        return res
          .status(401)
          .json({ error: true, message: "User not found in the database..." });
      }
    }

    next();
  } catch (error) {
    return res.status(401).json({ error: true, message: "Invalid Token..." });
  }
};

export const adminChecker = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
  customFunction?: any
): Promise<any> => {
  const token = req.headers["authorization"];

  if (!token) {
    return res.status(500).json({ error: true, message: "Token Required..." });
  }

  const auth = token.substring(7, token.length);

  try {
    const decode: any = jwt.verify(auth, secretToken!); // Pass the secretToken
    req.user = decode.user;

    if (customFunction) {
      const userExists = await customFunction(decode.user);
      if (!userExists) {
        return res
          .status(401)
          .json({ error: true, message: "User not found in the database..." });
      }
    }

    next();
  } catch (error) {
    return res.status(401).json({ error: true, message: "Invalid Token..." });
  }
};
