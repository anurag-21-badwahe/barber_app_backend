const Service = require('../../models/service_model');

// Create a new service
const createService = async (req, res) => {
    try {
        const {salonId} = req.params;
        const { name, duration, price, discount, category, description, popularity, isActive } = req.body;

        if (!salonId || !name || !duration || !price || !category) {
            return res.status(400).json({ message: "Required fields are missing" });
        }

        const newService = new Service({
            salonId,
            name,
            duration,
            price,
            discount,
            category,
            description,
            popularity,
            isActive
        });

        const savedService = await newService.save();
        res.status(201).json(savedService);
    } catch (error) {
        res.status(500).json({ message: "Error creating service", error: error.message });
    }
};

// Get all services for a specific salon
const getServicesBySalon = async (req, res) => {
    try {
        const { salonId } = req.params;
        const services = await Service.find({ salonId });
        
        if (!services.length) {
            return res.status(404).json({ message: "No services found for this salon" });
        }
        
        res.status(200).json(services);
    } catch (error) {
        res.status(500).json({ message: "Error fetching services", error: error.message });
    }
};

// Update a service by ID
const updateService = async (req, res) => {
    try {
        const { serviceId } = req.params;
        const updatedService = await Service.findByIdAndUpdate(serviceId, req.body, {
            new: true,
            runValidators: true
        });

        if (!updatedService) {
            return res.status(404).json({ message: "Service not found" });
        }

        res.status(200).json(updatedService);
    } catch (error) {
        res.status(500).json({ message: "Error updating service", error: error.message });
    }
};

// Delete a service by ID
const deleteService = async (req, res) => {
    try {
        const { serviceId } = req.params;
        const deletedService = await Service.findByIdAndDelete(serviceId);

        if (!deletedService) {
            return res.status(404).json({ message: "Service not found" });
        }

        res.status(200).json({ message: "Service deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting service", error: error.message });
    }
};

module.exports = {
    createService,
    getServicesBySalon,
    updateService,
    deleteService
};
