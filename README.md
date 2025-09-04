# 🛩️ Calculadora de Costos de Vuelo

Una aplicación web profesional para calcular los costos operativos de vuelos de manera precisa, desarrollada con React y TypeScript.

## ✨ Características

- **Cálculo Automático de Costos**: Combustible, tripulación, mantenimiento, aterrizaje, navegación e impuestos
- **Gestión de Catálogos**: Aeronaves, pilotos, aeropuertos, programas de mantenimiento e impuestos
- **Análisis de Datos de Vuelo**: Procesamiento de datos CSV de Flightradar24
- **Interfaz Moderna**: Diseño responsive con tema oscuro
- **Validaciones Inteligentes**: Previene errores comunes y valida datos de entrada

## 🚀 Tecnologías

- **Frontend**: React 19 + TypeScript
- **Styling**: Tailwind CSS
- **Build Tool**: Vite
- **Deployment**: Vercel

## 📦 Instalación

```bash
# Clonar el repositorio
git clone https://github.com/tu-usuario/calculadora-costos-vuelo.git

# Instalar dependencias
npm install

# Ejecutar en desarrollo
npm run dev
```

## 🛠️ Scripts Disponibles

```bash
# Desarrollo
npm run dev

# Build para producción
npm run build

# Preview del build
npm run preview
```

## 📊 Datos Incluidos

- **3 Aeronaves**: LearJet LJ31, Piper Malibu, Bristell LSA
- **4 Pilotos**: Con diferentes costos por hora
- **100+ Aeropuertos**: México y USA con coordenadas precisas
- **Programas de Mantenimiento**: Configurables por aeronave
- **Sistema de Impuestos**: TUA, SENEAM, migración, aduana, IVA

## 🎯 Uso

1. **Selecciona una aeronave** del catálogo
2. **Elige los pilotos** (piloto al mando y primer oficial)
3. **Pega los datos del vuelo** en formato CSV de Flightradar24
4. **Calcula los costos** automáticamente
5. **Revisa el desglose detallado** de todos los costos

## 📁 Estructura del Proyecto

```
├── components/          # Componentes React
│   ├── managers/       # Gestores de catálogos
│   └── icons/          # Iconos SVG
├── lib/               # Utilidades y lógica de negocio
├── src/               # Estilos globales
├── types.ts           # Definiciones de TypeScript
├── constants.ts       # Datos iniciales
└── App.tsx           # Componente principal
```

## 🔧 Configuración

La aplicación incluye catálogos preconfigurados con:
- Aeropuertos de México y USA
- Diferentes tipos de aeronaves
- Programas de mantenimiento
- Estructura de impuestos

Todos los catálogos son editables desde la interfaz de usuario.

## 📈 Despliegue

### Vercel (Recomendado)

1. Conecta tu repositorio de GitHub a Vercel
2. Configura las variables de entorno si es necesario
3. Despliega automáticamente

### Build Manual

```bash
npm run build
# Los archivos se generan en la carpeta dist/
```

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para detalles.

## 👨‍💻 Autor

Desarrollado con ❤️ para la industria aeronáutica.

---

**Powered by pai-b | Todos los derechos reservados 2025 ©**