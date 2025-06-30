import SQL from "./sql";
import { canSubtract, canUnion, splitBinary } from "./utils";
import type { Row, Table } from "@/interfaces/Table";
import type { Predicate, RelationalQuery } from "@/interfaces/Query";

export function parseExpression(
  input: string,
  tables: Table[]
): RelationalQuery {
  input = input.trim();

  if (!input.includes("(")) {
    const table = tables.find((s) => s.name === input);
    if (!table) throw new Error(`Table ${input} does not exist`);
    return { type: "table", tableName: input };
  }

  if (input.startsWith("π")) {
    const match = input.match(/^π\s+(.+?)\s*\((.*)\)$/s);
    if (!match) throw new Error("Formato inválido para la proyección");
    const attrs = match[1].split(",");
    const subExpr = match[2];
    return {
      type: "projection",
      attributes: attrs,
      input: parseExpression(subExpr, tables),
    };
  }

  if (input.match("σ")) {
    const match = input.match(/^σ\s*(.+?)\s*\((.*)\)$/);
    if (!match) throw new Error("Formato inválido para la selección");
    const condition = match[1];
    const subExpr = match[2];
    const predicate = parsePredicate(condition);

    return {
      type: "selection",
      input: parseExpression(subExpr, tables),
      predicate,
    };
  }

  if (input.includes("⋈")) {
    const match = input.match(/^\((.*)\)\s*⋈\s*([^\s]+)?\s*\((.*)\)$/);
    if (!match) throw new Error("Formato inválido para join");
    const left = match[1];
    const condition = match[2];
    const right = match[3];

    return {
      type: "join",
      left: parseExpression(left, tables),
      right: parseExpression(right, tables),
      condition: condition ? parsePredicate(condition) : undefined,
    };
  }

  if (input.includes("-")) {
    const [leftRaw, rightRaw] = splitBinary(input, "-");

    return {
      type: "difference",
      left: parseExpression(leftRaw, tables),
      right: parseExpression(rightRaw, tables),
    };
  }

  if (input.includes("×")) {
    const [leftRaw, rightRaw] = splitBinary(input, "×");

    return {
      type: "product",
      left: parseExpression(leftRaw, tables),
      right: parseExpression(rightRaw, tables),
    };
  }

  if (input.includes("∪")) {
    const [leftRaw, rightRaw] = splitBinary(input, "∪");

    return {
      type: "union",
      left: parseExpression(leftRaw, tables),
      right: parseExpression(rightRaw, tables),
    };
  }

  if (input.includes("∩")) {
    const [leftRaw, rightRaw] = splitBinary(input, "∩");

    return {
      type: "intersect",
      left: parseExpression(leftRaw, tables),
      right: parseExpression(rightRaw, tables),
    };
  }

  throw new Error("Expresión no reconocida: " + input);
}

export function parsePredicate(condition: string): Predicate {
  const conditions = condition.split(" ");

  if (conditions.length === 1) {
    condition = conditions[0];
    if (condition.includes(">")) {
      const [left, right] = condition.split(">");
      return { type: "gt", left: left.trim(), right: right.trim() };
    }

    if (condition.includes("<")) {
      const [left, right] = condition.split("<");
      return { type: "lt", left: left.trim(), right: right.trim() };
    }

    if (condition.includes("=")) {
      const [left, right] = condition.split("=");
      return { type: "eq", left: left.trim(), right: right.trim() };
    }
  } else if (conditions.length === 3) {
    const logicOp = conditions[1].toLowerCase();
    if (logicOp === "and" || logicOp === "or") {
      return {
        type: logicOp,
        predicates: [
          parsePredicate(conditions[0]),
          parsePredicate(conditions[2]),
        ],
      };
    }
    throw new Error("Condición no soportada: " + condition);
  }
  throw new Error("Condición no soportada: " + condition);
}

