const errorHandler = (err, req, res, next) => {
    console.error("Error:", err);
    res.status(500).json(
        { 
            message: "Error interno del servidor", 
            detail: err.message 
        }
    );
};


export default errorHandler;