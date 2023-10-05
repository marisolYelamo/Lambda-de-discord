import { AxiosError } from "axios";
import { generateResponse } from "../functions";

interface BaseError {
  error: Error | { message: string };
  thirdParty: string;
  status?: number;
}

class BaseError extends Error {
  constructor(errorName: string, error: Error | { message: string }) {
    super(errorName);
    Object.setPrototypeOf(this, new.target.prototype);
    this.error = error;
  }
}

interface LambdaError extends BaseError {
  error: Error | AxiosError | { message: string; status?: number };
}
interface DiscordError {
  error: AxiosError & { error: string };
  message: string;
}

class LambdaError extends BaseError {
  constructor(error: Error | AxiosError | DiscordError | { message: string }) {
    const errorName =
      error instanceof AxiosError ? "Discord Error" : "Lambda Error";
    super(errorName, error);

    Object.setPrototypeOf(this, new.target.prototype);
    this.name = errorName;
    this.error =
      error instanceof AxiosError
        ? error.response?.data
        : (error as Error & { error: Error })?.error || error;
    Error.captureStackTrace(this, this.constructor);
  }
}

export const checkAndHandleErrors = ({ name, error, stack }: LambdaError) => {
  console.error(`[${name}]`, "\n\n", stack, "\n\n", error?.message || error);
  return generateResponse(
    (!(error instanceof Error) && error.status) || 500,
    error
  );
};

export { LambdaError };

interface IExternalErrors {
  [key: string]: string;
}

const externalErrors: IExternalErrors = {
  discord_error: "Discord Error",
  pipedrive_error: "Pipedrive Error",
  ses_error: "SES Error",
  mercadoPago_error: "Mercado Pago error",
  analytics_error: "Analytics Error",
  dynamo_error: "DynamoDb Error",
  paypal_error: "Paypal Error",
};

export class ExternalError extends BaseError {
  constructor(
    errorName: string,
    externalInfo: Error | { status: number; message: string }
  ) {
    super(errorName, externalInfo);
    const thirdPartyName = externalErrors[errorName];

    Object.setPrototypeOf(this, new.target.prototype);
    this.name = thirdPartyName || "External error";
    this.error = externalInfo;
    Error.captureStackTrace(this, this.constructor);
  }
}
