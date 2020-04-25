from random import randint
from http.server import BaseHTTPRequestHandler, HTTPServer
from database import QuizDB
from urllib.parse import parse_qs
import json

def make_random_pin():
    db = QuizDB()
    pins = db.retrievePins()
    new_pin = randint(1000, 9999)
    for pin in pins:
        if pin == new_pin:
            new_pin = randint(9000, 9999)
    return new_pin

class MyRequestHandler(BaseHTTPRequestHandler):

    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")
        self.end_headers()

    def do_GET(self):
        print(self.path)
        if self.path == "/quiz":
            self.handleGetQuiz()
        elif self.path.startswith("/questions/"):
            self.handleRetrieveQuestions()
        else:
            self.handleNotFound()
   

    def do_POST(self):
        if self.path == "/quiz":
            self.handleQuizCreate()
        elif self.path == "/question":
            self.handleCreateQuestion()
        else:
            self.handleNotFound()

    def handleRetrieveQuestions(self):
        parts = self.path.split("/")
        quiz_id = parts[2]
        db = QuizDB()
        questions = db.retrieveQuestions(quiz_id)
        print(questions)
        if questions != None:
            self.send_response(200)
            self.send_header("Content-Type", "application/json")
            self.send_header("Access-Control-Allow-Origin", "*")
            self.end_headers()
            self.wfile.write(bytes(json.dumps(questions), "utf-8"))
        else:
            self.handleNotFound()

    
    def handleCreateQuestion(self):
        self.send_response(201)
        self.send_header("Content-Type", "application/json")
        self.send_header("Access-Control-Allow-Origin", "*")
        self.end_headers()
        length = self.headers["Content-Length"]
        body = self.rfile.read(int(length)).decode("utf-8")
        print("BODY (string):", body)
        parsed_body = parse_qs(body)
        print("BODY (parsed):", parsed_body)

        question = parsed_body["question"][0]
        answer1 = parsed_body["answer1"][0]
        answer2 = parsed_body["answer2"][0]
        answer3 = parsed_body["answer3"][0]
        answer4 = parsed_body["answer4"][0]
        correct_answer = parsed_body["correct_answer"][0]
        quiz_id = parsed_body["quiz_id"][0]

        db = QuizDB()
        db.insertQuestion(question, answer1, answer2, answer3, answer4, correct_answer, quiz_id)


    def handleGetQuiz(self):
        # parts = self.path.split("/")
        # quiz_id = parts[2]
        self.send_response(200)
        self.send_header("Content-Type", "application/json")
        self.send_header("Access-Control-Allow-Origin", "*")
        self.end_headers()
        db = QuizDB()
        quiz = db.retrieveAllQuiz()
        self.wfile.write(bytes(json.dumps(quiz), "utf-8"))

    def handleQuizCreate(self):
        self.send_response(201)
        self.send_header("Content-Type", "application/json")
        self.send_header("Access-Control-Allow-Origin", "*")
        self.end_headers()
        length = self.headers["Content-Length"]
        body = self.rfile.read(int(length)).decode("utf-8")
        print("BODY (string):", body)
        parsed_body = parse_qs(body)
        print("BODY (parsed):", parsed_body)
        
        title = parsed_body["title"][0]
        pin = parsed_body["pin"][0]
        db = QuizDB()
        db.createQuiz(pin, title)


    def handleNotFound(self):
        self.send_response(404)
        self.end_headers()
        self.wfile.write(bytes("Not found.", "utf-8"))

def run():
  listen = ("127.0.0.1", 8080)
  server = HTTPServer(listen, MyRequestHandler)
  print("Listening...")
  server.serve_forever()
run()

    

