import { isNil } from "lodash-es";
import type { ReactElement } from "react";
import { Payroll } from "../models";
import { m } from "../paraglide/messages";
import type { YearMonth } from "../shared/types/common";
import { CurrencyInput } from "./form/CurrencyInput";
import { FieldError } from "./form/FieldError";
import { FieldLabel } from "./form/FieldLabel";
import { FieldRoot } from "./form/FieldRoot";
import { Form } from "./form/Form";
import { useForm } from "./form/useForm";
import { YearMonthInput } from "./form/YearMonthInput";
import { Text } from "./Text";

type PayrollFormProps = {
  buttonSlot?: (isLoading: boolean) => ReactElement;
  initialValues?: Payroll.FormValues;
  onSubmit: (values: Payroll.FormValues) => void;
};

export const PayrollForm = ({
  buttonSlot,
  onSubmit,
  initialValues,
}: PayrollFormProps) => {
  const { props, isLoading, data, setFieldValue } = useForm({
    schema: Payroll.FORM_SCHEMA(initialValues),
    onSubmit,
    initialValues: Payroll.getFormValues(initialValues),
    validationMode: "onChange",
  });

  const buildSection = (title: string, fields: ReactElement) => (
    <div className="flex flex-col gap-2 w-full">
      <Text variant="heading">{title}</Text>
      <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-2">
        {fields}
      </div>
    </div>
  );

  return (
    <Form className="w-full flex flex-col gap-10" {...props}>
      {buildSection(
        m.general(),
        <>
          <FieldRoot name="accountingPeriod">
            <FieldLabel>{m.accounting_period()}</FieldLabel>
            <YearMonthInput
              className="w-full"
              readOnly={!isNil(initialValues?.accountingPeriod)}
              autoFocus
              value={data.accountingPeriod as YearMonth | undefined}
              onChange={(value) => {
                setFieldValue("accountingPeriod", value);
              }}
            />
            <FieldError />
          </FieldRoot>
          <FieldRoot name="payout">
            <FieldLabel>{m.payout()}</FieldLabel>
            <CurrencyInput
              className="w-full"
              value={data.payout as number | undefined}
              onChange={(value) => setFieldValue("payout", value)}
            />
            <FieldError />
          </FieldRoot>
        </>,
      )}
      {buildSection(
        m.base_amounts(),
        <>
          <FieldRoot name="baseSalary">
            <FieldLabel>{m.salary()}</FieldLabel>
            <CurrencyInput
              className="w-full"
              value={data.baseSalary}
              onChange={(value) => setFieldValue("baseSalary", value)}
            />
            <FieldError />
          </FieldRoot>
          <FieldRoot name="baseIncomeTax">
            <FieldLabel>{m.income_tax()}</FieldLabel>
            <CurrencyInput
              className="w-full"
              value={data.baseIncomeTax}
              onChange={(value) => setFieldValue("baseIncomeTax", value)}
            />
            <FieldError />
          </FieldRoot>
          <FieldRoot name="baseChurchTax">
            <FieldLabel>{m.church_tax()}</FieldLabel>
            <CurrencyInput
              className="w-full"
              value={data.baseChurchTax}
              onChange={(value) => setFieldValue("baseChurchTax", value)}
            />
            <FieldError />
          </FieldRoot>
          <FieldRoot name="baseSolidaritySurcharge">
            <FieldLabel>{m.solidarity_surcharge()}</FieldLabel>
            <CurrencyInput
              className="w-full"
              value={data.baseSolidaritySurcharge}
              onChange={(value) =>
                setFieldValue("baseSolidaritySurcharge", value)
              }
            />
            <FieldError />
          </FieldRoot>
          <FieldRoot name="baseHealthInsurance">
            <FieldLabel>{m.health_insurance()}</FieldLabel>
            <CurrencyInput
              className="w-full"
              value={data.baseHealthInsurance}
              onChange={(value) => setFieldValue("baseHealthInsurance", value)}
            />
            <FieldError />
          </FieldRoot>
          <FieldRoot name="basePensionInsurance">
            <FieldLabel>{m.pension_insurance()}</FieldLabel>
            <CurrencyInput
              className="w-full"
              value={data.basePensionInsurance}
              onChange={(value) => setFieldValue("basePensionInsurance", value)}
            />
            <FieldError />
          </FieldRoot>
          <FieldRoot name="baseUnemploymentInsurance">
            <FieldLabel>{m.unemployment_insurance()}</FieldLabel>
            <CurrencyInput
              className="w-full"
              value={data.baseUnemploymentInsurance}
              onChange={(value) =>
                setFieldValue("baseUnemploymentInsurance", value)
              }
            />
            <FieldError />
          </FieldRoot>
          <FieldRoot name="baseLongTermCareInsurance">
            <FieldLabel>{m.long_term_care_insurance()}</FieldLabel>
            <CurrencyInput
              className="w-full"
              value={data.baseLongTermCareInsurance}
              onChange={(value) =>
                setFieldValue("baseLongTermCareInsurance", value)
              }
            />
            <FieldError />
          </FieldRoot>
        </>,
      )}
      {buildSection(
        m.bonus_amounts(),
        <>
          <FieldRoot name="bonusSalary">
            <FieldLabel>{m.salary()}</FieldLabel>
            <CurrencyInput
              className="w-full"
              value={data.bonusSalary}
              onChange={(value) => setFieldValue("bonusSalary", value)}
            />
            <FieldError />
          </FieldRoot>
          <FieldRoot name="bonusIncomeTax">
            <FieldLabel>{m.income_tax()}</FieldLabel>
            <CurrencyInput
              className="w-full"
              value={data.bonusIncomeTax}
              onChange={(value) => setFieldValue("bonusIncomeTax", value)}
            />
            <FieldError />
          </FieldRoot>
          <FieldRoot name="bonusChurchTax">
            <FieldLabel>{m.church_tax()}</FieldLabel>
            <CurrencyInput
              className="w-full"
              value={data.bonusChurchTax}
              onChange={(value) => setFieldValue("bonusChurchTax", value)}
            />
            <FieldError />
          </FieldRoot>
          <FieldRoot name="bonusSolidaritySurcharge">
            <FieldLabel>{m.solidarity_surcharge()}</FieldLabel>
            <CurrencyInput
              className="w-full"
              value={data.bonusSolidaritySurcharge}
              onChange={(value) =>
                setFieldValue("bonusSolidaritySurcharge", value)
              }
            />
            <FieldError />
          </FieldRoot>
          <FieldRoot name="bonusHealthInsurance">
            <FieldLabel>{m.health_insurance()}</FieldLabel>
            <CurrencyInput
              className="w-full"
              value={data.bonusHealthInsurance}
              onChange={(value) => setFieldValue("bonusHealthInsurance", value)}
            />
            <FieldError />
          </FieldRoot>
          <FieldRoot name="bonusPensionInsurance">
            <FieldLabel>{m.pension_insurance()}</FieldLabel>
            <CurrencyInput
              className="w-full"
              value={data.bonusPensionInsurance}
              onChange={(value) =>
                setFieldValue("bonusPensionInsurance", value)
              }
            />
            <FieldError />
          </FieldRoot>
          <FieldRoot name="bonusUnemploymentInsurance">
            <FieldLabel>{m.unemployment_insurance()}</FieldLabel>
            <CurrencyInput
              className="w-full"
              value={data.bonusUnemploymentInsurance}
              onChange={(value) =>
                setFieldValue("bonusUnemploymentInsurance", value)
              }
            />
            <FieldError />
          </FieldRoot>
          <FieldRoot name="bonusLongTermCareInsurance">
            <FieldLabel>{m.long_term_care_insurance()}</FieldLabel>
            <CurrencyInput
              className="w-full"
              value={data.bonusLongTermCareInsurance}
              onChange={(value) =>
                setFieldValue("bonusLongTermCareInsurance", value)
              }
            />
            <FieldError />
          </FieldRoot>
        </>,
      )}
      {buildSection(
        m.reimbursements_and_disbursements(),
        <>
          <FieldRoot name="reimbursements">
            <FieldLabel>{m.reimbursements()}</FieldLabel>
            <CurrencyInput
              className="w-full"
              value={data.reimbursements}
              onChange={(value) => setFieldValue("reimbursements", value)}
            />
            <FieldError />
          </FieldRoot>
          <FieldRoot name="disbursements">
            <FieldLabel>{m.disbursements()}</FieldLabel>
            <CurrencyInput
              className="w-full"
              value={data.disbursements}
              onChange={(value) => setFieldValue("disbursements", value)}
            />
            <FieldError />
          </FieldRoot>
        </>,
      )}
      <div className="flex gap-4 justify-end items-center">
        {buttonSlot?.(isLoading)}
      </div>
    </Form>
  );
};
