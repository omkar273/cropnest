class ApiResponse {
    status: number;
    data: any;
    message: string;
    success: boolean;
    constructor(data: any, message: string, status = 200) {
        this.status = status;
        this.data = data;
        this.message = message;
        this.success = status >= 200 && status < 300;
    }
}

export { ApiResponse };
