import joi from "joi";

// this file should only be imported by server-side rendering code
interface ServerEnvVariables {
  MY_SECRET_KEY: string;
  NEXT_PUBLIC_KEY: string;
}

const validationSchema = joi
  .object<ServerEnvVariables>({
    MY_SECRET_KEY: joi.string().required(),
    NEXT_PUBLIC_KEY: joi.string().required(),
  })
  .unknown(true);

const validation = validationSchema.validate(process.env);

if (validation.error) {
  // eslint-disable-next-line no-console
  console.error(validation.error.details);

  throw new Error(validation.error.message);
}

export const serverValidatedEnv = validation.value;
