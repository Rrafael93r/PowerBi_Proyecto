import Client from 'ssh2-sftp-client'


export default class SftpService {
    private config = {
        host: 'ftpharmaser.pharmaser.com.co',
        port: 22,
        username: 'cporto',
        password: 'Ph@rm4s3r.',
    }

    private basePath = '/medicar/Powerbi/'

    public async uploadFile(filePath: string, fileName: string): Promise<string> {
        const sftp = new Client()
        try {
            await sftp.connect(this.config)

            const remotePath = this.basePath + fileName
            await sftp.put(filePath, remotePath)

            return remotePath
        } catch (err) {
            console.error('SFTP Upload Error:', err)
            throw new Error('Error subiendo archivo al SFTP')
        } finally {
            await sftp.end()
        }
    }

    // Helper to upload from buffer if needed (Adonis Request 'file' usually gives tmp path)
    public async upload(file: any): Promise<string> {
        const sftp = new Client()
        try {
            await sftp.connect(this.config)

            // Sanitizar nombre de archivo
            const fileName = `${new Date().getTime()}_${file.clientName.replace(/\s+/g, '_')}`
            const remotePath = this.basePath + fileName

            // Upload from temp path
            await sftp.put(file.tmpPath, remotePath)

            return fileName // Return just filename or full path depending on requirement
        } catch (err) {
            console.error('SFTP Upload Error:', err)
            throw new Error('Error subiendo archivo al SFTP: ' + err.message)
        } finally {
            await sftp.end()
        }
    }

    public async getFile(fileName: string): Promise<Buffer> {
        const sftp = new Client()
        try {
            await sftp.connect(this.config)
            const remotePath = this.basePath + fileName

            // Check if file exists
            const exists = await sftp.exists(remotePath)
            if (!exists) throw new Error('Archivo no encontrado en SFTP')

            // Download to buffer
            const buffer = await sftp.get(remotePath)
            return buffer as Buffer
        } catch (err) {
            console.error('SFTP Get Error:', err)
            throw err
        } finally {
            await sftp.end()
        }
    }
}
