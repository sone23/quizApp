import sqlite3
import json
import os
import urllib.parse

def dict_factory(cursor, row):
    d = {}
    for idx, col in enumerate(cursor.description):
        d[col[0]] = row[idx]
    return d
class QuizDB:
    def __init__(self):
        self.connection = sqlite3.connect("database.db")
        self.connection.row_factory = dict_factory
        self.cursor = self.connection.cursor()

    # def __del__(self):
    #     self.cursor.close()
    #     self.conn.close()

    def insertQuestion(self, question, answer1, answer2, answer3, answer4, correct_answer, quiz_id):
        data = [question, answer1, answer2, answer3, answer4, correct_answer, quiz_id]
        self.cursor.execute("INSERT INTO questions (question, answer1, answer2, answer3, answer4, correct_answer, quiz_id) VALUES (?, ?, ?, ?,?,?, ?)", data)
        self.connection.commit()

    def createQuiz(self, pin, title):
        data = [pin, title]
        self.cursor.execute("INSERT INTO quiz (pin, title) VALUES (?, ?)", data)
        self.connection.commit()

    #get all questions for a quiz
    def retrieveQuestions(self, quiz_id):
        data = [quiz_id]
        self.cursor.execute("SELECT * FROM questions WHERE quiz_id = ?", data)
        result_set = self.cursor.fetchall()
        return result_set

    def retrieveAllQuiz(self):
        self.cursor.execute("SELECT * FROM quiz ")
        self.connection.commit()
        result_set = self.cursor.fetchall()
        return result_set

    #get access to a quiz
    def retrieveQuiz(self, id):
        data = [id]
        self.cursor.execute("SELECT * FROM quizzes WHERE id = ?", data)
        self.connection.commit()
        result_set = self.cursor.fetchall()
        return result_set

    def retrievePins(self):
        self.cursor.execute("SELECT pin FROM quiz")
        self.connection.commit()
        result_set = self.cursor.fetchall()
        return result_set

    