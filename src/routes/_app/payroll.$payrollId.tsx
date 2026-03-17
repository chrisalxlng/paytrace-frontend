import { RiDeleteBinLine } from "@remixicon/react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { payrollQueries } from "../../api/payroll.queries";
import { useDeletePayrollMutation } from "../../api/useDeletePayrollMutation";
import { useUpdatePayrollMutation } from "../../api/useUpdatePayrollMutation";
import { Button } from "../../components/Button";
import { ConfirmDialog } from "../../components/ConfirmDialog";
import { ConsistencyConfirmDialog } from "../../components/ConsistencyConfirmDialog";
import { Message } from "../../components/Message";
import { PayrollForm } from "../../components/PayrollForm";
import { Text } from "../../components/Text";
import { useConfirm } from "../../hooks/useConfirm";
import { toastManager } from "../../main";
import { Payroll } from "../../models";
import { m } from "../../paraglide/messages";
import { currencyFormatter } from "../../shared/utils/formatters";

export const PayrollComponent = () => {
  const { payrollId } = Route.useParams();
  const { data } = useSuspenseQuery(payrollQueries.getById(payrollId));
  const { consistencyDeviation } = data;
  const { confirm, ...props } = useConfirm();
  const navigate = useNavigate();
  const { mutate: updatePayroll } = useUpdatePayrollMutation({
    onSuccess: () => {
      toastManager.add({
        title: m.payroll_updated(),
        data: {
          variant: "success",
        },
      });
      navigate({ to: "/payrolls" });
    },
    onError: () => {
      toastManager.add({
        title: m.payroll_not_updated(),
        data: {
          variant: "error",
        },
      });
    },
  });
  const { mutate: deletePayroll } = useDeletePayrollMutation({
    onSuccess: () => {
      toastManager.add({
        title: m.payroll_deleted(),
        data: {
          variant: "success",
        },
      });
      navigate({ to: "/payrolls" });
    },
    onError: () => {
      toastManager.add({
        title: m.payroll_not_deleted(),
        data: {
          variant: "error",
        },
      });
    },
  });

  const formValues = Payroll.toFormValues(data);

  const handleSubmit = async (values: Payroll.FormValues) => {
    if (!Payroll.checkConsistency(values) && !(await confirm())) {
      return;
    }

    const payload = Payroll.toUpdateRequest(payrollId, values);

    updatePayroll(payload);
  };

  const handleDelete = async () => {
    deletePayroll({ payrollId });
  };

  return (
    <>
      <div className="w-full flex flex-col gap-6 max-w-xl mx-auto">
        {consistencyDeviation !== 0 && (
          <Message
            variant="warning"
            message={m.data_differs_from_payout({
              value:
                currencyFormatter.formatFractionDigits(consistencyDeviation),
            })}
          />
        )}
        <PayrollForm
          initialValues={formValues}
          onSubmit={handleSubmit}
          buttonSlot={(isLoading) => (
            <>
              <ConfirmDialog
                triggerSlot={
                  <Button
                    className="bg-red-dark hover:bg-red-darker active:bg-red-darkest"
                    disabled={isLoading}
                  >
                    <RiDeleteBinLine className="text-red" size={16} />
                  </Button>
                }
                titleSlot={
                  <Text variant="title">{m.confirm_delete_payroll()}</Text>
                }
                descriptionSlot={
                  <Text color="subtle">
                    {m.confirm_delete_payroll_message()}
                  </Text>
                }
                confirmSlot={
                  <Button
                    className="bg-red-dark hover:bg-red-darker active:bg-red-darkest"
                    onClick={handleDelete}
                  >
                    <Text color="red">{m.delete_payroll()}</Text>
                  </Button>
                }
                cancelSlot={
                  <Button className="hover:bg-subtle-darker active:bg-subtle-darkest">
                    <Text color="subtle">{m.cancel()}</Text>
                  </Button>
                }
              />
              <Button
                disabled={isLoading}
                type="submit"
                className="bg-primary hover:bg-primary-darker active:bg-primary-darkest grow sm:grow-0"
              >
                <Text>{m.update_payroll()}</Text>
              </Button>
            </>
          )}
        />
      </div>
      <ConsistencyConfirmDialog {...props} confirmLabel={m.update_payroll()} />
    </>
  );
};

export const Route = createFileRoute("/_app/payroll/$payrollId")({
  component: PayrollComponent,
  loader: ({ context: { queryClient }, params: { payrollId } }) =>
    queryClient.ensureQueryData(payrollQueries.getById(payrollId)),
  head: () => ({
    meta: [
      {
        title: m.page_title({ page: m.update_payroll() }),
      },
    ],
  }),
  staticData: {
    title: m.update_payroll(),
    renderFloatingButton: false,
  },
});
