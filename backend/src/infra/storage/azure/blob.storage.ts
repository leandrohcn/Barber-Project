import { Injectable, Logger } from '@nestjs/common';
import { IStorageService } from '../storage.service';

/**
 * Implementação Azure Blob Storage
 *
 * Nota: Para usar, instale: npm install @azure/storage-blob
 * e configure: AZURE_STORAGE_ACCOUNT_NAME, AZURE_STORAGE_ACCOUNT_KEY
 */
@Injectable()
export class BlobStorageService implements IStorageService {
  private readonly logger = new Logger(BlobStorageService.name);

  constructor() {
    this.logger.warn('BlobStorageService não está completamente implementado. Use S3StorageService para AWS.');
    // TODO: Inicializar BlobServiceClient
  }

  async uploadFile(bucket: string, key: string, data: Buffer, contentType?: string): Promise<string> {
    // TODO: Implementar com ContainerClient.getBlockBlobClient().upload()
    throw new Error('BlobStorageService não implementado para este ambiente');
  }

  async downloadFile(bucket: string, key: string): Promise<Buffer> {
    // TODO: Implementar com ContainerClient.getBlockBlobClient().download()
    throw new Error('BlobStorageService não implementado para este ambiente');
  }

  async deleteFile(bucket: string, key: string): Promise<void> {
    // TODO: Implementar com ContainerClient.deleteBlob()
    throw new Error('BlobStorageService não implementado para este ambiente');
  }

  async getSignedUrl(bucket: string, key: string, expirationSeconds?: number): Promise<string> {
    // TODO: Implementar com generateBlobSASUrl()
    throw new Error('BlobStorageService não implementado para este ambiente');
  }

  async listFiles(bucket: string, prefix?: string): Promise<string[]> {
    // TODO: Implementar com ContainerClient.listBlobsFlat()
    throw new Error('BlobStorageService não implementado para este ambiente');
  }

  async fileExists(bucket: string, key: string): Promise<boolean> {
    // TODO: Implementar com ContainerClient.getBlockBlobClient().exists()
    throw new Error('BlobStorageService não implementado para este ambiente');
  }
}
