/**
 * SqlB - Simple query builder
 * Copyright 2020 jhaemin
 */
declare type Order = 'ASC' | 'asc' | 'DESC' | 'desc';
declare type SqlBValue = number | string | undefined;
export declare class SqlBInstance<T = any> {
    private q;
    /**
     * Add a space at the end
     */
    private space;
    /**
     * Append query with a space before
     */
    private append;
    /**
     * Concatenate string without a space
     */
    private concat;
    private wrap;
    private singleQuotify;
    /**
     * Convert `undefined` to '?' and escape others
     */
    private convert;
    build(terminate?: boolean): string;
    /**
     * Format the output. Use this before `build()`.
     */
    format(): SqlBInstance<T>;
    raw(str: string): SqlBInstance<T>;
    /**
     * `(...) alias`
     *
     * Wrap the whole query currently built with braces.
     */
    bind(alias?: string): SqlBInstance<T>;
    /**
     * `SELECT`
     *
     * Select columns from table. If you specify a generic schema type,
     * it only allows the keys of the given type.
     * Use `alsoSelectAny` for more flexible selection.
     * @param what Array of strings or SqlB instances. Empty will select all.
     */
    select(...what: Array<keyof T | '*' | SqlBInstance>): SqlBInstance<T>;
    /**
     * Don't use this method alone.
     * Run `select()` or `selectAny()` first.
     */
    alsoSelect(...what: Array<keyof T | '*' | SqlBInstance>): SqlBInstance<T>;
    selectAny(...what: string[]): SqlBInstance<T>;
    /**
     * Don't know why this method is created.
     * Can't find any use cases.
     *
     * Don't use this method alone.
     * Run `select()` or `selectAny()` first.
     */
    alsoSelectAny(...what: string[]): SqlBInstance<T>;
    distinctSelect(...what: (keyof T | '*' | SqlBInstance<T>)[]): SqlBInstance<T>;
    /**
     * Wrap whole query in SqlBInstance and append alias.
     *
     * `(query_until_now) AS alias`
     */
    as(alias: string): SqlBInstance<T>;
    /**
     * `FROM target`
     *
     * Pass nothing only appends `FROM` statement
     */
    from(): SqlBInstance<T>;
    from(target: string): SqlBInstance<T>;
    from(target: string): SqlBInstance<T>;
    from(target: SqlBInstance<T>): SqlBInstance<T>;
    /**
     * `WHERE conditions`
     *
     * Pass nothing only appends `WHERE` statement
     */
    where(): SqlBInstance<T>;
    where(conditions: string): SqlBInstance<T>;
    where(conditions: SqlBInstance<T>): SqlBInstance<T>;
    /**
     * `schema1 JOIN schema2`
     */
    join(schema1: string, schema2: string, outer?: 'left' | 'right'): SqlBInstance<T>;
    /**
     * `ON condition`
     */
    on(condition?: string): SqlBInstance<T>;
    in(attr: keyof T, values: SqlBValue[]): SqlBInstance<T>;
    isNull(attr: keyof T): SqlBInstance<T>;
    andIsNull(attr: keyof T): SqlBInstance<T>;
    orIsNull(attr: keyof T): SqlBInstance<T>;
    isNotNull(attr: keyof T): SqlBInstance<T>;
    andIsNotNull(attr: keyof T): SqlBInstance<T>;
    orIsNotNull(attr: keyof T): SqlBInstance<T>;
    /**
     * > NOTE: To check `NULL`, use `isNull()`
     */
    equal(attr: string, value: SqlBValue): SqlBInstance<T>;
    andEqual(attr: string, value: SqlBValue): SqlBInstance<T>;
    /**
     * > NOTE: To check `NULL`, use `isNotNull()`
     */
    notEqual(attr: string, value: SqlBValue): SqlBInstance<T>;
    andNotEqual(attr: string, value: SqlBValue): SqlBInstance<T>;
    /** attr >= value */
    equalOrMore(attr: string, value: SqlBValue): SqlBInstance<T>;
    /** AND attr >= value */
    andEqualOrMore(attr: string, value: SqlBValue): SqlBInstance<T>;
    /** attr <= value */
    equalOrLess(attr: string, value: SqlBValue): SqlBInstance<T>;
    /** AND attr <= value */
    andEqualOrLess(attr: string, value: SqlBValue): SqlBInstance<T>;
    /** attr > value */
    more(attr: string, value: SqlBValue): SqlBInstance<T>;
    /** AND attr > value */
    andMore(attr: string, value: SqlBValue): SqlBInstance<T>;
    /** attr < value */
    less(attr: string, value: SqlBValue): SqlBInstance<T>;
    /** AND attr < value */
    andLess(attr: string, value: SqlBValue): SqlBInstance;
    group(by: keyof T): SqlBInstance<T>;
    order(attr: keyof T, direction?: Order): SqlBInstance<T>;
    multiOrder(options: [keyof T, Order][]): SqlBInstance<T>;
    limit(amount: number, offset?: number): SqlBInstance<T>;
    like(column: keyof T, keyword: string): SqlBInstance<T>;
    private onDuplicateKeyUpdate;
    insert(schema: string, items: {
        [K in keyof T]?: T[K];
    }, dupStrategy?: 'ignore' | 'update' | {
        strategy: 'update';
        attributes: (keyof T)[];
    }): SqlBInstance<T>;
    bulkInsert(schema: string, items: {
        [K in keyof T]?: T[K];
    }[], dupStrategy?: 'ignore' | 'update' | {
        strategy: 'update';
        attributes: (keyof T)[];
    }): SqlBInstance<T>;
    /**
     * `UPDATE schema SET attribute = 'value', ...`
     */
    update(schema: string, items: {
        [K in keyof T]?: T[K];
    }): SqlBInstance<T>;
    delete(): SqlBInstance<T>;
    when(): SqlBInstance<T>;
    notExists(sqlB: SqlBInstance<T>): SqlBInstance<T>;
    and(sql?: string | SqlBInstance<T>): SqlBInstance<T>;
    or(sql?: string | SqlBInstance<T>): SqlBInstance<T>;
}
declare function SqlB<T = any>(): SqlBInstance<T>;
declare namespace SqlB {
    var escape: (value: any) => string;
}
export default SqlB;
/**
 * SqlB function alias
 */
export declare const Q: typeof SqlB;
