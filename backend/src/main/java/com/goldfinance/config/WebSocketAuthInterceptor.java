package com.goldfinance.config;

import com.goldfinance.security.JwtService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.server.ServerHttpRequest;
import org.springframework.http.server.ServerHttpResponse;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.WebSocketHandler;
import org.springframework.web.socket.server.HandshakeInterceptor;
import org.springframework.web.util.UriComponentsBuilder;

import java.net.URI;
import java.security.Principal;
import java.util.Map;

@Component
@RequiredArgsConstructor
@Slf4j
public class WebSocketAuthInterceptor implements HandshakeInterceptor {

    private final JwtService jwtService;

    @Override
    public boolean beforeHandshake(ServerHttpRequest request, ServerHttpResponse response,
                                   WebSocketHandler wsHandler, Map<String, Object> attributes) {
        try {
            URI uri = request.getURI();
            String token = UriComponentsBuilder.fromUri(uri).build()
                    .getQueryParams().getFirst("token");

            if (token == null || token.isBlank()) {
                // Allow anonymous — STOMP will still work for /topic broadcasts
                log.debug("WebSocket handshake: no token, allowing anonymous connection");
                return true;
            }

            try {
                String username = jwtService.extractUsername(token);
                if (username != null) {
                    attributes.put("username", username);
                    attributes.put("user", (Principal) () -> username);
                    log.info("WebSocket handshake authenticated for user: {}", username);
                }
            } catch (Exception e) {
                // Token parsing failed — still allow the connection for /topic subscriptions
                log.debug("WebSocket handshake: token parsing failed ({}), allowing anonymous", e.getMessage());
            }

            // Always allow the handshake — Spring Security + STOMP layer handles auth
            return true;
        } catch (Exception e) {
            log.warn("WebSocket handshake unexpected error: {}", e.getMessage());
            // Don't block the handshake on unexpected errors
            return true;
        }
    }

    @Override
    public void afterHandshake(ServerHttpRequest request, ServerHttpResponse response,
                               WebSocketHandler wsHandler, Exception exception) {
        // no-op
    }
}
