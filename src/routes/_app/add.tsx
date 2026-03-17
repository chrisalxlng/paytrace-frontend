import { ParaglideMessage } from "@inlang/paraglide-js-react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useCreatePayrollMutation } from "../../api/useCreatePayrollMutation";
import { Button } from "../../components/Button";
import { ConsistencyConfirmDialog } from "../../components/ConsistencyConfirmDialog";
import { PayrollForm } from "../../components/PayrollForm";
import { Text } from "../../components/Text";
import { useConfirm } from "../../hooks/useConfirm";
import { toastManager } from "../../main";
import { Payroll } from "../../models";
import { m } from "../../paraglide/messages";

export const Add = () => {
  const { confirm, ...props } = useConfirm();
  const navigate = useNavigate();
  const { mutate: createPayroll } = useCreatePayrollMutation({
    onSuccess: () => {
      toastManager.add({
        title: m.payroll_added(),
        data: {
          variant: "success",
        },
      });
      navigate({ to: "/dashboard" });
    },
    onError: () => {
      toastManager.add({
        title: m.payroll_not_added(),
        data: {
          variant: "error",
        },
      });
    },
  });

  const handleSubmit = async (values: Payroll.FormValues) => {
    if (!Payroll.checkConsistency(values) && !(await confirm())) {
      return;
    }

    const payload = Payroll.toCreateRequest(values);

    createPayroll(payload);
  };

  return (
    <>
      <div className="flex flex-col gap-6 max-w-xl mx-auto">
        <Text color="subtle">
          <ParaglideMessage
            message={m.manual_payroll_message}
            inputs={{}}
            markup={{
              link: ({ children, options }) => (
                <Link to={options.to}>
                  <Text color="primary" underlined>
                    {children}
                  </Text>
                </Link>
              ),
            }}
          />
        </Text>
        <PayrollForm
          onSubmit={handleSubmit}
          buttonSlot={(isLoading) => (
            <>
              <Button
                disabled={isLoading}
                type="submit"
                className="bg-primary hover:bg-primary-darker active:bg-primary-darkest grow sm:grow-0"
              >
                <Text>{m.add_payroll()}</Text>
              </Button>
            </>
          )}
        />
      </div>
      <ConsistencyConfirmDialog {...props} confirmLabel={m.add_payroll()} />
    </>
  );
};

export const Route = createFileRoute("/_app/add")({
  component: Add,
  head: () => ({
    meta: [
      {
        title: m.page_title({ page: m.add_payroll() }),
      },
    ],
  }),
  staticData: {
    title: m.add_payroll(),
    renderFloatingButton: false,
  },
});
