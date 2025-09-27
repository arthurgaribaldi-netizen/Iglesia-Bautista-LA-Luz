// Mock para react-hook-form
export const useForm = jest.fn(() => ({
  register: jest.fn(),
  handleSubmit: jest.fn((fn) => (e) => {
    e?.preventDefault();
    return fn({});
  }),
  formState: {
    errors: {},
    isSubmitting: false,
    isValid: true,
    isDirty: false,
    touchedFields: {},
    dirtyFields: {},
  },
  watch: jest.fn(),
  setValue: jest.fn(),
  getValues: jest.fn(() => ({})),
  reset: jest.fn(),
  clearErrors: jest.fn(),
  setError: jest.fn(),
  trigger: jest.fn(),
  control: {},
  unregister: jest.fn(),
}));

export const useFormContext = jest.fn(() => ({
  register: jest.fn(),
  handleSubmit: jest.fn(),
  formState: { errors: {} },
  watch: jest.fn(),
  setValue: jest.fn(),
  getValues: jest.fn(() => ({})),
  reset: jest.fn(),
  clearErrors: jest.fn(),
  setError: jest.fn(),
  trigger: jest.fn(),
  control: {},
}));

export const useController = jest.fn(() => ({
  field: {
    onChange: jest.fn(),
    onBlur: jest.fn(),
    value: '',
    name: 'test',
    ref: jest.fn(),
  },
  fieldState: {
    invalid: false,
    isTouched: false,
    isDirty: false,
    error: undefined,
  },
  formState: {
    isSubmitting: false,
    isValid: true,
  },
}));

export const useWatch = jest.fn(() => ({}));

export const useFieldArray = jest.fn(() => ({
  fields: [],
  append: jest.fn(),
  prepend: jest.fn(),
  insert: jest.fn(),
  swap: jest.fn(),
  move: jest.fn(),
  update: jest.fn(),
  replace: jest.fn(),
  remove: jest.fn(),
}));

export const Controller = ({ render }: { render: (props: any) => React.ReactNode }) => 
  render({
    field: {
      onChange: jest.fn(),
      onBlur: jest.fn(),
      value: '',
      name: 'test',
      ref: jest.fn(),
    },
    fieldState: {
      invalid: false,
      isTouched: false,
      isDirty: false,
      error: undefined,
    },
    formState: {
      isSubmitting: false,
      isValid: true,
    },
  });

export const FormProvider = ({ children }: { children: React.ReactNode }) => children;

export const useFormState = jest.fn(() => ({
  errors: {},
  isSubmitting: false,
  isValid: true,
  isDirty: false,
  touchedFields: {},
  dirtyFields: {},
}));

export const useFormError = jest.fn(() => undefined);

export const useFormField = jest.fn(() => ({
  field: {
    onChange: jest.fn(),
    onBlur: jest.fn(),
    value: '',
    name: 'test',
    ref: jest.fn(),
  },
  fieldState: {
    invalid: false,
    isTouched: false,
    isDirty: false,
    error: undefined,
  },
  formState: {
    isSubmitting: false,
    isValid: true,
  },
}));

export default {
  useForm,
  useFormContext,
  useController,
  useWatch,
  useFieldArray,
  Controller,
  FormProvider,
  useFormState,
  useFormError,
  useFormField,
};
