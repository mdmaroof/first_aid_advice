package config

import "os"

type Config struct {
	Address      string
	DatabasePath string
	Environment  string
}

func Load() Config {
	return Config{
		Address:      valueOrDefault("CURAIS_API_ADDRESS", ":8080"),
		DatabasePath: valueOrDefault("CURAIS_DATABASE_PATH", "./var/curais.db"),
		Environment:  valueOrDefault("CURAIS_ENV", "local"),
	}
}

func valueOrDefault(key, fallback string) string {
	if value := os.Getenv(key); value != "" {
		return value
	}
	return fallback
}
