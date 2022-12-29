from crawler.WebCrawler import getResponse
from urllib.parse import quote
def getCrawler(text):

    text = quote(text)
    # texto
    URL = 'https://www.google.com/search?q=%s' % text+'&hl=vi&gl=VN'
    soup = getResponse(url=URL)
    html = str(soup)
    with open('data/index.html', 'w', encoding='utf-8') as f:
        f.write(html)
    if 'class="Z0LcW"' in html:
        sult = soup.find(class_='Z0LcW').get_text()
        return sult
    if 'class="LGOjhe"' in html:
        sult = soup.find(class_="LGOjhe").find(class_="hgKElc").get_text()
        return sult
   
    if 'class="Z0LcW k37FLe"' in html:
        sult = soup.find(class_='Z0LcW k37FLe').get_text()
        return sult
    if 'class="Z0LcW vMhfn"' in html:
        sult = soup.find(class_='Z0LcW vMhfn').find(class_='FLP8od').get_text()
        return sult
    if 'jsname="xQjRM"' in html:
        sult = soup.find('div', jsname='xQjRM').find_all(
            'span', jsname='YS01Ge')
        array = []
        for element in sult:
            element = element.get_text()
            array.append(element)
        return "\n".join(array)
    if 'class="uHNKed"' in html:
        sult = soup.find('div', class_='uHNKed').find_all(
            'span', jsname='YS01Ge')
        array = []
        for element in sult:
            element = element.get_text()
            array.append(element)
        return "\n".join(array)
    if 'class="KIy09e obcontainer wDYxhc"' in html:
        temperature = soup.find(id='wob_tm').get_text()
        rain = soup.find(id='wob_pp').get_text()
        sky = soup.find(id='wob_dc').get_text()
        location = soup.find(id='wob_loc').get_text()
        time = soup.find(id='wob_dts').get_text()
        humidity = soup.find(id='wob_hm').get_text()
        wind = soup.find(id='wob_ws').get_text()
        json = {
            "temperature": temperature,
            "rain": rain,
            "sky": sky,
            "location": location,
            "time": time,
            "humidity": humidity,
            "wind": wind
            }
     
        return json
    if 'class="pclqee"' in html:
        bitcoin = soup.find(class_='pclqee').get_text() + \
            ' '+soup.find(class_='dvZgKd').get_text()
        return bitcoin
    if 'class="dDoNo ikb4Bb gsrt GDBPqd"' in html:
        currency = soup.find(class_='DFlfde SwHCTb').get_text(
        ) + ' '+soup.find(class_='MWvIVe').get_text()
        return currency
    if 'class="zCubwf"' in html:
        date = soup.find(class_='zCubwf').get_text()
        return date
    if 'class="dDoNo vrBOv vk_bk"' in html:
        convert = soup.find(class_='dDoNo vrBOv vk_bk').get_text()
        return convert
    if 'class="qv3Wpe"' in html:
        math = soup.find(id='cwos').get_text()
        return math
    if 'class="sfS5Re"' in html:
        text = soup.find(class_='sfS5Re').find_all(
            'div', class_='bVj5Zb FozYP')
        for element in text:
            array.append(element.get_text())
        if array.count() > 0:
            return "\n".join(array)
        print(convert)
    if 'class="kno-rdesc"' in html:
            sult = soup.find(class_='kno-rdesc').find('span').get_text()
            return sult