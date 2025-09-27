// Mock para @hookform/resolvers
export const zodResolver = jest.fn(() => jest.fn());
export const yupResolver = jest.fn(() => jest.fn());
export const joiResolver = jest.fn(() => jest.fn());
export const ajvResolver = jest.fn(() => jest.fn());
export const superstructResolver = jest.fn(() => jest.fn());
export const vestResolver = jest.fn(() => jest.fn());
export const classValidatorResolver = jest.fn(() => jest.fn());
export const typeboxResolver = jest.fn(() => jest.fn());

export default {
  zodResolver,
  yupResolver,
  joiResolver,
  ajvResolver,
  superstructResolver,
  vestResolver,
  classValidatorResolver,
  typeboxResolver,
};
