import { isNil } from "lodash-es";
import { Bar, BarChart, Tooltip, XAxis, YAxis } from "recharts";
import type { Chart } from "../../models";
import { m } from "../../paraglide/messages";
import {
  currencyFormatter,
  yearMonthFormatter,
} from "../../shared/utils/formatters";
import { CHART_TICK_OPTIONS } from "./constants";
import { StatCard } from "./StatCard";
import { useStatInteraction } from "./useStatInteraction";

type RollingAverageCardProps = {
  title: string;
  data: Chart.RollingAverage;
};

export const RollingAverageCard = ({
  title,
  data,
}: RollingAverageCardProps) => {
  const formattedData: Chart.RollingAverageMonth[] = data.months.map((d) => ({
    ...d,
    yearMonth: yearMonthFormatter.format(d.yearMonth) as string,
  }));

  const { activeIndex, props } = useStatInteraction();

  const first = data.months.at(0);
  const last = data.months.at(-1);
  const active = isNil(activeIndex) ? null : data.months.at(activeIndex);

  const activeYearMonth = active?.yearMonth;
  const firstYearMonth = first?.yearMonth;
  const lastYearMonth = last?.yearMonth;

  const activeValue = active?.value;

  const formattedMetric = isNil(activeValue) ? `\u2205 ${title}` : title;

  const timespan =
    yearMonthFormatter.formatShort(activeYearMonth) ??
    yearMonthFormatter.formatRangeShort(firstYearMonth, lastYearMonth) ??
    m.unknown_timespan();

  const formattedActiveValue = isNil(activeValue)
    ? null
    : currencyFormatter.format(activeValue);
  const formattedValue = currencyFormatter.format(data.average);
  const value = formattedActiveValue ?? formattedValue ?? "?";

  return (
    <StatCard title={formattedMetric} timespan={timespan} value={value}>
      <BarChart
        data={formattedData}
        accessibilityLayer
        barCategoryGap="10%"
        {...props}
      >
        <XAxis
          dataKey="yearMonth"
          tickLine={false}
          tickMargin={20}
          axisLine={false}
          tickFormatter={(value) => value.slice(0, 1)}
          tick={CHART_TICK_OPTIONS}
        />

        <YAxis type="number" hide domain={[0, "dataMax + 50"]} />

        <Tooltip
          cursor={{ fill: "var(--color-subtle)", opacity: 0.1 }}
          content={() => <div />}
        />

        <Bar dataKey="value" className="fill-primary" radius={3} />
      </BarChart>
    </StatCard>
  );
};
