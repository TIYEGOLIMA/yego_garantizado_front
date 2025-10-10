# Sistema de Registro de Conductores - Yego

Landing page profesional para registro de conductores. Desarrollada con React, Tailwind CSS y backend Java Spring Boot.

## 🎨 Características

- ✨ Diseño moderno inspirado en Yego (rojo y blanco)
- 📱 Completamente responsive
- ⚡ Formulario de registro con validaciones
- 🔄 Carga dinámica de flotas desde API
- 📋 Modal de términos y condiciones interactivo
- 🚀 Integración con backend Java

## 🖼️ Campos del Formulario

- **Número de Licencia**: Campo de texto validado
- **Flota**: Select dinámico cargado desde el backend
- **Términos y Condiciones**: Modal interactivo que requiere lectura completa

## 🛠️ Tecnologías

### Frontend
- React 18
- Vite
- Tailwind CSS
- JavaScript ES6+

### Backend
- Java Spring Boot
- API REST

## 📦 Instalación

```bash
# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev
```

La aplicación estará disponible en `http://localhost:5173`

## ⚙️ Configuración del Backend

**IMPORTANTE**: Antes de usar la aplicación, debes configurar el backend Java.

Lee el archivo `BACKEND-SETUP.md` para instrucciones detalladas.

Pasos rápidos:
1. Copia `backend-config/CorsConfig.java` a tu proyecto Java
2. Asegúrate de que el backend esté corriendo en puerto 8080
3. Verifica que `/flotas` y `/registros` estén disponibles

## 📡 Endpoints

### GET /flotas
Obtiene la lista de flotas disponibles.

**Respuesta esperada:**
```json
[
  {
    "id": "123",
    "nombre": "Yego Lima",
    "ciudad": "Lima"
  }
]
```

### POST /registros
Crea un nuevo registro de conductor.

**Body:**
```json
{
  "licenciaNumero": "Q12345678",
  "partnerId": "123",
  "partnerName": "Yego Lima",
  "city": "Lima",
  "terminosAceptados": true
}
```

**Respuesta exitosa:**
```json
{
  "mensaje": "Registro creado exitosamente",
  "id": "456"
}
```

## 🎯 Estructura del Proyecto

```
src/
├── components/
│   ├── Hero.jsx              # Sección principal con formulario
│   ├── Footer.jsx            # Pie de página
│   └── ModalTerminos.jsx     # Modal de términos y condiciones
├── config/
│   └── api.js                # Configuración de endpoints
├── App.jsx                   # Componente principal
├── main.jsx                  # Punto de entrada
└── index.css                 # Estilos globales con Tailwind

backend-config/
└── CorsConfig.java           # Configuración CORS para Spring Boot
```

## 🎨 Personalización

### Cambiar colores
Edita `tailwind.config.js`:
```javascript
colors: {
  primary: {
    DEFAULT: '#FF0000', // Rojo principal
    dark: '#CC0000',
    light: '#FF3333',
  }
}
```

### Cambiar URL del backend
Edita `src/config/api.js`:
```javascript
const API_BASE_URL = 'http://localhost:8080' // Tu URL aquí
```

## 🔧 Scripts Disponibles

```bash
npm run dev      # Inicia el servidor de desarrollo
npm run build    # Construye para producción
npm run preview  # Vista previa de la build de producción
```

## 📱 Responsive

La aplicación está optimizada para:
- 📱 Móviles (< 768px)
- 💻 Tablets (768px - 1024px)
- 🖥️ Desktop (> 1024px)

## 🚀 Despliegue

### Frontend
Puedes desplegar en:
- Vercel
- Netlify
- GitHub Pages

### Backend
Recuerda actualizar:
1. La URL en `src/config/api.js`
2. Los orígenes permitidos en `CorsConfig.java`

## 📄 Información de Contacto

**Yego**
- Dirección: Av. Prolongación Iquitos 2299, Lince
- Teléfono: +51 905 459 777
- Email: sac@yego.pro

## 🏷️ Lema

**#YegoSiempreCumple ❤️**

---

© 2025 Yego. Todos los derechos reservados.
