package sv.edu.catolica.gestionusuario.service;


import org.springframework.transaction.annotation.Transactional;
import sv.edu.catolica.gestionusuario.model.DTO.UsuarioDTO;
import sv.edu.catolica.gestionusuario.model.entity.Usuario;

import java.util.List;

public interface IUsuarioService {

    Usuario save(Usuario usuario);

    @Transactional



    Usuario save(UsuarioDTO usuarioDto);

    Usuario findById(Integer id);

    void delete(Usuario usuario);

    boolean existsById(Integer id);

    Iterable<Usuario> findAll();
}
