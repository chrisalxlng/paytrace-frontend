import classNames from "classnames";
import { isNil } from "lodash-es";
import {
  Bar,
  ComposedChart,
  LabelList,
  Line,
  ReferenceLine,
  XAxis,
  YAxis,
} from "recharts";
import type { Chart } from "../../models";
import { m } from "../../paraglide/messages";
import {
  percentageFormatter,
  yearMonthFormatter,
} from "../../shared/utils/formatters";
import { SvgPercentIndicator } from "../SvgPercentIndicator";
import { getTextClasses } from "../Text";
import { CHART_TICK_OPTIONS } from "./constants";
import { StatCard } from "./StatCard";
import { useStatInteraction } from "./useStatInteraction";

type RollingPerfomanceCardProps = {
  title: string;
  data: Chart.RollingPerfomance;
};

export const RollingPerfomanceCard = ({
  title,
  data,
}: RollingPerfomanceCardProps) => {
  const formattedData: Chart.RollingPerfomanceMonth[] = data.months.map(
    (d) => ({
      ...d,
      yearMonth: yearMonthFormatter.format(d.yearMonth) as string,
    }),
  );

  const maxValue = Math.max(...data.months.map((d) => Math.abs(d.value)));
  const chartLimit = maxValue * 2.5;

  const { activeIndex, props } = useStatInteraction();

  const first = data.months.at(0);
  const active = isNil(activeIndex) ? null : data.months.at(activeIndex);

  const activeMonthYear = active?.yearMonth;
  const firstMonthYear = first?.yearMonth;

  const activeValue = active?.value;
  const firstValue = first?.value;

  const timespan =
    yearMonthFormatter.formatShort(activeMonthYear) ??
    yearMonthFormatter.formatShort(firstMonthYear) ??
    m.unknown_timespan();

  const formattedActiveValue = isNil(activeValue)
    ? null
    : percentageFormatter.format(activeValue);
  const formattedValue = isNil(firstValue)
    ? null
    : percentageFormatter.format(firstValue);
  const value = isNil(active)
    ? (formattedValue ?? m.n_a())
    : (formattedActiveValue ?? m.n_a());

  return (
    <StatCard title={title} timespan={timespan} value={value}>
      <ComposedChart
        data={formattedData}
        layout="vertical"
        margin={{ left: 0, right: 0, top: 20, bottom: 0 }}
        {...props}
      >
        <XAxis
          type="number"
          hide
          domain={[-chartLimit, chartLimit]}
          padding={{ left: 0, right: 0 }}
        />

        <YAxis
          dataKey="yearMonth"
          type="category"
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => value.slice(0, 3)}
          tick={{ ...CHART_TICK_OPTIONS, textAnchor: "start" }}
          width={7}
        />

        <ReferenceLine
          x={0}
          stroke="var(--color-subtle)"
          strokeWidth={2}
          strokeDasharray="3 3"
          label={{
            value: "Vorjahr",
            position: "top",
            fill: "var(--color-subtle)",
            className: getTextClasses({ variant: "caption" }),
            offset: 10,
          }}
        />

        <Bar
          dataKey="value"
          barSize={16}
          shape={(props) => {
            const { x, y, width, height, value } = props;
            if (typeof value !== "number") return null;

            const absWidth = Math.abs(width);
            const finalX = value < 0 ? x - absWidth : x;

            return (
              <rect
                x={finalX}
                y={y}
                width={absWidth}
                height={height}
                className={classNames({
                  "fill-green": value > 0,
                  "fill-red": value < 0,
                  "fill-subtle": value === 0,
                })}
                fillOpacity={0.4}
                rx={1}
              />
            );
          }}
        >
          <LabelList
            dataKey="value"
            position="right"
            offset={15}
            content={(props) => {
              const { value, x, y, width, height } = props;
              if (isNil(value)) return null;
              if (typeof x !== "number") return null;
              if (typeof y !== "number") return null;
              if (typeof width !== "number") return null;
              if (typeof height !== "number") return null;
              if (typeof value !== "number") return null;

              const isNegative = value < 0;

              return (
                <SvgPercentIndicator
                  value={value}
                  x={x + width + (isNegative ? -20 : 20)}
                  y={y + height / 2 + 4}
                  textAnchor={isNegative ? "end" : "start"}
                />
              );
            }}
          />
        </Bar>

        <Line
          dataKey="value"
          stroke="none"
          dot={(props) => {
            const { cx, cy, payload } = props;
            const { value } = payload;

            return (
              <circle
                cx={cx}
                cy={cy}
                r={8}
                className={classNames("drop-shadow-sm", {
                  "fill-green": value > 0,
                  "fill-red": value < 0,
                  "fill-subtle": value === 0,
                })}
                stroke="var(--color-surface)"
                strokeWidth={2}
              />
            );
          }}
          activeDot={(props) => {
            const { cx, cy, payload } = props;
            const { value } = payload;

            return (
              <g>
                <circle
                  cx={cx}
                  cy={cy}
                  r={16}
                  className={classNames("drop-shadow-sm", {
                    "fill-green": value > 0,
                    "fill-red": value < 0,
                    "fill-subtle": value === 0,
                  })}
                  fillOpacity={0.15}
                />
                <circle
                  cx={cx}
                  cy={cy}
                  r={10}
                  className={classNames("drop-shadow-sm", {
                    "fill-green": value > 0,
                    "fill-red": value < 0,
                    "fill-subtle": value === 0,
                  })}
                  stroke="var(--color-surface)"
                  strokeWidth={4}
                />
              </g>
            );
          }}
        />
      </ComposedChart>
    </StatCard>
  );
};
