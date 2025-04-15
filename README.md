
# Disk Monitor - Dashboard de Monitoramento de Disco

Um dashboard web para monitorar o uso de disco em tempo real, desenvolvido em Python com FastAPI.  
**Recursos principais**:  
✅ Visualização gráfica do uso das partições  
✅ Detalhamento do uso por diretório  
✅ Interface responsiva e intuitiva  

---

## 📁 Estrutura do Projeto

```
disk-monitor/
├── static/
│   ├── styles.css        # Estilos CSS da interface
│   ├── scripts.js        # Lógica JavaScript do frontend
│   └── favicon.ico       # Ícone da aplicação
├── templates/
│   └── main.html         # Template HTML principal
├── api.py                # Backend FastAPI (rotas e lógica principal)
└── disk_monitor.py       # Funções de coleta de dados do sistema
```

---

## 📦 Dependências

| Pacote    | Versão   | Finalidade                          |
|-----------|----------|-------------------------------------|
| FastAPI   | >=0.68.0 | Framework web para a API            |
| uvicorn   | >=0.15.0 | Servidor ASGI                       |
| jinja2    | >=3.1.6  | Template engine para Python web     |
| psutil    | >=5.8.0  | Coleta de métricas do sistema       |
| pandas    | >=1.3.0  | Manipulação de dados                |
| plotly    | >=5.3.0  | Geração de gráficos interativos     |

---

## 🛠️ Instalação

### Para Arch Linux/Manjaro:
```bash
yay -S python-fastapi uvicorn python-psutil python-pandas python-plotly
```

### Para Debian/Ubuntu:
```bash
sudo apt install python3-pip
pip install fastapi uvicorn psutil pandas plotly jinja2
```

### Via pip (recomendado):
```bash
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt  # Crie o arquivo com as dependências listadas acima
```

---

## 🚀 Como Usar

1. Na raiz do projeto, inicie o servidor:
```bash
uvicorn api:app --reload
```

2. Acesse o dashboard:
```
http://localhost:8000
```

3. Interface:
- **Aba Partições**:  
  🍰 Gráfico de pizza com distribuição do espaço  
  📊 Gráfico de barras com percentual de uso  
  🖱️ Botão para alternar layout

- **Aba Diretórios**:  
  📂 Listagem hierárquica do uso  
  🔄 Botão de atualização manual  
  ⏳ Loading animado durante carregamentos

---

## ⚙️ Configurações Opcionais

1. **Timeout de coleta** (em `disk_monitor.py`):
```python
def get_directory_usage(mountpoint: str, timeout: int = 120):  # Altere o valor
```

2. **Porta do servidor**:
```bash
uvicorn api:app --port 8080 --reload
```

3. **Estilos CSS** (em `static/styles.css`):
- Modifique cores, tamanhos e layouts
- Adicione animações personalizadas

---

## 📄 Licença
Este projeto é open-source. Se for usá-lo, considere adicionar uma licença (MIT, GPL, etc.).

---

## 🤝 Contribuição
Contribuições são bem-vindas! Siga estes passos:
1. Fork o repositório
2. Crie uma branch (`git checkout -b feature/nova-feature`)
3. Commit suas mudanças (`git commit -am 'Adiciona nova feature'`)
4. Push para a branch (`git push origin feature/nova-feature`)
5. Abra um Pull Request
