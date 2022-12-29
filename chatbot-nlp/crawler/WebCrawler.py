import requests
from bs4 import BeautifulSoup
def getResponse(url):
    URL = url
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.90 Safari/537.36 Edg/89.0.774.57'
    }
    page = requests.get(URL, headers=headers)
    soup = BeautifulSoup(page.content, 'html.parser')
    html = str(soup)
    with open('data/index.html', 'w', encoding='utf-8') as f:
        f.write(html)
    return soup


def getPiriceGold():
    key = '3kd8ub1llcg9t45hnoh8hmn7t5kc2v'
    url = 'http://api.btmc.vn/api/BTMCAPI/getpricebtmc?key='+key
    response = requests.get(url)
    return response.json()


def getPriceFuel():
    url = 'https://webtygia.com/api/xang-dau'
    soup = getResponse(url)
    table = soup.find('table', id='myTable')
    table_body = table.find('tbody')
    data = []
    rows = table_body.find_all('tr')
    for row in rows:
        cols = row.find_all('td')
        cols = [ele.text.strip() for ele in cols]
        data.append([ele for ele in cols if ele])
    dataJson = []
    for element in data:
        object = {
            "name": element[0],
            "price1": str(element[1]).replace('.', ' ')+' đồng/lít',
            "price2": str(element[2]).replace('.', ' ')+' đồng/lít'
        }
        dataJson.append(object)
    return (dataJson)
getPriceFuel()
