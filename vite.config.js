import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'fs'
import path from 'path'
import { pathToFileURL } from 'url'

// Mock Vercel API environment for local Vite dev
const apiMiddleware = (env) => ({
    name: 'api-middleware',
    configureServer(server) {
        server.middlewares.use(async (req, res, next) => {
            if (req.url.startsWith('/api/')) {
                // Set environment variables for the process so API handlers can access them
                Object.entries(env).forEach(([key, value]) => {
                    process.env[key] = value;
                });

                const apiPath = req.url.split('?')[0];
                const filePath = path.join(process.cwd(), apiPath + '.js');

                if (fs.existsSync(filePath)) {
                    try {
                        // FIX: Use pathToFileURL for Windows support and add timestamp to bypass cache
                        const fileUrl = `${pathToFileURL(filePath).href}?t=${Date.now()}`;
                        const module = await import(fileUrl);

                        // Mock req/res for Vercel handler
                        const mockReq = {
                            method: req.method,
                            body: await new Promise((resolve) => {
                                // FIX: Only wait for body on methods that typically have one
                                if (['GET', 'HEAD'].includes(req.method) || req.complete) {
                                    return resolve({});
                                }
                                let body = '';
                                req.on('data', chunk => body += chunk);
                                req.on('end', () => {
                                    try {
                                        resolve(body ? JSON.parse(body) : {});
                                    } catch (e) {
                                        resolve(body);
                                    }
                                });
                            }),
                            headers: req.headers,
                            query: Object.fromEntries(new URL(req.url, 'http://localhost').searchParams)
                        };

                        const mockRes = {
                            status: (code) => {
                                res.statusCode = code;
                                return mockRes;
                            },
                            setHeader: (name, value) => {
                                res.setHeader(name, value);
                                return mockRes;
                            },
                            json: (data) => {
                                res.setHeader('Content-Type', 'application/json');
                                res.end(JSON.stringify(data));
                                return mockRes;
                            },
                            // FIX: Add missing Vercel response methods
                            send: (data) => {
                                res.end(data);
                                return mockRes;
                            },
                            end: (data) => {
                                res.end(data);
                                return mockRes;
                            }
                        };

                        await module.default(mockReq, mockRes);
                        return;
                    } catch (err) {
                        console.error('API Middleware Error:', err);
                        res.statusCode = 500;
                        res.end(JSON.stringify({ error: err.message }));
                        return;
                    }
                }
            }
            next();
        });
    }
});

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, process.cwd(), '');
    return {
        plugins: [
            react({
                babel: {
                    plugins: ['styled-jsx/babel'],
                },
            }),
            apiMiddleware(env)
        ],
        server: {
            port: 5190,
            host: true
        },
        ssr: {
            noExternal: ['react-helmet-async']
        }
    }
})
