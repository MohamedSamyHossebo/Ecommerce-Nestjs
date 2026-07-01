import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  Logger,
} from '@nestjs/common';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    const status =
      exception instanceof HttpException ? exception.getStatus() : 500;
    let errResponsePayload: string | object = 'Internal server error';

    if (exception instanceof HttpException) {
      errResponsePayload = exception.getResponse();
    } else if (exception instanceof Error) {
      errResponsePayload = exception.message;
    }

    const errorMessage =
      typeof errResponsePayload === 'object' && errResponsePayload !== null
        ? (errResponsePayload as any).message ||
          JSON.stringify(errResponsePayload)
        : errResponsePayload;
    this.logger.error(
      `HTTP Error Interupted [${request.method}] ${request.url} - Status: ${status} - Error: ${errorMessage}`,
    );

    response.status(status).json({
      success: false,
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      error: {
        message: errorMessage,
        type:
          exception instanceof Error ? exception.name : 'InternalServerError',
        stack: exception instanceof Error ? exception.stack : undefined,
      },
    });
  }
}
