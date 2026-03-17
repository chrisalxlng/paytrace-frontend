export type StrictExtract<T, U extends T> = Extract<T, U>;
export type StrictExclude<T, U extends T> = Exclude<T, U>;
export type StrictOmit<T, K extends keyof T> = Omit<T, K>;

export type Nillable<T> = T | null | undefined;
export type Nullable<T> = T | null;
export type Emptyable<T extends string> = T | "";

export type Year = `${number}${number}${number}${number}`;

type Month =
  | "01"
  | "02"
  | "03"
  | "04"
  | "05"
  | "06"
  | "07"
  | "08"
  | "09"
  | "10"
  | "11"
  | "12";
export type YearMonth = `${number}${number}${number}${number}-${Month}`;
