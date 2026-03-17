import { type NumberFormatValues, PatternFormat } from "react-number-format";
import { useLocale } from "../../hooks/useLocale";
import { BULLET } from "../../shared/constants/characters";
import type { Emptyable, YearMonth } from "../../shared/types/common";
import { FieldControl } from "./FieldControl";

type YearMonthInputProps = {
  className?: string;
  autoFocus?: boolean;
  readOnly?: boolean;
  value?: Emptyable<YearMonth>;
  onChange?: (value: Emptyable<YearMonth>) => void;
};

export const YearMonthInput = ({
  value,
  onChange,
  className,
  autoFocus,
  readOnly,
}: YearMonthInputProps) => {
  const locale = useLocale();

  const getLocaleFormat = () => {
    const testDate = new Date(2026, 9, 1);
    const parts = new Intl.DateTimeFormat(locale, {
      month: "2-digit",
      year: "numeric",
    }).formatToParts(testDate);

    let pattern = "";
    let placeholder = "";
    const structure: ("month" | "year")[] = [];

    parts.forEach((part) => {
      if (part.type === "month") {
        pattern += "##";
        placeholder += BULLET.repeat(2);
        structure.push("month");
      } else if (part.type === "year") {
        pattern += "####";
        placeholder += BULLET.repeat(4);
        structure.push("year");
      } else if (part.type === "literal") {
        pattern += part.value;
        placeholder += part.value;
      }
    });

    return { pattern, placeholder, structure };
  };

  const { pattern, placeholder, structure } = getLocaleFormat();

  const displayValue = value?.includes("-")
    ? (() => {
        const [y, m] = value.split("-");
        return structure[0] === "month" ? `${m}${y}` : `${y}${m}`;
      })()
    : value;

  const handleValueChange = (values: NumberFormatValues) => {
    const raw = values.value;

    if (raw.length === 6) {
      let year = "";
      let month = "";

      if (structure[0] === "month") {
        month = raw.substring(0, 2);
        year = raw.substring(2, 6);
      } else {
        year = raw.substring(0, 4);
        month = raw.substring(4, 6);
      }

      onChange?.(`${year}-${month}` as YearMonth);
    } else if (raw === "") {
      onChange?.("");
    }
  };

  const isAllowed = (values: NumberFormatValues) => {
    const { value: rawValue } = values;
    if (!rawValue) return true;

    let monthPart = "";
    if (structure[0] === "month") {
      monthPart = rawValue.substring(0, 2);
    } else {
      monthPart = rawValue.substring(4, 6);
    }

    if (monthPart.length === 0) return true;

    if (monthPart.length === 1 && parseInt(monthPart, 10) > 1) {
      return false;
    }

    if (monthPart.length === 2) {
      const m = parseInt(monthPart, 10);
      if (m < 1 || m > 12) return false;
    }

    return true;
  };

  return (
    <PatternFormat
      className={className}
      readOnly={readOnly}
      autoFocus={autoFocus}
      customInput={FieldControl}
      format={pattern}
      mask={BULLET}
      placeholder={placeholder}
      value={displayValue}
      isAllowed={isAllowed}
      onValueChange={handleValueChange}
      inputMode="numeric"
    />
  );
};
