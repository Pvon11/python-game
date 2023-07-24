from flask import Flask, render_template, request, jsonify
import random
import os

app = Flask(__name__)

computer_opponents = [
    {"name": "Helmasaur King", "image": "helmasaur-king.png", "user_wins": 0, "computer_wins": 0, "round": 1},
    {"name": "Vitreous", "image": "vitreous.png", "user_wins": 0, "computer_wins": 0, "round": 1},
    {"name": "Trinexx", "image": "trinexx.png", "user_wins": 0, "computer_wins": 0, "round": 1},
    {"name": "Agahnim", "image": "agahnim.png", "user_wins": 0, "computer_wins": 0, "round": 1},
    {"name": "Ganon", "image": "ganon.png", "user_wins": 0, "computer_wins": 0, "round": 1},
]

def determine_winner(player_choice, computer_choice):
    if player_choice == computer_choice:
        return "It's a tie!"
    elif player_choice == "rock":
        return "Player wins!" if computer_choice == "scissors" else "Computer wins!"
    elif player_choice == "paper":
        return "Player wins!" if computer_choice == "rock" else "Computer wins!"
    elif player_choice == "scissors":
        return "Player wins!" if computer_choice == "paper" else "Computer wins!"
    else:
        return "Invalid choice. Please choose 'rock', 'paper', or 'scissors'."

def initialize_campaign():
    return {"round": 1, "user_wins": 0, "computer_wins": 0, "selected_opponent": None}

def play_round(player_choice, selected_opponent):
    options = ["rock", "paper", "scissors"]
    computer_choice = random.choice(options)
    result = determine_winner(player_choice, computer_choice)

    if result == "Player wins!":
        selected_opponent["user_wins"] += 1
    elif result == "Computer wins!":
        selected_opponent["computer_wins"] += 1

    return computer_choice, result

@app.route("/", methods=["GET", "POST"])
def play_game():
    if request.method == "POST":
        data = request.get_json()
        player_choice = data["player_choice"].lower().strip()
        opponent_index = int(data["opponent"])
        selected_opponent = computer_opponents[opponent_index]

        computer_choice, result = play_round(player_choice, selected_opponent)

        return jsonify({
            "computer_choice": computer_choice,
            "result": result,
            "user_wins": selected_opponent["user_wins"],
            "computer_wins": selected_opponent["computer_wins"],
            "round": selected_opponent["round"],
            "opponent_name": selected_opponent["name"],
            "opponent_image": selected_opponent["image"]
        })

    return render_template("index.html", opponents=computer_opponents)

@app.route("/get_opponents", methods=["GET"])
def get_opponents():
    return jsonify(computer_opponents)

if __name__ == "__main__":
    app.run()


