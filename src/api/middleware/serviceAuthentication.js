export function verificarLogin(req, res, next){
    if (!req.session || !req.session.user){
        return res.status(401).json({
            status: 'erro',
            mensagem:'Acesso negado. Faça login para continuar.'
        });
    }
    
    next();
}