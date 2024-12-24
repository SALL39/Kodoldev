import { FieldValues, UseFormRegister } from 'react-hook-form';

export function getFieldError(fieldName: string, errors: Record<string, any>) {
  return errors[fieldName]?.message;
}

export function createFormField<T extends FieldValues>(
  register: UseFormRegister<T>,
  name: keyof T,
  options = {}
) {
  return register(name, options);
}