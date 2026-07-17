#!/data/data/com.termux/files/usr/bin/bash
# NutriMX Launcher para Termux/Android
# Ejecutar: bash launch_android.sh

echo "🌮 NutriMX - Iniciando servidor local..."

# Verificar si python3 está instalado
if ! command -v python3 &> /dev/null; then
    echo "📦 Instalando Python..."
    pkg install -y python
fi

# Obtener IP=$(pwd)
cd "$(dirname "$0")"

# Puerto para el servidor
PORT=8080

echo "🚀 Sirviendo NutriMX en http://localhost:$PORT"
echo "📱 Abre Chrome y ve a http://localhost:$PORT"
echo "💡 Pulsa 'Instalar' en el banner para tenerlo como app"
echo ""
echo "Para detener: Ctrl+C"
echo ""

# Servidor HTTP simple con Python
python3 -m http.server $PORT --bind 0.0.0.0