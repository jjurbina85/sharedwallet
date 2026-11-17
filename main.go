// Servidor local y base para la fase 2 (API con base de datos).
// Hoy solo sirve el sitio estático de web/. Uso: go run .  (puerto 8080, o PORT)
package main

import (
	"embed"
	"io/fs"
	"log"
	"net/http"
	"os"
)

//go:embed all:web
var content embed.FS

func main() {
	web, err := fs.Sub(content, "web")
	if err != nil {
		log.Fatal(err)
	}
	mux := http.NewServeMux()
	mux.HandleFunc("/healthz", func(w http.ResponseWriter, _ *http.Request) { w.Write([]byte("ok")) })
	// Fase 2: aquí van /api/clientes, /api/ofertas, /api/tecnologias, etc.
	mux.Handle("/", http.FileServer(http.FS(web)))
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}
	log.Printf("Wallet Preventa en http://localhost:%s", port)
	log.Fatal(http.ListenAndServe(":"+port, mux))
}
