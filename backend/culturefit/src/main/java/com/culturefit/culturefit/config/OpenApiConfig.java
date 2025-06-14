package com.culturefit.culturefit.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.security.SecurityScheme;
import io.swagger.v3.oas.models.servers.Server;

@Configuration
public class OpenApiConfig {
    @Bean
    public OpenAPI customOpenAPI() {
        Server proServer = new Server();
        proServer.setUrl("http://localhost:9000");
        proServer.setDescription("Production server");

        Contact contact = new Contact();
        contact.setName("CultureFit");
        contact.setEmail("culturefit.contact@gmail.com");
        contact.setUrl("https://culturefit.lareira.digital/");

        License license = new License();
        license.setName("GNU");
        license.setUrl("https://www.gnu.org/licenses/gpl-3.0.html");

        Info info = new Info()
            .title("API CultureFit")
            .description("API REST para la aplicación CultureFit Gym. Esta API proporciona endpoints para la gestión de usuarios, rutinas, ejercicios, citas y seguimiento del progreso.")
            .version("3.0.0")
            .contact(contact)
            .license(license);

        // Configuración de seguridad JWT
        SecurityScheme securityScheme = new SecurityScheme()
            .type(SecurityScheme.Type.HTTP)
            .scheme("bearer")
            .bearerFormat("JWT")
            .in(SecurityScheme.In.HEADER)
            .name("Authorization");

        Components components = new Components()
            .addSecuritySchemes("bearerAuth", securityScheme);

        return new OpenAPI()
            .info(info)
            .addServersItem(proServer)
            .components(components)
            .addSecurityItem(new SecurityRequirement().addList("bearerAuth"));
    }
}