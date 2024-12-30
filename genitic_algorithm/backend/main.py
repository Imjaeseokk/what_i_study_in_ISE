from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from pydantic import BaseModel
import random
import os

from fastapi.middleware.cors import CORSMiddleware




app = FastAPI()

current_dir = os.path.dirname(os.path.abspath(__file__))
frontend_dir = os.path.join(current_dir, "../frontend")

# Static files mount
app.mount("/static", StaticFiles(directory=frontend_dir, html=True), name="static")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # 모든 도메인 허용
    allow_methods=["*"],  # 모든 HTTP 메서드 허용
    allow_headers=["*"],  # 모든 헤더 허용
)

# 문제 정의
def fitness_function(x):
    return -x**4 + 10*x**3 - 50*x**2 + 100*x

# 전역 상태 저장
population = [1.0]
best_solution = None
mutation_rate = 0.1
population_size = 20

class InitializeRequest(BaseModel):
    crossover_prob: float
    mutation_prob: float
    initial_point: float


class EvolveRequest(BaseModel):
    learning_rate: float
    initial_point: int
    current_step: int

@app.get("/")
def serve_frontend():
    return FileResponse(os.path.join(frontend_dir, "index.html"))


@app.post("/initialize")
def initialize(request: InitializeRequest):
    print(request)

    global population, best_solution, mutation_rate, population_size

    crossover_prob = request.crossover_prob
    mutation_prob = request.mutation_prob
    initial_point = request.initial_point

    population = [initial_point]  # 초기 개체군 단일 값
    mutation_rate = mutation_prob
    best_solution = {"point": initial_point, "fitness": float('-inf')}
    
    return {
        "message": "Initialization successful",
        "population": population,
        "crossover_prob": crossover_prob,
        "mutation_prob": mutation_prob
    }


@app.post("/step")
def step(request: EvolveRequest):
    global population, best_solution
    print(request)

