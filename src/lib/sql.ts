import type { Row } from "@/interfaces/Table";

class SQLClass {
  UNION(tableA: Row[], tableB: Row[]): Row[] {
    const combined = [...tableA, ...tableB];
    const result: Row[] = [];
    const seen = new Set<string>();

    for (const row of combined) {
      const key = JSON.stringify(row);

      if (!seen.has(key)) {
        seen.add(key);
        result.push(row);
      }
    }

    return result;
  }

  INTERSECT(tableA: Row[], tableB: Row[]): Row[] {
    const setB = new Set(tableB.map((row) => JSON.stringify(row)));
    const result: Row[] = [];

    for (const row of tableA) {
      const key = JSON.stringify(row);
      if (setB.has(key)) {
        result.push(row);
      }
    }

    return result;
  }

  DIFFERENCE(tableA: Row[], tableB: Row[]): Row[] {
    const result: Row[] = [];
    const setB = new Set(tableB.map((row) => JSON.stringify(row)));

    for (const row of tableA) {
      const key = JSON.stringify(row);

      if (!setB.has(key)) {
        result.push(row);
      }
    }

    return result;
  }

  JOIN(tableA: Row[], tableB: Row[], keyA: string, keyB: string): Row[] {
    const result: Row[] = [];

    for (const rowA of tableA) {
      for (const rowB of tableB) {
        if (rowA[keyA] === rowB[keyB]) {
          const combined = { ...rowA };

          for (const [k, v] of Object.entries(rowB)) {
            if (k === keyB) continue;
            combined[k + "_2"] = v;
          }

          result.push(combined);
        }
      }
    }

    return result;
  }

  PRODUCT(tableA: Row[], tableB: Row[]): Row[] {
    const result: Row[] = [];

    for (const rowA of tableA) {
      for (const rowB of tableB) {
        const prefixedA = Object.fromEntries(
          Object.entries(rowA).map(([key, value]) => [`${key}1`, value])
        );

        const prefixedB = Object.fromEntries(
          Object.entries(rowB).map(([key, value]) => [`${key}2`, value])
        );

        result.push({ ...prefixedA, ...prefixedB });
      }
    }

    return result;
  }
}

const SQL = new SQLClass();
export default SQL;
