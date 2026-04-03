# 🥐 Dulzuras El Balcón - Pastelería Artesanal
Bienvenido al repositorio oficial de la Single Page Application (SPA) de Dulzuras El Balcón, ubicada en Barrio El Balcón, Alto Comedero, Jujuy. Este sitio está diseñado con un estilo moderno (tipo Instagram), optimizado para dispositivos móviles y enfocado en la conversión mediante WhatsApp.
## 🚀 Características del Sitio
### Dos Canales de Venta:
*¡Salidos del Horno!*: Productos con stock inmediato.


*Para Encargar*: Catálogo general con anticipación mínima de 48hs.


### Lógica de Carrito Independiente: 
El usuario puede armar su pedido y el formulario se genera dinámicamente.


### Integración con WhatsApp: 
Envía un mensaje estructurado con el detalle del pedido, total, método de pago y ubicación.


### Geolocalización: 
Autocompletado de direcciones mediante Google Maps API.


### Galería Accesible: 
Icono de lupa en cada producto para ampliar imágenes con gestión de foco para personas con movilidad reducida.


### Diseño Responsivo: 
Paleta de colores rústica (Verde Oliva, Crema, Chocolate) optimizada para móviles.
## 📁 Estructura del Proyecto
```
/mi-pasteleria-balcon
├── index.html          # Estructura principal (SPA)
├── style.css           # Estilos y diseño (Tailwind/Custom)
├── script.js           # Lógica de carrito, envíos y WhatsApp
├── productos.json      # Base de datos local (Precios y Stock)
└── /assets             # Recursos estáticos
    ├── /img            # Fotos de productos (Panes, Paletas, Huevos)
    └── logo.png        # Logo del emprendimiento
```
## 🛠️ Cómo administrar los productos
Para cambiar precios o productos, no necesitas tocar el código principal. Solo debes editar el archivo productos.json:
Abre productos.json.
Para cambiar un precio: Modifica el valor en el campo "precio".
Para ocultar un producto: Cambia "disponible": true por "disponible": false.
Para usar tus fotos:
Guarda tu foto en assets/img/tu-foto.jpg.
En el JSON, cambia el campo "img" por "assets/img/tu-foto.jpg".
## ⚙️ Configuración Inicial
1. Google Maps API
Para que el buscador de direcciones funcione, debes obtener una API Key en Google Cloud Console y pegarla al final del archivo index.html:
code
Html
<script src="https://maps.googleapis.com/maps/api/js?key=TU_API_KEY_AQUI&libraries=places..."></script>
2. Número de WhatsApp
Si deseas cambiar el número de recepción, busca en script.js la función enviarWhatsApp y actualiza el número:
code
JavaScript
window.open(`https://wa.me/5493885187505?text=${msg}`, '_blank');
## ☁️ Despliegue en Vercel
Este proyecto está optimizado para Vercel:
Sube estos archivos a un repositorio de GitHub.
Entra en Vercel.com y conecta tu repositorio.
Vercel detectará el index.html y publicará tu sitio automáticamente.
Cada vez que hagas un cambio en productos.json y lo subas a GitHub, el sitio se actualizará solo.
## ♿ Accesibilidad
El sitio cumple con estándares básicos de accesibilidad:
Áreas de clic superiores a 44x44px.
Foco visible con alto contraste para navegación por teclado.
Etiquetas aria-label en botones críticos e iconos.
Gestión de foco en modales de imagen.
Dulzuras El Balcón - Sabor artesanal de Alto Comedero para todo Jujuy.
