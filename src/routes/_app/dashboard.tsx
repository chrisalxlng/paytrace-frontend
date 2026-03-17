import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { groupBy } from "lodash-es";
import type { ReactNode } from "react";
import { payrollQueries } from "../../api/payroll.queries";
import { Button } from "../../components/Button";
import { EmptyState } from "../../components/EmptyState";
import { Message } from "../../components/Message";
import { AllTimeTotalCard } from "../../components/stat-cards/AllTimeTotalCard";
import { FiveYearTrendCard } from "../../components/stat-cards/FiveYearTrendCard";
import { RollingAverageCard } from "../../components/stat-cards/RollingAverageCard";
import { RollingPerfomanceCard } from "../../components/stat-cards/RollingPerfomanceCard";
import { Text } from "../../components/Text";
import { Chart, Payroll } from "../../models";
import { m } from "../../paraglide/messages";
import { STAT_CHARTS } from "../../shared/constants/charts";
import type { StatCategory } from "../../shared/types/charts";

const Dashboard = () => {
  const { data } = useSuspenseQuery(
    payrollQueries.stats(Payroll.getStatsPayload(STAT_CHARTS)),
  );
  const { data: hasInconsistentEntries } = useSuspenseQuery(
    payrollQueries.hasInconsistent(),
  );

  const chartData = STAT_CHARTS.map((chart, index) => {
    let hasSufficientData = false;
    let buildChart = null;

    if (chart.chartType === "ALL_TIME_TOTAL") {
      hasSufficientData = Chart.hasSufficientAllTimeTotalData(data[index]);
      buildChart = () => (
        <AllTimeTotalCard
          key={`${chart.metric}-${chart.chartType}`}
          title={chart.title}
          data={Chart.toAllTimeTotal(data[index])}
        />
      );
    } else if (chart.chartType === "FIVE_YEAR_TREND") {
      hasSufficientData = Chart.hasSufficientFiveYearTrendData(data[index]);
      buildChart = () => (
        <FiveYearTrendCard
          key={`${chart.metric}-${chart.chartType}`}
          title={chart.title}
          data={Chart.toFiveYearTrend(data[index])}
        />
      );
    } else if (chart.chartType === "ROLLING_AVERAGE") {
      hasSufficientData = Chart.hasSufficientRollingAverageData(data[index]);
      buildChart = () => (
        <RollingAverageCard
          key={`${chart.metric}-${chart.chartType}`}
          title={chart.title}
          data={Chart.toRollingAverage(data[index])}
        />
      );
    } else if (chart.chartType === "ROLLING_PERFORMANCE") {
      hasSufficientData = Chart.hasSufficientRollingPerformanceData(
        data[index],
      );
      buildChart = () => (
        <RollingPerfomanceCard
          key={`${chart.metric}-${chart.chartType}`}
          title={chart.title}
          data={Chart.toRollingPerformance(data[index])}
        />
      );
    } else {
      throw new Error("Unexpected chart type");
    }

    return {
      ...chart,
      hasSufficientData,
      buildChart,
    };
  });

  const groupedChartData = groupBy(chartData, (item) => item.category);

  const buildSection = (title: string, charts: ReactNode) => (
    <div className="flex flex-col gap-2">
      <div className="px-4 mx-auto w-full max-w-7xl">
        <Text color="subtle">{title}</Text>
      </div>
      <div className="mx-auto grid w-full max-w-7xl grid-cols-1 gap-4 lg:grid-cols-2 md:px-2 lg:px-4">
        {charts}
      </div>
    </div>
  );

  const getData = (category: StatCategory) => groupedChartData[category] ?? [];

  const hasSufficientData = chartData.some((item) => item.hasSufficientData);
  const hasInsufficientData = chartData.some((item) => !item.hasSufficientData);
  const hasSufficientIncomeData = getData("INCOME").some(
    (item) => item.hasSufficientData,
  );
  const hasSufficientDeductionsData = getData("DEDUCTIONS").some(
    (item) => item.hasSufficientData,
  );
  const hasSufficientBonusData = getData("BONUS").some(
    (item) => item.hasSufficientData,
  );

  if (!hasSufficientData) {
    return (
      <div className="flex items-center justify-center h-full w-full">
        <EmptyState
          title={m.insufficient_data()}
          description={m.insufficient_data_message()}
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
  }

  return (
    <div className="flex flex-col gap-10">
      {hasInconsistentEntries && (
        <div className="px-4 mx-auto w-full max-w-7xl">
          <Link to="/payrolls" search={{ consistent: false }}>
            <Message
              variant="warning"
              message={m.inconsistent_data_message()}
              interactive
            />
          </Link>
        </div>
      )}
      {hasSufficientIncomeData &&
        buildSection(
          m.income(),
          getData("INCOME").map(
            (item) => item.hasSufficientData && item.buildChart(),
          ),
        )}
      {hasSufficientDeductionsData &&
        buildSection(
          m.deductions(),
          getData("DEDUCTIONS").map(
            (item) => item.hasSufficientData && item.buildChart(),
          ),
        )}
      {hasSufficientBonusData &&
        buildSection(
          m.bonus(),
          getData("BONUS").map(
            (item) => item.hasSufficientData && item.buildChart(),
          ),
        )}
      {hasInsufficientData && (
        <div className="flex items-center justify-center w-full">
          <EmptyState
            title={m.insufficient_data()}
            description={m.still_insufficient_data_message()}
          />
        </div>
      )}
    </div>
  );
};

export const Route = createFileRoute("/_app/dashboard")({
  loader: ({ context: { queryClient } }) =>
    Promise.all([
      queryClient.ensureQueryData(
        payrollQueries.stats(Payroll.getStatsPayload(STAT_CHARTS)),
      ),
      queryClient.ensureQueryData(payrollQueries.hasInconsistent()),
    ]),
  component: Dashboard,
  head: () => ({
    meta: [
      {
        title: m.page_title({ page: m.dashboard() }),
      },
    ],
  }),
  staticData: {
    title: m.dashboard(),
    inset: "vertical",
  },
});
