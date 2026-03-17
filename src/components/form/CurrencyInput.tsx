import { NumericFormat } from "react-number-format";
import { useLocale } from "../../hooks/useLocale";
import { FieldControl } from "./FieldControl";

type CurrencyInputProps = {
  className?: string;
  value?: number;
  onChange?: (value: number) => void;
};

export const CurrencyInput = ({
  value,
  onChange,
  className,
}: CurrencyInputProps) => {
  const locale = useLocale();

  const getCurrencyConfig = (loc: string) => {
    const formatter = new Intl.NumberFormat(loc, {
      style: "currency",
      currency: "EUR",
    });
    const parts = formatter.formatToParts(1111.11);

    const decimalSeparator =
      parts.find((p) => p.type === "decimal")?.value || ",";
    const thousandSeparator =
      parts.find((p) => p.type === "group")?.value || ".";

    const symbolIndex = parts.findIndex((p) => p.type === "currency");
    const literalBefore =
      parts[symbolIndex - 1]?.type === "literal"
        ? parts[symbolIndex - 1].value
        : "";
    const literalAfter =
      parts[symbolIndex + 1]?.type === "literal"
        ? parts[symbolIndex + 1].value
        : "";

    const prefix = symbolIndex === 0 ? `€${literalAfter}` : "";
    const suffix = symbolIndex > 0 ? `${literalBefore}€` : "";

    const placeholder = formatter.format(0).replace(/\d/g, "0");

    return { decimalSeparator, thousandSeparator, prefix, suffix, placeholder };
  };

  const { decimalSeparator, thousandSeparator, prefix, suffix, placeholder } =
    getCurrencyConfig(locale);

  return (
    <NumericFormat
      className={className}
      customInput={FieldControl}
      prefix={prefix}
      suffix={suffix}
      thousandSeparator={thousandSeparator}
      decimalSeparator={decimalSeparator}
      decimalScale={2}
      fixedDecimalScale
      allowNegative={false}
      value={value}
      placeholder={placeholder}
      onValueChange={(values) => {
        onChange?.(Number(values.value));
      }}
      inputMode="decimal"
    />
  );
};
