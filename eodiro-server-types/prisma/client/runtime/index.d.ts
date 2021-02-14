/// <reference types="node" />
export var __esModule: boolean;
export var engineEnvVarMap: {
    "query-engine": string;
    "migration-engine": string;
    "introspection-engine": string;
    "prisma-fmt": string;
};
export var knownBinaryTargets: string[];
export var NodeEngine: {
    new ({ cwd, datamodelPath, prismaPath, generator, datasources, showColors, logLevel, logQueries, env: env2, flags, clientVersion: clientVersion2, enableExperimental, engineEndpoint, enableDebugLogs, enableEngineDebugMode, dirname: dirname2, useUds, activeProvider }: {
        cwd: any;
        datamodelPath: any;
        prismaPath: any;
        generator: any;
        datasources: any;
        showColors: any;
        logLevel: any;
        logQueries: any;
        env: any;
        flags: any;
        clientVersion: any;
        enableExperimental: any;
        engineEndpoint: any;
        enableDebugLogs: any;
        enableEngineDebugMode: any;
        dirname: any;
        useUds: any;
        activeProvider: any;
    }): {
        startCount: number;
        enableExperimental: any;
        useUds: any;
        stderrLogs: string;
        handleRequestError: (error: any, graceful?: boolean) => Promise<boolean>;
        dirname: any;
        env: any;
        cwd: any;
        enableDebugLogs: any;
        enableEngineDebugMode: any;
        datamodelPath: any;
        prismaPath: any;
        generator: any;
        datasources: any;
        logEmitter: any;
        showColors: any;
        logLevel: any;
        logQueries: any;
        clientVersion: any;
        flags: any;
        activeProvider: any;
        engineEndpoint: any;
        port: number;
        setError(err: any): void;
        lastRustError: any;
        lastErrorLog: any;
        checkForTooManyEngines(): void;
        resolveCwd(cwd: any): any;
        on(event: any, listener: any): void;
        beforeExitListener: any;
        emitExit(): Promise<void>;
        getPlatform(): Promise<any>;
        platformPromise: any;
        getQueryEnginePath(platform: any, prefix?: string): any;
        handlePanic(): void;
        resolvePrismaPath(): Promise<{
            prismaPath: any;
            searchedLocations: any[];
        }>;
        incorrectlyPinnedBinaryTarget: any;
        platform: any;
        getPrismaPath(): Promise<any>;
        getFixedGenerator(): any;
        printDatasources(): string;
        start(): Promise<any>;
        startPromise: Promise<any>;
        getEngineEnvVars(): any;
        internalStart(): Promise<any>;
        socketPath: string;
        child: import("child_process").ChildProcessByStdio<null, import("stream").Readable, import("stream").Readable>;
        undici: any;
        engineStartDeferred: {
            resolve: (value: any) => void;
            reject: (reason?: any) => void;
        };
        stop(): Promise<void>;
        stopPromise: Promise<void>;
        _stop(): Promise<void>;
        engineStopDeferred: {
            resolve: (value: any) => void;
            reject: (reason?: any) => void;
        };
        kill(signal: any): void;
        globalKillSignalReceived: any;
        getFreePort(): Promise<any>;
        getConfig(): Promise<any>;
        getConfigPromise: Promise<any>;
        _getConfig(): Promise<any>;
        version(forceRun?: boolean): Promise<any>;
        versionPromise: Promise<any>;
        internalVersion(): Promise<any>;
        lastVersion: any;
        request(query: any, headers: any, numTry?: number): any;
        currentRequestPromise: any;
        lastQuery: any;
        requestBatch(queries: any, transaction?: boolean, numTry?: number): Promise<any>;
        readonly hasMaxRestarts: boolean;
        throwAsyncErrorIfExists(forceThrow?: boolean): void;
        lastPanic: any;
        getErrorMessageWithLink(title: any): any;
        graphQLToJSError(error: any): any;
    };
};
export function resolveBinary(name: any, proposedPath: any): Promise<any>;
export function maybeCopyToTmp(file: any): Promise<any>;
export function download(options: any): Promise<any>;
export function getVersion(enginePath: any): Promise<any>;
export function checkVersionCommand(enginePath: any): Promise<boolean>;
export function getBinaryName(binaryName: any, platform: any): `${any}-${any}` | `${any}-${any}.exe`;
export function getBinaryEnvVarPath(binaryName: any): any;
export function plusX(file: any): void;
export function getGenerators({ schemaPath, providerAliases: aliases, version, cliVersion, printDownloadProgress, baseDir, overrideGenerators, skipDownload, binaryPathsOverride }: {
    schemaPath: any;
    providerAliases: any;
    version: any;
    cliVersion: any;
    printDownloadProgress: any;
    baseDir?: any;
    overrideGenerators: any;
    skipDownload: any;
    binaryPathsOverride: any;
}): Promise<any>;
export function getGenerator(options: any): Promise<any>;
export function skipIndex(arr: any, index: any): any[];
export function check(input: any): Promise<{
    status: string;
    data?: undefined;
} | {
    status: string;
    data: any;
}>;
export function getInfo(): Promise<{
    signature: any;
    cachePath: any;
    cacheItems: any[];
}>;
export function getSignature(signatureFile: any, cacheFile: any): Promise<any>;
