export const setUploadPath = (path = 'uploads') => {
    return (req, res, next) => {
        req.uploadPath = path;
        next();
    };
};
