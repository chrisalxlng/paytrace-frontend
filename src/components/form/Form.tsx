import {
  Form as BaseForm,
  type FormProps as BaseFormProps,
} from "@base-ui/react";

export type FormProps = BaseFormProps;

export const Form = (props: FormProps) => <BaseForm {...props} />;
