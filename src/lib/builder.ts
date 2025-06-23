import type { Predicate, RelationalQuery } from "@/interfaces/Query";

export class QueryBuilder {
  query: RelationalQuery;

  constructor(query: RelationalQuery) {
    this.query = query;
  }

  static table(name: string) {
    return new QueryBuilder({ type: "table", tableName: name });
  }

  select(predicate: Predicate) {
    this.query = { type: "selection", predicate, input: this.query };
    return this;
  }

  project(attributes: string[]) {
    this.query = { type: "projection", attributes, input: this.query };
    return this;
  }

  union(other: QueryBuilder) {
    this.query = { type: "union", left: this.query, right: other.query };
    return this;
  }

  difference(other: QueryBuilder) {
    this.query = { type: "difference", left: this.query, right: other.query };
    return this;
  }

  product(other: QueryBuilder) {
    this.query = { type: "product", left: this.query, right: other.query };
    return this;
  }

  rename(newName: string) {
    this.query = { type: "rename", newName, input: this.query };
    return this;
  }

  join(other: QueryBuilder, condition?: Predicate) {
    this.query = {
      type: "join",
      left: this.query,
      right: other.query,
      condition,
    };
    return this;
  }

  build() {
    return this.query;
  }
}
