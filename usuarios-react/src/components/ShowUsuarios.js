import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';


const showAlert = (title, text, icon) => {
    Swal.fire({
        title: title,
        text: text,
        icon: icon,
        timer: 1500,
        showConfirmButton: false
    });
};

const ShowUsuarios = () => {
    const url ='http://localhost:8092/api/v1/user';
    const [usuarios, setUsuarios] = useState([]);
    const [nuevoUsuario, setNuevoUsuario] = useState({
        nombre: '',
        apellido: '',
        correo: '',
        fecha_nacimiento: ''
    });
    const [usuarioSeleccionado, setUsuarioSeleccionado] = useState(null);

    useEffect(() => {
        getUsuarios();
    }, []);

    const getUsuarios = async () => {
        try {
            const respuesta = await axios.get(url);
            if (Array.isArray(respuesta.data.object)) {
                const usuariosConSelected = respuesta.data.object.map(usuario => ({ ...usuario, selected: false }));
                setUsuarios(usuariosConSelected);
            } else {
                console.error('La respuesta de la API no contiene un arreglo de usuarios');
            }
        } catch (error) {
            console.error('Error al obtener usuarios:', error);
        }
    };


    const handleChange = (e) => {
        const { name, value } = e.target;
        setNuevoUsuario(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post(url, nuevoUsuario);
            showAlert('¡Usuario agregado!', 'El usuario ha sido agregado exitosamente.', 'success');
            getUsuarios();
            clearForm();
            closeModal('modalUsuarios');
        } catch (error) {
            console.error('Error al agregar usuario:', error);
            showAlert('Error', 'Hubo un error al agregar el usuario.', 'error');
        }
    };
    
    
    

    const handleDelete = async (usuarioId) => {
        Swal.fire({
            title: '¿Estás seguro?',
            text: 'Esta acción no se puede deshacer.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Sí, eliminar'
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await axios.delete(`${url}/${usuarioId}`);
                    showAlert('¡Usuario eliminado!', 'El usuario ha sido eliminado exitosamente.', 'success');
                    setTimeout(() => {
                        window.location.reload(); 
                    }, 500); 
                    getUsuarios();
                } catch (error) {
                    console.error('Error al eliminar usuario:', error);
                    showAlert('Error', 'Hubo un error al eliminar el usuario.', 'error');
                }
            }
        });
    };

    const handleDeleteMultiple = async () => {
        const selectedUserIds = usuarios.filter(usuario => usuario.selected).map(usuario => usuario.idUsuario);
        if (selectedUserIds.length === 0) {
            showAlert('Advertencia', 'Por favor, selecciona al menos un usuario para eliminar.', 'warning');
            return;
        }

        Swal.fire({
            title: '¿Estás seguro?',
            text: 'Esta acción no se puede deshacer.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Sí, eliminar'
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await Promise.all(selectedUserIds.map(async (usuarioId) => {
                        await axios.delete(`${url}/${usuarioId}`);
                    }));
                    showAlert('¡Usuarios eliminados!', 'Los usuarios han sido eliminados exitosamente.', 'success');
                    setTimeout(() => {
                        window.location.reload(); 
                    }, 500); 
                    getUsuarios();

                } catch (error) {
                    console.error('Error al eliminar usuarios:', error);
                    showAlert('Error', 'Hubo un error al eliminar los usuarios.', 'error');
                }
            }
        });
    };

    const handleSelectAll = () => {
        const updatedUsuarios = usuarios.map(usuario => ({
            ...usuario,
            selected: !usuario.selected
        }));
        setUsuarios(updatedUsuarios);
    };

    const handleSelectUser = (usuarioId) => {
        const updatedUsuarios = usuarios.map(usuario => {
            if (usuario.idUsuario === usuarioId) {
                return {
                    ...usuario,
                    selected: !usuario.selected
                };
            }
            return usuario;
        });
        setUsuarios(updatedUsuarios);
    };

    const clearForm = () => {
        setNuevoUsuario({
            nombre: '',
            apellido: '',
            correo: '',
            fecha_nacimiento: ''
        });
    };


    const handleEdit = (usuario) => {
        setUsuarioSeleccionado(usuario);
        openModal('modalEditarUsuario');
    };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    if (!(date instanceof Date && !isNaN(date))) {
        // Si no podemos parsear la fecha, devolvemos la cadena original
        return dateString;
    }
    const year = date.getUTCFullYear();
    const month = String(date.getUTCMonth() + 1).padStart(2, '0');
    const day = String(date.getUTCDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
    };
 
    const handleEditSubmit = async (e) => {
        e.preventDefault();
        try {
            console.log('ID del usuario seleccionado:', usuarioSeleccionado.idUsuario);
            // Aquí debes enviar el usuario seleccionado actualizado a la API para actualizarlo
            await axios.put(`${url}/${usuarioSeleccionado.idUsuario}`, usuarioSeleccionado);
            getUsuarios(); // Actualiza la lista de usuarios después de actualizar el usuario seleccionado
            closeModal('modalEditarUsuario');
            showAlert('¡Usuario actualizado!', 'El usuario ha sido actualizado exitosamente.', 'success'); // Mueve showAlert aquí
        } catch (error) {
            console.error('Error al actualizar usuario:', error);
            showAlert('Error', 'Hubo un error al actualizar el usuario.', 'error');
        }
    };
    
    const handleEditChange = (e) => {
        const { name, value } = e.target;
        // Clonar el usuario seleccionado y actualizar el campo cambiado
        const updatedUser = { ...usuarioSeleccionado, [name]: value };
        console.log('Fecha de nacimiento actualizada:', updatedUser.fecha_nacimiento); // Agrega esta línea para imprimir la fecha actualizada
        setUsuarioSeleccionado(updatedUser);
    };
    

    const closeModal = (modalId) => {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.remove('show');
            modal.setAttribute('aria-hidden', 'true');
            modal.setAttribute('style', 'display: none');
            const backdrop = document.getElementsByClassName('modal-backdrop')[0];
            if (backdrop) {
                backdrop.remove();
            }
        }
    };

    const openModal = (modalId) => {
        const modal = document.getElementById(modalId);
        modal.classList.add('show');
        modal.setAttribute('aria-hidden', 'false');
        modal.setAttribute('style', 'display: block');
    };


    return (
        <div className='App'>
             <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
                <div className="container-fluid">
                    <a className="navbar-brand" href="http://localhost:3000/">Laboratorio02</a>
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarNav">
                        <ul className="navbar-nav">
                        
                        </ul>
                    </div>
                </div>
            </nav>
            <div className='container-fluid mt-5'>
                <div className='row mt-3'>
                    <div className='col-md-4 offset-md-4'>
                        <div className='d-grid mx-auto'>
                            <button className='btn btn-success' data-bs-toggle='modal' data-bs-target='#modalUsuarios'>
                                <i className='fa-solid fa-circle-plis'></i> Agregar
                            </button>
                           
                        </div>
                    </div>
                </div>
                <div className='row mt-3'>
                    <div className='col-12 col-lg-8 offset-lg-2'>
                        <div className='table-responsive'>
                            <table className='table table-bordered'>
                                <thead>
                                    <tr>
                                        <th><input type="checkbox" onChange={handleSelectAll} /></th>
                                        <th>Nombre</th>
                                        <th>Apellido</th>
                                        <th>Email</th>
                                        <th>Fecha de Nacimiento</th>
                                        <th>Acciones</th>
                                    </tr>
                                </thead>
                                <tbody className='table-group-divider'>
                                    {usuarios.map((usuario) => (
                                        <tr key={usuario.idUsuario}>
                                            <td><input type="checkbox" onChange={() => handleSelectUser(usuario.idUsuario)} checked={usuario.selected} /></td>
                                            <td>{usuario.nombre}</td>
                                            <td>{usuario.apellido}</td>
                                            <td>{usuario.correo}</td>
                                            <td>{formatDate(usuario.fecha_nacimiento)}</td>
                                            <td>
                                                <button className='btn btn-warning' onClick={() => handleEdit(usuario)}>
                                                    <i className='fa-solid fa-edit'></i> Editar
                                                </button>
                                                &nbsp;
                                                <button className='btn btn-danger' onClick={() => handleDelete(usuario.idUsuario)}>
                                                    <i className='fa-solid fa-trash'></i> Borrar
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <button className='btn btn-danger ms-2' onClick={handleDeleteMultiple}>
                                <i className='fa-solid fa-trash'></i> Eliminar Seleccionados
                        </button>
                    </div>
                    
                </div>
            </div>

            {/* Modal para agregar usuario */}
            <div className='modal fade' id='modalUsuarios' tabIndex='-1' aria-labelledby='modalUsuariosLabel' aria-hidden='true'>
                <div className='modal-dialog'>
                    <div className='modal-content'>
                        <div className='modal-header'>
                            <h5 className='modal-title' id='modalUsuariosLabel'>Agregar Usuario</h5>
                            <button type='button' className='btn-close' data-bs-dismiss='modal' aria-label='Close'></button>
                        </div>
                        <div className='modal-body'>
                            <form onSubmit={handleSubmit}>
                                <div className='mb-3'>
                                    <label htmlFor='nombre' className='form-label'>Nombre</label>
                                    <input type='text' className='form-control' id='nombre' name='nombre' value={nuevoUsuario.nombre} onChange={handleChange} required />
                                </div>
                                <div className='mb-3'>
                                    <label htmlFor='apellido' className='form-label'>Apellido</label>
                                    <input type='text' className='form-control' id='apellido' name='apellido' value={nuevoUsuario.apellido} onChange={handleChange} required />
                                </div>
                                <div className='mb-3'>
                                    <label htmlFor='correo' className='form-label'>Correo</label>
                                    <input type='email' className='form-control' id='correo' name='correo' value={nuevoUsuario.correo} onChange={handleChange} required />
                                </div>
                                <div className='mb-3'>
                                    <label htmlFor='fecha_nacimiento' className='form-label'>Fecha de Nacimiento</label>
                                    <input type='date' className='form-control' id='fecha_nacimiento' name='fecha_nacimiento' value={nuevoUsuario.fecha_nacimiento} onChange={handleChange} required />
                                </div>
                                <button type='submit' className='btn btn-primary'>Agregar</button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal para editar usuario */}
            <div className='modal fade' id='modalEditarUsuario' tabIndex='-1' aria-labelledby='modalEditarUsuarioLabel' aria-hidden='true'>
                <div className='modal-dialog'>
                    <div className='modal-content'>
                        <div className='modal-header'>
                            <h5 className='modal-title' id='modalEditarUsuarioLabel'>Editar Usuario</h5>
                            <button type='button' className='btn-close' aria-label='Close' onClick={() => closeModal('modalEditarUsuario')}></button>
                        </div>
                        <div className='modal-body'>
                            <form onSubmit={handleEditSubmit}>
                                <div className='mb-3'>
                                    <label htmlFor='editNombre' className='form-label'>Nombre</label>
                                    <input type='text' className='form-control' id='editNombre' name='nombre' value={usuarioSeleccionado ? usuarioSeleccionado.nombre : ''} onChange={handleEditChange} required />
                                </div>
                                <div className='mb-3'>
                                    <label htmlFor='editApellido' className='form-label'>Apellido</label>
                                    <input type='text' className='form-control' id='editApellido' name='apellido' value={usuarioSeleccionado ? usuarioSeleccionado.apellido : ''} onChange={handleEditChange} required />
                                </div>
                                <div className='mb-3'>
                                    <label htmlFor='editCorreo' className='form-label'>Correo</label>
                                    <input type='email' className='form-control' id='editCorreo' name='correo' value={usuarioSeleccionado ? usuarioSeleccionado.correo : ''} onChange={handleEditChange} required />
                                </div>
                                <div className='mb-3'>
                                    <label htmlFor='editFechaNacimiento' className='form-label'>Fecha de Nacimiento</label>
                                    <input type='date' className='form-control' id='editFechaNacimiento' name='fecha_nacimiento'  value={usuarioSeleccionado ? formatDate(usuarioSeleccionado.fecha_nacimiento) : ''} onChange={handleEditChange}  required />

                                </div>
                                <button type='submit' className='btn btn-primary'>Guardar cambios</button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    );
};

export default ShowUsuarios;
