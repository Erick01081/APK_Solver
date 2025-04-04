# 📱 APK Solver

**APK Solver** es una aplicación móvil que conecta personas que ofrecen servicios básicos con quienes los necesitan, de manera rápida, segura y eficiente. Está diseñada para reducir la informalidad en el mercado laboral, facilitando la contratación directa de trabajadores independientes sin intermediarios costosos. 

La aplicación permite:
- Buscar y ofrecer servicios (domésticos, técnicos, etc.).
- Contratar de forma segura gracias a un sistema de verificación y calificaciones.
- Integrar pagos digitales y suscripciones premium.
- Fomentar el empleo local y el emprendimiento independiente.

---

## Tecnologías utilizadas

A continuación se listan las principales tecnologías y herramientas usadas en el desarrollo:

| Tecnología             | Uso principal                                                                 |
|------------------------|-------------------------------------------------------------------------------|
| React Native           | Framework principal para crear apps móviles multiplataforma                  |
| Expo                   | Plataforma para construir y probar apps con React Native                     |
| TypeScript             | Tipado estático para mejorar la mantenibilidad del código                    |
| React Navigation       | Manejo de navegación entre pantallas                                          |
| Context API            | Gestión de estado global (ej. temas visuales)                                 |
| Hooks personalizados   | Reutilización de lógica funcional (modo oscuro, temas, etc.)                  |
| Themed Components      | Componentes visuales adaptativos al modo claro/oscuro                        |
| Haptics                | Retroalimentación háptica en botones y pestañas                              |
| Parallax ScrollView    | Scroll con efecto visual interactivo                                          |
| Script JS (Node)       | Automatización de limpieza y reinicio del proyecto (`reset-project.js`)       |
| Pruebas unitarias      | Verificación funcional de componentes (`__tests__`)                           |

---

## Estructura del Proyecto

| Carpeta        | Descripción                                                                 |
|----------------|-----------------------------------------------------------------------------|
| `app/`         | Pantallas de la aplicación y configuración de navegación                    |
| `assets/`      | Recursos estáticos como imágenes y fuentes                                  |
| `components/`  | Componentes reutilizables (temas, botones, pestañas, animaciones, etc.)     |
| `context/`     | Contexto global para manejar el tema visual (oscuro/claro)                  |
| `data/`        | Datos precargados como listas de trabajos u ofertas                         |
| `hooks/`       | Hooks personalizados (modo oscuro, tema dinámico, etc.)                     |
| `scripts/`     | Script auxiliar para resetear el proyecto                                   |

---

## Cómo ejecutar el proyecto

1. Clona el repositorio:

```bash
git clone https://github.com/Erick01081/APK_Solver.git
cd APK_Solver
```

2. Instala las dependencias:

   ```bash
   npm install
   ```

3. Ejecuta el proyecto con Expo:
   
   ```bash
    npx expo start
   ```


Podrás usar diferentes opciones para abrir la aplicación tal como:

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go)
