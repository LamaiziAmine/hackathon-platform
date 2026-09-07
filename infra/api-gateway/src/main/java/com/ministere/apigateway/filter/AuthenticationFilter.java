package com.ministere.apigateway.filter;

import com.ministere.apigateway.config.RouteValidator;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cloud.gateway.filter.GatewayFilter;
import org.springframework.cloud.gateway.filter.factory.AbstractGatewayFilterFactory;
import org.springframework.http.HttpHeaders;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;

@Component
public class AuthenticationFilter extends AbstractGatewayFilterFactory<AuthenticationFilter.Config> {

    @Autowired
    private RouteValidator validator;

    @Autowired
    private WebClient.Builder webClientBuilder;

    public AuthenticationFilter() {
        super(Config.class);
    }

    public static class Config { }

    @Override
    public GatewayFilter apply(Config config) {
        return ((exchange, chain) -> {
            if (validator.isSecured.test(exchange.getRequest())) {

                if (!exchange.getRequest().getHeaders().containsKey(HttpHeaders.AUTHORIZATION)) {
                    exchange.getResponse().setStatusCode(org.springframework.http.HttpStatus.UNAUTHORIZED);
                    return exchange.getResponse().setComplete();
                }

                String authHeader = exchange.getRequest().getHeaders().get(HttpHeaders.AUTHORIZATION).get(0);
                if (authHeader != null && authHeader.startsWith("Bearer ")) {
                    authHeader = authHeader.substring(7);
                }


                return webClientBuilder.build()
                        .get()
                        .uri("http://IDENTITY-SERVICE/auth/validate?token=" + authHeader)
                        .retrieve()
                        .onStatus(status -> status.isError(), clientResponse -> {
                            // Si le service d'identité dit que le token est mauvais
                            throw new RuntimeException("Unauthorized access to application");
                        })
                        .bodyToMono(String.class)
                        .flatMap(response -> chain.filter(exchange))
                        .onErrorResume(err -> {
                            // En cas d'erreur de validation, on renvoie 401
                            exchange.getResponse().setStatusCode(org.springframework.http.HttpStatus.UNAUTHORIZED);
                            return exchange.getResponse().setComplete();
                        });
            }
            return chain.filter(exchange);
        });
    }
}