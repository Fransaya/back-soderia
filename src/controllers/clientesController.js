//? importaciones de funciones del servicio

import { 
    getAllClientService,
    getClientByIdService,
    createClientService,
    updateClientService,
} from "../services/clienteService.js";

// obtener todos los clientes
export const getClienteController = async(req,res)=>{
    try {
        const clientes = await getAllClientService();

        // console.log("clientes", clientes)

        if(clientes.status === false) return res.status(404).json({message: clientes.message}); 

        return res.status(200).json(clientes);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// obtener cliente por id
export const getClienteIdController = async(req,res)=>{
    const { id } = req.params;
    try {
        const cliente = await getClientByIdService(id);

        if(cliente.status === false) return res.status(404).json({message: cliente.message});

        return res.status(200).json(cliente);   
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// crear cliente
export const postClienteController = async(req, res)=>{
    const cliente = req.body
    try {
        
        const nuevoCliente= await createClientService(cliente);

        console.log("respuesta", nuevoCliente)

        if(nuevoCliente.status === false) return res.status(404).json({message: nuevoCliente.message});

        return res.status(200).json(nuevoCliente);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};  

// actualizardatos cliente
export const putClienteController = async(req, res)=>{
    const { id } = req.params;
    const cliente = req.body;
    try {
        const clienteActualizado = await updateClientService(id, cliente);

        if(clienteActualizado.status === false) return res.status(404).json({message: clienteActualizado.message});

        return res.status(200).json(clienteActualizado);    
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
