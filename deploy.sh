#!/bin/bash

# Script de Implantação Automatizado do Manifesta para Ubuntu (Oracle Cloud)
# Instala Docker, Docker Compose, Nginx e PostgreSQL e inicia os serviços

set -e

echo "=========================================================="
echo "✨ Iniciando Implantação do Manifesta no Ubuntu Oracle Cloud"
echo "=========================================================="

# 1. Atualização do Sistema
echo "📦 1. Atualizando pacotes do Ubuntu..."
sudo apt update && sudo apt upgrade -y

# 2. Instalação de utilitários básicos e Nginx
echo "🌐 2. Instalando Nginx, UFW, Curl e Git..."
sudo apt install -y nginx curl git ufw postgresql-client certbot python3-certbot-nginx

# 3. Configuração do Firewall UFW no Ubuntu
echo "🛡️ 3. Configurando Regras de Firewall (UFW)..."
sudo ufw allow 22/tcp
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw --force enable

# 4. Liberação das portas no Iptables da Oracle Cloud (caso esteja ativo)
echo "🔓 4. Ajustando Iptables do Ubuntu Oracle Cloud..."
sudo iptables -I INPUT 6 -m state --state NEW -p tcp --dport 80 -j ACCEPT || true
sudo iptables -I INPUT 6 -m state --state NEW -p tcp --dport 443 -j ACCEPT || true
sudo netfilter-persistent save || true

# 5. Instalação do Docker e Docker Compose
if ! command -v docker &> /dev/null; then
    echo "🐳 5. Instalando Docker..."
    curl -fsSL https://get.docker.com -o get-docker.sh
    sudo sh get-docker.sh
    sudo usermod -aG docker $USER
    sudo systemctl enable docker
    sudo systemctl start docker
    rm get-docker.sh
else
    echo "🐳 Docker já instalado."
fi

# 6. Criar arquivo .env se não existir
if [ ! -f .env ]; then
    echo "📝 6. Criando arquivo .env padrão..."
    cp .env.example .env
fi

# 7. Compilar e Iniciar os Containers com Docker Compose
echo "🚀 7. Subindo o aplicativo Manifesta com Docker Compose..."
sudo docker compose up -d --build

# 8. Configuração do Proxy Nginx nativo no Host
echo "⚙️ 8. Aplicando arquivo de configuração do Nginx..."
sudo cp ./nginx/default.conf /etc/nginx/sites-available/manifesta
sudo ln -sf /etc/nginx/sites-available/manifesta /etc/nginx/sites-enabled/default
sudo nginx -t
sudo systemctl restart nginx

echo "=========================================================="
echo "🎉 IMPLANTAÇÃO CONCLUÍDA COM SUCESSO!"
echo "Acesse o IP da sua instância Oracle Cloud no navegador na porta 80."
echo "Para verificar status: sudo docker compose ps"
echo "=========================================================="
