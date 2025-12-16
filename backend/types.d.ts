declare module 'ssh2-sftp-client' {
    export default class Client {
        connect(config: any): Promise<void>;
        put(localPath: string | Buffer, remotePath: string): Promise<string>;
        get(remotePath: string): Promise<Buffer>;
        exists(remotePath: string): Promise<boolean | string>;
        end(): Promise<void>;
    }
}
