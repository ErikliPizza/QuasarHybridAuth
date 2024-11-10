## About this

This is a hybrid starter kit ([see back-end repo](https://github.com/ErikliPizza/SanctumHybridAuth)) for your projects, seamlessly integrating Laravel Sanctum for backend authentication and Quasar for the frontend framework. The combination provides an efficient, secure, and modern development environment ideal for full-stack applications. This starter kit is designed to accelerate project setup, simplify authentication processes, and offer a robust foundation for your hybrid web or mobile applications.


## Why Keep it Hybrid

The hybrid approach in this starter kit leverages Laravel Sanctum and Quasar to provide a comprehensive full-stack framework, blending the best practices for both SPA and Token-Based authentication. Here is how this method works and why it benefits your project:

### Key Authentication Methods:
1. **SPA Authentication**:
  - Utilizes Laravel Sanctum to handle secure, session-based authentication for single-page applications (SPAs). This method ensures a smooth user experience by maintaining session state without needing traditional API tokens.
  - Ideal for applications where the frontend is tightly coupled with the backend, providing seamless protection for routes without excessive configuration.

2. **Token-Based Authentication**:
  - Allows for flexible API token management for authentication purposes. This method is perfect for scenarios where third-party services or mobile applications need access to the backend API.
  - Tokens are generated and managed efficiently through Sanctum, making it easy to create, revoke, and control access levels.

### Benefits of the Hybrid Approach:
- **Versatile Authentication Options**: Choose the best-fit authentication method for different parts of your project.
- **Secure and Scalable**: Sanctum’s session cookies provide security for SPAs, while tokens support secure API access for external integrations.
- **Consistent Development Workflow**: Integrates smoothly with Quasar’s frontend capabilities to manage client-side state and routing.
- **Enhanced User Experience**: Supports rapid navigation and real-time data interactions, essential for modern web and mobile apps.

### What Happens if We Use Token-Based Auth for SPAs?

While using token-based authentication for SPAs is technically possible, it comes with certain trade-offs:

- **Increased Complexity**: Token management requires explicit handling in the client, including storage, retrieval, and renewal. This can lead to vulnerabilities if tokens are not stored securely.
- **CSRF Protection Limitations**: Sanctum is session-based authentication provides built-in CSRF protection, which is bypassed when using token-based authentication for SPAs. This makes your application more susceptible to CSRF attacks if additional precautions are not taken.
- **Less Seamless User Experience**: Managing token expiration and refreshing adds complexity to the frontend logic, potentially disrupting the user experience with forced logouts or token renewal prompts.

### Security Concerns with Token Storage
- **Local Storage Risks**: Storing tokens in the browser is local storage or session storage can expose them to potential XSS (Cross-Site Scripting) attacks. If an attacker can inject malicious scripts into your site, they could access and steal the token from local storage, resulting in compromised user accounts.
- **Best Practices**: To mitigate these risks, tokens should ideally be stored in secure, httpOnly cookies. This approach ensures that the tokens are not accessible through JavaScript, significantly reducing the risk of token theft through XSS.

**Recommendation**: For SPAs directly interacting with a Laravel backend, it is generally best to use Sanctum's session-based SPA authentication for simplicity, security, and built-in CSRF protection. Our hybrid starter kit addresses this concern by integrating both session-based SPA authentication and token-based authentication in a secure, efficient way with the power of Quasar.

## Additional Features and Components

To accelerate development and showcase the capabilities of the hybrid starter kit, we have included several additional features and components. These include:

### Included Features:
- **Enums and Validation Logic**: Predefined enums and validation logic are incorporated to simplify common tasks and ensure consistency throughout the project.
- **Layout Examples**: Ready-to-use layout templates are provided to help you quickly set up your application’s structure and design.
- **Demo Components**: Sample components are included to demonstrate various use cases and best practices when building with Laravel Sanctum and Quasar. These components serve as a reference for integrating authentication and other features.

### Customization Note:
While these additional elements are designed to speed up development and offer practical examples, they are optional. Developers are encouraged to review these features and remove any components, enums, or validation logic that are not necessary for their specific projects. This will help maintain a lean codebase and avoid unnecessary dependencies.

**Reminder**: These supplementary tools are meant to be starting points, providing guidance and inspiration for your own implementations.



## Cross-Platform Development Support

One of the standout features of this hybrid starter kit is its support for cross-platform development, powered by Quasar CLI. This integration allows you to build applications that run seamlessly on multiple platforms, including:

- **Mobile Applications**: Utilize **Capacitor** or **Cordova** to compile your Quasar project into mobile apps for iOS and Android.
- **Desktop Applications**: Build cross-platform desktop applications using **Electron**, enabling you to create powerful desktop apps with a web-based frontend.

### Benefits of Cross-Platform Development:
- **Unified Codebase**: Develop your application once and deploy it across web, mobile, and desktop without rewriting significant portions of the code.
- **Consistent User Experience**: Quasar ensures that your application maintains a consistent look and feel, no matter the platform.
- **Time and Cost Efficiency**: Save development time and reduce costs by leveraging one framework to support multiple platforms.

This starter kit provides the foundation for modern, versatile applications that can scale across various environments, making it an excellent choice for projects aiming to reach users on web, mobile, and desktop platforms.

**Note**: While the starter kit includes configurations and setup for cross-platform development, developers should familiarize themselves with Capacitor, Cordova, or Electron's specific documentation for any advanced customization or platform-specific requirements.

## CORS Policy Considerations in Local Development

When developing your project locally with this hybrid starter kit, it’s important to be mindful of **Cross-Origin Resource Sharing (CORS)** policy restrictions. CORS is a security feature implemented by browsers to prevent unauthorized access to resources from a different domain. While necessary for protecting user data, it can sometimes pose challenges during local development.

## IMPORTANT!

- **Strongly recommended** to use 8080 port for front-end and 8000 port for the back-end due to SPA Auth CORS Policies. Remember that SPA Auth method works only if the back-end and front-end deployed over same server.
- **You may want to refactor boot/axios.js file and the .env files** due to complexity of mixing the network requests with local environment. For example Capacitor: Android Studio take the target local url as http://10.0.2.2:8000, Electron: Uses chromium and works just like a browser, so it uses your actual localhost url. Please refactor the axios file when it is time to deploy.


## RECOMMENDED UP COMMANDS

- **SPA:** ```quasar dev --port=8080``` (if you use 8000 for your server)
- **ELECTRON:** ```quasar dev -m electron```
- **CAPACITOR:** ```quasar dev -m capacitor -T android --ide``` (edit quasar config file based on your executable android studio path e.g       linuxAndroidStudio: "/snap/android-studio/161/bin/studio.sh")
