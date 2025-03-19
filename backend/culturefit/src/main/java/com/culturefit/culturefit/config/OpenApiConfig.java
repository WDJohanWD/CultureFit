package com.culturefit.culturefit.config;


import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;
import io.swagger.v3.oas.models.servers.Server;

@Configuration
public class OpenApiConfig {
    @Bean
    public OpenAPI customOpenAPI() {
        Server proServer = new Server();
        proServer.setUrl("http://localhost:9000");
        proServer.setDescription("Servidor de produción");

        Contact contact = new Contact();
        contact.setName("CultureFit");
        contact.setEmail("culturefit.contact@gmail.com");

        License license = new License();
        license.setName("GNU");
        license.setUrl("https://www.gnu.org/licenses/gpl-3.0.html");

        Info info = new Info();
        info.setTitle("API CultureFit");
        info.setDescription("API de gimnasio CultureFit");
        info.setVersion("1.0.0");
        info.setContact(contact);
        info.setLicense(license);

        return new OpenAPI().info(info).addServersItem(proServer);
    }
}