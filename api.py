from fastapi import FastAPI, Request
from fastapi.staticfiles import StaticFiles
from fastapi.responses import HTMLResponse, FileResponse
from fastapi.templating import Jinja2Templates
from disk_monitor import get_disk_usage, get_directory_usage
import plotly.express as px
import pandas as pd
import os

app = FastAPI()

# Configure os arquivos estáticos e templates
app.mount("/static", StaticFiles(directory="static"), name="static")
templates = Jinja2Templates(directory="templates")

@app.get("/data")
async def get_data():
    return get_disk_usage().to_dict(orient="records")

@app.get("/directory_data")
async def get_directory_data():
    disk_df = get_disk_usage()
    dir_usage = {}
    for _, row in disk_df.iterrows():
        mountpoint = row['mountpoint']
        try:
            usage = get_directory_usage(mountpoint, 200)
            dir_usage[mountpoint] = {
                "total_used": row['used'],
                "percent": row['percent'],
                "items": usage if isinstance(usage, list) else []
            }
        except Exception as e:
            dir_usage[mountpoint] = {
                "total_used": row['used'],
                "percent": row['percent'],
                "items": [{"path": f"Erro: {str(e)}", "size": "N/A"}]
            }
    return dir_usage

@app.get("/", response_class=HTMLResponse)
async def dashboard(request: Request):
    try:
        disk_df = get_disk_usage()
        
        # Crie os gráficos
        pie = px.pie(
            disk_df,
            names="mountpoint", 
            values="total",
            title="Tamanho por Partição",
            labels={'total': 'Tamanho (GB)'},
            hover_data={'total': ':.2f'}
        ).update_layout(
            legend=dict(
                orientation="h",
                yanchor="bottom",
                y=-0.4,
                xanchor="center",
                x=0.5
            ),
            margin=dict(b=75)
        )

        bar = px.bar(
            disk_df,
            x="mountpoint", 
            y="percent",
            color="mountpoint",
            title="Percentual de Uso",
            color_discrete_sequence=px.colors.qualitative.Plotly,
            labels={'percent': 'Uso (%)'}
        ).update_layout(showlegend=False, margin=dict(b=80))

        return templates.TemplateResponse("main.html", {
            "request": request,
            "pie_chart": pie.to_html(full_html=False),
            "bar_chart": bar.to_html(full_html=False)
        })
    
    except Exception as e:
        return HTMLResponse(f"""
            <html>
                <body>
                    <h1>Erro!</h1>
                    <p>{str(e)}</p>
                </body>
            </html>
        """)