import { jwtUtil } from '../utils/index.js';

const isAuthenticated = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ message: 'Acceso denegado. No se proporcionó ningún token.', data: null, success: false });

  const token = authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Acceso denegado. Formato de token inválido.', data: null, success: false });

  try {
    const decoded = jwtUtil.verifyToken(token);
    req.user = decoded;
    next();
  } catch (error) {
    console.error('Error al verificar el token:', error);
    return res.status(500).json({ message: 'Error al verificar el token', data: null, success: false });
  }
};

export { isAuthenticated };