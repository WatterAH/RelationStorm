import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function splitBinary(input: string, operator: string): [string, string] {
  const idx = input.indexOf(operator);
  const left = input.slice(0, idx).trim();
  const right = input.slice(idx + operator.length).trim();

  const leftExpr = left.replace(/^\(|\)$/g, "");
  const rightExpr = right.replace(/^\(|\)$/g, "");

  return [leftExpr, rightExpr];
}
