package com.pswied.zossen.mockidp.jwt;

import io.jsonwebtoken.Jwts;
import org.springframework.stereotype.Component;

import java.util.Date;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Component
public class JwtTokenGenerator {

    private final JwtKeyProvider keyProvider;

    public JwtTokenGenerator(JwtKeyProvider keyProvider) {
        this.keyProvider = keyProvider;
    }

    public String generateToken(String username, List<String> roles) {
        long now = System.currentTimeMillis();
        long expiry = now + 3600000; // 1 hour

        return Jwts.builder()
                .setSubject(username)
                .setIssuer("http://localhost:8080/mock-idp")
                .setIssuedAt(new Date(now))
                .setExpiration(new Date(expiry))
                .setId(UUID.randomUUID().toString())
                .addClaims(Map.of(
                        "realm_access", Map.of("roles", roles),
                        "scope", "openid profile email"
                ))
                .signWith(keyProvider.getSecretKey())
                .compact();
    }
}
