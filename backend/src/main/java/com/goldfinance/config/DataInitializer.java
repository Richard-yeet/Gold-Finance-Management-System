package com.goldfinance.config;

import com.goldfinance.entity.AppUser;
import com.goldfinance.entity.UserRole;
import com.goldfinance.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
@RequiredArgsConstructor
public class DataInitializer {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Bean
    CommandLineRunner seedAdminUser(
            @Value("${app.security.admin-username}") String username,
            @Value("${app.security.admin-password}") String password
    ) {
        return args -> userRepository.findByUsername(username).orElseGet(() -> userRepository.save(
                AppUser.builder()
                        .username(username)
                        .passwordHash(passwordEncoder.encode(password))
                        .role(UserRole.ADMIN)
                        .enabled(true)
                        .build()
        ));
    }
}

