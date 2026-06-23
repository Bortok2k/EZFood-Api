
const bodyParser = require('body-parser');
const express = require('express');
const config = require('./config');
const cors = require('cors');

const EZBotRoutes = require('./v1/routes/EZBot.router');
const employeeRoutes = require('./v1/routes/employee.router');
const userRoutes = require('./v1/routes/user.router');
const authRoutes = require('./v1/routes/auth.router');
const addressRoutes = require('./v1/routes/address.router');
const menuRoutes = require('./v1/routes/menu.router');
const orderRoutes = require('./v1/routes/order.router');
const categoryRoutes = require('./v1/routes/category.router');
const clientRoutes = require('./v1/routes/client.route');
const insumoRoutes = require('./v1/routes/insumo.router');
const GastoRoutes = require('./v1/routes/Gasto.route');
const PlatoRoutes = require('./v1/routes/Plato.rourter');
const OrdenRoutes = require('./v1/routes/Orden.routes');
const facturaRoutes = require('./v1/routes/factura.router');
const swaggerDocs = require('./documentation/swagger');
const FacturaRoutes = require('./v1/routes/FacturaElectronica.router');
const MesaRoutes = require('./v1/routes/Mesa.routes');




//#region app config
const app = express();

app.use(express.json());
app.use(cors());
app.use(bodyParser.json());

app.get('', (req,res) => res.status(200).json({
        msg: "Server running in port "+ config.port
    })
);

app.use('/api/v1/user', userRoutes.routes);
app.use('/api/v1/auth', authRoutes.routes);
app.use('/api/v1/employee', employeeRoutes.routes);
app.use('/api/v1/address', addressRoutes.routes);
app.use('/api/v1/menu', menuRoutes.routes);
app.use('/api/v1/order', orderRoutes.routes);
app.use('/api/v1/category', categoryRoutes.routes);
app.use('/api/v1/client', clientRoutes.routes);
app.use('/api/v1/insumo', insumoRoutes.routes);
app.use('/api/v1/Gasto', GastoRoutes.routes);
app.use('/api/v1/Plato', PlatoRoutes.routes);
app.use('/api/v1/Orden', OrdenRoutes.routes);
app.use('/api/v1/factura', facturaRoutes.routes);
app.use('/api/v1/EZBot', EZBotRoutes.routes);
app.use('/api/v1/FacturaElectronica', FacturaRoutes.routes);
app.use('/api/v1/Mesa', MesaRoutes.routes);

//#endregion

//#region startup
async function main(){
    try{
        app.listen(
            config.port || 8080,
            () => console.log("Server running in port "+ config.port)
        ); 
        swaggerDocs.swaggerDocs(app, config.port);   
    }catch(e){
        throw new Error(e);
    }
}

main();
//#endregion

module.exports = app;