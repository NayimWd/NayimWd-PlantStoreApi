import { Request, Response, NextFunction } from 'express';
import { ZodSchema, ZodError } from 'zod';

const zodValidator = (schema: ZodSchema<any>) => async (req: Request, res: Response, next: NextFunction) => {
    try {
        const parsedBody = await schema.parseAsync(req.body);
        req.body = parsedBody;
        next();
    } catch (err) {
        if (err instanceof ZodError) {
            res.status(400).json({
                message: err.errors[0]?.message, // ZodError has an `errors` property
            });
        } else {
            res.status(500).json({
                message: 'Internal Server Error',
            });
        }
    }
};

export default zodValidator;