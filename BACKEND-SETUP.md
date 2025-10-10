# Configuración del Backend Java

## Problema actual

Estás recibiendo errores de CORS y 404 porque:
1. El backend no está corriendo o no está en el puerto 8080
2. CORS no está configurado correctamente

## Solución

### 1. Agregar Configuración CORS

Copia el archivo `backend-config/CorsConfig.java` a tu proyecto Java en:
```
src/main/java/com/garantizado/backoffice/config/CorsConfig.java
```

### 2. Verificar que el Backend esté corriendo

Asegúrate de que tu aplicación Spring Boot esté corriendo en el puerto 8080.

Verifica en la consola que veas algo como:
```
Tomcat started on port(s): 8080 (http)
```

### 3. Probar los Endpoints

Abre tu navegador o Postman y verifica:

**GET Flotas:**
```
http://localhost:8080/flotas
```

Debería devolver un array JSON como:
```json
[
  {
    "id": "123",
    "nombre": "Yego Lima",
    "ciudad": "Lima"
  }
]
```

**POST Registro (con Postman):**
```
POST http://localhost:8080/registros
Content-Type: application/json

{
  "licenciaNumero": "Q12345678",
  "partnerId": "123",
  "partnerName": "Yego Lima",
  "city": "Lima",
  "terminosAceptados": true
}
```

### 4. Estructura esperada de FlotaResponse

Tu clase `FlotaResponse` debe tener estos campos:
```java
public class FlotaResponse {
    private String id;
    private String nombre;
    private String ciudad;
    
    // getters y setters
}
```

### 5. Si usas otro puerto

Si tu backend está en otro puerto (ej: 8081), actualiza el archivo:
```
src/config/api.js
```

Cambia:
```javascript
const API_BASE_URL = 'http://localhost:8081' // Tu puerto aquí
```

### 6. Para producción

Cuando despliegues a producción, actualiza la URL en `src/config/api.js`:
```javascript
const API_BASE_URL = 'https://tu-api-backend.com'
```

Y en `CorsConfig.java` agrega tu dominio:
```java
config.addAllowedOrigin("https://tu-frontend.com");
```

## Verificación

Una vez configurado, deberías ver en la consola del navegador:
- ✅ Las flotas se cargan correctamente
- ✅ El formulario se envía sin errores
- ✅ No hay errores de CORS

Si sigues teniendo problemas, verifica:
1. ✅ Backend corriendo en puerto 8080
2. ✅ CorsConfig.java está en tu proyecto
3. ✅ Los endpoints /flotas y /registros responden
4. ✅ Frontend corriendo en puerto 5173 (npm run dev)


