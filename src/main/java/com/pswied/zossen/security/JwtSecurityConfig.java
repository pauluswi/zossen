package com.pswied.zossen.security;

import com.pswied.zossen.mockidp.jwt.JwtKeyProvider;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.oauth2.jwt.NimbusJwtDecoder;

/**
 * Configures the JWT Decoder to use the same key as the Mock IdP.
 * In a real scenario, this would use a JWK Set URI.
 */
@Configuration
public class JwtSecurityConfig {

    private final JwtKeyProvider jwtKeyProvider;

    public JwtSecurityConfig(JwtKeyProvider jwtKeyProvider) {
        this.jwtKeyProvider = jwtKeyProvider;
    }

    @Bean
    public JwtDecoder jwtDecoder() {
        // We use the shared secret key from our Mock IdP to validate tokens.
        return NimbusJwtDecoder.withSecretKey(jwtKeyProvider.getSecretKey()).build();
    }
}
