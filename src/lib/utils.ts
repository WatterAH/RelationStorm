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

export function canUnion(table1: object[], table2: object[]): boolean {
  if (table1.length === 0 || table2.length === 0) return false;

  const keys1 = Object.keys(table1[0]);
  const keys2 = Object.keys(table2[0]);

  if (keys1.length !== keys2.length) return false;

  return keys1.every((key, index) => key === keys2[index]);
}

export function canSubtract(tableA: object[], tableB: object[]): boolean {
  if (tableA.length === 0 || tableB.length === 0) {
    return false;
  }

  const keysA = Object.keys(tableA[0]).sort();
  const keysB = Object.keys(tableB[0]).sort();

  if (keysA.length !== keysB.length) return false;

  for (let i = 0; i < keysA.length; i++) {
    if (keysA[i] !== keysB[i]) return false;
  }

  return true;
}
