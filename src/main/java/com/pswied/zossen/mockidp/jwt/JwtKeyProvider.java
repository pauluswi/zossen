package com.pswied.zossen.mockidp.jwt;

import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.security.KeyPair;

/**
 * Provides cryptographic keys for signing and verifying JWTs.
 * In a real scenario, this would load keys from a KeyStore or Vault.
 * For this Mock IdP, we generate them in memory.
 */
@Component
public class JwtKeyProvider {

    private final SecretKey secretKey;

    public JwtKeyProvider() {
        // Generate a secure key for HS256
        this.secretKey = Keys.secretKeyFor(SignatureAlgorithm.HS256);
    }

    public SecretKey getSecretKey() {
        return secretKey;
    }
}
