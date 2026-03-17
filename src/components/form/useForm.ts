import { isNil, omit } from "lodash-es";
import { useState } from "react";
import { z } from "zod";
import type { FormProps } from "./Form";

type FormValidationMode = "onChange" | "onSubmit";

type UseFormArgs<T extends z.ZodRawShape> = {
  schema?: z.ZodObject<T>;
  onSubmit?: (values: z.infer<z.ZodObject<T>>) => void;
  initialValues?: Partial<z.infer<z.ZodObject<T>>>;
  validationMode?: FormValidationMode;
};

type FormValues<T extends z.ZodRawShape> = z.infer<z.ZodObject<T>>;

type FormErrors = Record<string, string[]>;

export const useForm = <T extends z.ZodRawShape>(args?: UseFormArgs<T>) => {
  const {
    schema,
    onSubmit,
    initialValues,
    validationMode = "onSubmit",
  } = args ?? {};

  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<Partial<FormValues<T>>>(initialValues ?? {});

  const validateField = async (
    fieldName: keyof FormValues<T>,
    values: Partial<FormValues<T>>,
  ) => {
    if (!schema) return;

    const { error } = await schema.safeParseAsync(values);
    if (isNil(error)) return;

    const fieldErrors = z.flattenError(error).fieldErrors ?? {};
    const fieldError = fieldErrors[fieldName];

    if (isNil(fieldError)) {
      setErrors((prev) => omit(prev, fieldName));
    } else {
      setErrors((prev) => ({
        ...prev,
        [fieldName]: fieldErrors[fieldName] ?? [],
      }));
    }
  };

  const validateForm = async (values: Partial<FormValues<T>>) => {
    if (!schema) return true;

    const result = await schema.safeParseAsync(values);
    if (!result.success) {
      setErrors((z.flattenError(result.error).fieldErrors ?? {}) as FormErrors);
      return false;
    }
    setErrors({});
    return true;
  };

  const handleFieldChange = <K extends keyof FormValues<T>>(
    fieldName: K,
    value: FormValues<T>[K],
  ) => {
    setData((prev) => {
      const newData = {
        ...prev,
        [fieldName]: value,
      };
      if (validationMode === "onChange") {
        validateField(fieldName, newData);
      }
      return newData;
    });
  };

  const setFieldError = <K extends keyof FormValues<T>>(
    fieldName: K,
    error: string,
  ) => {
    setErrors({
      ...errors,
      [fieldName]: [error],
    });
  };

  const handleSubmit = async () => {
    try {
      setIsLoading(true);

      const isValid = await validateForm(data);
      if (!isValid) return;

      onSubmit?.(data as FormValues<T>);
    } finally {
      setIsLoading(false);
    }
  };

  const props: FormProps = {
    errors,
    onFormSubmit: handleSubmit as (values: unknown) => void,
  };

  return {
    isLoading,
    errors,
    props,
    data,
    setFieldValue: handleFieldChange,
    setFieldError,
  };
};
