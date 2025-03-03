from fastapi import FastAPI

app = FastAPI()


@app.get("/")
def read_root():
    return 'Server is running healthy'

@app.get('/get-all-stokes')
async def get_all_stokes():
    return 'All stokes'