package sv.edu.catolica.gestionusuario.model.DTO;

import jakarta.persistence.*;
import lombok.*;

import java.io.Serializable;
import java.util.Date;


@Data
@ToString
@Builder
public class UsuarioDTO implements Serializable {

    private Integer idUsuario;
    private String nombre;
    private String apellido;
    private String correo;
    private Date fecha_nacimiento;
}
