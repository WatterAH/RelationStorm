export type RelationalQuery =
  | { type: "table"; tableName: string }
  | { type: "selection"; predicate: Predicate; input: RelationalQuery }
  | { type: "projection"; attributes: string[]; input: RelationalQuery }
  | { type: "union"; left: RelationalQuery; right: RelationalQuery }
  | { type: "intersect"; left: RelationalQuery; right: RelationalQuery }
  | { type: "difference"; left: RelationalQuery; right: RelationalQuery }
  | { type: "product"; left: RelationalQuery; right: RelationalQuery }
  | { type: "rename"; newName: string; input: RelationalQuery }
  | {
      type: "join";
      left: RelationalQuery;
      right: RelationalQuery;
      condition?: Predicate;
    };

export type Predicate =
  | { type: "eq"; left: string; right: string }
  | { type: "and"; predicates: Predicate[] }
  | { type: "or"; predicates: Predicate[] }
  | { type: "not"; predicate: Predicate }
  | { type: "gt"; left: string; right: string }
  | { type: "lt"; left: string; right: string };
// ...más operadores si quieres
