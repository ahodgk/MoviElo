import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const calculateDaysPassed = (date1: Date) => {
  const startDate = new Date(date1);
  const endDate = new Date();

  const differenceInMilliseconds = endDate.getTime() - startDate.getTime();

  const daysPassed = Math.floor(
    differenceInMilliseconds / (1000 * 60 * 60 * 24),
  );

  return daysPassed;
};
