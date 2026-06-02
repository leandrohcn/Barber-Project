/**
 * Interface abstrata para armazenamento em nuvem
 * Implementações: AWS S3, Azure Blob Storage, Google Cloud Storage
 */
export interface IStorageService {
  /**
   * Upload de arquivo
   */
  uploadFile(bucket: string, key: string, data: Buffer, contentType?: string): Promise<string>;

  /**
   * Download de arquivo
   */
  downloadFile(bucket: string, key: string): Promise<Buffer>;

  /**
   * Deletar arquivo
   */
  deleteFile(bucket: string, key: string): Promise<void>;

  /**
   * Gerar URL pública assinada
   */
  getSignedUrl(bucket: string, key: string, expirationSeconds?: number): Promise<string>;

  /**
   * Listar arquivos de um bucket
   */
  listFiles(bucket: string, prefix?: string): Promise<string[]>;

  /**
   * Verificar se arquivo existe
   */
  fileExists(bucket: string, key: string): Promise<boolean>;
}
