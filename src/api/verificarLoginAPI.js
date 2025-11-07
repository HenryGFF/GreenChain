import express from 'express';

const router = express.Router();

router.get('/', (req, res) => {
    if (req.session && req.session.user) {
        return res.status(200).json({
            status: 'ok',
            mensagem: 'Usuário autenticado',
            empresa: req.session.user
        });
    } else {
        return res.status(401).json({
            status: 'erro',
            mensagem: 'Usuário não autenticado'
        });
    }
});

export default router;