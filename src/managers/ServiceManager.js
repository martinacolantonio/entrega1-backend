import fs from 'fs';
import path from 'path';

export default class ServiceManager {
    constructor() {
        this.path = path.resolve('src/data/services.json');
        this.initFile();
    }

    async initFile() {
        try {
            await fs.promises.access(this.path);
        } catch (error) {
            await fs.promises.mkdir(path.dirname(this.path), { recursive: true });
            await fs.promises.writeFile(this.path, JSON.stringify([], null, 2));
        }
    }

    async getServices() {
        try {
            const data = await fs.promises.readFile(this.path, 'utf-8');
            return JSON.parse(data);
        } catch (error) {
            return [];
        }
    }

    async getServiceById(id) {
        const services = await this.getServices();
        const service = services.find(s => s.id === id);
        if (!service) {
            return { error: "Servicio no encontrado" };
        }
        return service;
    }

    async addService(serviceData) {
        const { name, description, duration, price, category, available } = serviceData;

        if (!name || !description || duration === undefined || price === undefined || !category || available === undefined) {
            return { error: "Faltan campos obligatorios para crear el servicio" };
        }

        const services = await this.getServices();
        
        const newService = {
            id: Date.now().toString(),
            name,
            description,
            duration: Number(duration),
            price: Number(price),
            category,
            available: Boolean(available)
        };

        services.push(newService);
        await fs.promises.writeFile(this.path, JSON.stringify(services, null, 2));
        return newService;
    }

    async updateService(id, updatedData) {
        const services = await this.getServices();
        const index = services.findIndex(s => s.id === id);
        
        if (index === -1) {
            return { error: "Servicio no encontrado para actualizar" };
        }

        delete updatedData.id; // Evita que modifiquen el id

        services[index] = { ...services[index], ...updatedData };
        await fs.promises.writeFile(this.path, JSON.stringify(services, null, 2));
        return services[index];
    }

    async deleteService(id) {
        const services = await this.getServices();
        const index = services.findIndex(s => s.id === id);
        
        if (index === -1) {
            return { error: "Servicio no encontrado para eliminar" };
        }

        const deleted = services.splice(index, 1);
        await fs.promises.writeFile(this.path, JSON.stringify(services, null, 2));
        return deleted[0];
    }
}