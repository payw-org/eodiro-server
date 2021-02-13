import mysql from 'mysql';
/**
 * @deprecated
 */
export default class DbConnector {
    private static connection;
    static connect(): Promise<boolean>;
    static getConnection(): Promise<mysql.Connection>;
    /**
     * Get connection synchronously if you're sure
     * that the connection is successfully established
     */
    static getConnConfident(): mysql.Connection;
}
