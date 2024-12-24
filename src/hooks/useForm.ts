import { UseFormRegister, FieldValues, RegisterOptions } from 'react-hook-form';

export type FormFieldConfig = {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  validate?: (value: any) => boolean | string;
};

export function createFormConfig<T extends FieldValues>(
  register: UseFormRegister<T>,
  fieldName: keyof T,
  config: FormFieldConfig = {}
) {
  const options: RegisterOptions = {};

  if (config.required) {
    options.required = 'Ce champ est requis';
  }

  if (config.minLength) {
    options.minLength = {
      value: config.minLength,
      message: `Minimum ${config.minLength} caractères requis`
    };
  }

  if (config.maxLength) {
    options.maxLength = {
      value: config.maxLength,
      message: `Maximum ${config.maxLength} caractères autorisés`
    };
  }

  if (config.pattern) {
    options.pattern = {
      value: config.pattern,
      message: 'Format invalide'
    };
  }

  if (config.validate) {
    options.validate = config.validate;
  }

  return register(fieldName, options);
}