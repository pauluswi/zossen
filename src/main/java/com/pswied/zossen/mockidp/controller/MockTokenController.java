package com.pswied.zossen.mockidp.controller;

import com.pswied.zossen.mockidp.jwt.JwtTokenGenerator;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/mock-idp")
public class MockTokenController {

    private final JwtTokenGenerator tokenGenerator;

    public MockTokenController(JwtTokenGenerator tokenGenerator) {
        this.tokenGenerator = tokenGenerator;
    }

    @PostMapping("/token")
    public ResponseEntity<Map<String, String>> login(@RequestParam String username) {
        // Simulate role assignment based on username
        List<String> roles;
        if ("admin".equals(username)) {
            roles = List.of("ROLE_ADMIN", "ROLE_APPROVER");
        } else {
            roles = List.of("ROLE_USER");
        }

        String token = tokenGenerator.generateToken(username, roles);
        return ResponseEntity.ok(Map.of(
                "access_token", token,
                "token_type", "Bearer",
                "expires_in", "3600"
        ));
    }
}
