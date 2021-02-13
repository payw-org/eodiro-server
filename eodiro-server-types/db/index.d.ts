import { SqlBInstance } from "../modules/sqlb";
import { FieldInfo, MysqlError } from 'mysql';
export declare type MysqlResult = any[] | Record<string, any>;
export declare type MysqlInsertOrUpdateResult = {
    fieldCount: number;
    affectedRows: number;
    insertId: number;
    serverStatus: number;
    warningCount: number;
    message: string;
    protocol41: boolean;
    changedRows: number;
};
export declare type MysqlQueryReturn<ResultType> = [MysqlError, ResultType, FieldInfo[]];
export declare type QueryValues = (string | number)[] | string | number;
/**
 * @deprecated Use Prisma
 */
export default class Db {
    static query<ResultType = MysqlResult>(query: SqlBInstance): Promise<MysqlQueryReturn<ResultType>>;
    static query<ResultType = MysqlResult>(query: string): Promise<MysqlQueryReturn<ResultType>>;
    static query<ResultType = MysqlResult>(query: string, values: QueryValues): Promise<MysqlQueryReturn<ResultType>>;
}
