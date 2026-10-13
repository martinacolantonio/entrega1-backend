import express from 'express';
import config from './config/env.config.js';
import ServiceManager from './managers/ServiceManager.js';

const app = express();
app.use(express.json());

const serviceManager = new ServiceManager();

// Obtener todos los servicios
app.get('/api/services', async (req, res) => {
    try {
        const services = await serviceManager.getServices();
        res.json({ status: 'success', payload: services });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
});

// Obtener servicio por ID
app.get('/api/services/:sid', async (req, res) => {
    try {
        const { sid } = req.params;
        const service = await serviceManager.getServiceById(sid);
        if (service.error) {
            return res.status(404).json({ status: 'error', message: service.error });
        }
        res.json({ status: 'success', payload: service });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
});

// Crear servicio
app.post('/api/services', async (req, res) => {
    try {
        const newService = await serviceManager.addService(req.body);
        if (newService.error) {
            return res.status(400).json({ status: 'error', message: newService.error });
        }
        res.status(201).json({ status: 'success', payload: newService });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
});

// Actualizar servicio
app.put('/api/services/:sid', async (req, res) => {
    try {
        const { sid } = req.params;
        const updated = await serviceManager.updateService(sid, req.body);
        if (updated.error) {
            return res.status(404).json({ status: 'error', message: updated.error });
        }
        res.json({ status: 'success', payload: updated });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
});

// Eliminar servicio
app.delete('/api/services/:sid', async (req, res) => {
    try {
        const { sid } = req.params;
        const deleted = await serviceManager.deleteService(sid);
        if (deleted.error) {
            return res.status(404).json({ status: 'error', message: deleted.error });
        }
        res.json({ status: 'success', payload: deleted });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
});

app.listen(config.port, () => {
    console.log(`Servidor corriendo exitosamente en el puerto ${config.port}`);
});