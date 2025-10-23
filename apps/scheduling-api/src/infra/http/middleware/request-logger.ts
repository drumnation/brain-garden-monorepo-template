import type { Request, Response, NextFunction } from 'express';
import type { Logger } from '@kit/logger';

export const requestLogger = (logger: Logger) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const start = Date.now();

    res.on('finish', () => {
      const duration = Date.now() - start;
      logger.info({
        method: req.method,
        url: req.url,
        status: res.statusCode,
        duration
      }, 'Request completed');
    });

    next();
  };
};
