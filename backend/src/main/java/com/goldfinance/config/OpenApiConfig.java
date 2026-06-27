package com.goldfinance.config;

import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.security.SecurityScheme;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenApiConfig {

    @Bean
    OpenAPI goldFinanceOpenApi() {
        var bearerScheme = new SecurityScheme()
                .type(SecurityScheme.Type.HTTP)
                .scheme("bearer")
                .bearerFormat("JWT");

        return new OpenAPI()
                .info(new Info()
                        .title("Gold Finance Management API")
                        .version("v1")
                        .description("REST APIs for customers, jewellery-backed loans, payments, bank loans, reports, and dashboard alerts."))
                .components(new Components().addSecuritySchemes("bearerAuth", bearerScheme))
                .addSecurityItem(new SecurityRequirement().addList("bearerAuth"));
    }
}

