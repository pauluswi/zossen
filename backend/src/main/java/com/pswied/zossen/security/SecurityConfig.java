package com.pswied.zossen.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationConverter;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    private final JwtClaimMapper jwtClaimMapper;

    public SecurityConfig(JwtClaimMapper jwtClaimMapper) {
        this.jwtClaimMapper = jwtClaimMapper;
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .csrf(AbstractHttpConfigurer::disable) // Disable CSRF for stateless APIs
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/mock-idp/**").permitAll() // Allow login without token
                .requestMatchers("/error").permitAll()
                .anyRequest().authenticated() // Everything else requires a token
            )
            .oauth2ResourceServer(oauth2 -> oauth2
                .jwt(jwt -> jwt
                    .jwtAuthenticationConverter(jwtAuthenticationConverter())
                )
            )
            // Add standard security headers
            .headers(headers -> headers
                // Prevents clickjacking
                .frameOptions(frameOptions -> frameOptions.sameOrigin())
                // Enforces HTTPS
                .httpStrictTransportSecurity(hsts -> hsts
                    .includeSubDomains(true)
                    .maxAgeInSeconds(31536000)
                )
                // Sets a basic Content Security Policy
                .contentSecurityPolicy(csp -> csp
                    .policyDirectives("script-src 'self'; object-src 'none';")
                )
            );

        return http.build();
    }

    private JwtAuthenticationConverter jwtAuthenticationConverter() {
        JwtAuthenticationConverter converter = new JwtAuthenticationConverter();
        converter.setJwtGrantedAuthoritiesConverter(jwtClaimMapper);
        return converter;
    }
}
