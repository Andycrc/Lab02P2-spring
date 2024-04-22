package sv.edu.catolica.gestionusuario.model.payload;

import lombok.Builder;
import lombok.Data;
import lombok.ToString;
import org.springframework.http.HttpStatusCode;

import java.io.Serializable;

@Data
@ToString
@Builder
public class MensajeResponse implements Serializable {
    private String error;
    private Object object;
}
