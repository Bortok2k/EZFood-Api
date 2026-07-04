const { verifyToken } = require('../helpers/jwt');

// Verifica que el token sea válido (admin o employee)
const requireAuth = (req, res, next) => {
    const { authorization } = req.headers;

    if (!authorization) {
        return res.status(403).json({ msg: 'Token requerido' });
    }

    const auth = verifyToken(authorization);

    if (!auth.status) {
        return res.status(403).json({ msg: 'invalid token' });
    }

    req.user = auth.decoded;
    next(); // ← crítico, sin esto la petición nunca continúa
};

// Solo admin (rol 1)
const requireAdmin = (req, res, next) => {
    const { authorization } = req.headers;

    if (!authorization) {
        return res.status(403).json({ msg: 'Token requerido' });
    }

    const auth = verifyToken(authorization);

    if (!auth.status) {
        return res.status(403).json({ msg: 'invalid token' });
    }

    if (auth.decoded.rol != 1) {
        return res.status(401).json({ msg: 'unauthorized' });
    }

    req.user = auth.decoded;
    next();
};

// Admin o empleado (rol 1 o 2)
const requireEmployee = (req, res, next) => {
    const { authorization } = req.headers;

    if (!authorization) {
        return res.status(403).json({ msg: 'Token requerido' });
    }

    const auth = verifyToken(authorization);

    if (!auth.status) {
        return res.status(403).json({ msg: 'invalid token' });
    }

    if (auth.decoded.rol != 1 && auth.decoded.rol != 2) {
        return res.status(401).json({ msg: 'unauthorized' });
    }

    req.user = auth.decoded;
    next();
};

module.exports = {
    requireAdmin,
    requireEmployee
};