export function evaluate(
  query: RelationalQuery,
  tables: Record<string, any[]>,
  schemas: Table[]
): { rows: Row[]; schemaName?: string } {
  switch (query.type) {
    case "table":
      return {
        rows: tables[query.tableName] ?? [],
        schemaName: query.tableName,
      };

    case "selection": {
      const { rows, schemaName } = evaluate(query.input, tables, schemas);
      const predicate = query.predicate;
      const schema = schemas.find((s) => s.name === schemaName);

      if (schema) {
        switch (predicate.type) {
          case "eq":
          case "lt":
          case "gt":
            const attr = schema.attributes.find(
              (a) => a.name == predicate.left
            );
            const filtered = rows.filter((row) =>
              evaluatePredicate(predicate, row, attr?.type ?? "")
            );
            return {
              rows: filtered,
              schemaName,
            };
          default:
            throw new Error("Error al evaluar");
        }
      }
      throw new Error("Error al evaluar");
    }

    case "projection": {
      const result = evaluate(query.input, tables, schemas);

      const projectedRows = result.rows.map((row) => {
        const projected: Row = {};

        for (const attr of query.attributes) {
          if (!row[attr]) {
            throw new Error("El registro contiene atributos no válidos");
          }
          projected[attr] = row[attr];
        }
        return projected;
      });

      return {
        rows: projectedRows,
        schemaName: result.schemaName,
      };
    }

    case "union": {
      const left = evaluate(query.left, tables, schemas);
      const right = evaluate(query.right, tables, schemas);

      if (!canUnion(left.rows, right.rows)) {
        throw new Error(
          "Estructura incompatible: claves diferentes o en orden distinto."
        );
      }

      return {
        rows: SQL.UNION(left.rows, right.rows),
        schemaName: left.schemaName ?? right.schemaName,
      };
    }

    case "intersect": {
      const left = evaluate(query.left, tables, schemas);
      const right = evaluate(query.right, tables, schemas);

      if (!canUnion(left.rows, right.rows)) {
        throw new Error(
          "Estructura incompatible: claves diferentes o en orden distinto."
        );
      }

      return {
        rows: SQL.INTERSECT(left.rows, right.rows),
        schemaName: left.schemaName ?? right.schemaName,
      };
    }

    case "difference": {
      const left = evaluate(query.left, tables, schemas);
      const right = evaluate(query.right, tables, schemas);

      if (!canSubtract(left.rows, right.rows)) {
        throw new Error(
          "No se puede restar: las tablas tienen distinta estructura"
        );
      }

      return {
        rows: SQL.DIFFERENCE(left.rows, right.rows),
        schemaName: left.schemaName ?? right.schemaName,
      };
    }

    case "product": {
      const left = evaluate(query.left, tables, schemas);
      const right = evaluate(query.right, tables, schemas);

      return {
        rows: SQL.PRODUCT(left.rows, right.rows),
        schemaName: `${left.schemaName}×${right.schemaName}`,
      };
    }

    case "join": {
      const left = evaluate(query.left, tables, schemas);
      const right = evaluate(query.right, tables, schemas);

      if (query.condition?.type !== "eq") throw new Error("traste");

      return {
        rows: SQL.JOIN(
          left.rows,
          right.rows,
          query.condition.left,
          query.condition.right
        ),
        schemaName: `${left.schemaName}⋈${right.schemaName}`,
      };
    }

    default:
      throw new Error("Tipo de consulta no soportado: " + (query as any).type);
  }
}

function evaluatePredicate(pred: Predicate, row: any, type: string): boolean {
  switch (pred.type) {
    case "eq":
      if (type === "Integer") {
        const evalu = Number(pred.right);
        if (!isNaN(evalu)) {
          return Number(row[pred.left]) === Number(pred.right);
        }
        throw new Error("No se pueden comparar strings con numeros");
      }
      return (
        row[pred.left] === row[pred.right] || row[pred.left] === pred.right
      );
    case "gt":
      return row[pred.left] > +pred.right;
    case "lt":
      return row[pred.left] < +pred.right;
    case "and":
      return pred.predicates.every((p) => evaluatePredicate(p, row, type));
    case "or":
      return pred.predicates.some((p) => evaluatePredicate(p, row, type));
    case "not":
      return !evaluatePredicate(pred.predicate, row, type);
    default:
      throw new Error("Tipo de predicado no soportado");
  }
}
