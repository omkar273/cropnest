class ApiError extends Error {
    public statusCode: number;
    public error: any[];
    public success: boolean;

    constructor(
        message = 'Something went wrong',
        statusCode: number = 500,
        error: any[] = [],
        stack: string = ''
    ) {
        super(message);
        this.statusCode = statusCode;
        this.error = error;
        this.success = false;

        if (stack) {
            this.stack = stack;
        } else {
            Error.captureStackTrace(this, this.constructor);
        }
    }
}

export { ApiError };
