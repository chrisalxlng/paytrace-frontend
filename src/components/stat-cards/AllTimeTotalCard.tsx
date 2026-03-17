import { isNil } from "lodash-es";
import { Area, AreaChart, XAxis, YAxis } from "recharts";
import type { Chart } from "../../models";
import { m } from "../../paraglide/messages";
import {
  currencyFormatter,
  yearFormatter,
} from "../../shared/utils/formatters";
import { CHART_TICK_OPTIONS } from "./constants";
import { StatCard } from "./StatCard";
import { useStatInteraction } from "./useStatInteraction";

type AllTimeTotalCardProps = {
  title: string;
  data: Chart.AllTimeTotal;
};

export const AllTimeTotalCard = ({ title, data }: AllTimeTotalCardProps) => {
  const { activeIndex, props } = useStatInteraction();

  const first = data.years.at(0);
  const last = data.years.at(-1);
  const active = isNil(activeIndex) ? null : data.years.at(activeIndex);

  const activeYear = active?.year;
  const firstYear = first?.year;
  const lastYear = last?.year;

  const activeValue = active?.value;
  const lastValue = last?.value;

  const timespan =
    activeYear ??
    yearFormatter.formatRange(firstYear, lastYear) ??
    m.unknown_timespan();

  const formattedActiveValue = isNil(activeValue)
    ? null
    : currencyFormatter.format(activeValue);
  const formattedValue = isNil(lastValue)
    ? null
    : currencyFormatter.format(lastValue);
  const value = formattedActiveValue ?? formattedValue ?? m.n_a();

  return (
    <StatCard title={title} timespan={timespan} value={value}>
      <AreaChart
        data={data.years}
        accessibilityLayer
        barCategoryGap="10%"
        className="outline-hidden"
        {...props}
      >
        <XAxis
          dataKey="year"
          tickLine={false}
          tickMargin={20}
          axisLine={false}
          interval="preserveStartEnd"
          tick={CHART_TICK_OPTIONS}
        />
        <YAxis domain={[0, "auto"]} hide />
        <defs>
          <linearGradient id="gradient" x1="0" y1="0" x2="0" y2="1">
            <stop
              offset="5%"
              stopColor="var(--color-primary)"
              stopOpacity={0.8}
            />
            <stop
              offset="95%"
              stopColor="var(--color-primary)"
              stopOpacity={0.1}
            />
          </linearGradient>
        </defs>
        <Area
          dataKey="value"
          type="monotone"
          fillOpacity={0.4}
          fill="url(#gradient)"
          strokeWidth={2}
          stroke="var(--color-primary)"
          activeDot={(props) => {
            const { cx, cy } = props;
            const color = "var(--color-primary)";
            return (
              <g>
                <circle
                  cx={cx}
                  cy={cy}
                  r={12}
                  fill={color}
                  fillOpacity={0.15}
                />
                <circle
                  cx={cx}
                  cy={cy}
                  r={6}
                  fill={color}
                  stroke="var(--color-surface)"
                  strokeWidth={4}
                />
              </g>
            );
          }}
        />
      </AreaChart>
    </StatCard>
  );
};
