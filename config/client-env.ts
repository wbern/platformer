import joi from 'joi';

// this file should only be imported by client-side code

// based on Joi typings
interface ClientEnvVariables {
  NEXT_PUBLIC_KEY: string;
}

const objectSchema = {
  NEXT_PUBLIC_KEY: joi.string().required(),
};

// Next.js requires us to spell out every process.env variable
// for them to work (client-side only)
const variables = {
  NEXT_PUBLIC_KEY: process.env.NEXT_PUBLIC_KEY,
};

const validationSchema = joi
  .object<ClientEnvVariables>(objectSchema)
  .unknown(true);

const validation = validationSchema.validate(variables);

if (validation.error) {
  // eslint-disable-next-line no-console
  console.error(validation.error.details);

  throw new Error(validation.error.message);
}

export const clientValidatedEnv = validation?.value;
