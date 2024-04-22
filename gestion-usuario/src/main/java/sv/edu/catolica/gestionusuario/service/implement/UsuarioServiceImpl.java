package sv.edu.catolica.gestionusuario.service.implement;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import sv.edu.catolica.gestionusuario.model.DTO.UsuarioDTO;
import sv.edu.catolica.gestionusuario.model.dao.UsuarioDAO;
import sv.edu.catolica.gestionusuario.model.entity.Usuario;
import sv.edu.catolica.gestionusuario.service.IUsuarioService;

import java.util.List;

@Service
public class UsuarioServiceImpl implements IUsuarioService {

    @Autowired
    private UsuarioDAO usuarioDao;

    @Override
    public Usuario save(Usuario usuario) {
        return null;
    }


    @Transactional
    @Override
    public Usuario save(UsuarioDTO usuarioDto) {
        Usuario usuario = Usuario.builder()
                .idUsuario(usuarioDto.getIdUsuario())
                .nombre(usuarioDto.getNombre())
                .apellido(usuarioDto.getApellido())
                .correo(usuarioDto.getCorreo())
                .fecha_nacimiento(usuarioDto.getFecha_nacimiento())
                .build();
        return usuarioDao.save(usuario);
    }

    @Transactional(readOnly = true)
    @Override
    public Usuario findById(Integer id) {
        return usuarioDao.findById(id).orElse(null);
    }

    @Transactional
    @Override
    public void delete(Usuario usuario) {
            usuarioDao.delete(usuario);
    }

    @Override
    public boolean existsById(Integer id) {
        return usuarioDao.existsById(id);
    }


    @Transactional
    @Override
    public Iterable<Usuario> findAll() {
        return usuarioDao.findAll();
    }

}
