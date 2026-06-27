package com.goldfinance.service;

import com.goldfinance.dto.AuthRequest;
import com.goldfinance.dto.AuthResponse;
import com.goldfinance.repository.UserRepository;
import com.goldfinance.security.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final AuthenticationManager authenticationManager;
    private final UserDetailsService userDetailsService;
    private final UserRepository userRepository;
    private final JwtService jwtService;

    public AuthResponse login(AuthRequest request) {
        authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(request.username(), request.password()));
        var user = userRepository.findByUsername(request.username()).orElseThrow();
        var userDetails = userDetailsService.loadUserByUsername(request.username());
        String token = jwtService.generateToken(userDetails, Map.of("role", user.getRole().name(), "userId", user.getId()));
        return new AuthResponse(token, "Bearer", user.getUsername(), user.getRole(), jwtService.expirationMinutes());
    }
}

