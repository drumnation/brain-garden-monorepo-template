import type { Request, Response, NextFunction } from 'express';
import type { Logger } from '@kit/logger';

export const errorHandler = (logger: Logger) => {
  return (err: Error, _req: Request, res: Response, _next: NextFunction) => {
    logger.error({ err, stack: err.stack }, 'Request error');

    // Default to 500 Internal Server Error
    const statusCode = 'statusCode' in err && typeof err.statusCode === 'number'
      ? err.statusCode
      : 500;

    res.status(statusCode).json({
      error: {
        message: err.message,
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
      }
    });
  };
};
