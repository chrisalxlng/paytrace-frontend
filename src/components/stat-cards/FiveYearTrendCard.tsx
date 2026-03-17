import classNames from "classnames";
import { isNil } from "lodash-es";
import { Bar, BarChart, LabelList, Tooltip, XAxis, YAxis } from "recharts";
import type { Chart } from "../../models";
import { m } from "../../paraglide/messages";
import { currencyFormatter } from "../../shared/utils/formatters";
import { SvgPercentIndicator } from "../SvgPercentIndicator";
import { getTextClasses } from "../Text";
import { CHART_TICK_OPTIONS } from "./constants";
import { StatCard } from "./StatCard";
import { useStatInteraction } from "./useStatInteraction";

type FiveYearTrendCardProps = {
  title: string;
  data: Chart.FiveYearTrend;
};

const OFFSET = 7000;

export const FiveYearTrendCard = ({ title, data }: FiveYearTrendCardProps) => {
  const { activeIndex, props } = useStatInteraction();

  const chartData = data.years.map((year) => ({
    ...year,
    displayValue: year.value + OFFSET,
  }));

  const first = data.years.at(0);
  const active = isNil(activeIndex) ? null : data.years.at(activeIndex);

  const activeYear = active?.year;
  const firstYear = first?.year;

  const activeValue = active?.value;
  const firstValue = first?.value;

  const timespan = activeYear ?? firstYear ?? m.unknown_timespan();

  const formattedActiveValue = isNil(activeValue)
    ? null
    : currencyFormatter.format(activeValue);
  const formattedValue = isNil(firstValue)
    ? null
    : currencyFormatter.format(firstValue);
  const value = formattedActiveValue ?? formattedValue ?? "?";

  return (
    <StatCard title={title} timespan={timespan} value={value}>
      <BarChart
        data={chartData}
        layout="vertical"
        margin={{ left: -5 }}
        barCategoryGap="10%"
        {...props}
      >
        <YAxis
          dataKey="year"
          type="category"
          tickLine={false}
          axisLine={false}
          tick={CHART_TICK_OPTIONS}
          tickMargin={20}
          interval={0}
        />

        <XAxis
          type="number"
          hide
          domain={[0, (dataMax) => dataMax + OFFSET + 5000]}
        />

        <Tooltip
          cursor={{ fill: "var(--color-subtle)", opacity: 0.1 }}
          content={() => <div />}
        />

        <Bar
          dataKey="displayValue"
          className="fill-primary"
          radius={4}
          minPointSize={45}
        >
          <LabelList
            dataKey="value"
            position="insideLeft"
            offset={12}
            formatter={(label) => currencyFormatter.format(Number(label))}
            className={classNames(
              getTextClasses({
                variant: "caption",
              }),
              "fill-on-primary",
            )}
          />

          <LabelList
            dataKey="yoyPercentage"
            position="right"
            offset={15}
            content={(props) => {
              const { x, y, width, height, value } = props;

              if (typeof value !== "number") return null;

              return (
                <g
                  transform={`translate(${(x as number) + (width as number) + 15}, ${y})`}
                >
                  <SvgPercentIndicator
                    value={value}
                    dy={(height as number) / 2 + 4}
                  />
                </g>
              );
            }}
          />
        </Bar>
      </BarChart>
    </StatCard>
  );
};
