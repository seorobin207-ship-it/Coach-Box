import Input from "@app/components/Input";
import ErrorMessage from "@components/Form/ErrorMessage";
import {Input as AntInput, InputProps} from "antd";
import {ChangeEvent} from "react";
import {useController, useFormContext} from "react-hook-form";

interface ITextInputFormProps extends InputProps {
  name: string;
  handleChange?: (e: string | ChangeEvent<HTMLInputElement>) => void;
  handleBlur?: (e: string | ChangeEvent<HTMLInputElement>) => void;
  disabledSpace?: boolean;
  isTypeNumber?: boolean;
  onPressEnter?: () => void;
  showTogglePassword?: boolean;
}

function hasWhiteSpace(s: string) {
  return /\s/.test(s);
}

export default function TextInputForm(props: ITextInputFormProps) {
  const {
    name,
    isTypeNumber,
    onPressEnter,
    type,
    showTogglePassword = true,
  } = props;

  const {control} = useFormContext();

  const {field, formState} = useController({
    control,
    name,
  });

  const isPassword = type === "password";

  const CommonInputProps = {
    value: field.value ?? "",
    onChange: (text: any) => {
      if (props?.disabledSpace) {
        if (hasWhiteSpace(text.target.value)) return;
      }

      if (isTypeNumber) {
        const valueInput = text.target.value;
        const regex = /^[0-9\b]+$/;
        if (!regex.test(valueInput) && valueInput) return;
      }

      field.onChange(text);
      props.handleChange?.(text);
    },
    onBlur: field.onBlur,
    onKeyPress: (e: any) => {
      if (onPressEnter && e.charCode === 13) onPressEnter();
      if (isTypeNumber && [45, 46, 43].includes(e.charCode)) {
        e.preventDefault();
      }
    },
    ...props,
  };

  return (
    <>
      {isPassword ? (
        <AntInput.Password
          {...CommonInputProps}
          visibilityToggle={showTogglePassword}
        />
      ) : (
        <Input {...CommonInputProps} />
      )}

      <ErrorMessage>
        {formState.errors?.[name]?.message?.toString()}
      </ErrorMessage>
    </>
  );
}
