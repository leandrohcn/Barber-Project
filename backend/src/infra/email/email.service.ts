/**
 * Interface abstrata para envio de emails
 * Implementações: AWS SES, SendGrid, Azure SendGrid
 */
export interface IEmailService {
  /**
   * Enviar email simples
   */
  sendEmail(to: string, subject: string, body: string, html?: string): Promise<string>;

  /**
   * Enviar email com template
   */
  sendTemplateEmail(
    to: string,
    templateId: string,
    variables: Record<string, any>
  ): Promise<string>;

  /**
   * Enviar email para múltiplos destinatários
   */
  sendBulkEmail(
    recipients: { email: string; variables?: Record<string, any> }[],
    subject: string,
    templateId?: string
  ): Promise<string[]>;

  /**
   * Verificar se email é válido
   */
  validateEmail(email: string): Promise<boolean>;

  /**
   * Obter status de entrega
   */
  getEmailStatus(messageId: string): Promise<{ status: string; bounceType?: string }>;
}
