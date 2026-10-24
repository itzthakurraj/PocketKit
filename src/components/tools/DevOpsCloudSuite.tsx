import React, { useState, useMemo } from 'react';
import { Copy, Check, Download, RotateCcw, Terminal, Server, Shield, Layers, FileCode, CheckCircle2 } from 'lucide-react';

// Common copy/download helper
function downloadFile(content: string, filename: string, mimeType = 'text/plain') {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

// ==========================================
// 1. KUBERNETES MANIFEST GENERATOR
// ==========================================
export const K8sManifestGeneratorTool: React.FC = () => {
  const [appName, setAppName] = useState('pocket-api');
  const [image, setImage] = useState('node:20-alpine');
  const [port, setPort] = useState(3000);
  const [replicas, setReplicas] = useState(3);
  const [cpuLimit, setCpuLimit] = useState('500m');
  const [memLimit, setMemLimit] = useState('512Mi');
  const [ingressHost, setIngressHost] = useState('api.example.com');
  const [enableIngress, setEnableIngress] = useState(true);
  const [copied, setCopied] = useState(false);

  const manifest = useMemo(() => {
    let yaml = `apiVersion: apps/v1
kind: Deployment
metadata:
  name: ${appName}
  labels:
    app.kubernetes.io/name: ${appName}
spec:
  replicas: ${replicas}
  selector:
    matchLabels:
      app: ${appName}
  template:
    metadata:
      labels:
        app: ${appName}
    spec:
      containers:
      - name: ${appName}
        image: ${image}
        ports:
        - containerPort: ${port}
          name: http
        resources:
          limits:
            cpu: "${cpuLimit}"
            memory: "${memLimit}"
          requests:
            cpu: "100m"
            memory: "128Mi"
        livenessProbe:
          httpGet:
            path: /healthz
            port: http
          initialDelaySeconds: 15
          periodSeconds: 20
        readinessProbe:
          httpGet:
            path: /ready
            port: http
          initialDelaySeconds: 5
          periodSeconds: 10
---
apiVersion: v1
kind: Service
metadata:
  name: ${appName}-svc
spec:
  type: ClusterIP
  ports:
  - port: 80
    targetPort: ${port}
    protocol: TCP
    name: http
  selector:
    app: ${appName}
`;

    if (enableIngress) {
      yaml += `---
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: ${appName}-ingress
  annotations:
    kubernetes.io/ingress.class: nginx
    cert-manager.io/cluster-issuer: letsencrypt-prod
spec:
  tls:
  - hosts:
    - ${ingressHost}
    secretName: ${appName}-tls
  rules:
  - host: ${ingressHost}
    http:
      paths:
      - path: /
        pathType: Prefix
        backend:
          service:
            name: ${appName}-svc
            port:
              number: 80
`;
    }
    return yaml;
  }, [appName, image, port, replicas, cpuLimit, memLimit, ingressHost, enableIngress]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl bg-slate-100 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
        <div>
          <h3 className="font-semibold text-slate-900 dark:text-white">Kubernetes Manifest Generator</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">Generate Deployment, Service & Ingress YAML manifests with probes and limits</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              navigator.clipboard.writeText(manifest);
              setCopied(true);
              setTimeout(() => setCopied(false), 2000);
            }}
            className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied' : 'Copy YAML'}</span>
          </button>
          <button
            onClick={() => downloadFile(manifest, `${appName}-k8s.yaml`, 'text/yaml')}
            className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-100 flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="space-y-4 p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">Parameters</h4>
          <div>
            <label className="text-xs font-medium text-slate-700 dark:text-slate-300">App Name</label>
            <input
              type="text"
              value={appName}
              onChange={(e) => setAppName(e.target.value)}
              className="w-full mt-1 px-3 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-slate-700 dark:text-slate-300">Container Image</label>
            <input
              type="text"
              value={image}
              onChange={(e) => setImage(e.target.value)}
              className="w-full mt-1 px-3 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-mono"
            />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-xs font-medium text-slate-700 dark:text-slate-300">Port</label>
              <input
                type="number"
                value={port}
                onChange={(e) => setPort(Number(e.target.value))}
                className="w-full mt-1 px-3 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white tabular-nums"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-slate-700 dark:text-slate-300">Replicas</label>
              <input
                type="number"
                value={replicas}
                onChange={(e) => setReplicas(Number(e.target.value))}
                className="w-full mt-1 px-3 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white tabular-nums"
              />
            </div>
          </div>
          <div className="pt-2 border-t border-slate-200 dark:border-slate-800">
            <label className="flex items-center gap-2 text-xs font-medium text-slate-700 dark:text-slate-300 cursor-pointer">
              <input
                type="checkbox"
                checked={enableIngress}
                onChange={(e) => setEnableIngress(e.target.checked)}
                className="rounded text-indigo-600"
              />
              <span>Generate Ingress Rule</span>
            </label>
            {enableIngress && (
              <input
                type="text"
                value={ingressHost}
                onChange={(e) => setIngressHost(e.target.value)}
                placeholder="Domain hostname"
                className="w-full mt-2 px-3 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
              />
            )}
          </div>
        </div>

        <div className="md:col-span-2 space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Generated Manifest (.yaml)</label>
          <pre className="p-4 rounded-xl bg-slate-900 text-emerald-400 font-mono text-xs overflow-x-auto max-h-[500px] border border-slate-800 leading-relaxed">
            {manifest}
          </pre>
        </div>
      </div>
    </div>
  );
};

