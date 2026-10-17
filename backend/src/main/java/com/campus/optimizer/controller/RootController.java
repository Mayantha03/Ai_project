package com.campus.optimizer.controller;

import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
public class RootController {

    @GetMapping(value = "/", produces = MediaType.TEXT_HTML_VALUE)
    public ResponseEntity<String> rootLanding() {
        String html = """
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Smart Campus AI - Backend API</title>
                <style>
                    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background: #0f172a; color: #f8fafc; margin: 0; padding: 40px 20px; display: flex; justify-content: center; align-items: center; min-height: 80vh; }
                    .card { background: #1e293b; border-radius: 16px; border: 1px solid #334155; padding: 36px; max-width: 620px; width: 100%; box-shadow: 0 20px 25px -5px rgba(0,0,0,0.4); }
                    .badge { display: inline-block; background: #059669; color: #ecfdf5; padding: 4px 12px; border-radius: 9999px; font-size: 13px; font-weight: 600; margin-bottom: 16px; }
                    h1 { margin-top: 0; font-size: 24px; color: #ffffff; }
                    p { color: #94a3b8; line-height: 1.6; }
                    .links { display: flex; flex-direction: column; gap: 12px; margin-top: 24px; }
                    .btn { display: flex; justify-content: space-between; align-items: center; padding: 14px 18px; border-radius: 10px; text-decoration: none; font-weight: 500; font-size: 14px; transition: all 0.2s; }
                    .btn-primary { background: #3b82f6; color: #ffffff; }
                    .btn-primary:hover { background: #2563eb; }
                    .btn-secondary { background: #334155; color: #e2e8f0; }
                    .btn-secondary:hover { background: #475569; }
                    .code { font-family: monospace; font-size: 12px; opacity: 0.8; }
                </style>
            </head>
            <body>
                <div class="card">
                    <span class="badge">● Backend Online (Spring Boot)</span>
                    <h1>Smart Campus AI - REST API Server</h1>
                    <p>The backend microservice is operational and connected to the in-memory H2 database with seeded KDU Faculty of Computing data.</p>
                    <div class="links">
                        <a href="http://localhost:3000" class="btn btn-primary" target="_blank">
                            <span>Open Frontend Dashboard (React UI)</span>
                            <span class="code">http://localhost:3000 &rarr;</span>
                        </a>
                        <a href="/api/v1/classrooms" class="btn btn-secondary">
                            <span>Test API: List Classrooms</span>
                            <span class="code">/api/v1/classrooms</span>
                        </a>
                        <a href="/h2-console" class="btn btn-secondary" target="_blank">
                            <span>H2 Database Console</span>
                            <span class="code">/h2-console</span>
                        </a>
                        <a href="http://localhost:8000/docs" class="btn btn-secondary" target="_blank">
                            <span>FastAPI AI Service Docs</span>
                            <span class="code">http://localhost:8000/docs</span>
                        </a>
                    </div>
                </div>
            </body>
            </html>
            """;
        return ResponseEntity.ok(html);
    }

    @GetMapping(value = "/api/v1/status")
    public ResponseEntity<Map<String, Object>> status() {
        return ResponseEntity.ok(Map.of(
            "status", "UP",
            "service", "smart-campus-optimizer-backend",
            "frontend_url", "http://localhost:3000",
            "ai_service_url", "http://localhost:8000"
        ));
    }
}
