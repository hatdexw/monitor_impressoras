import asyncio
import websockets
import requests
from bs4 import BeautifulSoup
import json

printer_urls = [
    "http://10.124.72.22/cgi-bin/dynamic/printer/PrinterStatus.html",
    "http://10.124.72.24/cgi-bin/dynamic/printer/PrinterStatus.html",
    "http://10.124.72.21/cgi-bin/dynamic/printer/PrinterStatus.html",
    "http://10.124.72.23/cgi-bin/dynamic/printer/PrinterStatus.html"
]

async def printer_status(websocket, path):
    while True:
        printer_data = []
        for url in printer_urls:
            printer_info = get_printer_status(url)
            printer_data.append(printer_info)
        await websocket.send(json.dumps(printer_data))
        await asyncio.sleep(3)

def get_printer_status(url):
    response = requests.get(url)
    html_code = response.content
    soup = BeautifulSoup(html_code, 'html.parser')

    toner_status_element = soup.find('b', string='Status do toner:')
    toner_status = toner_status_element.find_next('b').text.strip()

    bandeja1_status = get_text(soup, 'Bandeja 1')
    kit_manutencao = get_text(soup, 'Kit manutenção Vida restante:')
    kit_rolo = get_text(soup, 'Kit do rolo Vida restante:')
    unid_imagem = get_text(soup, 'Unid. imagem Vida restante:')

    return {
        "url": url,
        "toner_status": toner_status,
        "bandejas_status": bandeja1_status,
        "kit_manutencao": kit_manutencao,
        "kit_rolo": kit_rolo,
        "unid_imagem": unid_imagem
    }

def get_text(soup, label):
    element = soup.find('td', string=label)
    if element:
        return element.find_next('td').get_text(strip=True)
    return ""

printer_data = []
for url in printer_urls:
    printer_info = get_printer_status(url)
    printer_data.append(printer_info)

with open('printer_status.json', 'w') as outfile:
    json.dump(printer_data, outfile, indent=4)
    
start_server = websockets.serve(printer_status, "localhost", 8765)

asyncio.get_event_loop().run_until_complete(start_server)
asyncio.get_event_loop().run_forever()