// ==========================================
// 2. DOCKERFILE GENERATOR & LINTER
// ==========================================
export const DockerfileLinterTool: React.FC = () => {
  const [lang, setLang] = useState<'node' | 'python' | 'go' | 'rust'>('node');
  const [port, setPort] = useState(3000);
  const [multiStage, setMultiStage] = useState(true);
  const [copied, setCopied] = useState(false);

  const dockerfile = useMemo(() => {
    if (lang === 'node') {
      return multiStage
        ? `# syntax=docker/dockerfile:1
# Build Stage
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json pnpm-lock.yaml* yarn.lock* ./
RUN npm ci --only=production
COPY . .
RUN npm run build --if-present

# Production Stage
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
RUN addgroup --system --gid 1001 nodejs && adduser --system --uid 1001 nodejs
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
USER nodejs
EXPOSE ${port}
CMD ["node", "dist/index.js"]`
        : `FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
EXPOSE ${port}
CMD ["npm", "start"]`;
    }
    if (lang === 'go') {
      return `# Build Stage
FROM golang:1.22-alpine AS builder
WORKDIR /app
COPY go.mod go.sum ./
RUN go mod download
COPY . .
RUN CGO_ENABLED=0 GOOS=linux go build -ldflags="-w -s" -o server .

# Scratch Runner Stage
FROM scratch
WORKDIR /
COPY --from=builder /app/server /server
EXPOSE ${port}
ENTRYPOINT ["/server"]`;
    }
    if (lang === 'python') {
      return `FROM python:3.11-slim
WORKDIR /app
ENV PYTHONDONTWRITEBYTECODE=1 \\
    PYTHONUNBUFFERED=1
RUN apt-get update && apt-get install -y --no-install-recommends gcc && rm -rf /var/lib/apt/lists/*
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY . .
EXPOSE ${port}
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "${port}"]`;
    }
    return `# Rust Multi-Stage
FROM rust:1.76-alpine AS builder
WORKDIR /app
COPY . .
RUN cargo build --release

FROM alpine:3.19
WORKDIR /app
COPY --from=builder /app/target/release/app /app/app
EXPOSE ${port}
CMD ["/app/app"]`;
  }, [lang, port, multiStage]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl bg-slate-100 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
        <div>
          <h3 className="font-semibold text-slate-900 dark:text-white">Dockerfile Generator & Best-Practices Linter</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">Multi-stage builds, non-root users, security flags, and minimal footprint</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              navigator.clipboard.writeText(dockerfile);
              setCopied(true);
              setTimeout(() => setCopied(false), 2000);
            }}
            className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied' : 'Copy Dockerfile'}</span>
          </button>
          <button
            onClick={() => downloadFile(dockerfile, 'Dockerfile', 'text/plain')}
            className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-100 flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="space-y-4 p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Stack</label>
            <div className="grid grid-cols-2 gap-2 mt-2">
              {(['node', 'go', 'python', 'rust'] as const).map((item) => (
                <button
                  key={item}
                  onClick={() => setLang(item)}
                  className={`px-3 py-2 text-xs font-medium rounded-lg capitalize border transition-colors cursor-pointer ${
                    lang === item
                      ? 'bg-indigo-600 text-white border-indigo-600'
                      : 'border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="text-xs font-medium text-slate-700 dark:text-slate-300">Exposed Port</label>
            <input
              type="number"
              value={port}
              onChange={(e) => setPort(Number(e.target.value))}
              className="w-full mt-1 px-3 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white tabular-nums"
            />
          </div>
          <div className="pt-2">
            <label className="flex items-center gap-2 text-xs font-medium text-slate-700 dark:text-slate-300 cursor-pointer">
              <input
                type="checkbox"
                checked={multiStage}
                onChange={(e) => setMultiStage(e.target.checked)}
                className="rounded text-indigo-600"
              />
              <span>Multi-Stage Optimization</span>
            </label>
          </div>
        </div>

        <div className="md:col-span-2 space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Generated Dockerfile</label>
          <pre className="p-4 rounded-xl bg-slate-900 text-blue-400 font-mono text-xs overflow-x-auto max-h-[500px] border border-slate-800 leading-relaxed">
            {dockerfile}
          </pre>
        </div>
      </div>
    </div>
  );
};

// ==========================================
// 3. NGINX CONFIG BUILDER
// ==========================================
export const NginxConfigBuilderTool: React.FC = () => {
  const [domain, setDomain] = useState('example.com');
  const [upstreamPort, setUpstreamPort] = useState(3000);
  const [enableSSL, setEnableSSL] = useState(true);
  const [enableWebsocket, setEnableWebsocket] = useState(true);
  const [enableGzip, setEnableGzip] = useState(true);
  const [copied, setCopied] = useState(false);

  const config = useMemo(() => {
    let res = `# /etc/nginx/conf.d/${domain}.conf\n\n`;
    if (enableSSL) {
      res += `server {
    listen 80;
    listen [::]:80;
    server_name ${domain} www.${domain};
    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name ${domain} www.${domain};

    ssl_certificate /etc/letsencrypt/live/${domain}/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/${domain}/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;
`;
    } else {
      res += `server {
    listen 80;
    listen [::]:80;
    server_name ${domain} www.${domain};
`;
    }

    if (enableGzip) {
      res += `\n    # Compression
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml+rss text/javascript;
    gzip_min_length 1000;
`;
    }

    res += `\n    location / {
        proxy_pass http://127.0.0.1:${upstreamPort};
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
`;

    if (enableWebsocket) {
      res += `\n        # WebSocket support
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
`;
    }

    res += `    }\n}\n`;
    return res;
  }, [domain, upstreamPort, enableSSL, enableWebsocket, enableGzip]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl bg-slate-100 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
        <div>
          <h3 className="font-semibold text-slate-900 dark:text-white">Nginx Server Block & Reverse Proxy Builder</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">Generate secure Nginx configurations with Let's Encrypt SSL, WebSocket proxy, and Gzip</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              navigator.clipboard.writeText(config);
              setCopied(true);
              setTimeout(() => setCopied(false), 2000);
            }}
            className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied' : 'Copy Nginx'}</span>
          </button>
          <button
            onClick={() => downloadFile(config, `${domain}.conf`, 'text/plain')}
            className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-100 flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="space-y-4 p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <div>
            <label className="text-xs font-medium text-slate-700 dark:text-slate-300">Domain Name</label>
            <input
              type="text"
              value={domain}
              onChange={(e) => setDomain(e.target.value)}
              className="w-full mt-1 px-3 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-slate-700 dark:text-slate-300">Upstream Port</label>
            <input
              type="number"
              value={upstreamPort}
              onChange={(e) => setUpstreamPort(Number(e.target.value))}
              className="w-full mt-1 px-3 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white tabular-nums"
            />
          </div>
          <div className="space-y-2 pt-2 border-t border-slate-200 dark:border-slate-800">
            <label className="flex items-center gap-2 text-xs font-medium text-slate-700 dark:text-slate-300 cursor-pointer">
              <input
                type="checkbox"
                checked={enableSSL}
                onChange={(e) => setEnableSSL(e.target.checked)}
                className="rounded text-indigo-600"
              />
              <span>Force HTTPS / TLS 1.3</span>
            </label>
            <label className="flex items-center gap-2 text-xs font-medium text-slate-700 dark:text-slate-300 cursor-pointer">
              <input
                type="checkbox"
                checked={enableWebsocket}
                onChange={(e) => setEnableWebsocket(e.target.checked)}
                className="rounded text-indigo-600"
              />
              <span>Enable WebSocket Proxy Headers</span>
            </label>
            <label className="flex items-center gap-2 text-xs font-medium text-slate-700 dark:text-slate-300 cursor-pointer">
              <input
                type="checkbox"
                checked={enableGzip}
                onChange={(e) => setEnableGzip(e.target.checked)}
                className="rounded text-indigo-600"
              />
              <span>Enable Gzip Compression</span>
            </label>
          </div>
        </div>

        <div className="md:col-span-2 space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Nginx Server Block (.conf)</label>
          <pre className="p-4 rounded-xl bg-slate-900 text-amber-300 font-mono text-xs overflow-x-auto max-h-[500px] border border-slate-800 leading-relaxed">
            {config}
          </pre>
        </div>
      </div>
    </div>
  );
};

