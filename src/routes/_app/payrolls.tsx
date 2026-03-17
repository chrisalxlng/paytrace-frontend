import { RiCloseLine, RiErrorWarningLine } from "@remixicon/react";
import {
  useSuspenseInfiniteQuery,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import classNames from "classnames";
import { isEmpty, isNil } from "lodash-es";
import { payrollQueries } from "../../api/payroll.queries";
import { Button } from "../../components/Button";
import { EmptyState } from "../../components/EmptyState";
import { IconContainer } from "../../components/IconContainer";
import { List } from "../../components/List";
import { ListItem } from "../../components/ListItem";
import { Message } from "../../components/Message";
import { Text } from "../../components/Text";
import { Payroll } from "../../models";
import { m } from "../../paraglide/messages";
import {
  currencyFormatter,
  yearMonthFormatter,
} from "../../shared/utils/formatters";

export const Payrolls = () => {
  const { consistent } = Route.useSearch();

  const { data: hasInconsistentEntries } = useSuspenseQuery(
    payrollQueries.hasInconsistent(),
  );

  const { data, hasNextPage, fetchNextPage } = useSuspenseInfiniteQuery(
    payrollQueries.getMultiple({
      ...Payroll.getMultipleQueryPayload(),
      consistent,
    }),
  );

  const years = data.pages.flatMap((page) => page.years);

  const isInconsistentFilterActive = !isNil(consistent);

  const buildLabel = (year: string, sum: number, count: number) => {
    const formattedSum = currencyFormatter.format(sum);
    const formattedCount = m.n_payrolls({ count });

    return [year, formattedSum, formattedCount].join(" • ");
  };

  const buildListItemTitleSlot = (period: string) => (
    <Text>{yearMonthFormatter.format(period)}</Text>
  );

  const buildListItemSupportingSlot = (consistent: boolean, payout: number) => (
    <div
      className={classNames("flex gap-2 min-w-24 items-center", {
        "justify-between": !consistent,
        "justify-end": consistent,
      })}
    >
      {!consistent && (
        <IconContainer color="yellow">
          <RiErrorWarningLine className="size-4" />
        </IconContainer>
      )}
      <Text color="subtle">{currencyFormatter.format(payout)}</Text>
    </div>
  );

  const buildList = () => (
    <div className="flex flex-col gap-8 mx-auto w-full max-w-2xl">
      {hasInconsistentEntries && !isInconsistentFilterActive && (
        <Link to="." search={{ consistent: false }}>
          <Message
            variant="warning"
            message={m.inconsistent_data_message()}
            interactive
          />
        </Link>
      )}
      {isInconsistentFilterActive && (
        <Link to=".">
          <Message
            variant="info"
            message={m.inconsistent_data_filter_message()}
            interactive
            icon={<RiCloseLine className="size-4" />}
          />
        </Link>
      )}
      {years.map((year) => (
        <div key={year.year} className="flex flex-col gap-4">
          <Text color="subtle">
            {buildLabel(year.year, year.sum, year.count)}
          </Text>
          <List>
            {year.entries.map((entry) => (
              <Link
                key={entry.payrollId}
                to="/payroll/$payrollId"
                params={{ payrollId: entry.payrollId }}
              >
                <ListItem
                  titleSlot={buildListItemTitleSlot(entry.accountingPeriod)}
                  supportingSlot={buildListItemSupportingSlot(
                    entry.consistencyDeviation === 0,
                    entry.payout,
                  )}
                  interactive
                />
              </Link>
            ))}
          </List>
        </div>
      ))}
      {hasNextPage && (
        <Button
          className="self-center bg-primary hover:bg-primary-darker active:bg-primary-darkest grow sm:grow-0"
          onClick={() => fetchNextPage()}
        >
          <Text>{m.load_more()}</Text>
        </Button>
      )}
    </div>
  );

  const buildContent = () => {
    if (isEmpty(years))
      return (
        <div className="flex items-center justify-center h-full w-full">
          <EmptyState
            title={m.no_payrolls()}
            description={m.no_payrolls_message()}
            actionSlot={
              <Link to="/upload">
                <Button className="bg-primary hover:bg-primary-darker active:bg-primary-darkest">
                  <Text>{m.add_payroll()}</Text>
                </Button>
              </Link>
            }
          />
        </div>
      );
    return buildList();
  };

  return <div className="h-full w-full overflow-auto">{buildContent()}</div>;
};

type SearchParams = {
  consistent?: false;
};

export const Route = createFileRoute("/_app/payrolls")({
  loaderDeps: ({ search: { consistent } }) => ({ consistent }),
  loader: ({ context: { queryClient }, deps: { consistent } }) =>
    Promise.all([
      queryClient.fetchInfiniteQuery(
        payrollQueries.getMultiple({
          ...Payroll.getMultipleQueryPayload(),
          consistent,
        }),
      ),
      queryClient.ensureQueryData(payrollQueries.hasInconsistent()),
    ]),
  component: Payrolls,
  validateSearch: (search: Record<string, unknown>): SearchParams => ({
    consistent: isNil(search.consistent) ? undefined : false,
  }),
  head: () => ({
    meta: [
      {
        title: m.page_title({ page: m.my_payrolls() }),
      },
    ],
  }),
  staticData: {
    title: m.my_payrolls(),
  },
});
