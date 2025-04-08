import psutil
import pandas as pd
from datetime import datetime

def get_disk_usage():
    partitions = []
    for part in psutil.disk_partitions(all=False):
        # Ignorar mounts do Snap e loop devices
        if any([
            part.mountpoint == '/boot/efi',
            part.mountpoint.startswith('/snap/'),   # Mounts do Snap
            part.mountpoint == '/var/lib/snapd',    # Pasta do Snapd
            part.fstype == 'squashfs'               # Sistemas de arquivos Snap
        ]):
            continue
        
        try:
            usage = psutil.disk_usage(part.mountpoint)
            partitions.append({
                "device": part.device,
                "mountpoint": part.mountpoint,
                "fstype": part.fstype,
                "total": usage.total / (1024 ** 3),
                "used": usage.used,
                "free": usage.free,
                "percent": usage.percent,
                "timestamp": datetime.now().isoformat()
            })
        except Exception as e:
            print(f"Erro ao ler {part.mountpoint}: {str(e)}")
    
    return pd.DataFrame(partitions)

import subprocess
import os

def get_directory_usage(mountpoint: str, timeout: int = 30):
    try:
        # Ignorar diretórios Snap mesmo em outras partições
        if '/snap/' in mountpoint or 'snapd' in mountpoint:
            return []
            
        result = subprocess.run(
            ['du', '-h', '-d', '1', mountpoint],
            capture_output=True,
            text=True,
            timeout=timeout
        )
        
        # Filtrar linhas do Snap
        lines = [
            line for line in result.stdout.split('\n') 
            if line and not any([
                '/snap/' in line,
                '/var/lib/snapd' in line
            ])
        ]
        
        data = []
        for line in lines:
            if line and not line.endswith(mountpoint):
                size, path = line.split('\t', 1)
                data.append({"path": path, "size": size})
        
        return data
    
    except Exception as e:
        return [{"path": f"Erro: {str(e)}", "size": "N/A"}]