import express from 'express';

const router = express.Router();

router.post('/', (req, res) => {
    if (req.session.user){ 
        req.session.destroy((err) => {
            if (err){
                console.error(err);
                return res.status(500).json({
                    status: 'erro',
                    mensagem: 'Erro ao encerrar sessão.'
                });
            }
            res.clearCookie('connect.sid', {
                path:'/',
                httpOnly: true,
                sameSite: 'lax'
            });
            return res.json({
                status: 'ok',
                mensagem: 'Logout realizado com sucesso!'
            });
        })
    } else {
        return res.status(400).json({
            status: 'erro',
            mensagem: 'Nenhum usuário logado'
        })
    }
})

export default router;