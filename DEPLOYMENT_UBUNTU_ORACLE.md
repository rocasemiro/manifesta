# 🚀 Guia Completo de Implantação do Manifesta (Ubuntu + Nginx + PostgreSQL na Oracle Cloud)

Este guia orienta passo a passo como implantar e rodar a estrutura do aplicativo **Manifesta** em uma instância de servidor **Ubuntu Linux na Oracle Cloud Infrastructure (OCI)** com **Nginx (Reverse Proxy)**, **PostgreSQL (Banco de Dados)** e **HTTPS (Certbot / Let's Encrypt)**.

---

## 🏗️ 1. Visão Geral da Arquitetura de Servidor

```
   [ Cliente / Navegador ]
              │ (Porta 80 / 443 - HTTP/HTTPS)
              ▼
    [ Nginx Reverse Proxy ]
              │ (Proxy Pass http://127.0.0.1:3000)
              ▼
  [ Express App Server (Node.js) ] ── (Gemini API) ──► [ Google AI ]
              │ (Porta 5432)
              ▼
   [ PostgreSQL Database ]
```

---

## 🛠️ 2. Liberação das Portas na Oracle Cloud (Ingress Rules)

Antes de rodar comandos no servidor Ubuntu, é vital liberar as portas na **VCN (Virtual Cloud Network)** da Oracle Cloud:

1. Acesse o painel da **Oracle Cloud Infrastructure (OCI)**.
2. Vá em **Networking** > **Virtual Cloud Networks** > Selecione sua VCN.
3. Clique em **Security Lists** > **Default Security List**.
4. Clique em **Add Ingress Rules** e adicione as duas regras abaixo:
   - **Regra 1 (HTTP):**
     - Source CIDR: `0.0.0.0/0`
     - IP Protocol: `TCP`
     - Destination Port Range: `80`
   - **Regra 2 (HTTPS):**
     - Source CIDR: `0.0.0.0/0`
     - IP Protocol: `TCP`
     - Destination Port Range: `443`

---

## 📂 3. Estrutura de Arquivos Criada no Projeto

No repositório do projeto, já estão criados e prontos os seguintes arquivos de infraestrutura:

| Arquivo | Função / Propósito |
| :--- | :--- |
| `Dockerfile` | Constrói a imagem containerizada da aplicação (Express + React Vite). |
| `docker-compose.yml` | Orquestra os serviços: `postgres`, `web` (Node.js) e `nginx`. |
| `nginx/default.conf` | Configuração do servidor web Nginx como Proxy Reverso para a porta 3000. |
| `database/init.sql` | Script SQL de criação automática das tabelas e dados iniciais no PostgreSQL. |
| `systemd/manifesta.service` | Unidade de serviço para rodar via `systemd` caso prefira não usar Docker. |
| `deploy.sh` | Script bash de 1-clique para instalar todas as dependências e subir a aplicação. |
| `.env.example` | Modelo de variáveis de ambiente do sistema. |

---

## ⚡ 4. Método 1: Implantação Automatizada em 1 Clique (Recomendado)

Conecte-se via SSH à sua máquina Ubuntu na Oracle Cloud e execute os comandos abaixo:

```bash
# 1. Clonar o repositório do projeto para o servidor
git clone https://github.com/seu-usuario/manifesta.git
cd manifesta

# 2. Copiar as variáveis de ambiente e editar com sua chave Gemini
cp .env.example .env
nano .env # (Cole sua GEMINI_API_KEY)

# 3. Dar permissão de execução e rodar o script de deploy
chmod +x deploy.sh
./deploy.sh
```

O script `deploy.sh` fará automaticamente:
- Atualização do Ubuntu
- Instalação de Nginx, Certbot e Docker
- Liberação das portas no firewall `iptables` do Ubuntu Oracle Cloud
- Subida dos containers com PostgreSQL e Node.js
- Configuração do Nginx como Reverse Proxy na porta 80

---

## 🛠️ 5. Método 2: Instalação Manual Passo a Passo (Sem Docker)

Se você preferir rodar os serviços diretamente na máquina virtual sem containers:

### A. Atualizar o Ubuntu e Instalar Dependências
```bash
sudo apt update && sudo apt upgrade -y
sudo apt install -y nodejs npm nginx postgresql postgresql-contrib ufw certbot python3-certbot-nginx
```

### B. Configurar o Banco de Dados PostgreSQL
```bash
sudo -u postgres psql
```
No terminal do PostgreSQL (`psql`), execute:
```sql
CREATE DATABASE manifesta_db;
CREATE USER manifesta_user WITH PASSWORD 'senha_forte_aqui';
GRANT ALL PRIVILEGES ON DATABASE manifesta_db TO manifesta_user;
\q
```

Para rodar a estrutura inicial de tabelas:
```bash
sudo -u postgres psql -d manifesta_db -f ./database/init.sql
```

### C. Compilar a Aplicação Node.js
```bash
# Instalar dependências da aplicação
npm install

# Gerar o bundle de produção (dist/server.cjs)
npm run build
```

### D. Configurar o Serviço Systemd
```bash
# Copiar o arquivo de serviço para o sistema
sudo cp systemd/manifesta.service /etc/systemd/system/manifesta.service

# Editar as variáveis de ambiente (Chave Gemini e Senha do PostgreSQL)
sudo nano /etc/systemd/system/manifesta.service

# Iniciar o serviço
sudo systemctl daemon-reload
sudo systemctl enable manifesta
sudo systemctl start manifesta
```

### E. Configurar o Nginx como Proxy Reverso
```bash
sudo cp ./nginx/default.conf /etc/nginx/sites-available/manifesta
sudo ln -s /etc/nginx/sites-available/manifesta /etc/nginx/sites-enabled/
sudo rm /etc/nginx/sites-enabled/default # remover padrão se necessário
sudo nginx -t
sudo systemctl restart nginx
```

---

## 🔒 6. Ativação do Certificado SSL / HTTPS Gratuito (Let's Encrypt)

Após direcionar seu domínio (ex: `manifesta.seudominio.com`) para o IP Público da sua instância Oracle Cloud, execute o comando abaixo no Ubuntu:

```bash
sudo certbot --nginx -d manifesta.seudominio.com
```

O Certbot irá reconfigurar o Nginx automaticamente para forçar HTTPS e renovará o certificado sozinho a cada 90 dias.

---

## 📊 7. Monitoramento e Comandos Úteis

- **Verificar status do aplicativo (Docker):**
  ```bash
  sudo docker compose ps
  ```
- **Verificar logs da aplicação:**
  ```bash
  sudo docker compose logs -f web
  ```
- **Verificar logs do Nginx:**
  ```bash
  sudo tail -f /var/log/nginx/access.log
  sudo tail -f /var/log/nginx/error.log
  ```
- **Testar Rota de Saúde da API:**
  ```bash
  curl http://localhost:3000/api/health
  curl http://localhost:3000/api/db-status
  ```

---
✨ **Tudo pronto! Seu aplicativo Manifesta estará rodando com alta performance, segurança e persistência no Ubuntu na Oracle Cloud.**
