import { response, Response } from "express";

export const sendSuccess = <T>(
    res: Response,
    data: T,
    message: string = 'Success',
    statusCode: number = 200
) => {
    return res.status(statusCode).json({
        success: true,
        
        message,
        result: data
    })
}
export const sendError = (
    res: Response,
    message: string = 'Internal Server Error',
    statusCode: number = 500,
    errorDetails?: any
) => {
    return res.status(statusCode).json({
        success: false,
        message,
        ...(errorDetails && { error: errorDetails })
    })
}
