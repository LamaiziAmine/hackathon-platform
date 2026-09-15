package com.ministere.identityservice.services;

import com.ministere.identityservice.entities.UserCredential;
import com.ministere.identityservice.repositories.UserCredentialRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
public class AuthService {
    @Autowired
    private UserCredentialRepository repository;
    @Autowired
    private PasswordEncoder passwordEncoder;
    @Autowired
    private JwtService jwtService;

    public String saveUser(UserCredential credential) {
        credential.setPassword(passwordEncoder.encode(credential.getPassword()));
        repository.save(credential);
        return "Utilisateur ajouté avec succès";
    }

    public String generateToken(String email) {
        UserCredential user = repository.findByEmail(email).orElse(null);
        Map<String, Object> claims = new HashMap<>();
        if (user != null) {
            claims.put("role", user.getRole());
            claims.put("userId", user.getId());
            claims.put("name", user.getName());
        }
        return jwtService.generateToken(email, claims);
    }

    public void validateToken(String token) {
        jwtService.validateToken(token);
    }
}