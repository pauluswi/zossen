package com.pswied.zossen;

import com.pswied.zossen.mockidp.jwt.JwtTokenGenerator;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
class ZossenApplicationTests {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private JwtTokenGenerator tokenGenerator;

    @Test
    void approveTransaction_withApproverRole_shouldSucceed() throws Exception {
        String token = tokenGenerator.generateToken("admin", List.of("ROLE_APPROVER"));

        mockMvc.perform(post("/backoffice/approve")
                        .param("transactionId", "TX-SUCCESS")
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isOk());
    }

    @Test
    void approveTransaction_withUserRole_shouldFailWith403() throws Exception {
        String token = tokenGenerator.generateToken("user", List.of("ROLE_USER"));

        mockMvc.perform(post("/backoffice/approve")
                        .param("transactionId", "TX-FAIL")
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isForbidden());
    }

    @Test
    void approveTransaction_withoutToken_shouldFailWith401() throws Exception {
        mockMvc.perform(post("/backoffice/approve")
                        .param("transactionId", "TX-UNAUTH"))
                .andExpect(status().isUnauthorized());
    }
}