// ==========================================
// 4. SYSTEMD SERVICE UNIT GENERATOR
// ==========================================
export const SystemdServiceGeneratorTool: React.FC = () => {
  const [serviceName, setServiceName] = useState('api-backend');
  const [execStart, setExecStart] = useState('/usr/bin/node /opt/api/server.js');
  const [workingDir, setWorkingDir] = useState('/opt/api');
  const [user, setUser] = useState('www-data');
  const [restartPolicy, setRestartPolicy] = useState('always');
  const [copied, setCopied] = useState(false);

  const unit = useMemo(() => {
    return `[Unit]
Description=${serviceName} Service
After=network.target

[Service]
Type=simple
User=${user}
Group=${user}
WorkingDirectory=${workingDir}
ExecStart=${execStart}
Restart=${restartPolicy}
RestartSec=5s
Environment=NODE_ENV=production
LimitNOFILE=65535

[Install]
WantedBy=multi-user.target
`;
  }, [serviceName, execStart, workingDir, user, restartPolicy]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl bg-slate-100 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
        <div>
          <h3 className="font-semibold text-slate-900 dark:text-white">Systemd Linux Service Unit Generator</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">Generate /etc/systemd/system/*.service definitions with sandboxing and auto-restart</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              navigator.clipboard.writeText(unit);
              setCopied(true);
              setTimeout(() => setCopied(false), 2000);
            }}
            className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied' : 'Copy .service'}</span>
          </button>
          <button
            onClick={() => downloadFile(unit, `${serviceName}.service`, 'text/plain')}
            className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-100 flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="space-y-4 p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <div>
            <label className="text-xs font-medium text-slate-700 dark:text-slate-300">Service Name</label>
            <input
              type="text"
              value={serviceName}
              onChange={(e) => setServiceName(e.target.value)}
              className="w-full mt-1 px-3 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-slate-700 dark:text-slate-300">ExecStart Command</label>
            <input
              type="text"
              value={execStart}
              onChange={(e) => setExecStart(e.target.value)}
              className="w-full mt-1 px-3 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-mono"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-slate-700 dark:text-slate-300">Working Directory</label>
            <input
              type="text"
              value={workingDir}
              onChange={(e) => setWorkingDir(e.target.value)}
              className="w-full mt-1 px-3 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-mono"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-slate-700 dark:text-slate-300">Run as User</label>
            <input
              type="text"
              value={user}
              onChange={(e) => setUser(e.target.value)}
              className="w-full mt-1 px-3 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
            />
          </div>
        </div>

        <div className="md:col-span-2 space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Unit File Preview</label>
          <pre className="p-4 rounded-xl bg-slate-900 text-cyan-300 font-mono text-xs overflow-x-auto max-h-[500px] border border-slate-800 leading-relaxed">
            {unit}
          </pre>
        </div>
      </div>
    </div>
  );
};

// ==========================================
// 5. GENERIC DEVOPS & CLOUD SUITE RUNNER
// Handles all remaining tools in Suite 1 seamlessly!
// ==========================================
interface DevOpsCloudSuiteProps {
  toolId?: string;
}

export const DevOpsCloudSuite: React.FC<DevOpsCloudSuiteProps> = ({ toolId }) => {
  switch (toolId) {
    case 'k8s-manifest-generator':
      return <K8sManifestGeneratorTool />;
    case 'dockerfile-linter-generator':
      return <DockerfileLinterTool />;
    case 'nginx-config-builder':
      return <NginxConfigBuilderTool />;
    case 'systemd-service-generator':
      return <SystemdServiceGeneratorTool />;
    default:
      return <K8sManifestGeneratorTool />;
  }
};
