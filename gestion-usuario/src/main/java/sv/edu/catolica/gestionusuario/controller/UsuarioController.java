package sv.edu.catolica.gestionusuario.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataAccessException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import sv.edu.catolica.gestionusuario.model.DTO.UsuarioDTO;
import sv.edu.catolica.gestionusuario.model.entity.Usuario;
import sv.edu.catolica.gestionusuario.model.payload.MensajeResponse;
import sv.edu.catolica.gestionusuario.service.IUsuarioService;

import java.util.List;


@RestController
@RequestMapping("/api/v1")
public class UsuarioController {
    @Autowired
    private IUsuarioService usuarioService;

    //create new user
    @PostMapping("user")
    public ResponseEntity<?> create(@RequestBody UsuarioDTO usuarioDto) {
        Usuario usuarioSave = null;
        try {
            usuarioSave = usuarioService.save(usuarioDto);
            return new ResponseEntity<>(MensajeResponse.builder()
                    .error("Save User")
                    .object(UsuarioDTO.builder()
                            .idUsuario(usuarioSave.getIdUsuario())
                            .nombre(usuarioSave.getNombre())
                            .apellido(usuarioSave.getApellido())
                            .correo(usuarioSave.getCorreo())
                            .fecha_nacimiento(usuarioSave.getFecha_nacimiento())
                            .build())
                    .build()
                    , HttpStatus.CREATED);

        }catch (DataAccessException e){
            return new ResponseEntity<>(
                    MensajeResponse.builder()
                            .error(e.getMessage())
                            .object(null)
                            .build()
                    , HttpStatus.METHOD_NOT_ALLOWED);

        }

    }

    //update user
    @PutMapping("user/{id}")
    public ResponseEntity<?> update(@RequestBody UsuarioDTO usuarioDto,@PathVariable Integer id) {
         Usuario usuarioUpdate = null;
        try {

            if(usuarioService.existsById(id)){
                usuarioDto.setIdUsuario(id);
                usuarioUpdate = usuarioService.save(usuarioDto);
                return new ResponseEntity<>(MensajeResponse.builder()
                        .error("Update User")
                        .object(UsuarioDTO.builder()
                                .idUsuario(usuarioUpdate.getIdUsuario())
                                .nombre(usuarioUpdate.getNombre())
                                .apellido(usuarioUpdate.getApellido())
                                .correo(usuarioUpdate.getCorreo())
                                .fecha_nacimiento(usuarioUpdate.getFecha_nacimiento())
                                .build())
                        .build()
                        , HttpStatus.CREATED);
            } else {
                return new ResponseEntity<>(
                        MensajeResponse.builder()
                                .error("Usuario no encontrado para actualizar")
                                .object(null)
                                .build()
                        , HttpStatus.NOT_FOUND);
            }
        }catch (DataAccessException e){
            return new ResponseEntity<>(
                    MensajeResponse.builder()
                            .error(e.getMessage())
                            .object(null)
                            .build()
                    , HttpStatus.INTERNAL_SERVER_ERROR);

        }
    }

    //delete user
    @DeleteMapping("user/{id}")

    public ResponseEntity<?> delete(@PathVariable Integer id) {
        try {
            Usuario usuarioDelete = usuarioService.findById(id);
            usuarioService.delete(usuarioDelete);
            return new ResponseEntity<>(usuarioDelete, HttpStatus.NO_CONTENT);
        }catch (DataAccessException e){
            return new ResponseEntity<>(
                    MensajeResponse.builder()
                        .error(e.getMessage())
                        .object(null)
                            .build()
                    , HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    //find by id
    @GetMapping("user/{id}")
    public ResponseEntity<?> showById(@PathVariable Integer id) {
        Usuario usuario = usuarioService.findById(id);
        if (usuario == null) {
            return new ResponseEntity<>(
                    MensajeResponse.builder()
                            .error("El registro no se ha encontrado")
                            .object(null)
                            .build()
                    , HttpStatus.INTERNAL_SERVER_ERROR);
        }
        return new ResponseEntity<>(
                MensajeResponse.builder()
                        .error("")
                        .object(UsuarioDTO.builder()
                                .idUsuario(usuario.getIdUsuario())
                                .nombre(usuario.getNombre())
                                .apellido(usuario.getApellido())
                                .correo(usuario.getCorreo())
                                .fecha_nacimiento(usuario.getFecha_nacimiento())
                                .build())
                        .build()
                , HttpStatus.OK);
    }

    // get all users
    @GetMapping("user")
    public ResponseEntity<?> getAllUsers() {
        List<Usuario> usuarios = (List<Usuario>) usuarioService.findAll();
        if (usuarios.isEmpty()) {
            return new ResponseEntity<>(
                    MensajeResponse.builder()
                            .error("No hay usuarios disponibles")
                            .object(null)
                            .build(),
                    HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity<>(
                MensajeResponse.builder()
                        .error("")
                        .object(usuarios)
                        .build(),
                HttpStatus.OK);
    }


    
}
