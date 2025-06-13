from fastapi import FastAPI

description = """
Swagger with routes to control application, any routes with yours parameters. 🚀

## Users

You will be able to:

* **Create users**
* **Read users**
"""

app = FastAPI(
    openapi_url="/api/v1/openapi.json",
    title="PitStop API",
    description=description,
    summary="Use with moderation",
    version="0.0.1",
    terms_of_service="http://example.com/terms/",
    contact={
        "name": "Deadpoolio the Amazing",
        "url": "http://x-force.example.com/contact/",
        "email": "dp@x-force.example.com",
    },
    license_info={
        "name": "Apache 2.0",
        "url": "https://www.apache.org/licenses/LICENSE-2.0.html",
    },
)

@app.get("/")
def read_root():
    return {"Hello": "World"}