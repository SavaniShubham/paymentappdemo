
class ApiError extends Error{
    constructor(statuscode  ,  message )
    {
        super(message);
        this.statusCode = statuscode;
        this.data = null;
        this.message=message;
        this.success=false;
        
    }
}

export default ApiError ;