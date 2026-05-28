const GastoService = require('../services/Gasto.service');

const CreateGasto = async (req,res) => {
    try{
        await GastoService.CreateGasto(req.body);

        res.status(200).json({
            msg : 'Gasto creado exitosamente'
        });
        
    }catch (e) {
        console.error(e);
        res.status(500).json({
            msg: 'Error interno del servidor'
        });
    }
};

const GetGasto = async (req,res) => {
    try{

        const data = await GastoService.GetGasto();

        if(data.length === 0){
            return res.status(404).json({
                msg: 'No data'
            })
        }

        res.status(200).json({
            data : data
        })

    }catch (e) {
        console.error(e);
        res.status(500).json({
            msg: 'Internal server error'
        });
    }
};

const GastoUpdate = async (req, res) => {
    try {
        await GastoService.GastoUpdate(req.params.id, req.body);

        res.status(200).json({
            msg: 'Gasto updated successfully'
        });
    } catch (e) {
        console.error(e);
        res.status(500).json({
            msg: 'Internal server error'
        });
    }
};

const GastoDelete = async (req, res) => {
    try {
        await GastoService.GastoDelete(req.params.id);

        res.status(200).json({
            msg: 'insumo deleted successfully'
        });
    } catch (e) {
        console.error(e);
        res.status(500).json({
            msg: 'Internal server error'
        });
    }
};

module.exports = {
    CreateGasto,
    GetGasto,
    GastoUpdate,
    GastoDelete
};