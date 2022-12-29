from pydantic import BaseModel
from typing import Union
from services.ChatBotService import response
from crawler.GoogleCrawler import getCrawler
from crawler.WebCrawler import getPiriceGold, getPriceFuel
from fastapi.openapi.utils import get_openapi
from fastapi import FastAPI, Request, HTTPException, Depends
from youtube_search import YoutubeSearch
import uvicorn
import jwt
from services.Security import validate_token
from typing import Union, Any
from fastapi.middleware.cors import CORSMiddleware
from datetime import datetime, timedelta
app = FastAPI()
app.add_middleware(
        CORSMiddleware,
        allow_origins=['*']
    )

def custom_openapi():
    if app.openapi_schema:
        return app.openapi_schema
    openapi_schema = get_openapi(
        title="API Chat BOT NVN ",
        version="1.0.0",
        description="Một con chat bot sử dụng NLP,AI và n cái vớ vẩn",
        routes=app.routes,
    )
    openapi_schema["info"]["x-logo"] = {
        "url": "https://fastapi.tiangolo.com/img/logo-margin/logo-teal.png"
    }
    app.openapi_schema = openapi_schema
    return app.openapi_schema
SECURITY_ALGORITHM = 'HS256'
SECRET_KEY = '123456'


def generate_token(username: Union[str, Any]) -> str:
    expire = datetime.utcnow() + timedelta(
        seconds=60 * 60 * 24 * 3  # Expired after 3 days
    )
    to_encode = {
        "exp": expire, "username": username
    }
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY,
                             algorithm=SECURITY_ALGORITHM)
    return encoded_jwt


app.openapi = custom_openapi


class Message(BaseModel):
    message: str


class LoginRequest(BaseModel):
    username: str
    password: str


def verify_password(username, password):
    if username == 'admin' and password == 'admin':
        return True
    return False


@app.post('/login')
def login(request_data: LoginRequest):
    print(f'[x] request_data: {request_data.__dict__}')
    if verify_password(username=request_data.username, password=request_data.password):
        token = generate_token(request_data.username)
        return {
            'token': token
        }
    else:
        raise HTTPException(status_code=404, detail="User not found")


@app.get("/", tags=["Home Page"])
def read_root():
    return {"Hello": "World"}


@app.post("/api/chat", tags=["Get message from messageInput"])
async def api_chat_bot_ai(request: Request, message: Message):
    req_info = await request.json()
    # get message from request
    msg = req_info["message"]
    responseMessage = response(msg)
    if responseMessage is None:
        responseMessage = getCrawler(msg)
    return {
        "status": 200,
        "data": responseMessage
    }


@app.get('/api/gold', tags=["Get Price Gold Viet Nam"])
def api_Gold():
    return{
        "status": 200,
        "data": getPiriceGold()
    }


@app.get('/api/fuel', tags=["Get Price Fuel Viet Nam"])
def api_Fuel():
    return{
        "status": 200,
        "data": getPriceFuel()
    }


@app.post('/api/covid', tags=["Get Covid World and all Country"])
def api_Covid():
    return{"status": 200}


@app.get('/api/food', tags=["Recommend Food"])
def api_Food():
    return{"status": 200}


@app.get('/api/font', tags=["Get Font NVN"])
def api_Font():
    return{"status": 200}


@app.post('/api/youtube-search', tags=["Get best video with keywords"])
async def api_YouTube_Search(request: Request, message: Message):
    req_info = await request.json()
    msg = req_info["message"]
    results = YoutubeSearch(msg, max_results=5)
    return {"status": 200, "data": results}
if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8080)
