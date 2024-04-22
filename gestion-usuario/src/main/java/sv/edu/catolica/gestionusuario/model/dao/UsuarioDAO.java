package sv.edu.catolica.gestionusuario.model.dao;

import org.springframework.data.repository.CrudRepository;
import sv.edu.catolica.gestionusuario.model.entity.Usuario;

public interface UsuarioDAO extends CrudRepository<Usuario, Integer> {
}
